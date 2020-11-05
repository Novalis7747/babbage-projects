import appModuleHandler
from NVDAObjects import NVDAObject
from NVDAObjects.IAccessible import IAccessible, Button, delphi, ToolTip
from NVDAObjects.window import Window
from documentBase import TextContainerObject
import displayModel
import threading
import time
import braille
import speech	
import tones
import wx
import textInfos
import controlTypes
import winUser
from colors import RGB
from scriptHandler import script
import weakref
import eventHandler
from logHandler import log 
import queueHandler
from locationHelper import RectLTRB, RectLTWH
import ui
import api
from globalPlugins.delphiAccess.helper import EnhancedDisplayModelTextInfo
import buildVersion
import six
buildVersion.isTestVersion = True

WHITE = RGB(255,255,255)
AQUA_BLUE = RGB(red=0, green=89, blue=154)

class TextMonitor(NVDAObject):
	"""A basic object class which facilitates monitoring of changes in text or text formatting.
	These objects only fire an event indicating that some part of the text or text formatting has changed; i.e. they don't provide the new text.
	Monitoring must be explicitly started and stopped using the L{startMonitoring} and L{stopMonitoring} methods.
	The object should notify of text changes using the textChange event.
	"""
	#: The time to wait before fetching text after a change event.
	STABILIZE_DELAY = 0

	def initOverlayClass(self):
		self._event = threading.Event()
		self._monitorThread = None
		self._keepMonitoring = False

	def startMonitoring(self):
		"""Start monitoring for changes in text.
		@note: If monitoring has already been started, this will have no effect.
		@see: L{stopMonitoring}
		"""
		if self._monitorThread:
			return
		thread = self._monitorThread = threading.Thread(target=self._monitor)
		thread.daemon = True
		self._keepMonitoring = True
		self._event.clear()
		thread.start()

	def stopMonitoring(self):
		"""Stop monitoring previously started with L{startMonitoring}.
		@note: If monitoring has not been started, this will have no effect.
		@see: L{startMonitoring}
		"""
		if not self._monitorThread:
			return
		self._keepMonitoring = False
		self._event.set()
		self._monitorThread = None

	def event_textChange(self):
		"""Fired when the text changes.
		@note: It is safe to call this directly from threads other than the main thread.
		"""
		self._event.set()

	def _monitor(self):
		"""The monitoring method.
		This is run in a separate thread using the L{startMonitoring} method.
		Subclasses should override this method.
		"""
		raise NotImplementedError()

	def _waitForTextChange(self):
		"""Waits infiintely for text changes."""
		self._event.wait()
		if not self._keepMonitoring:
			return
		if self.STABILIZE_DELAY > 0:
			# wait for the text to stabilise.
			time.sleep(self.STABILIZE_DELAY)
			if not self._keepMonitoring:
				# Monitoring was stopped while waiting for the text to stabilise.
				return
		self._event.clear()


class DisplayModelTextMonitor(TextMonitor, Window):
	TextInfo = displayModel.DisplayModelTextInfo

	def startMonitoring(self):
		# Force the window to be redrawn, as our display model might be out of date.
		self.redraw()
		displayModel.requestTextChangeNotifications(self, True)
		super(DisplayModelTextMonitor, self).startMonitoring()

	def stopMonitoring(self):
		super(DisplayModelTextMonitor, self).stopMonitoring()
		displayModel.requestTextChangeNotifications(self, False)

class SelectableText(TextContainerObject):
	"""
	An object that contains text in which the selection can be fetched and changed.
	This doesn't necessarily mean that the text is editable.

	If the object notifies of selection changes, the following should be done:
		* When the object gains focus, L{initAutoSelectDetection} must be called.
		* When the object notifies of a possible selection change, L{detectPossibleSelectionChange} must be called.
		* Optionally, if the object notifies of changes to its content, L{hasContentChangedSinceLastSelection} should be set to C{True}.
	@ivar hasContentChangedSinceLastSelection: Whether the content has changed since the last selection occurred.
	@type hasContentChangedSinceLastSelection: bool
	"""

	#: Whether to speak the unselected content after new content has been selected.
	#: @type: bool
	speakUnselected = False

	def initAutoSelectDetection(self):
		"""Initialise automatic detection of selection changes.
		This should be called when the object gains focus.
		"""
		try:
			self._lastSelectionPos=self.makeTextInfo(textInfos.POSITION_SELECTION)
		except:
			self._lastSelectionPos=None
		self.isTextSelectionAnchoredAtStart=True
		self.hasContentChangedSinceLastSelection=False

	def reportSelectionChange(
			self,
			oldInfo,
			newInfo,
			generalize=False
	):
		"""Announces selection changes with speech and updates the braille display accordingly.

		@param oldInfo: a TextInfo instance representing what the selection was before.
		@param newInfo: a TextInfo instance representing what the selection is now.
		@param generalize: if True, then this function knows that the text may have changed
			between the creation of the oldInfo and newInfo objects, meaning that changes need to be spoken
			more generally, rather than speaking the specific text, as the bounds may be all wrong.
		"""
		if not self.speakUnselected:
			speech.speakTextInfo(newInfo,unit=textInfos.UNIT_LINE,reason=controlTypes.REASON_CARET)
		else:
			speech.speakSelectionChange(oldInfo,newInfo,generalize=generalize)

	def detectPossibleSelectionChange(self):
		"""Detects if the selection has been changed, and if so it speaks the change.
		"""
		try:
			newInfo=self.makeTextInfo(textInfos.POSITION_SELECTION)
		except:
			# Just leave the old selection, which is usually better than nothing.
			return
		oldInfo=getattr(self,'_lastSelectionPos',None)
		self._lastSelectionPos=newInfo.copy()
		if not oldInfo:
			# There's nothing we can do, but at least the last selection will be right next time.
			self.isTextSelectionAnchoredAtStart=True
			return
		self._updateSelectionAnchor(oldInfo,newInfo)
		hasContentChanged=getattr(self,'hasContentChangedSinceLastSelection',False)
		self.hasContentChangedSinceLastSelection=False
		self.reportSelectionChange(oldInfo, newInfo, generalize=hasContentChanged)

	def _updateSelectionAnchor(self,oldInfo,newInfo):
		# Only update the value if the selection changed.
		if newInfo.compareEndPoints(oldInfo,"startToStart")!=0:
			self.isTextSelectionAnchoredAtStart=False
		elif newInfo.compareEndPoints(oldInfo,"endToEnd")!=0:
			self.isTextSelectionAnchoredAtStart=True

class NonEditableSelectableText(TextMonitor, SelectableText):
	"""Reports selection changes based on text monitoring.
	"""

	value = None

	def startMonitoring(self):
		self.initAutoSelectDetection()
		super(NonEditableSelectableText, self).startMonitoring()

	def event_gainFocus(self):
		super(NonEditableSelectableText, self).event_gainFocus()
		self.startMonitoring()
		# Announce the current selection on focus.
		if self._lastSelectionPos:
			speech.speakTextInfo(self._lastSelectionPos, reason=controlTypes.REASON_FOCUS)

	def event_loseFocus(self):
		self.stopMonitoring()

	def reportSelectionChange(
			self,
			oldInfo,
			newInfo,
			generalize
	):
		super(NonEditableSelectableText, self).reportSelectionChange(oldInfo, newInfo, generalize=generalize)
		# This object has no caret.
		# Yet, handleUpdate does not scroll a braille display  the selection when it has to.
		# handleCaretMove is also suitable to cover selection changes.
		braille.handler.handleCaretMove(self)

	def _monitor(self):
		while self._keepMonitoring:
			self._waitForTextChange()
			# Handle the sellection change from the main thread.
			queueHandler.queueFunction(queueHandler.eventQueue, self.detectPossibleSelectionChange)


class DisplayModelTextInfoOverlay(EnhancedDisplayModelTextInfo):

	def _get_selectionCondition(self):
		"""The search condition to apply to a L{textInfos.FieldCommand} when searching for selected or highlighted text.
		A condition is a list with dicts whose keys are control field attributes,
		and whose values are a list of possible values for the property.
		The dicts are joined with 'or', the keys in each dict are joined with 'and', and the values  for each key are joined with 'or'.
		It is evaluated using L{textInfos.Field.evaluateCondition}.
		"""
		condition = dict()
		if self.backgroundSelectionColor is not None and self.foregroundSelectionColor is not None:
			condition['color'] = [self.foregroundSelectionColor]
			condition['background-color'] = [self.backgroundSelectionColor]
		return [condition]

	def _getSelectionOffsets(self):
		condition = self.selectionCondition
		if condition:
			highlightDict = None
			fields=self._storyFieldsAndRects[0]
			startOffset=None
			endOffset=None
			curOffset=0
			inHighlightChunk=False
			for item in fields:
				if isinstance(item,textInfos.FieldCommand) and item.command=="formatChange":
					# If we are able to evaluate text against a condition of multiple dicts,
					# We can limit our future evaluations to the dict that matches.
					# This makes sure that we only apply the first matching condition to the highlight searching strategy.
					if not highlightDict:
						evaluation = self.evaluateCondition(item.field, *self.selectionCondition)
						if evaluation:
							highlightDict = evaluation
					else:
						evaluation = self.evaluateCondition(item.field, highlightDict)
						if not evaluation:
							# The highlight dict does not match, but we're dealing with format changes
							# The highlight chunk ends if we encounter another format change that contains the keys.
							# Execute a negative evaluation.
							evaluation = self.evaluateCondition(
								item.field,
								{key: False for key in highlightDict.keys()}
							)
					if evaluation:
						inHighlightChunk=True
						if startOffset is None:
							startOffset=curOffset
					else:
						inHighlightChunk=False
				elif isinstance(item, six.string_types):
					curOffset+=len(item)
					if inHighlightChunk:
						endOffset=curOffset
				else:
					inHighlightChunk=False
				if not inHighlightChunk and startOffset is not None and endOffset is not None:
					# We've just finished with a chunk, return early to avoid duplicates.
					return (startOffset,endOffset)
		raise LookupError

	# slightly hacky
	@staticmethod
	def evaluateCondition(self, *dicts):
		"""
		A function that evaluates whether the provided condition is met for this L{Field}.
		The arguments to this function are dicts whose keys are field attributes, and whose values are either:
			* A list of possible values for the attribute.
			* a boolean value, indicating that the condition for the key matches if the key is or is not in the field with whatever value.
		The dicts are joined with 'or', the keys in each dict are joined with 'and', and the values  for each key are joined with 'or'.
		For example,  to create a condition that matches on a format field with a white or black foreground color, you would provide the following condition argument:
			{'color': [colors.RGB(255, 255, 255), colors.RGB(0, 0, 0)]}
		To create a condition that matches on a format field with whatever foreground color, you would provide the following condition argument:
			{'color': True}
		To create a condition that matches on a format field without a foreground color, you would provide the following condition argument:
			{'color': False}
		"""
		if len(dicts) == 1 and isinstance(dicts[0], (list, set, tuple)):
			dicts = dicts[0]
		for dict in dicts:
			# Dicts are joined with or, therefore return early if a dict matches.
			for key,values in dict.items():
				if key not in self:
					if values is False:
						continue
					else:
						# Go to the next dict
						break
				elif values is True:
					continue
				if not isinstance(values, (list, set, tuple)):
					values=[values]
				if not self[key] in values:
					# Key does not match.
					break
			else:
				# This dict matches.
				return dict
		return None

class DisplayModelNonEditableSelectableText(DisplayModelTextMonitor, NonEditableSelectableText):
	pass

RDW_ALLCHILDREN = 0x0080
class AppModule(appModuleHandler.AppModule):

	@script(
		gesture="kb:NVDA+F5"
	)
	def script_redraw(self, gesture):
		fg = api.getForegroundObject()
		location = fg.location.toClient(fg.windowHandle)
		winUser.RedrawWindow(fg.windowHandle,
			location.toRECT(), None,
			winUser.RDW_INVALIDATE | winUser.RDW_UPDATENOW | RDW_ALLCHILDREN)
		ui.message(_("Refreshed"))
		api.getFocusObject().reportFocus()

	def chooseNVDAObjectOverlayClasses(self, obj, clsList):
		identity = getattr(obj,"IAccessibleIdentity",{})
		if identity and identity.get('objectID') == winUser.OBJID_CLIENT:
			if obj.windowClassName == "TdxBarControl":
				clsList.insert(0, KingMenu)
			if obj.windowClassName == 'TdxBarSubMenuControl':
				clsList.insert(0, KingSubMenu)
			elif obj.windowClassName in ("TfrmDecor", "TfrmKingMenu"):
				clsList.insert(0, KingMain)
			elif obj.windowClassName == "TqdDBGridEdit":
				clsList.insert(0, KingGridEdit)
			elif "Grid" in obj.windowClassName:
				clsList.insert(0, KingGrid)
			elif obj.windowClassName == "TqdPageControlEx":
				clsList.insert(0, KingPageCtrl)
			elif obj.windowClassName == "TqdTabSheet":
				clsList.insert(0, delphi.TabSheet)
			elif obj.windowClassName == "TqdRadioButton":
				clsList.insert(0, KingRadioButton)
			elif obj.windowClassName == "TChart":
				clsList.insert(0, KingChart)
			elif obj.windowClassName == "TqdCheckBox":
				clsList.insert(0, KingCheckBox)
			elif obj.windowClassName == "TqdDBCheckBox":
				clsList.insert(0, KingDBCheckBox)
			elif obj.windowClassName == "TfrmQdMessageDlg":
				clsList.insert(0, delphi.Form)
			elif obj.windowClassName == "THintWindow":
				clsList.insert(0, ToolTip)

class KingMain(NVDAObject):

	def _get_focusRedirect(self):
		for item in self.recursiveDescendants:
			if isinstance(item, KingMenu):
				return item


class KingMenuTextInfo(DisplayModelTextInfoOverlay):

	selectionCondition = [{
		'color': [WHITE],
	}]
	

class KingGridTextInfo(DisplayModelTextInfoOverlay):

	selectionCondition = [{
		'background-color': [AQUA_BLUE],
		'color': [WHITE],
	}]


class KingGrid(DisplayModelNonEditableSelectableText):
	STABILIZE_DELAY = 0.005
	TextInfo = _TextInfo = KingGridTextInfo
	role = controlTypes.ROLE_DATAGRID
	value = None

class KingGridEdit(KingGrid):

	def reportSelectionChange(
			self,
			oldInfo,
			newInfo,
			generalize
	):
		start = newInfo._startOffset
		point = newInfo._getPointFromOffset(start)
		headerInfo = newInfo.copy()
		headerOffset = headerInfo._getClosestOffsetFromPoint(point.x, self.location.top)
		headerInfo._startOffset, headerInfo._endOffset = headerInfo._getReadingChunkOffsets(headerOffset)
		speech.speakTextInfo(headerInfo, unit=textInfos.UNIT_LINE,reason=controlTypes.REASON_CARET)
		super(KingGridEdit, self).reportSelectionChange(oldInfo, newInfo, generalize=generalize)

class KingMenu(DisplayModelNonEditableSelectableText):
	STABILIZE_DELAY = 0
	TextInfo = KingMenuTextInfo
	value = ""
	role = controlTypes.ROLE_MENU

	def _get_subMenu(self):
		try:
			hwnd = winUser.FindWindow(u'TdxBarSubMenuControl', None)
		except WindowsError:
			hwnd = None
		if hwnd and hwnd != self.windowHandle:
			kwargs = dict(windowHandle=hwnd)
			if IAccessible.kwargsFromSuper(kwargs, relation="foreground"):
				obj = IAccessible(**kwargs)
				obj.parent = self
				return obj

	def _waitForTextChange(self):
		super(KingMenu, self)._waitForTextChange()
		subMenu = self.subMenu
		if subMenu:
			eventHandler.queueEvent("gainFocus", subMenu)


class KingSubMenu(KingMenu):

	def getScript(self, gesture):
		script = super(KingSubMenu, self).getScript(gesture)
		if script:
			return script

		def loseFocusScript(gesture):
			gesture.send()
			if not self.isFocusable:
				# The window died
				eventHandler.queueEvent("gainFocus", self.parent)
		return loseFocusScript

class KingPageCtrl(IAccessible):
	role = controlTypes.ROLE_TAB

	def _get_name(self):
		return self.firstChild.name

	@script(gestures=["kb:leftArrow", "kb:rightArrow"])
	def script_tabSwitch(self, gesture):
		gesture.send()
		eventHandler.queueEvent("nameChange", self)

class KingChart(IAccessible):
	role = controlTypes.ROLE_CHART

import screenBitmap
import hashlib
import base64

class KingCheckable(Button):

	def locationBitmapHash(self, location):
		sb = screenBitmap.ScreenBitmap(location.width, location.height)
		pixels = sb.captureImage(*location)
		digest = hashlib.sha1(pixels).digest()
		return base64.b64encode(digest)

	@script(gesture="kb:nvda+i")
	def script_reportHash(self, gesture):
		hash = api.getNavigatorObject().hash
		ui.message(hash)
		api.copyToClip(six.text_type(hash))

	def _get_hash(self):
		location = self.location.toLTRB()
		left = location.left + 2
		top = location.top + 2
		width = height = 13
		rect = RectLTWH(left, top, width, height)
		return self.locationBitmapHash(rect)

	def _get_states(self):
		states = super(KingCheckable, self).states
		hash = self.hash
		if hash == self._checkedHash:
			states.add(controlTypes.STATE_CHECKED)
		elif hash != self._uncheckedHash:
			states.add(controlTypes.STATE_DEFUNCT)
		return states

class KingCheckBox(KingCheckable):
	role = controlTypes.ROLE_CHECKBOX

	_checkedHash = b"ZvyhShYM3LW/OkIt9ysxkc+VycY="
	_uncheckedHash = b"E9wqH+UKRQBH+ff/SoHWAgmpWM4="

class KingRadioButton(KingCheckable):
	role = controlTypes.ROLE_RADIOBUTTON

	_checkedHash = b"DX+s+leUy7mgklRDrsnG7ZDIuFs="
	_uncheckedHash = b"oIrqtkPqVTawLInWlWDwsF3T6CQ="

class KingDBCheckBox(KingCheckBox):

	def _get_hash(self):
		location = self.location.toLTRB()
		left = location.right - 15
		top = location.top + 2
		width = height = 13
		rect = RectLTWH(left, top, width, height)
		return self.locationBitmapHash(rect)

	_checkedHash = b"HaGBewFur86CPyGMe5Cmj7pGiiM="
	_uncheckedHash = b"xPggGH8FFZ71LXSjTnJ0I+adMME="

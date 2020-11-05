import buildVersion
buildVersion.isTestVersion=True
import appModuleHandler
from NVDAObjects import NVDAObject
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
from NVDAObjects.behaviors import EditableText, EditableTextWithoutAutoSelectDetection, Terminal
import winUser
import api
import ui
from NVDAObjects.window import DisplayModelEditableText, DisplayModelLiveText
from NVDAObjects.IAccessible import IAccessible
import globalPluginHandler
import queueHandler
from colors import RGB
import six
from logHandler import log
import locationHelper
from scriptHandler import script
import oleacc

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
			generalize=False
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


class DisplayModelNonEditableSelectableText(DisplayModelTextMonitor, NonEditableSelectableText):
	pass


class SapMonitorDisplayModelTextInfo(displayModel.EditableTextDisplayModelTextInfo):
	includeDescendantWindows=False

class SapMonitor(DisplayModelNonEditableSelectableText):
	STABILIZE_DELAY = 0.01
	TextInfo = SapMonitorDisplayModelTextInfo

	def reportSelectionChange(
			self,
			oldInfo,
			newInfo,
			generalize=False
	):
		super(SapMonitor, self).reportSelectionChange(oldInfo, newInfo, generalize=generalize)
		self.appModule.usa.localBridge.trackToTextInfo(self, newInfo)


#: A text info unit constant for a single chunk in a display model
UNIT_DISPLAYCHUNK = "displayChunk"


class SapTerminalDisplayModelTextInfo(displayModel.EditableTextDisplayModelTextInfo):
	includeDescendantWindows=False
	foregroundSelectionColor = RGB(red=0, green=0, blue=0)
	backgroundSelectionColor = RGB(red=153, green=180, blue=209)

	def _getDisplayChunkOffsets(self, offset):
		prevOffset = lastEndOffset = 0
		for x in self._storyFieldsAndRects[0]:
			if not isinstance(x, six.string_types):
				continue
			lastEndOffset += len(x)
			if lastEndOffset > offset:
				return (prevOffset, lastEndOffset)
			prevOffset = lastEndOffset
		return (offset, offset + 1)

	def _getUnitOffsets(self, unit, offset):
		if unit is UNIT_DISPLAYCHUNK:
			return self._getDisplayChunkOffsets(offset)
		return super(SapTerminalDisplayModelTextInfo, self)._getUnitOffsets(unit, offset)

class SapTerminalWindow(EditableTextWithoutAutoSelectDetection, Terminal, DisplayModelLiveText):
	TextInfo = SapTerminalDisplayModelTextInfo

	@script(gestures=("kb:tab", "kb:shift+tab"))
	def script_move(self, gesture):
		self._caretMovementScriptHelper(gesture, textInfos.UNIT_LINE)

class AppModule(appModuleHandler.AppModule):

	def _get_usa(self):
		self.usa = next(p for p in globalPluginHandler.runningPlugins if p.__module__=="globalPlugins.usa")
		return self.usa

	def chooseNVDAObjectOverlayClasses(self, obj, clsList):
		if getattr(obj,"event_objectID",None) != winUser.OBJID_CLIENT:
			return
		if obj.windowClassName in ("SAPTreeList", "SAPALVGrid"):
			clsList.insert(0, SapMonitor)
		elif obj.windowClassName.endswith((":1008", ":b")):
			try:
				clsList.remove(DisplayModelEditableText)
			except ValueError:
				pass
			clsList[0:0] = (SapTerminalWindow,)

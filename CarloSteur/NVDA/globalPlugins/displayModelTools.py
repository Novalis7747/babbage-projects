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
import api
import vision

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
		"""
		Waits until a text change has been detected and a possible stabilize delay has elapsed.
		This method blocks, and therefore should be called from a background thread.
		"""
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

class SelectableTextContainerObject(TextContainerObject):
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
	#: If C{False}, the old selection is ignored,
	#: and the new selection is reported without the redundant selected state.
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
		if not self.speakUnselected:
			# As the unselected state is not relevant here and all spoken content is selected,
			# use speech.speakTextInfo to make sure the new selection is spoken.
			speech.speakTextInfo(newInfo,reason=controlTypes.REASON_CARET)
		else:
			speech.speakSelectionChange(oldInfo,newInfo,generalize=hasContentChanged)

		# Import late to avoid circular import
		from editableText import EditableText
		if not isinstance(self, EditableText):
			# This object has no caret, manually trigger a braille update.
			braille.handler.handleUpdate(self)
			api.setReviewPosition(newInfo)

	def _updateSelectionAnchor(self,oldInfo,newInfo):
		# Only update the value if the selection changed.
		if newInfo.compareEndPoints(oldInfo,"startToStart")!=0:
			self.isTextSelectionAnchoredAtStart=False
		elif newInfo.compareEndPoints(oldInfo,"endToEnd")!=0:
			self.isTextSelectionAnchoredAtStart=True

class SelectionChangeMonitor(TextMonitor, SelectableTextContainerObject):
	"""Reports selection changes based on text monitoring.
	This inherrits from L{documentBase.SelectableTextContainerObject} which facilitates the detection of selection changesusing the L{TextInfo}.
	This is also a L{TextMonitor} object for which monitoring is automatically enabled and disabled based on whether it has focus.
	"""

	speakUnselected = False

	def startMonitoring(self):
		self.initAutoSelectDetection()
		super(SelectionChangeMonitor, self).startMonitoring()

	def event_gainFocus(self):
		super(SelectionChangeMonitor, self).event_gainFocus()
		self.startMonitoring()

	def event_loseFocus(self):
		self.stopMonitoring()

	def _monitor(self):
		while self._keepMonitoring:
			self._waitForTextChange()
			self.detectPossibleSelectionChange()

class DisplayModelSelectionChangeMonitor(SelectionChangeMonitor, DisplayModelTextMonitor):
	pass

class DisplayModelTextInfoOverlay(displayModel.DisplayModelTextInfo):

	def _get_defaultSelectionCondition(self):
		condition = dict()
		if self.backgroundSelectionColor is not None and self.foregroundSelectionColor is not None:
			condition['color'] = [self.foregroundSelectionColor]
			condition['background-color'] = [self.backgroundSelectionColor]
		self.defaultSelectionCondition = condition
		return self.defaultSelectionCondition

	def _get_selectionCondition(self):
		"""The search condition to apply to a L{textInfos.FieldCommand} when searching for selected or highlighted text.
		A condition is a list with dicts whose keys are control field attributes,
		and whose values are a list of possible values for the property.
		The dicts are joined with 'or', the keys in each dict are joined with 'and', and the values  for each key are joined with 'or'.
		It is evaluated using L{textInfos.Field.evaluateCondition}.
		"""
		# Lazily fetch a copy of the default condition dict and copy it.
		defaultSelectionCondition = self.defaultSelectionCondition.copy()
		self.selectionCondition = [defaultSelectionCondition]
		return self.selectionCondition

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
				elif isinstance(item,basestring):
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
			for key,values in dict.iteritems():
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


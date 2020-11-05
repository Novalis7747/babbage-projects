import oleacc
from NVDAObjects.behaviors import Terminal
from NVDAObjects.window import DisplayModelEditableText, DisplayModelLiveText
import appModuleHandler
from NVDAObjects.IAccessible import IAccessible
from displayModel import DisplayModelTextInfo
import colors
import textInfos
import braille
import tones
import six

class AppModule(appModuleHandler.AppModule):
	def chooseNVDAObjectOverlayClasses(self, obj, clsList):
		if obj.windowClassName == "MPC Windows Class" and isinstance(obj,IAccessible) and obj.IAccessibleRole == oleacc.ROLE_SYSTEM_CLIENT:
			clsList.insert(0, KanvasTerminalWindow)

class KanvasTextInfo(DisplayModelTextInfo):
	minHorizontalWhitespace=1
	minVerticalWhitespace=4
	stripOuterWhitespace=False

	def _getCaretOffset(self):
		try:
			return self._getSelectionOffsets()[1]
		except LookupError:
			raise RuntimeError

	def _get_selectionCondition(self):
		return [
			{'background-color': [colors.RGB(red=255, green=255, blue=255)],},
			{'color': [colors.RGB(red=255, green=255, blue=255)],'background-color': [colors.RGB(red=255, green=0, blue=0)],},
]

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
							evaluation = self.evaluateCondition(item.field, 
								{key: False for key in highlightDict.keys()})
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

	@classmethod
	def evaluateCondition(cls, field, *dicts):
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
				if key not in field:
					if values is False:
						continue
					else:
						# Go to the next dict
						break
				elif values is True:
					continue
				if not isinstance(values, (list, set, tuple)):
					values=[values]
				if not field[key] in values:
					# Key does not match.
					break
			else:
				# This dict matches.
				return dict
		return None

class KanvasTerminalWindow(Terminal, DisplayModelLiveText):
	TextInfo = KanvasTextInfo
	announceNewLineText = True
	announceEntireNewLine = True
	shouldFireCaretMovementFailedEvents = True
	STABILIZE_DELAY = 0.1

	def event_typedCharacter(self,ch):
		braille.handler.handleCaretMove(self)

	def event_caretMovementFailed(self, gesture):
		tones.beep(330,100)

	__gestures = {
		"kb:tab": "caret_moveByLine",
		"kb:shift+Tab": "caret_moveByLine",
	}

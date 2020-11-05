import appModuleHandler
from NVDAObjects.IAccessible import ContentGenericClient, IAccessible
from globalPlugins.dmTools.classes import *
from globalPlugins.dmTools.locationHelper import *
import NVDAObjects.window
import displayModel
import ui
import api
import eventHandler
import controlTypes
from NVDAObjects.IAccessible import IAccessible
import textInfos
import time

username = r"KERSTEN\babbage"

class SideForm(TextChangeBasedFocusContainer):
	TextInfo = SingleWindowEditableTextDisplayModelTextInfo

	def processTextInfoForObjectCreation(self, info):
		info.expand(displayModel.UNIT_DISPLAYCHUNK)
		start, end = info._startOffset, info._endOffset
		for i in xrange(1,6):
			info.move(displayModel.UNIT_DISPLAYCHUNK,-1)
			info.expand(displayModel.UNIT_DISPLAYCHUNK)
			if not info.text.strip():
				continue
			elif "  ." in info.text:
				continue
			if i>1:
				break
		info._endOffset = end
		return info

	def _monitor(self):
		statusBar = api.getForegroundObject().lastChild.previous
		oldText=statusBar.displayText
		try:
			oldOffsets = self._getRelevantOffsets()
		except:
			log.debugWarning("Error getting initial offsets", exc_info=True)
			oldOffsets = ()
		while self._keepMonitoring:
			self._event.wait()
			if not self._keepMonitoring:
				break
			if self.STABILIZE_DELAY > 0:
				# wait for the text to stabilise.
				time.sleep(self.STABILIZE_DELAY)
				if not self._keepMonitoring:
					# Monitoring was stopped while waiting for the text to stabilise.
					break
			self._event.clear()
			try:
				newOffsets = self._getRelevantOffsets()
				rect = self._getRelevantRect()
			except:
				log.debugWarning("Error getting new rectangle", exc_info=True)
				newOffsets = ()
				rect = None
			newText=statusBar.displayText
			if newText!=oldText:
				num=newText.rfind(username)
				ui.message(newText[:num] if num>0 else newText)
			elif rect:
				obj = self.getObjectFromRect(rect)
				obj.fakeFocus()			
			oldOffsets = newOffsets
			oldText = newText

class AppModule(appModuleHandler.AppModule):

	def chooseNVDAObjectOverlayClasses(self, obj, clsList):
		identity = getattr(obj,"IAccessibleIdentity",{})
		if identity and identity.get('objectID')==winUser.OBJID_CLIENT:
			if obj.windowClassName in ('C/SIDE Form'):
				clsList.insert(0,SideForm)
			if NVDAObjects.window.DisplayModelEditableText in clsList:
				clsList.remove(NVDAObjects.window.DisplayModelEditableText)


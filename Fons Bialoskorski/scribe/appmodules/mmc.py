import appModuleHandler
from tones import beep
from NVDAObjects.IAccessible import IAccessible
from NVDAObjects.IAccessible import sysListView32
import controlTypes
import displayModel
import textInfos
import api

class ScribeJobList(sysListView32.List):
	pass

class ScribeJob(sysListView32.ListItem):

	def _get_location(self):
		columns=self.parent.columnCount
		fc=self._getColumnLocation(1)
		lc=self._getColumnLocation(columns)
		left=fc[0]
		top=fc[1]
		width=(lc[0]-fc[0])+lc[2]
		height=lc[3]
		return(left,top,width,height)

	def _get_name(self):
		return displayModel.DisplayModelTextInfo(self.parent,self.rect).text

	def _get_rect(self):
		"""
		@returns: Rectangle of this object
		@rtype: L{textInfos.Rectangle}
		"""
		left, top, width, height = self.location
		right = left + width
		bottom = top + height
		return textInfos.Rect(left,top,right,bottom)

class AppModule(appModuleHandler.AppModule):

	def __init__(self,*args,**kwargs):
		super(AppModule,self).__init__(*args,**kwargs)
		self.listObj=None

	def chooseNVDAObjectOverlayClasses(self, obj, clsList):
		if obj.windowClassName=='ListView20WndClass' and obj.role==0:
			clsList.insert(0,ScribeJob)
		elif obj.windowClassName=='ListView20WndClass' and obj.role==3:
			self.listObj=obj
			clsList.insert(0,ScribeJobList)

	def script_setFocusToList(self, gesture):
		if self.listObj:
			self.listObj.setFocus()

	__gestures={
		"kb:alt+NVDA+l": "setFocusToList"
	}

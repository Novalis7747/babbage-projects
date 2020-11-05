import appModuleHandler
import controlTypes
from NVDAObjects.UIA import UIA

class AppModule(appModuleHandler.AppModule):

	def event_NVDAObject_init(self,obj):
		if isinstance(obj,UIA):
			if obj.UIAElement.cachedClassName in ('DataGridCell'):
				child=obj.firstChild
				if child:
					obj.name=child.name
			elif obj.role==controlTypes.ROLE_DATAITEM:
				obj.presentationType=obj.presType_layout
			elif obj.location==(0,0,0,0):
				obj.presentationType=obj.presType_unavailable

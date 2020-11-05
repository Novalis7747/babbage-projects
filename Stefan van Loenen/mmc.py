import appModuleHandler
import controlTypes
from NVDAObjects.IAccessible import IAccessible
from displayModel import DisplayModelTextInfo
import colors
import winUser

class InaccessibleControl(IAccessible):

	def _get_name(self):
		ti = DisplayModelTextInfo(self.container,"all")
		if self.windowClassName == 'SysTreeView32':
			ti.foregroundSelectionColor = colors.RGB(0,0,0)
		return ti._getTextRange(*ti._getSelectionOffsets())

class Unavailable(IAccessible):

	def _get_states(self):
		states = super(Unavailable,self)._get_states()
		states.discard(controlTypes.STATE_UNAVAILABLE)
		return states

class AccountExpires(IAccessible):

	def _get_next(self):
		return next((child for child in self.parent.parent.children if child.name=="Never"))

class Never(Unavailable):

	def _get_next(self):
		return next((child for child in self.parent.parent.children if child.name=="End of:"))

	def _get_previous(self):
		return next((child for child in self.parent.parent.children if child.name=="Account expires"))

class EndOf(Unavailable):

	def _get_next(self):
		return next((child for child in self.parent.parent.children if child.role==controlTypes.ROLE_DROPLIST))

	def _get_previous(self):
		return next((child for child in self.parent.parent.children if child.name=="Never"))

class Droplist(Unavailable):

	def _get_previous(self):
		return next((child for child in self.parent.parent.children if child.name=="End of:"))

class InaccessibleControlContainer(IAccessible):
	TextInfo = DisplayModelTextInfo

class AppModule(appModuleHandler.AppModule):

	def chooseNVDAObjectOverlayClasses(self, obj, clsList):
		identity = getattr(obj,"IAccessibleIdentity",{})
		if identity and identity.get('objectID')==winUser.OBJID_CLIENT:
			if not obj.processHandle and obj.windowClassName in ('SysTreeView32','SysListView32'):
				if obj.role in (controlTypes.ROLE_TREEVIEW, controlTypes.ROLE_LIST):
					clsList[0]=InaccessibleControlContainer
				else:
					clsList[0]=InaccessibleControl
			elif obj.name=='Account expires' and obj.role==controlTypes.ROLE_GROUPING:
				clsList.insert(0,AccountExpires)
			elif obj.name=='Never' and obj.role==controlTypes.ROLE_RADIOBUTTON:
				clsList.insert(0,Never)
			elif obj.name=='End of:' and obj.role==controlTypes.ROLE_RADIOBUTTON:
				clsList.insert(0,EndOf)
			elif obj.name==None and obj.role==controlTypes.ROLE_DROPLIST:
				clsList.insert(0,Droplist)

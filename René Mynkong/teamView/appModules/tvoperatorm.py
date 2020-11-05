import appModuleHandler
import oleacc
from NVDAObjects.IAccessible import IAccessible
from scriptHandler import script
import ui
import winUser
import mouseHandler

class SearchResult(IAccessible):
	def _get_name(self):
		return self.parent.parent.displayText

	@script(gesture="kb:enter", description="Kiest het geselecteerde zoekresultaat")
	def script_openCall(self, gesture):
		self.clickMouse(*self.simpleParent.parent.location.topLeft)

	@staticmethod
	def clickMouse(x,y):
		winUser.setCursorPos(x,y)
		mouseHandler.executeMouseMoveEvent(x,y)
		winUser.mouse_event(winUser.MOUSEEVENTF_LEFTDOWN,0,0,None,None)
		winUser.mouse_event(winUser.MOUSEEVENTF_LEFTUP,0,0,None,None)

class AppModule(appModuleHandler.AppModule):

	def chooseNVDAObjectOverlayClasses(self, obj, clsList):
		if not (getattr(obj, "IAccessibleRole", None) == oleacc.ROLE_SYSTEM_CLIENT and obj.name and obj.simpleParent.simpleParent.name == "Zoeken"):
			return
		prev = obj.parent.previous
		if not prev or prev.name != obj.name:
			return
		prev = prev.previous
		if not prev or prev.name != obj.name:
			return
		clsList.insert(0, SearchResult)

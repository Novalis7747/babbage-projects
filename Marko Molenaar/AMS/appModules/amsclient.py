import appModuleHandler
import api
import winUser
import mouseHandler
import ui
from NVDAObjects.IAccessible.sysTreeView32 import TreeViewItem
from controlTypes import ROLE_TABCONTROL, STATE_SELECTED
import keyboardHandler
import speech

class EnhancedTreeViewItem(TreeViewItem):

	def event_gainFocus(self):
		if STATE_SELECTED not in self.states:
			return
		return super(EnhancedTreeViewItem, self).event_gainFocus()

	def event_stateChange(self):
		if STATE_SELECTED not in self.states:
			return
		return super(EnhancedTreeViewItem, self).event_stateChange()

class AppModule(appModuleHandler.AppModule):

	def __init__(self, *args, **kwargs):
		super(AppModule, self).__init__(*args, **kwargs)
		for n in range(1, 9):
			self.bindGesture("kb:control+%s" % n, "focusTab")

	def chooseNVDAObjectOverlayClasses(self, obj, clsList):
		if TreeViewItem in clsList:
			clsList.insert(0, EnhancedTreeViewItem)

	def clickMouse(self,x,y):
		winUser.setCursorPos(x,y)
		mouseHandler.executeMouseMoveEvent(x,y)
		winUser.mouse_event(winUser.MOUSEEVENTF_LEFTDOWN,0,0,None,None)
		winUser.mouse_event(winUser.MOUSEEVENTF_LEFTUP,0,0,None,None)
		ui.message("Muisklik: horizontaal %d, verticaal %d" % (x, y))

	def script_focusTab(self, gesture):
		num = int(gesture.mainKeyName[-1])
		fg = api.getForegroundObject()
		tab = fg.simpleFirstChild
		if tab and num > 1:
			for i in range(1, num):
				tab = tab.simpleNext
				if not tab:
					break
		if not tab or tab.role != ROLE_TABCONTROL:
			ui.message("Geen tabblad gevonden")
			return
		winUser.setForegroundWindow(tab.windowHandle)

	def script_clickApply(self, gesture):
		fg = api.getForegroundObject()
		tab = fg.simpleFirstChild
		while tab and tab.name != "*Object Details":
			tab = tab.simpleNext
		if not tab:
			ui.message("Geen tabblad gevonden of geen wijzigingen om toe te passen")
			return
		left = tab.location.left
		right = tab.location.right
		x = right - 96
		y = top +11
		self.clickMouse(x, y)

	def tabHelper(self, reverse=False):
		gesture = keyboardHandler.KeyboardInputGesture.fromName("shift+tab" if reverse else "tab")
		i = 0
		while i < 10:
			gesture.send()
			api.processPendingEvents()
			if api.getFocusObject().parent.windowClassName != "ToolbarWindow32":
				break
			speech.cancelSpeech()
			i += 1

	def script_tab(self, gesture):
		self.tabHelper(False)

	def script_shiftTab(self, gesture):
		self.tabHelper(True)

	__gestures = {
		"kb:nvda+alt+a": "clickApply",
		"kb:tab": "tab",
		"kb:shift+tab": "shiftTab",
	}

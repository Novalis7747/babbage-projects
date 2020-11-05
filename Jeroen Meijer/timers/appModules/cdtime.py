import appModuleHandler
from NVDAObjects.UIA import UIA
import eventHandler
import api

class TimerButton(UIA):

	def initOverlayClass(self):
		# Ugly, but there's nothing else we can do with WPF.
		eventHandler.requestEvents(eventName="nameChange", processId=self.processID, windowClassName=self.windowClassName)

	def _get_name(self):
		name = super(TimerButton, self)._get_name()
		if name:
			return name
		automationId = self.UIAElement.CachedAutomationId
		if automationId == "SmarTimer":
			# The last child is the name of the timer
			return self.lastChild.name
		elif automationId == "AddSmartimerButton":
			return "Timer toevoegen"
		elif automationId == "DeleteSmartimerButton":
			return "Timer verwijderen"

	def _get_value(self):
		automationId = self.UIAElement.CachedAutomationId
		if automationId == "SmarTimer":
			# The first child is the value of the timer
			return self.firstChild.name
		return super(TimerButton, self)._get_value()

class AppModule(appModuleHandler.AppModule):

	def isGoodUIAWindow(self, hwnd):
		return True

	def event_nameChange(self, obj, nextHandler):
		try:
			if not isinstance(obj, UIA):
				return
			focus = api.getFocusObject()
			if focus != obj.parent:
				return
			if obj.UIAElement.CachedClassName=="TextBlock" and focus.UIAElement.CachedAutomationId == "SmarTimer":
				eventHandler.queueEvent("valueChange",focus)
		finally:
			nextHandler()

	def chooseNVDAObjectOverlayClasses(self, obj, clsList):
		if not isinstance(obj, UIA):
			return
		if obj.UIAElement.CachedClassName=="Button":
			clsList.insert(0, TimerButton)

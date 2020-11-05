import appModuleHandler
import controlTypes
import oleacc
from NVDAObjects.behaviors import RowWithFakeNavigation
import winUser
from NVDAObjects.IAccessible import IAccessible
import eventHandler
import ui
from logHandler import log
import api
import wx

class tableWithoutFocusEvents(IAccessible):
	previousRow = None

	def event_gainFocus(self):
		super(tableWithoutFocusEvents,self).event_gainFocus()
		self.focusCurrentRow()

	def _get_activeRow(self):
		return next((obj for obj in self.children if controlTypes.STATE_SELECTED in obj.states),None)

	def focusCurrentRow(self):
		row=self.activeRow
		if row!=self.previousRow:
			eventHandler.executeEvent("gainFocus", row)
			self.previousRow=row

	def script_focusCurrentRow(self, gesture):
		gesture.send()
		self.focusCurrentRow()
	script_focusCurrentRow.canPropagate = True

	__gestures={
		"kb:upArrow":"focusCurrentRow",
		"kb:downArrow":"focusCurrentRow",
		"kb:leftArrow":"focusCurrentRow",
		"kb:rightArrow":"focusCurrentRow",
	}

class tableWithoutFocusEventsRow(IAccessible, RowWithFakeNavigation):

	def _get_name(self):
		return "; ".join(obj.name for obj in self.children if controlTypes.STATE_INVISIBLE not in obj.states)

class tableWithoutFocusEventsCell(IAccessible):

	def _get_table(self):
		return self.parent.parent

	def _get_columnNumber(self):
		return self.IAccessibleChildID

	def _get_columnHeaderText(self):
		return self.table.firstChild.getChild(self.columnNumber-1).name

	def _get_rowNumber(self):
		return 0	

class AppModule(appModuleHandler.AppModule):

	def _get_treeView(self):
		try:
			obj = api.getForegroundObject().lastChild.firstChild.firstChild.firstChild
		except:
			log.debugWarning("Can't get tree view", exc_info=True)
			return None
		else:
			if obj.windowClassName=='SysTreeView32':
				return obj
		return None

	def script_focusTreeView(self, gesture):
		treeView=self.treeView
		if treeView:
			eventHandler.executeEvent("gainFocus", treeView)
			return
		ui.message("Boomstructuur niet gevonden")

	def chooseNVDAObjectOverlayClasses(self, obj, clsList):
		if obj.windowClassName=="XTPReport":
			if obj.IAccessibleRole== oleacc.ROLE_SYSTEM_TABLE:
				clsList.insert(0,tableWithoutFocusEvents)
			if obj.IAccessibleRole== oleacc.ROLE_SYSTEM_ROW:
				clsList.insert(0,tableWithoutFocusEventsRow)
			if obj.IAccessibleRole== oleacc.ROLE_SYSTEM_CELL:
				clsList.insert(0,tableWithoutFocusEventsCell)

	__gestures={
		"kb:NVDA+alt+w":"focusTreeView"
	}

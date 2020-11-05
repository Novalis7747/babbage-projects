import appModuleHandler
import api
from logHandler import log
import controlTypes
import oleacc
from globalPlugins.displayModelTools import *
from tones import beep
from NVDAObjects.IAccessible import IAccessible
import collections
import colors
import weakref
import displayModel
import winUser
from NVDAObjects.window import DisplayModelEditableText
from NVDAObjects.UIA import UIA, ComboBoxWithoutValuePattern
import UIAHandler

class avTable(DisplayModelSelectionChangeMonitor):
	STABILIZE_DELAY = 0.2

class AppModule(appModuleHandler.AppModule):
	monitorable = None
	tables = weakref.WeakSet()

	def isGoodUIAWindow(self, hwnd):
		if winUser.getClassName(hwnd).startswith('AVWIN'):
			return True
		return False

	def chooseNVDAObjectOverlayClasses(self, obj, clsList):
		if (
			(obj.name and obj.name.startswith('GRD')
			and not obj.windowHandle in (o.windowHandle for o in self.tables)) or
			(obj.windowClassName=='TreeView20WndClass' and getattr(obj,"IAccessibleRole",None)==10) or
			(obj.windowClassName=='ListView20WndClass' and obj.role==3)
		):
			clsList.insert(0,avTable)
			self.tables.add(obj)
		elif isinstance(obj, UIA):
			if obj._getUIACacheablePropertyValue(UIAHandler.UIA_IsValuePatternAvailablePropertyId) and obj.role==controlTypes.ROLE_EDITABLETEXT:
				clsList.insert(0, DisplayModelEditableText)
			elif obj.role==controlTypes.ROLE_LIST:
				# AV list boxes are broken.
				# They expose a number value, but the selection pattern works ok.
				# We can treat them as combo boxes without a value pattern.
				clsList.insert(0, ComboBoxWithoutValuePattern)

	def event_NVDAObject_init(self,obj):
		if any(winUser.isDescendantWindow(handle,obj.windowHandle) for handle in (o.windowHandle for o in self.tables)) and not obj in self.tables or obj.name=="Page2":
			obj.shouldAllowIAccessibleFocusEvent = False
			obj.shouldAllowUIAFocusEvent = False
		if obj.role==controlTypes.ROLE_GRAPHIC:
			obj.shouldAllowIAccessibleFocusEvent = False
			obj.shouldAllowUIAFocusEvent = False

	def event_gainFocus(self, obj, nextHandler):
		for table in self.tables:
			if table in api.getFocusAncestors() and table not in displayModel._textChangeNotificationObjs:
				table.startMonitoring()
			elif table not in api.getFocusAncestors() and table in displayModel._textChangeNotificationObjs:
				table.stopMonitoring()
		nextHandler()\

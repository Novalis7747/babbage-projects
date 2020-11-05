import appModuleHandler
import api
from globalPlugins.displayModelTools import *
from locationHelper import *
from NVDAObjects.IAccessible import IAccessible, getNVDAObjectFromEvent, getNVDAObjectFromPoint
import tones
import winUser
import ctypes
import treeInterceptorHandler
import controlTypes
from scriptHandler import isScriptWaiting
from operator import attrgetter
import ui
import collections
import keyboardHandler
import colors
import time
from NVDAObjects.window import Window
import textInfos
import wx

def isUsableWindow(windowHandle):
	if not winUser.user32.IsWindowVisible(windowHandle):
		return False
	if winUser.user32.GhostWindowFromHungWindow(windowHandle):
		return False
	return True

class U4TreeInterceptor(treeInterceptorHandler.TreeInterceptor):

	def __init__(self,obj):
		super(U4TreeInterceptor,self).__init__(obj)
		self._lastFocusObj = None
		self._lastFocusIndex = 0
		self._hadFirstGainFocus = False

	def _formMovementScriptHelper(self, movement="next", step=1, axis="x", wrap=False):
		if isScriptWaiting():
			return
		length = len(self.relevantAncestorHandles)
		map = self.relevantAncestorsXY if axis=="y" else self.relevantAncestorsYX
		curPoint = self.relevantAncestorCenterPoints[self._lastFocusIndex]
		oldIndex = map.index(curPoint)
		newIndex = oldIndex+step if movement=="next" else oldIndex-step
		if wrap:
			if step==-1 and movement=="next":
				goToIndex= length
			elif step==-1 and movement=="previous":
				goToIndex= 0
			else:
				goToIndex= newIndex % length
		else:
			boundaryFunc = max if movement=="next" else min
			getter = attrgetter("y" if axis=="x" else "x")
			boundary = boundaryFunc(map.index(point) for point in map if getter(point)==getter(curPoint))
			if movement=="next":
				if newIndex >boundary and oldIndex==boundary:
					goToIndex= None
				elif (newIndex >boundary and oldIndex<boundary) or step==-1:
					goToIndex = boundary
				else:
					goToIndex = newIndex
			else:
				if newIndex <boundary and oldIndex==boundary:
					goToIndex= None
				elif (newIndex <boundary and oldIndex>boundary) or step==-1:
					goToIndex = boundary
				else:
					goToIndex = newIndex
		if goToIndex is None:
			ui.message("Rand van formulier")
			return
		obj = getNVDAObjectFromPoint(*map[goToIndex])
		if controlTypes.STATE_UNAVAILABLE in obj.states or obj.hasFocus:
			eventHandler.executeEvent('gainFocus',obj)
		else:
			obj.setFocus()

	def event_gainFocus(self, obj, nextHandler):
		self._lastFocusObj = obj
		try:
			self._lastFocusIndex = self.relevantAncestorHandles.index(obj.windowHandle)
		except:
			self._hadFirstGainFocus = False
		nextHandler()

	def event_treeInterceptor_gainFocus(self):
		hadFirstGainFocus=self._hadFirstGainFocus
		if not hadFirstGainFocus:
			focusObj = self.currentNVDAObject
			if focusObj.windowHandle not in self.relevantAncestorHandles:
				try:
					getNVDAObjectFromPoint(*self.relevantAncestorsYX[0]).setFocus()
				except:
					pass
			else:
				self.event_gainFocus(focusObj, lambda: focusObj.event_gainFocus())
		self._hadFirstGainFocus = True

	def _get_isAlive(self):
		return winUser.isWindowVisible(self.rootNVDAObject.windowHandle)

	def __contains__(self, obj):
		return winUser.isDescendantWindow(self.rootNVDAObject.windowHandle, obj.windowHandle)

	def _get_currentNVDAObject(self):
		curFocus = api.getFocusObject()
		return curFocus if curFocus in self else None

	shouldPrepare = True

	def prepare(self):
		self.shouldPrepare = False
		self.relevantAncestorHandles = []
		self.relevantAncestorCenterPoints = []
		r=ctypes.wintypes.RECT()
		for handle in self.rootNVDAObject.getRecursiveDescendantHandles(self.rootNVDAObject.windowHandle):
			className = winUser.getClassName(handle)
			if className=="TskcxCurrencyEdit" or not any(className.endswith(suffix) for suffix in ("Edit","CheckBox","Button")):
				continue
			self.relevantAncestorHandles.append(handle)
			try:
				self.relevantAncestorHandles.remove(winUser.getAncestor(handle, winUser.GA_PARENT))
			except ValueError:
				pass
		for handle in self.relevantAncestorHandles:
			winUser.user32.GetWindowRect(handle,ctypes.byref(r))
			self.relevantAncestorCenterPoints.append(RectLTRB.fromCompatibleType(r).center)
		self.relevantAncestorsYX = sorted(self.relevantAncestorCenterPoints)
		self.relevantAncestorsXY = sorted(self.relevantAncestorCenterPoints, key=tuple)

	def script_nextObj(self, gesture):
		self._formMovementScriptHelper(axis="x", wrap=True)
	script_nextObj.__doc__ = "Gaat naar het volgende object in het formulier."

	def script_previousObj(self, gesture):
		self._formMovementScriptHelper(movement="previous", axis="x", wrap=True)
	script_previousObj.__doc__ = "Gaat naar het vorige object in het formulier."

	def script_nextRow(self, gesture):
		self._formMovementScriptHelper(axis="y", movement="next")
	script_nextRow.__doc__ = "Gaat naar de volgende rij in het formulier."

	def script_previousRow(self, gesture):
		self._formMovementScriptHelper(axis="y", movement="previous")
	script_previousRow.__doc__ = "Gaat naar de vorige rij in het formulier."

	def script_nextRow3(self, gesture):
		self._formMovementScriptHelper(axis="y", movement="next", step=3)
	script_nextRow3.__doc__ = "Gaat 3 rijen verder in het formulier."

	def script_previousRow3(self, gesture):
		self._formMovementScriptHelper(axis="y", movement="previous", step=3)
	script_previousRow3.__doc__ = "Gaat 3 rijen terug in het formulier."

	def script_lastRow(self, gesture):
		self._formMovementScriptHelper(axis="y", movement="next", step=-1)
	script_lastRow.__doc__ = "Gaat naar de laatste rij in het formulier."

	def script_firstRow(self, gesture):
		self._formMovementScriptHelper(axis="y", movement="previous", step=-1)
	script_firstRow.__doc__ = "Gaat naar de eerste rij in het formulier."

	def script_nextColumn(self, gesture):
		self._formMovementScriptHelper(axis="x", movement="next")
	script_nextColumn.__doc__ = "Gaat naar de volgende kolom in het formulier."

	def script_previousColumn(self, gesture):
		self._formMovementScriptHelper(axis="x", movement="x")
	script_previousColumn.__doc__ = "Gaat naar de vorige kolom in het formulier."

	def script_partner(self, gesture):
		obj = self.rootNVDAObject.simplePrevious
		if obj and obj.windowClassName=="TTabSet":
			ti = obj.makeTextInfo(textInfos.POSITION_ALL)
			if ti.find("(P)"):
				point = ti.pointAtStart
				winUser.setCursorPos(point.x, point.y)
				winUser.mouse_event(winUser.MOUSEEVENTF_LEFTDOWN, 0, 0, None, None)
				winUser.mouse_event(winUser.MOUSEEVENTF_LEFTUP, 0, 0, None, None)
				return
		ui.message("Partner niet gevonden, of je zit in het verkeerde scherm, of er is geen partner beschikbaar")
	script_partner.__doc__= "Gaat naar de aangifte van de partner, indien beschikbaar"

	def script_client(self, gesture):
		obj = self.rootNVDAObject.simplePrevious
		if obj and obj.windowClassName=="TTabSet":
			ti = obj.makeTextInfo(textInfos.POSITION_ALL)
			if ti.text.startswith("(B)"):
				point = ti.pointAtStart
				winUser.setCursorPos(point.x, point.y)
				winUser.mouse_event(winUser.MOUSEEVENTF_LEFTDOWN, 0, 0, None, None)
				winUser.mouse_event(winUser.MOUSEEVENTF_LEFTUP, 0, 0, None, None)
				return
		ui.message("Client niet gevonden, of je zit in het verkeerde scherm, of er is geen partner beschikbaar")
	script_client.__doc__= "Gaat naar de aangifte van de client, indien beschikbaar"

	__gestures={
		"kb:windows+alt+.": "nextObj",
		"kb:windows+alt+,": "previousObj",
		"kb:windows+alt+downArrow": "nextRow",
		"kb:windows+alt+upArrow": "previousRow",
		"kb:windows+alt+end": "lastRow",
		"kb:windows+alt+home": "firstRow",
		"kb:windows+alt+pageUp": "previousRow3",
		"kb:windows+alt+pageDown": "nextRow3",
		"kb:windows+alt+rightArrow": "nextColumn",
		"kb:windows+alt+leftArrow": "previousColumn",
		"kb:alt+p":"partner",
		"kb:alt+b":"client",
	}

class U4FormFieldContainer(NVDAObject):
	treeInterceptorClass=U4TreeInterceptor
	shouldCreateTreeInterceptor = True
	role = controlTypes.ROLE_PROPERTYPAGE

	def event_gainFocus(self):
		# Make sure that this object has a tree interceptor
		wx.CallLater(2000,treeInterceptorHandler.update,self)

	@classmethod
	def getRecursiveDescendantHandles(cls, handle):
		childWindow=winUser.getTopWindow(handle)
		while childWindow:
			if isUsableWindow(childWindow):
				yield childWindow
				for grandChildWindow in cls.getRecursiveDescendantHandles(childWindow):
					yield grandChildWindow
			childWindow=winUser.getWindow(childWindow,winUser.GW_HWNDNEXT)

class U4GridTextInfo(DisplayModelTextInfoOverlay):

	def _get_selectionCondition(self):
		lst = [self.defaultSelectionCondition,]
		if self.obj.simpleParent.windowClassName==u'TfrmMain':
			lst.append({'color': [colors.RGB(red=255, green=255, blue=255)],
			'background-color': [colors.RGB(red=128, green=0, blue=64), colors.RGB(red=10, green=36, blue=106),]
		})
		return lst

class U4Grid(DisplayModelSelectionChangeMonitor):
	STABILIZE_DELAY = 0.2
	TextInfo = U4GridTextInfo

class U4ToolbarContainer(NVDAObject):

	def script_altG(self, gesture):
		widthFrac = None
		heightFrac = 0.5
		l, t, w, h = self.simpleFirstChild.location
		if self.windowClassName=="TfrmClientBelastingJaarIB":
			widthFrac = 0.046
#		elif self.windowClassName=="TfrmClientBelastingJaarVpb":
#			widthFrac = 0.067
		if not widthFrac:
			ui.message("Functie niet overschreven.")
			gesture.send()
			return
		x = int(l + widthFrac * w)
		y = int(t + heightFrac * h)
		winUser.setCursorPos(x, y)
		winUser.mouse_event(winUser.MOUSEEVENTF_LEFTDOWN, 0, 0, None, None)
		winUser.mouse_event(winUser.MOUSEEVENTF_LEFTUP, 0, 0, None, None)
	script_altG.__doc__= "Overschrijft alt+g voor het klikken op de juiste knop"
	script_altG.canPropagate = True

	__gestures = {
		"kb:alt+g": "altG",
	}

class AppModule(appModuleHandler.AppModule):

	def chooseNVDAObjectOverlayClasses(self, obj, clsList):
		identity = getattr(obj,"IAccessibleIdentity",{})
		if identity and identity.get('objectID')==winUser.OBJID_CLIENT:
			if obj.windowClassName in ('TcxGridSite','TdxTreeList'):
				clsList.insert(0, U4Grid)
			elif not controlTypes.STATE_INVISIBLE in obj.states and obj.parent.parent.windowClassName=='TskcxPageControl' and obj.simpleParent.windowClassName.startswith('Tfrm'):
				clsList.insert(0, U4FormFieldContainer)
			elif obj.windowClassName.startswith("TfrmClientBelastingJaar"):
				clsList.insert(0, U4ToolbarContainer)
			elif obj.windowClassName.endswith("CheckBox"):
				obj.role=controlTypes.ROLE_CHECKBOX

	def event_gainFocus(self, obj, nextHandler):
		if (getattr(obj,"IAccessibleIdentity",{}).get('objectID')==winUser.OBJID_CLIENT
			and obj.windowClassName=='TskcxPageControl'
			and obj.simpleParent.windowClassName.startswith('Tfrm')
		):
			firstChild=obj.firstChild
			if not firstChild.treeInterceptor:
				firstChild.setFocus()
			else:
				wx.CallLater(1000,firstChild.setFocus)
		nextHandler()

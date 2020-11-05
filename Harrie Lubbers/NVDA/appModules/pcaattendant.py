import appModuleHandler
from globalPlugins.dmTools.classes import *
import colors
import winUser
from NVDAObjects.IAccessible import StaticText
from controlTypes import ROLE_ALERT, STATE_INVISIBLE
import ui
import scriptHandler
from textInfos import POSITION_ALL, UNIT_LINE


class IncomingCallAlert(StaticText):
	role = ROLE_ALERT

	def initOverlayClass(self):
		if not self.hasFocus:
			self.setFocus()

class JdmListCtrlTextInfo(MultipleColorsDisplayModelTextInfo):
	backgroundSelectionColors = [colors.RGB(red=132, green=193, blue=255)]
	foregroundSelectionColors = [colors.RGB(red=0, green=0, blue=0)]

class JdmListCtrl(DisplayModelSelectionChangeMonitor):
	TextInfo = JdmListCtrlTextInfo
	STABILIZE_DELAY = 0.1

	def script_reportInfo(self,gesture):
		try:
			obj = self.parent.previous.previous.previous.previous.previous
			if obj.windowClassName== "#32770":
				ti = obj.makeTextInfo(POSITION_ALL)
				info = "\n".join(ti.getTextInChunks(UNIT_LINE))
			else:
				info = None
		except:
			info = None
		if not info:
			ui.message("Geen beschikbaarheidsinformatie")
			return
		repeats=scriptHandler.getLastScriptRepeatCount()
		if repeats==0:
			ui.message(info)
		elif repeats==1:
			ui.browseableMessage(info, title="Beschikbaarheidsinfo")
	script_reportInfo.__doc__ = "Geeft informatie over de aanwezigheid van een persoon, indien beschikbaar"

	__gestures={
		"kb:NVDA+I": "reportInfo",
	}

class AppModule(appModuleHandler.AppModule):

	def chooseNVDAObjectOverlayClasses(self, obj, clsList):
		identity = getattr(obj,"IAccessibleIdentity",{})
		if identity and identity.get('objectID')==winUser.OBJID_CLIENT:
			if obj.name=="JdmListCtrl":
				clsList.insert(0, JdmListCtrl)
			elif obj.name and obj.windowClassName=="Static" and obj.windowControlID==1190 and STATE_INVISIBLE not in obj.states:
				clsList.insert(0, IncomingCallAlert)
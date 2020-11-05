import appModuleHandler
import api
from globalPlugins.displayModelTools import *
import colors
import ui
from scriptHandler import script
import winUser
import review

class AuditionTextInfo(DisplayModelTextInfoOverlay):

	def _get_selectionCondition(self):
		return [{'background-color': [colors.RGB(red=0, green=120, blue=215)],
		}, {
			#'color': [colors.RGB(red=255, green=255, blue=255)],
			'background-color': [colors.RGB(red=255, green=182, blue=176)],
		}]

class AuditionBase(DisplayModelSelectionChangeMonitor):
	pass

class AuditionColorChangeTextContainer(AuditionBase):
	TextInfo = AuditionTextInfo

	@script(gesture="kb:alt+NVDA+r")
	def script_redraw(self, gesture):
		self.redraw()
		ui.message("Opnieuw getekend")

	@script(description="Changes focus", gestures=("kb:upArrow", "kb:downArrow", "kb:leftArrow", "kb:rightArrow"))
	def script_changeFocus(self, gesture):
		gesture.send()
		self.event_textChange()

class AuditionBalanceTextInfo(DisplayModelTextInfoOverlay, displayModel.EditableTextDisplayModelTextInfo):

	def _get_selectionCondition(self):
		return [{
			'color': [colors.RGB(red=255, green=255, blue=255)],
		}]

class AuditionBalansEditor(AuditionBase):
	TextInfo = AuditionBalanceTextInfo

class AppModule(appModuleHandler.AppModule):

	def chooseNVDAObjectOverlayClasses(self, obj, clsList):
		identity = getattr(obj,"IAccessibleIdentity",{})
		if identity and identity.get('objectID')==winUser.OBJID_CLIENT:
			if obj.windowClassName in ('ClassReportDocFrame','ClassAdjDocFrame'):
				clsList.insert(0, AuditionColorChangeTextContainer)
			elif obj.windowClassName in ('fpSpread70'):
				clsList.insert(0, AuditionBalansEditor)

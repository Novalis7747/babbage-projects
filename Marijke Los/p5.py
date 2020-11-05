import appModuleHandler
import api
import winUser
import mouseHandler
import ui
from logHandler import log
import time

class AppModule(appModuleHandler.AppModule):

	def getFirstAncestorWithAttribute(self, obj, attribute, value):
		"""
		Function which traverses up the objects tree until it finds a parent object with a particular attribute
		@param obj: The object to start from
		@type obj: L{NVDAObjects.NVDAObject}
		@param attribute: The attribute to search for
		@returns: the first parent of obj with attribute
		@rtype: L{NVDAObjects.NVDAObject}
		"""
		parent=obj.parent
		while parent:
			try:
				newValue=getattr(parent,attribute)
				if newValue==value:
					break
			except AttributeError:
				pass
			parent=parent.parent
		return parent

	def clickMouse(self,x,y):
		winUser.setCursorPos(x,y)
		mouseHandler.executeMouseMoveEvent(x,y)
		winUser.mouse_event(winUser.MOUSEEVENTF_LEFTDOWN,0,0,None,None)
		winUser.mouse_event(winUser.MOUSEEVENTF_LEFTUP,0,0,None,None)

	def script_clickBank(self,gesture):
		fg=api.getForegroundObject()
		if fg.name=='Bankverbindung':
			self.clickMouse(515, 454)
			return
		obj=fg.objectFromPoint(684,634)
		if self.getFirstAncestorWithAttribute(obj,"name",'Klantgegevens'):
			self.clickMouse(684, 634)
			return
		obj=fg.objectFromPoint(1662, 618)
		if self.getFirstAncestorWithAttribute(obj,"name",'Uitgavengegevens'):
			self.clickMouse(1662, 618)
			time.sleep(2)
			newFg=api.getForegroundObject()
			if fg!=newFg:
				return
			self.clickMouse(1662, 548)
			return
		ui.message("Niets gevonden om op te klikken, sta je in het juiste venster?")
	script_clickBank.__doc__="Klikt met de muis op een ontoegankelijk element met betrekking tot bank en rekeningnummerkeuze"

	def script_clickAdresNazending(self,gesture):
		obj=api.getForegroundObject().objectFromPoint(1658,423)
		if obj.name=='Nazending':
			self.clickMouse(1658,423)
			return
	script_clickAdresNazending.__doc__="Klikt met de muis op de knop om een adres te selecteren voor nazending, bijv. in het geval van vakantie"

	def script_clickVoorval(self,gesture):
		self.clickMouse(103, 113)
	script_clickVoorval.__doc__="Klikt met de muis op handmatig voorval aanleggen in de werkbalk"

	def script_clickVoorvalBewerken(self,gesture):
		self.clickMouse(42, 113)
	script_clickVoorval.__doc__="Klikt met de muis op voorval bewerkenin de werkbalk"

	def script_clickVolgendeVoorval(self,gesture):
		self.clickMouse(13, 110)
	script_clickVolgendeVoorval.__doc__="Klikt met de muis op volgende voorval in de werkbalk"

	def script_clickVolgendeQueue(self,gesture):
		self.clickMouse(94, 308)
	script_clickVolgendeQueue.__doc__="Klikt met de muis op volgende queue in de werkbalk"

	def script_clickQueueAanmelden(self,gesture):
		self.clickMouse(167, 112)
	script_clickQueueAanmelden.__doc__="Klikt met de muis op queue aanmelden in de werkbalk"

	def script_clickContactOptions(self,gesture):
		self.clickMouse(243, 56)
	script_clickContactOptions.__doc__="Klikt met de muis op contactopties in de werkbalk"

	def script_reportEindDatum(self,gesture):
		obj=api.getForegroundObject().objectFromPoint(450, 477)
		if self.getFirstAncestorWithAttribute(obj,"name",'Uitgavengegevens'):
			obj.reportFocus()
		else:
			ui.message("Geen einddatum, sta je op het tabblad uitgavegegevens?")
	script_reportEindDatum.__doc__="Leest de inhoud voor van het veld fact t/m, oftewel de datum tot wanneer er gefactureerd wordt"

	def script_reportRestitutie(self,gesture):
		obj=api.getForegroundObject().objectFromPoint(1529, 514)
		if self.getFirstAncestorWithAttribute(obj,"name",'Opzegging'):
			obj.reportFocus()
		else:
			ui.message("Geen prijs veld, ben je een opzegging aan het doen en heb je een opzeggingsreden gekozen?")
	script_reportRestitutie.__doc__="Leest de inhoud voor van het veld prijs, oftewel de prijs die de klant terug krijgt"

	__gestures={
		"kb:control+shift+b": "clickBank",
		"kb:control+shift+a": "clickAdresNazending",
		"kb:control+shift+v": "clickVoorval",
		"kb:control+shift+w": "clickVoorvalBewerken",
		"kb:control+shift+.": "clickVolgendeVoorval",
		"kb:control+shift+q": "clickQueueAanmelden",
		"kb:control+shift+,": "clickVolgendeQueue",
		"kb:control+shift+c": "clickContactOptions",
		"kb:control+shift+d": "reportEindDatum",
		"kb:control+shift+p": "reportRestitutie",
	}

	#test

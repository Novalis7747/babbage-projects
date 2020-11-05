import appModuleHandler
import controlTypes
import winUser
from NVDAObjects.window import DisplayModelEditableText
from NVDAObjects.UIA import UIA, ComboBoxWithoutValuePattern
import UIAHandler
from collections import OrderedDict

class AppModule(appModuleHandler.AppModule):

	def isGoodUIAWindow(self, hwnd):
		if winUser.getClassName(hwnd).startswith('Mamut'):
			return True
		return False

	def chooseNVDAObjectOverlayClasses(self, obj, clsList):
		if not isinstance(obj, UIA):
			return
		if obj._getUIACacheablePropertyValue(UIAHandler.UIA_IsValuePatternAvailablePropertyId):
			clsList.insert(0, MamutWithValuePattern)
			if obj.role==controlTypes.ROLE_EDITABLETEXT:
				clsList.insert(0, DisplayModelEditableText)
		if obj.role==controlTypes.ROLE_LIST:
			# Mamut list boxes are broken.
			# They expose a number value, but the selection pattern works ok.
			# We can treat them as combo boxes without a value pattern.
			clsList.insert(0, ComboBoxWithoutValuePattern)
		elif obj.role==controlTypes.ROLE_COMBOBOX:
			# Mamut combo boxes behave like broken list boxes as noted above.
			# However, they expose neither a value nor a selection pattern.
			clsList.insert(0, MamutBrokenComboBox)

class MamutBrokenComboBox(ComboBoxWithoutValuePattern):

	def _get_value(self):
		# Directly talk to UIA to get the selection, as fetching NVDA Object children is slow!
		# Adapted from Outlook appModule.
		childrenCacheRequest=UIAHandler.handler.baseCacheRequest.clone()
		childrenCacheRequest.addProperty(UIAHandler.UIA_NamePropertyId)
		childrenCacheRequest.TreeScope=UIAHandler.TreeScope_Children
		childrenCacheRequest.treeFilter=UIAHandler.handler.clientObject.createAndConditionFromArray([
			UIAHandler.handler.clientObject.ContentViewCondition,
			UIAHandler.handler.clientObject.createPropertyCondition(UIAHandler.UIA_SelectionItemIsSelectedPropertyId, True)
		])
		cachedChildren=self.UIAElement.buildUpdatedCache(childrenCacheRequest).getCachedChildren()
		if cachedChildren:
			return cachedChildren.getElement(0).cachedName
		return "Geen selectie"

class MamutWithValuePattern(UIA):

	def _getLabelsInRange(self):
		"""
		Searches for labels in range of the object.
		"""
		#: dictionary which will contain the matching labels with distance as key and a tuple containing instances of L{ChunkWithPos} and its associated L{NVDAObjects.NVDAObject} as value
		matches=OrderedDict()
		selfLeft = self.location[0]
		selfTop = self.location[1]
		selfRight = self.location[0]+self.location[2]
		selfBottom = self.location[1]+self.location[3]
		siblingCacheRequest=UIAHandler.handler.baseCacheRequest.clone()
		siblingCacheRequest.addProperty(UIAHandler.UIA_NamePropertyId)
		siblingCacheRequest.addProperty(UIAHandler.UIA_BoundingRectanglePropertyId)
		parentElement=UIAHandler.handler.baseTreeWalker.GetParentElementBuildCache(self.UIAElement,UIAHandler.handler.baseCacheRequest)
		children=parentElement.FindAllBuildCache(
			UIAHandler.TreeScope_Children,
			UIAHandler.handler.clientObject.createPropertyCondition(UIAHandler.UIA_ControlTypePropertyId,UIAHandler.UIA_TextControlTypeId),
			siblingCacheRequest
		)
		if not children:
			return matches
		widthMatches = {}
		heightMatches = {}
		for index in xrange(children.length):
			e=children.getElement(index)
			eLocation=e.getCachedPropertyValueEx(UIAHandler.UIA_BoundingRectanglePropertyId,True)
			eLeft = int(eLocation[0])
			eTop = int(eLocation[1])
			eRight = int(eLocation[0]+eLocation[2])
			eBottom = int(eLocation[1]+eLocation[3])
			# The code below is quite hard to explain and simply requires some Python knowledge
			# A good starting point would be reading documentation about generators and lambda functions as well as info about the sorted, abs and next functions.
			# It is really not that hard actually!
			if abs(eBottom-selfTop)>=abs(eTop-selfTop) and abs(eBottom-selfBottom)<=abs(eTop-selfBottom) and eRight<=selfLeft:
				widthMatches[selfLeft-eRight] = e.cachedName
			if abs(eRight-selfLeft)>=abs(eLeft-selfLeft) and abs(eRight-selfRight)<=abs(eLeft-selfRight) and eBottom<=selfTop:
				heightMatches[selfTop-eBottom] = e.cachedName
		matches.update(sorted(widthMatches.iteritems(), key=lambda x: x[0]))
		matches.update(sorted(heightMatches.iteritems(), key=lambda x: x[0]))
		return matches

	def _get_name(self):
		"""
		Set the label of an unlabeled object.
		This is either the object left or above, whichever distance is lower.
		"""
		matches=self._getLabelsInRange()
		if matches:
			self.name=next(v for k,v in matches.iteritems() if k<=150)
			return self.name
		return super(MamutWithValuePattern, self).name

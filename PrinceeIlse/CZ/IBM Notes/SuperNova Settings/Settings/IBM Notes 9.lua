--[[
	Dolphin script file for IBM Notes 9.
	Original author: Dolhin.
	Edited by: Babbage Automation.
--]]

require "strict"
require "dolphin"

msaa_focus_event = nil
g_msaa_role = nil
g_msaa_loc = nil
g_msaa_name = nil

function EventScriptStartup(p_id)
	msaa_focus_event = MSAA.AddEvent(EVENT_OBJECT_FOCUS, p_id, 0)
end

function EventScriptCloseDown()
	if msaa_focus_event then
		MSAA.RemoveEvent(msaa_focus_event)
	end
end

function EventScriptMSAAEvent(event_id, iacc, child_id)
	if event_id == EVENT_OBJECT_FOCUS then
		--[[
			local tmp = MSAA.GetName(iacc, child_id)
			if tmp then System.OutputDebugString(L"msaa focus event name " .. tmp) end
		--]]
		--[[
			when tabbing to buttons can get 2 button events and one graphic event.
			If graphic event last to fire can stop detection fn working.
			can also get a random document role sent through after the button role.
		--]]
		local tmp = MSAA.GetRole(iacc, child_id)
		if tmp and tmp ~= ROLE_SYSTEM_GRAPHIC and tmp ~= ROLE_SYSTEM_DOCUMENT then
			g_msaa_role = MSAA.GetRole(iacc, child_id)
			g_msaa_loc = MSAA.GetLocation(iacc, child_id)
			g_msaa_name = MSAA.GetName(iacc, child_id)
		end
	end
end

function detectButtonFocus(p_area, scan, mod, damage)
local btn_props
local new_focus
local msaa_rect
	if g_msaa_role == ROLE_SYSTEM_PUSHBUTTON then
		btn_props = Area.GetProperties(p_area)
		if g_msaa_loc and btn_props then 
			msaa_rect = {left = g_msaa_loc.left, top = g_msaa_loc.top, right = g_msaa_loc.left + g_msaa_loc.width, bottom = g_msaa_loc.top + g_msaa_loc.height}
			if Utils.RectInRect(btn_props, msaa_rect) then
				new_focus = {left = msaa_rect.left, top = msaa_rect.top, right = msaa_rect.right, bottom = msaa_rect.bottom, confidence = 90, type = FOCUSADD_TYPE_AREA, area = p_area}
				Focus.Add(new_focus)
			end
		end
	end
end

function detectCalendarCell(p_area, scan, mod, damage)
local new_focus
local cal_props
local msaa_rect
local new_cell
local inserted_cell
	if g_msaa_role and g_msaa_role == ROLE_SYSTEM_CELL then
		cal_props = Area.GetProperties(p_area)
		if g_msaa_loc and cal_props then
			msaa_rect = {left = g_msaa_loc.left, top = g_msaa_loc.top, right = g_msaa_loc.left + g_msaa_loc.width, bottom = g_msaa_loc.top + g_msaa_loc.height}
			if cal_props and Utils.RectInRect(msaa_rect, cal_props) then
				new_cell = {left = msaa_rect.left, top = msaa_rect.top, right = msaa_rect.right, bottom = msaa_rect.bottom, confidence = 90, type = AREA_CELL}
				inserted_cell = Area.Insert(p_area, new_cell)
				if Area.IsValid(inserted_cell) then
					if g_msaa_name then
						Area.SetText(inserted_cell, g_msaa_name, 1)
					end
					new_focus = {left = msaa_rect.left, top = msaa_rect.top, right = msaa_rect.right, bottom = msaa_rect.bottom, confidence = 90, type = FOCUSADD_TYPE_AREA, area = inserted_cell}
					Focus.Add(new_focus)
				end
			end
		end
	end
end

function detectPageTabList(p_area, scan, mod, damage)
local child_props
local msaa_rect
local new_focus
local new_tab
local inserted_tab
local tab_sheet_props
local tab_sheet_parent
local inserted_tab_sheet
	if g_msaa_role == ROLE_SYSTEM_PAGETAB then
		for child in Area.Children(p_area) do
			child_props = Area.GetProperties(child)
			if child_props and child_props.type == AREA_TAB then
				if g_msaa_loc and child_props then 
					msaa_rect = {left = g_msaa_loc.left, top = g_msaa_loc.top, right = g_msaa_loc.left + g_msaa_loc.width, bottom = g_msaa_loc.top + g_msaa_loc.height}
					if Utils.RectInRect(child_props, msaa_rect) then
						new_focus = {left = msaa_rect.left, top = msaa_rect.top, right = msaa_rect.right, bottom = msaa_rect.bottom, confidence = 90, type = FOCUSADD_TYPE_AREA, area = child}
						Focus.Add(new_focus)
						return
					end
				end
			end
		end
		--[[
			if we get here it is possible that the tab that should be focused is not being detected by Supernova properly.
			Add it in using the event info need to resize the parent tab sheet as it is not picked up by the map properly.
		--]]
		if g_msaa_loc then 
			tab_sheet_props = Area.GetProperties(p_area)
			if tab_sheet_props then
				tab_sheet_props.left = g_msaa_loc.left
				tab_sheet_parent = Area.Parent(p_area)
				if Area.IsValid(tab_sheet_parent) then
					Area.Remove(p_area, 0)
					local temp_table = {left = tab_sheet_props.left, top = tab_sheet_props.top, right = tab_sheet_props.right, bottom = tab_sheet_props.bottom, confidence = 90, type = AREA_TAB_SHEET}
					inserted_tab_sheet = Area.Insert(tab_sheet_parent, temp_table)
					if Area.IsValid(inserted_tab_sheet) then
						new_tab = {left = g_msaa_loc.left, top = g_msaa_loc.top, right = g_msaa_loc.left + g_msaa_loc.width, bottom = g_msaa_loc.top + g_msaa_loc.height, type = AREA_TAB, confidence = 90}
						inserted_tab = Area.Insert(inserted_tab_sheet, new_tab)
						if Area.IsValid(inserted_tab) then
							new_focus = {left = new_tab.left, top = new_tab.top, right = new_tab.right, bottom = new_tab.bottom, type = FOCUSADD_TYPE_AREA, area = inserted_tab, confidence = 90}
							Focus.Add(new_focus)
						end
					end
				end
			end
		end
	end
end

function detectListBoxFocus(p_area, scan, mod, damage)
local list_props
local new_focus
local msaa_rect
	if g_msaa_loc and (g_msaa_role == ROLE_SYSTEM_LIST  or g_msaa_role == ROLE_SYSTEM_COMBOBOX) then
		list_props = Area.GetProperties(p_area)
		msaa_rect = {left = g_msaa_loc.left, top = g_msaa_loc.top, right = g_msaa_loc.left + g_msaa_loc.width, bottom = g_msaa_loc.top + g_msaa_loc.height}
		if Utils.RectInRect(msaa_rect, list_props) then
			new_focus = {left = msaa_rect.left, top = msaa_rect.top, right = msaa_rect.right, bottom = msaa_rect.bottom, confidence = 90, area = p_area, type = FOCUSADD_TYPE_AREA}
			Focus.Add(new_focus)
		end
	end
end

function detectTooltip(area, scan, mod, damage)
local detect_obj
local first_child
local next_child
local child_child
local first_inf
	detect_obj = Detector.GetDetectFromArea(area)
	if detect_obj then
		first_child = Detector.FirstChild(detect_obj)
		if first_child then
			first_inf = Detector.GetInfo(first_child)
			if first_inf and first_inf.classname == L"Static" then
				next_child = Detector.Next(first_child)
				child_child = Detector.FirstChild(first_child)
				if not (next_child and child_child) then
					Area.SetType(area, AREA_TIP)
				end
			end
		end
	end
end

function detectEditName(area, mod, scan, damage)
local area_state = Area.GetState(area)
	if area_state and area_state.focus == VALUE_FOCUS then
		if g_msaa_name and g_msaa_role and g_msaa_role == ROLE_SYSTEM_TEXT then
			Area.SetText(area, g_msaa_name, 1)
		end
	end
end

function detectEditName1(area, mod, scan, damage)
local msaa_detect_inf = Detector.GetDetectorInfoFromArea(area, DETECTOR_MSAA)
	if msaa_detect_inf then
		if msaa_detect_inf.name then
			Area.SetText(area, msaa_detect_inf.name, 1)
		end
	end
end

function detectRadioButtonLabel(area, mod, scan, damage)
local area_state = Area.GetState(area)
	if area_state and area_state.focus == VALUE_FOCUS then
		local props = Area.GetProperties(area)
		local parent = Area.Parent(area)
		local radio_label = L""
		if props.type ~= AREA_RADIO_CONTROL then
			return
		end
		for child in Area.Children(parent) do
			local child_props = Area.GetProperties(child)
			if child_props.type == AREA_TEXT then
				radio_label = Area.GetText(child).string .. L" " .. radio_label
				Area.SetText(area, radio_label, 1)
			end
		end
	end
end

--[[
	Below not used anymore, as home TAB wasn't working properly
--]]
function detectPageTabFocus(p_area, scan, mod, damage)
local tab_props
local new_focus
local msaa_rect
	if g_msaa_role == ROLE_SYSTEM_PAGETAB then
		tab_props = Area.GetProperties(p_area)
		if g_msaa_loc and tab_props then 
			msaa_rect = {left = g_msaa_loc.left, top = g_msaa_loc.top, right = g_msaa_loc.left + g_msaa_loc.width, bottom = g_msaa_loc.top + g_msaa_loc.height}
			if Utils.RectInRect(tab_props, msaa_rect) then
				new_focus = {left = msaa_rect.left, top = msaa_rect.top, right = msaa_rect.right, bottom = msaa_rect.bottom, confidence = 90, type = FOCUSADD_TYPE_AREA, area = p_area}
				Focus.Add(new_focus)
			else
				System.OutputDebugString(wstring.format(L"msaa focus left %d, top %d, right %d, bottom %d", msaa_rect.left, msaa_rect.top, msaa_rect.right, msaa_rect.bottom))
				System.OutputDebugString(wstring.format(L"area props name %s left %d, top %d, right %d, bottom %d", tab_props.text, tab_props.left, tab_props.top, tab_props.right, tab_props.bottom))
			end
		end
	end
end

local SCRIPT_NAME = "BabbageEngineering.lua"
local SCRIPT_TIMESTAMP = "5/11/2017 9:14:28 PM"

-- Copyright (C) 2016-2017 Babbage. All rights reserved.

--[[
ToDo
 * test all Win functions, e.g.
local screen_x = Win.GetSystemMetrics( SM_CXSCREEN) 
local screen_y = Win.GetSystemMetrics( SM_CYSCREEN)

 * test all System functions, e.g.
local button_text = System.GetWindowText(button_window)

 * demo MSAA
	local msaa_handle = MSAA.ObjectFromWindow(window_handle) 
	Once you have an MSAA object handle, you can use functions such as MSAA.GetInfo and MSAA.GetChild to
	retrieve MSAA information.  For example, to find out if the MSAA object has any help information, call: 
		local help_info = MSAA.GetInfo( msaa_handle, MSAA_HELP) 
	The MSAA.DefaultAction function performs the default action for the given MSAA object.  For example, the
	default action for a button is to click the button. 
	When you have finished with an MSAA object handle, you must call MSAA.DeleteObject to delete it and free
	the resources associated with the 
	Call the MSAA.AddEvent function to register that your script should receive an MSAA even

local focus_wnd = System.GetFocus( ) 
local msaa_obj = MSAA.ObjectFromWindow( focus_wnd)
MSAA.Select MSAA.DefaultAction( msaa_object) 
MSAA.DeleteObject( msaa_object) 

MSAA.AddEvent 
MSAA.DefaultAction 
MSAA.DeleteObject 
MSAA.GetChild 
MSAA.GetInfo 
	MSAA.GetInfo 
	Retrieve information from an MSAA object. 
	MSAA.GetInfo( msaa_object, information, child_id) 
	Parameters 
	msaa_object Object you want to retrieve information from. 
	information Type of information to retrieve, see remarks.  MSAA_*
	child_id Optionally specifies the child object to query. 
	Return Values 
		The return value depends on the information requested, see remarks. 
		Remarks 
		This function can be used to retrieve a variety of information from MSAA objects. 
		information can be one of the following values: 
		MSAA_NAME			Returns a string containing the name of the specified object 
		MSAA_VALUE			Returns a string for the value the specified object holds (if any) 
		MSAA_DESCRIPTION	Returns a string containing extra description information for the specified object 
		MSAA_STATE			Returns a value containing state information about the specified object 
		MSAA_CHILDREN		Returns the number of child objects the specified object has 
		MSAA_SHORTCUT		Returns a string containing the keyboard shortcut for the object 
		MSAA_ROLE			Returns a value which identifies the type of control the MSAA object relates to 
		MSAA_LOCATION		Returns a table containing left, top, width and height values for the MSAA object 
		MSAA_HELP			Returns a string containing specific help for the object 
		The child_id parameter is only needed when you want to access information 
		for a particular child of that object. If this parameter is omitted, the information 
		relates to the specified MSAA object rather than a child.  
MSAA.GetParent 
MSAA.ObjectFromPoint 
MSAA.ObjectFromWindow 
MSAA.RemoveEvent 

 * demo UIA
	Accessing UIA Objects 
	UIA information is accessed through the MSAA Object. ((I guess UIA was intended in this quote from the manual))
First, get a handle to the UIA object, use either the UIA.ObjectFromPoint, 
UIA.ObjectFromWindow, UIA.ObjectFromMSAA, UIA.ObjectFromRuntimeId, 
or UIA.ObjectFromProcessId function. 
local uia_handle = UIA.ObjectFromWindow( window_handle) 
Once you have a UIA object handle, you can use functions such as UIA.GetProperty and UIA.GetPattern to
retrieve UIA information.  For example, to find out if the UIA object has any help text, call: 
local help_info = UIA.GetProperty( uia_handle, UIA_HelpTextPropertyId) 
When you have finished with a UIA object handle, you must call UIA.DeleteObject to delete it and free the
resources associated with the handle. 
UIA Events 
Call the UIA.AddEvent function to register that your script should receive a UIA event.  You pass the
particular event you wish to register as a parameter to this function, along with the process ID that you want
events for: 
my_event = UIA.AddEvent(UIA_AutomationFocusChangedEventId, process) 

 * demo DOM
To get a handle to a DOM object from a window handle, use the 
System.GetDOMObjectFromWindow function.  You could use various 
methods to obtain the window handle, including using the Area Tree or 
Windows functions such as System.FindWindow. 
For example, assuming wnd is a window handle, to retrieve the DOM object: 
local dom_obj = System.GetDOMObjectFromWindow( wnd) 

 * AREA
The Area.GetScreen function gets a handle to the screen object, the top level 
of the tree.  All detected items are children of the screen object. 
local area_screen = Area.GetScreen( ) 

 * SITUATION
Situations 
The Situation object lets you examine the access software's situation 
information.  A situation is all the information the access software holds to 
identify the current point of interest.  This includes the chain of windows from 
the application window to the current control and the type and position of the 
focus. 
The Situation.GetCurrent function returns a list of the areas that lead to the 
current window or control.  For example, it might contain an application 
window, then a dialog, then a group box, then a button. 

 * Altering the Focus List 
The focus list is available in detection scripts and contains all the areas the 
access software considers as a focus.  You can access the focus list with the 
Focus object. 
--]]

--[[
Een Dolphin-Lua test applicatie waar je via een dialoog zo ongeveer alle functies kunt controleren. Bijvoorbeeld

    iedere event-functie
    het log level binnen de event functie, bijvoorbeeld sommige/alle properties van de area in EventApllicationFocusChange
    het weergeven van de alle/sommige propertiesa van een parent, waarbij het begin object met de muis wordt aangewezen
    het aflopen van alle kinderen van een MSAA of UIA object, waarbij het begin object met de muis wordt aangewezen

Het doel is om:
    snel inzicht te krijgen wat je met scripting in een gegeven applicatie kan bereiken
    onduidelijkheden in de specificatie van de API op te helderen
    een raamwerk waarbinnen snel een idee aangaande een scripting oplossing voor een specifiek probleem getest kan worden
--]]

local hotkey_modifier = System.BitwiseOr( MODIFIER_RIGHT_SHIFT, MODIFIER_RIGHT_CONTROL)	-- the debug special key, likely not tyo interfere with other hotkeys

local topValues, subValues = nil, nil
local mySubIndex = 0			-- index in dialog_paramsTable and dialog_controlTable to identify the selected activity, default to invalid value
								-- gets a value based on the button selected in the top_controls based dialog

-- IDs for our custom controls ToDo why did I have to move this when switching from 15.05 to 14.05
local CONTROL_DUMMY_GROUP_TYPE = 1 							--========================================
local CONTROL_RB_EVENT = CONTROL_DUMMY_GROUP_TYPE + 1
local CONTROL_RB_TEST = CONTROL_RB_EVENT + 1 
local CONTROL_RB_SPARE = CONTROL_RB_TEST + 1
local CONTROL_DUMMY_GROUP_DETECTOR = CONTROL_RB_SPARE + 1 	--========================================
local CONTROL_CB_WINDOWS = CONTROL_DUMMY_GROUP_DETECTOR + 1
local CONTROL_CB_MSAA = CONTROL_CB_WINDOWS + 1
local CONTROL_CB_UIA = CONTROL_CB_MSAA + 1
local CONTROL_CB_AREA = CONTROL_CB_UIA + 1
local CONTROL_CB_DOM = CONTROL_CB_AREA + 1
local CONTROL_LIST = CONTROL_CB_DOM + 1
local CONTROL_EDIT = CONTROL_LIST + 1
local CONTROL_DUMMY_GROUP_ACTION = CONTROL_EDIT + 1		 	--========================================
local CONTROL_OK = CONTROL_DUMMY_GROUP_ACTION + 1
local CONTROL_CANCEL = CONTROL_OK + 1
local CONTROL_TEST1 = CONTROL_CANCEL + 1
local ID_TEST1 = CONTROL_TEST1 
local CONTROL_TEST2 = ID_TEST1 + 1
local ID_TEST2 = CONTROL_TEST2 
local CONTROL_TEST3 = ID_TEST2 + 1
local ID_TEST3 = CONTROL_TEST3
 
-- ToDo add comment
local g_ControlCbScreen = false 
local g_ControlCbApplication = false 
local g_ControlCbFocus = false 
local g_ControlCbWindows = false 
local g_ControlCbMsaa = false 
local g_ControlCbUia = false 
local g_ControlCbArea = false 
local g_ControlCbDom = false 

local myEvent, myId, myWindow, myNotification = 0, 0, 0, 0  -- make the dialog results persistant

--[[------------------------------------------------------------------------------
BabbageEngineeringInitialize must be called at SOD from the EventScriptStartup function of the script
associated with the application to be instrumented
It will successively:
  - write a SOD message to the debug console
  - set the ScriptIterationCount to a higher then default level. Note that 2147483647 is upposed to be the
	largest posible value but I had no success in using it.
  - register some shortcut keycombinations
	RShift-RCtrl-B to the debug dialog
	RShift-RCtrl-X to the "DebugExtra" function
--]]
function BabbageEngineeringInitialize()
	-- output SOD message
	OutputDebugInfo({"loaded", SCRIPT_NAME, "dated(", SCRIPT_TIMESTAMP, ")"}, OUT_HIGH)
	OutputDebugInfo({"raised ScriptIterationCount 10 times to 500.000"}, OUT_HIGH)
	System.SetScriptIterationCount( 500000)						-- I need the additional time due to accumulated sleep calls

	-- register the debug hotkeys
	registerKey( KEY_B, hotkey_modifier, "DebugDialog", "!!!!!!!!!! DebugDialog       !!!!!!!!!!")
	registerKey( KEY_X, hotkey_modifier, "DebugExtra ", "!!!!!!!!!! DebugExtra        !!!!!!!!!!")
end --  BabbageEngineeringInitialize


--[[------------------------------------------------------------------------------
babEng_EventApplicationKeyPress is called from EventApplicationKeyPress in BabbageSupport.lua
to perform additional test functions, i.e.:
 * run detector test at control selected by RCtrl-RShift_RMouse
--]]
g_ControlCbMsaa = true 
g_ControlCbArea = false 
function babEng_EventApplicationKeyPress( scancode, modifier)
	OutputDebugInfo({"==================== babEng_EventApplicationKeyPress:", vf_zoeken_reportScancode( scancode, modifier)}, OUT_MEDIUM)
	if modifier == hotkey_modifier and scancode == KEY_RIGHT_MOUSE then -- RControl-RShift-RMouseClick 
		local x, y = System.GetMousePosition()   						-- in screenpixels relative to top-left corner of the screen
		OutputDebugInfo({"RCtrl-Rshift-RMouseClick at x:", x, "y:", y}, OUT_MEDIUM)
		if g_ControlCbArea then
			local area = Area.GetFromXY( x, y) 
			if area == nil then 
				OutputDebugInfo({"!!!! failed to get area for x:", x, "y:", y, "\r\n\tfalling back to properties of application"}, OUT_ERROR)
				printTable(GetPropertyTable(nil))
			else 
				local n = countChildren( area )
				OutputDebugInfo({"number of children:", n }, OUT_MEDIUM)
				local p = Area.GetProperties( area)
				if p then printTable(GetPropertyTable(p, {"label_before", "label_after", "extra"}))
				else OutputDebugInfo({"!!!! failed to get properties for area for x:", x, "y:", y}, OUT_ERROR)
				end
--lijkt niet zo goed te werken 5/11/2017 4:39:00 PM 
				local count = 0
				for c in Area.Children( area) do 
					count = count + 1
					if c == nil then 
						OutputDebugInfo({"!!!! Area.Children() failed at #", count, "how screwy can you get"})
					else
						OutputDebugInfo({"---------- Area.Children #", count})
	--					listChildProperties( c)
						testMsaa( c)
					end
				end
			end
		end

		if g_ControlCbMsaa then
			local msaa_obj, childId = MSAA.ObjectFromPoint( x, y)
			local myCount = MSAA.GetInfo(msaa_obj, MSAA_CHILDREN, childId)			--  Returns a value containing state information about the specified object
			local myCount2 = MSAA.GetChildCount( msaa_obj )
			OutputDebugInfo( "babEng_EventApplicationKeyPress:Childcount 1#:"..myCount.." #2:".. myCount2)
			for i = 0, myCount do
				OutputDebugInfo( "babEng_EventApplicationKeyPress:getMsaaInfo #"..i )
				getMsaaInfo( msaa_obj, i)
			end

			-- The MSAA.DefaultAction function performs the default action for the given MSAA object.  For example, the
			-- default action for a button is to click the button.

			if false then 
				local flags = System.BitwiseOr(SELFLAG_TAKEFOCUS, SELFLAG_TAKESELECTION)
				MSAA.Select(msaa_object, flags, 1)

				--if editbox 10
				local myInfo = MSAA.GetInfo(msaa_obj, MSAA_NAME)				--  Returns a string containing the name of the specified object
				OutputDebugInfo( "MSAA_NAME:"..tostring(myinfo) )
				if myinfo == "Edit10" then
--					local window = System.FindWindow ("SomeApplicationWnd", nil)
					tbl["windowHandle"] = string.format( "hwnd:%s", tostring(p.hwnd))				--Window handle of the area, if applicable
					local process_info = System.GetProcessInfo( window)
					my_focus_event = MSAA.AddEvent (EVENT_OBJECT_FOCUS, process_info.process_id, 0)
					my_focus_event = MSAA.AddEvent (EVENT_OBJECT_FOCUS, process_info.process_id, 0)
				end
				--and no event registered yetr
				--register event
			end

			MSAA.DeleteObject(msaa_obj)
		end

		if false then
			Detector.Get (detector)
		end
	end
end -- babEng_EventApplicationKeyPress	


--[[------------------------------------------------------------------------------
countChildren counts the number of children in an area
--]]
function countChildren( area )
	local count = 0
	if area == nil then OutputDebugInfo({"!!!! countChildren called with nil area"}, OUT_ERROR)
	elseif not Area.IsValid(area) then OutputDebugInfo({"!!!! countChildren called with invalid area"}, OUT_ERROR)
	else
		for child in Area.Children( area) do 
			count = count + 1
		end 
	end 
	return count
end -- countChildren


--[[--------------------------------------------------------------------------------
test welke controls hoe vaak voorkomen in current application
--]]
function myTest_b()
	local t = {}
	local count, sum = 0, 0
	local app_area = Area.GetCurrentApplication()
	for key, ctrl in pairs(AreaTypeTable) do
		local rc = performFindType( app_area, key)
		if rc ~= 0 then
			t[key] = ctrl .. "#: " .. rc
			sum = sum + rc
			count = count + 1
		end
	end
	for key, value in pairs(t) do
		OutputDebugInfo({key, value})
	end
	OutputDebugInfo({"myTest_b count:", count, "sum:", sum, "title:", GetWindowTitle()}, OUT_HIGH)
end -- myTest_b

--[[--------------------------------------------------------------------------------
rather useless extension of myTest_b, created to get a grip on bad script behaviour.
More correctl: myTest_b is the reduction to the essentials of myTest_c
--]]
function myTest_c()
	local cntOk = 0
	local cntBad = 0
	local area = Area.GetCurrentApplication() 
	for key, ctrl in pairs(AreaTypeTable) do
		local myArea = Area.FindFirstType( area, key, {0}, SORT_ROWS)	-- location {0} means the whole area
		while myArea do
--			local p = Area.GetProperties2(area, PROPERTIES_ALL)
			local p = Area.GetProperties2(area, PROPERTIES_BASIC)		-- Dolphin suggestion, see email
			if p then
				cntOk = cntOk + 1
			else
				cntBad = cntBad + 1
				OutputDebugInfo({"!!!! myTest_c():: GetProperties2(PROPERTIES_ALL): BIZAR this time Application area has no properties"}, OUT_HIGH)
			end
			
			p = Area.GetProperties2(myArea, PROPERTIES_BASIC)		-- Dolphin suggestion, see email
			if p then
				cntOk = cntOk + 1
			else
				cntBad = cntBad + 1
				OutputDebugInfo({"!!!! myTest_c():: GetProperties2(PROPERTIES_ALL): control area has no properties"}, OUT_HIGH)
			end
			myArea = Area.FindNextType( area, key, {0}, SORT_ROWS, myArea)
		end
	end
	OutputDebugInfo({"myTest_c():: OK: ", cntOk, "Bad: ", cntBad}, OUT_HIGH)
	OutputDebugInfo({"myTest_c():: OK: ", cntOk, "Bad: ", cntBad})
end -- myTest_c

--[[--------------------------------------------------------------------------------
the most minimilastic test, just to check that basic plumbing is working
--]]
function myTest_d()
	OutputDebugInfo({"myTest_d() entry"}, OUT_HIGH)
	OutputDebugInfo({"myTest_d() exit"}, OUT_HIGH)
end -- myTest_d		



--[[--------------------------------------------------------------------------------
--]]
function myTest_e()
	-- cut&paste from the scripting manual exercise
	-- First, find the task bar tag 
	OutputDebugInfo({"---------- myTest_e"})
	VF.ChooseFocus( FOCUS_VF) 
	local marker = {direction = DIRECTION_VF_PREVIOUS, tag = "task tray", scope = SCOPE_WHOLE_SCREEN} 
	local found = VF.MoveToMarker( marker, 1) 
	if found then -- Create the list 
		local rc = List.CreateAreasList( ) 
		OutputDebugInfo({"CreateAreasList:", tostring(rc)})
		rc = List.Add( LIST_AREAS_BUTTON) 
		OutputDebugInfo({"List.Add:", tostring(rc)})
		rc = List.Show( ) 
		OutputDebugInfo({"List.Show:", tostring(rc)})
	else 
		OutputDebugInfo({"task tray: not found"}) -- It failed 
	end 
	VF.ChooseFocus( FOCUS_BACK) 
end -- myTest_e


--[[--------------------------------------------------------------------------------
--]]
function myTest_f()
	--	stale experiment
	for i, screenItem in pairs( ScreenItemTypeTable) do
		local s = tostring(Speak.GetString( i))				--cope with nil
		OutputDebugInfo({"speak.GetString(", i, screenItem, ") = ", s})
	end
end -- myTest_f


--[[--------------------------------------------------------------------------------
	Test Events ??
--]]
function myTest_g()
	
	local root = Area.GetScreen( ) 
	testAreaObject( root )

	local count = 0
	for child in Area.Children( root) do 
		count = count + 1
		local p = Area.GetProperties(child)
		if p == nil then 
			OutputDebugInfo({"!!!! Area.GetProperties() failed failed for child ", tostring(child)})
		else
			OutputDebugInfo({"child text:", tostring(p.text)})
			local thisCtrl = TranslateType( p.type)
			OutputDebugInfo({"screen child type:", tostring(thisCtrl)})					--Type of the area, see Area Types 
		end
	end 
	if count == 0 then OutputDebugInfo({"!!!! no children in root"}) end

end -- myTest_g	
--
	-- Area.Children( area, func)   ToDo investigate the "func"

--[[--------------------------------------------------------------------------------
	Test Events ??
--]]
function myTest_h()
end -- myTest_h

--[[--------------------------------------------------------------------------------
	Test Events ??
--]]
function myTest_i()
end -- myTest_i

--[[--------------------------------------------------------------------------------
	Test Events ??
--]]
function myTest_j()  --ToDo ~myTest_h   --> parameterise via RadioButton o.s.l.t
	
-- See Also Area.Children, Area.DirectChildren, Area.FindFirstType 

-- The following example enumerates all the text in the selected area
	local myArea, s = getMyArea()
	
	if myArea == nil then 
		OutputDebugInfo({"!!!! myTest_j", s, "failed"})
	else
		local count = 0
		for leaf in Area.Leaves( app_area) do 
			count = count + 1
			local p = Area.GetProperties( leaf) 
			if p then
				OutputDebugInfo({"leave type #", count, ":", tostring(p.type)})					--Type of the area, see Area Types 
			else
				OutputDebugInfo({"!!!!leave type #", count, "how screwy can you get, leaf has no properties"})					--Type of the area, see Area Types 
			end
		end 
		if count == 0 then OutputDebugInfo({"!!!! no leaves in application"}) end
	end
end -- myTest_j



--[[--------------------------------------------------------------------------------
--]]
function getMyArea()
--	if top_controls[id].control == "radiobutton" then 

	local p, s 
	for i = 12, 16 do 
		if topValues[i].checked == 1 then p = top_controls[i].testFunction ; s = top_controls[i].text end
	end
	OutputDebugInfo({"radio button result", tostring(p), tostring(s)}) 
	local myArea
	if s == "Mouse" then 
		local x, y = System.GetMousePosition()   		-- in screenpixels relative to top-left corner of the screen
		OutputDebugInfo({"mouse position", x, ":", y}) 
		myArea = p(x, y)
	else
		myArea = p()
	end
	OutputDebugInfo({"p result in area:", tostring(myArea)}) 
	return myArea, s
end -- getMyArea

--[[--------------------------------------------------------------------------------
	myTest_k counts children of the area selected by the radiobuttons
--]]
local myTest_k_cnt = 0
function myTest_k() 
	local myArea, s = getMyArea()
	
	if myArea == nil then 
		OutputDebugInfo({"!!!! myTest_k", s, "failed"})
	else
		local t = {}
		local count = 0
		for child in Area.Children( myArea) do
			count = count + 1
			local p = Area.GetProperties( child)
			if p == nil then
				OutputDebugInfo({"!!!! Area.GetProperties() failed failed for child ", tostring( child)})	
			else
				t[count] = TranslateType( p.type) .. " <" .. tostring( p.text) .. ">"
			end
		end
		if count == 0 then OutputDebugInfo({"myTest_k: no children for", s})
		else printTable( t)
		end
	end
end -- myTest_k



--[[--------------------------------------------------------------------------------
--]]
function myTest_l()  
	local myArea, s = getMyArea()
	if myArea == nil then 
		OutputDebugInfo({"!!!! myTest_l", s, "failed"})
	else
--		testAreaObject( myArea )			ToDo isolate this in a specific test function
		local p = Area.GetProperties(myArea) 
		if p == nil then 
			OutputDebugInfo({"!!!! Area.GetProperties() after", s, "failed"})
		else
			OutputDebugInfo({"area text:", tostring(p.text)})
			GetPropertyTable(p)
			-- Retrieve the first line in an area. 
			local line = Area.FirstLine(myArea, SORT_ROWS) 
			if line then 
				p = Area.GetProperties(line) 
				if p == nil then 
					OutputDebugInfo({"!!!! Area.GetProperties() failed"})
				else
					OutputDebugInfo({"FirstLine text:", tostring(p.text)})
				end
			else
				OutputDebugInfo({"!!!! getting FirstLine failed"})
			end 
		end
	end 
end -- myTest_l

  
--[[--------------------------------------------------------------------------------
--]]
function myTest_m()

	local hwnd = System.GetFocus( ) 
	local buffer = System.AllocateUserData( 256) 
	local dll_function = {dll_name = "user32.dll", function_name = "GetWindowTextA", standard_call = 1, parameters = 3} 
	local dll_params = {hwnd, buffer, 256} 
	System.CallDllFunction( dll_function, dll_params) 
	-- The variable buffer now contains the result  
	local msg = System.UserDataToString( buffer) 
	OutputDebugInfo({"GetWindowTextA:", msg}) 


	-- Set up a buffer to receive the string
	local name = System.AllocateUserData(128) 
	local size = System.AllocateUserData(8) 
	System.NumberToUserData( size, 64) 
	-- Call the DLL function GetUserName 
	local dll_function = {dll_name = "Advapi32.dll", function_name = "GetUserNameA", standard_call = 1, parameters = 2} 
 	local dll_params = {name, size} 
	System.CallDllFunction( dll_function, dll_params) 
	-- The variable buffer now contains the result  
	local msg = System.UserDataToString( name) 
	OutputDebugInfo({"GetUserNameA:", msg})

end -- myTest_m

  
--[[--------------------------------------------------------------------------------
--]]
--copied from C:\Users\Tester\AppData\Local\Dolphin\SnovaSuite1405\Settings\Default Application.lua:: function win7AltTab(area, scan, mod)
--detction function to add in an msaa focus to the win 7 alt - tab window so braille and mag will work better
--msaa focus not picked up by map file system
function testMsaa( area)
	OutputDebugInfo("testMsaa")
	local p = Area.GetProperties(area)
--	printTable(p)
	if p == nil then OutputDebugInfo({"!!!! GetProperties failure"}, OUT_ERROR)
	else
		local msaa_win = MSAA.ObjectFromWindow(p.hwnd)
		if msaa_win == nil then
			OutputDebugInfo("!!!! MSAA.ObjectFromWindow failure")
		else
			--search this window for the child list items
--			findMSAAObject(msaa_win, ROLE_SYSTEM_LISTITEM, area)     from the manual ToDo investigate
			
			getMsaaInfo( msaa_win) --, i)
			
--			You should not call MSAA.DeleteObject on iaccessible as it will be deleted
--			automatically at the end of the event function. However, you should delete any objects
--			you derive from this, e.g. parent or child objects MSAA.DeleteObject(msaa_obj)
			MSAA.DeleteObject(msaa_win)
		end
	end
end -- testMsaa	

  
--[[--------------------------------------------------------------------------------
--]]
function testArea( area)
	OutputDebugInfo("testArea")
	local p = Area.GetProperties(area)
	printTable(p)
end -- testArea	

--[[--------------------------------------------------------------------------------
--ToDo add this as a standalone test
--]]
function getMiscInfo(location)
	local msg = ""
	if not location then location = "unknown" end
	if location ~= "" then msg = "getMiscInfo called from "..tostring( location) end
	local hwnd = System.GetFocus( )
	if not hwnd then
		msg = "!!!! " .. msg .. " System.GetFocus failed"
	else
	--[[
Version 13.50:

·        New UIA functions, events and constants. New Selection, Detector and Settings functions. New
functions: VF.QuickNavigateNext, VF.QuickNavigatePrevious, System.ExecuteCommand, System.CopyUserData,
	System.GetRectangles, System.GetTextLocations, MSAA.Navigate, MSAA.GetChildCount, MSAA.GetDescription,
	MSAA.GetHelp, MSAA.GetLocation, MSAA.GetName, MSAA.GetRole, MSAA.GetShortcut, MSAA.GetState and
	MSAA.GetValue. New event functions: EventApplicationDomSetup and EventApplicationDomReport.
	--]]
		local uia_handle = UIA.ObjectFromWindow( hwnd)
		if not uia_handle then
			msg = "!!!! " .. msg .. " UIA.ObjectFromWindow failed"
		else
			local pid = UIA.GetProperty( uia_handle, UIA_ProcessIdPropertyId)
			msg = msg .. " System.GetFocus->UIA->PID:" .. tostring(pid)
		end
	end

  	local current_area = Area.GetCurrent( )
  	if not current_area then
		msg = "!!!! " .. msg .. " Area.GetCurrent failed"
	else
    	local area_props = Area.GetProperties( current_area)
		if not area_props then
			msg = "!!!! " .. msg .. " System.GetProperties failed"
		else
			local hwnd = area_props.hwnd
			if not area_props then
				msg = "!!!! " .. msg .. " System.GetProperties().hwnd failed"
			else
				local uia_handle = UIA.ObjectFromWindow( hwnd)
				if not uia_handle then
					msg = "!!!! " .. msg .. " UIA.ObjectFromWindow failed"
				else
					local pid = UIA.GetProperty( uia_handle, UIA_ProcessIdPropertyId)
					msg = msg .. " Area.GetCurrent->UIA->PID:" .. tostring(pid)
				end
			end
		end
    end
	msg = msg .. " Area.GetCurrentApplication() not tried"
	return msg
end -- getMiscInfo




  
--[[--------------------------------------------------------------------------------
--]]
function findMSAAObject(msaa_obj, msaa_type, parent_win)
--alt - tab window does not allow us to get the children so have to querry it using child id
	local num_child 
	
	num_child = MSAA.GetInfo(msaa_obj, MSAA_CHILDREN)
	
	for i = 1, num_child do 
		local role = MSAA.GetInfo(msaa_obj, MSAA_ROLE, i)
		if role == msaa_type then
		--role is what we are looking for, check if this obj has focused state set
			local state = MSAA.GetInfo(msaa_obj, MSAA_STATE, i)
			if System.BitwiseAnd(state, STATE_SYSTEM_FOCUSED) == STATE_SYSTEM_FOCUSED then
				--this item is focused, add focus to areas tree
--				addFocusFromMSAA(msaa_obj, i, parent_win)
				return
			end
		end --if role ==				
	end --for i
end

  
--[[--------------------------------------------------------------------------------
--]]
function addFocusFromMSAA(msaa_obj, child_index, parent_win)
local focus_info= {}
local msaa_loc = {}
local match_area	
	
	match_area = matchAreaItemToMSAA(msaa_obj, child_index, parent_win) 
	
	if not Area.IsValid(match_area) then
	--did not get an item area from the map, add one in using a script
		match_area = insertItemAltTab(parent_win, msaa_obj, child_index)
	end--if not area is valid
	
	msaa_loc = MSAA.GetInfo(msaa_obj, MSAA_LOCATION, child_index)
	if msaa_loc then
		focus_info = {confidence = 90, left = msaa_loc.left, top = msaa_loc.top, right = msaa_loc.left + msaa_loc.width, 
				bottom = msaa_loc.top + msaa_loc.height, area = match_area, type = FOCUSADD_TYPE_AREA}
		
		Focus.Add(focus_info)
	end--if msaa_loc
end


  
--[[--------------------------------------------------------------------------------
--]]
function getMsaaInfo( msaa_obj, childId)
-- The child_id parameter is only needed when you want to access information for a particular child of that
-- object. If this parameter is omitted, the information relates to the specified MSAA object rather than a
-- child.  Requirements

	local msg = ""
	local myInfo
	myInfo = MSAA.GetInfo(msaa_obj, MSAA_STATE, childId)				--  Returns a value containing state information about the specified object
	if myInfo == nil then
		msg = "!!!! getMsaaInfo: MSAA.getMsaaInfo failure"
		OutputDebugInfo({msg}, OUT_ERROR)
	else
		msg = string.format("getMsaaInfo: state:0x%08x - %s", myInfo, TranslateMsaaState(myInfo))
		myInfo = MSAA.GetInfo(msaa_obj, MSAA_NAME, childId)				--  Returns a string containing the name of the specified object
		msg = msg .. "\r\n\tname::" ..  tostring(myInfo)
		OutputDebugInfo(myInfo)		-- ToDo DELME !!!!!:wall


		myInfo = MSAA.GetInfo(msaa_obj, MSAA_VALUE, childId)			--  Returns a string for the value the specified object holds (if any)
		msg = msg .. "\r\n\tvalue::" ..  tostring(myInfo)

		myInfo = MSAA.GetInfo(msaa_obj, MSAA_CHILDREN, childId)			--  Returns the number of child objects the specified object has
		msg = msg .. "\r\n\tchildren::" ..  tostring(myInfo)

		myInfo = MSAA.GetInfo(msaa_obj, MSAA_ROLE, childId)				--  Returns a value which identifies the type of control the MSAA object relates to
		msg = string.format("%s\r\n\trole::%02d-0x%02x - %s", msg, myInfo, myInfo, TranslateMsaaRole(myInfo))

		myInfo = MSAA.GetInfo(msaa_obj, MSAA_LOCATION, childId)			--  Returns a table containing left, top, width and height values for the MSAA object
		if myInfo then
			local left, top, height, width = myInfo.left, myInfo.top, myInfo.height, myInfo.width
			msg = string.format( "%s\r\n\tlocation(left:top:height:width)::%d:%d:%d:%d", msg, left, top, height, width)
		end

		myInfo = MSAA.GetInfo(msaa_obj, MSAA_DESCRIPTION, childId)		--  Returns a string containing extra description information for the specified object
		if myInfo then msg = msg .. "\r\n\tdescription::" ..  tostring(myInfo) end

		myInfo = MSAA.GetInfo(msaa_obj, MSAA_SHORTCUT, childId)			--  Returns a string containing the keyboard shortcut for the object
		if myInfo then msg = msg .. "\r\n\tshortcut::" ..  tostring(myInfo) end

		myInfo = MSAA.GetInfo(msaa_obj, MSAA_HELP, childId)				--  Returns a string containing specific help for the object
		if myInfo then msg = msg .. "\r\n\thelp::" ..  tostring(myInfo) end

		OutputDebugInfo({msg}, OUT_HIGH, true, false)
	end
end -- getMsaaInfo

--!	local rc = List.CreateAllLists( LIST_LINKS) 
--!	OutputDebugInfo({"All lists rc:", tostring(rc)})
--!	rc = List.Show( ) 
--!	OutputDebugInfo({"list.show rc:", tostring(rc)})
--!
--!	rc = List.CreateAreasList( ) 
--!	OutputDebugInfo({"Created Areas lists rc:", tostring(rc)})
--!	rc = List.Add( LIST_AREAS_BUTTON) 
--!	OutputDebugInfo({"Buttons Areas lists rc:", tostring(rc)})
--!	rc = List.Add( LIST_AREAS_GRAPHIC )
--!	OutputDebugInfo({"Areas lists rc:", tostring(rc)})
--!	rc = List.Add( LIST_AREAS_RADIO )
--!	OutputDebugInfo({"Areas lists rc:", tostring(rc)})
--!	rc = List.Add( LIST_AREAS_CHECKBOX )
--!	OutputDebugInfo({"Areas lists rc:", tostring(rc)})
--!	rc = List.Add( LIST_AREAS_RADIOCONTROL )
--!	OutputDebugInfo({"Areas lists rc:", tostring(rc)})
--!	rc = List.Add( LIST_AREAS_CHECKCONTROL )
--!	OutputDebugInfo({"Areas lists rc:", tostring(rc)})
--!	rc = List.Add( LIST_AREAS_BUTTON )
--!	OutputDebugInfo({"Areas lists rc:", tostring(rc)})
--!	rc = List.Add( LIST_AREAS_EDIT )
--!	OutputDebugInfo({"Areas lists rc:", tostring(rc)})
--!	rc = List.Add( LIST_AREAS_ITEM )
--!	OutputDebugInfo({"Areas lists rc:", tostring(rc)})
--!	rc = List.Add( LIST_AREAS_CELL )
--!	OutputDebugInfo({"Areas lists rc:", tostring(rc)})
--!	rc = List.Add( LIST_AREAS_GROUP )
--!	OutputDebugInfo({"Areas lists rc:", tostring(rc)})
--!	rc = List.Show( ) 
--!	OutputDebugInfo({"list.show rc:", tostring(rc)})
--!
--!	rc = List.CreateAreasList( ) 
--!	OutputDebugInfo({"Current Area rc:", tostring(rc)})
--!	rc = List.AddCurrent( ) 
--!	OutputDebugInfo({"Current Area rc:", tostring(rc)})
--!	rc = List.Show( ) 
--!	OutputDebugInfo({"list.show rc:", tostring(rc)})


--[[------------------------------------------------------------------------------
	ToDo check why I can't use the area returned by Area.GetCurrentWindow() to do a Area.FindType
	Also, a FindType after a FindFirstType and 0 or more FindNext makes the next FindNext fail

		elseif scancode == KEY_X then					-- ToDo experiment about focus
			--inspired by D:\ProgramData\dolphin\SnovaSuite1404\defaults_demo\Default Application.lua --ToDo
			-- the System.CheckVariable function lets you check the setting of various access software
			-- variables, such as whether a drag and drop operation is currently in progress, the current
			-- access software mode or which access product is being used.  For example, to get the current
			-- access software mode: 
			-- 		local result = System.CheckVariable( CHECK_MODE, nil) 
			-- This would return whether the access software is in the normal live mode, or a virtual or area
			-- virtual focus mode, for example. 
			local focusMode = System.CheckVariable( CHECK_MODE )

			OutputDebugInfo({"KEY_X:: CHECK_MODE:", tostring( System.CheckVariable( CHECK_MODE))})
			OutputDebugInfo({"KEY_X:: CHECK_MODE:", ModeTable[System.CheckVariable( CHECK_MODE)]})
			OutputDebugInfo({"KEY_X:: CHECK_LAST_MODE:", tostring( System.CheckVariable( CHECK_LAST_MODE))})
			OutputDebugInfo({"KEY_X:: CHECK_FOCUS_TYPE:", tostring( System.CheckVariable( CHECK_FOCUS_TYPE))})
			OutputDebugInfo({"KEY_X:: CHECK_VF_SELECTION:", tostring( System.CheckVariable( CHECK_VF_SELECTION ))})
			OutputDebugInfo({"KEY_X:: CHECK_AREA_TYPE:", tostring( System.CheckVariable( CHECK_AREA_TYPE))})
			OutputDebugInfo({"KEY_X:: CHECK_INTERACTIVE:", tostring( System.CheckVariable( CHECK_INTERACTIVE))})
			OutputDebugInfo({"KEY_X:: CHECK_SCREENREADER_STATE:", tostring( System.CheckVariable( CHECK_SCREENREADER_STATE))})
			OutputDebugInfo({"KEY_X:: CHECK_SELECTION:", tostring( System.CheckVariable( CHECK_SELECTION))})

			OutputDebugInfo({"KEY_X:: CHECK_SPEECH_STYLE:", tostring( System.CheckVariable( CHECK_SPEECH_STYLE))})
			OutputDebugInfo({"KEY_X:: CHECK_CALL:", tostring( System.CheckVariable( CHECK_CALL))})
			OutputDebugInfo({"KEY_X:: CHECK_BATTERY:", tostring( System.CheckVariable( CHECK_BATTERY))})
			OutputDebugInfo({"KEY_X:: CHECK_DOCUMENT_READ:", tostring( System.CheckVariable( CHECK_DOCUMENT_READ))})
			OutputDebugInfo({"KEY_X:: CHECK_DRAGGING:", tostring( System.CheckVariable( CHECK_DRAGGING))})
			OutputDebugInfo({"KEY_X:: CHECK_FLIGHT_MODE:", tostring( System.CheckVariable( CHECK_FLIGHT_MODE))})
			OutputDebugInfo({"KEY_X:: CHECK_KEYPAD_LOCKED:", tostring( System.CheckVariable( CHECK_KEYPAD_LOCKED))})
			OutputDebugInfo({"KEY_X:: CHECK_MODEL:", tostring( System.CheckVariable( CHECK_MODEL))})
			OutputDebugInfo({"KEY_X:: CHECK_MONITOR:", tostring( System.CheckVariable( CHECK_MONITOR))})
			OutputDebugInfo({"KEY_X:: CHECK_MONITOR_IN_WINDOW:", tostring( System.CheckVariable( CHECK_MONITOR_IN_WINDOW))})
			OutputDebugInfo({"KEY_X:: CHECK_PRODUCT:", tostring( System.CheckVariable( CHECK_PRODUCT))})
			OutputDebugInfo({"KEY_X:: CHECK_SIM:", tostring( System.CheckVariable( CHECK_SIM))})





--[ [--------------------------------------------------------------
Area Object 
An area is an internal Supernova object that represents text or a control on the screen.
Areas are stored in a tree structure.  
--] ]


Following are the Area functions: 
	Area.Children 
	Area.DirectChildren 
	Area.FindFirstType 
Area.FindNextType
Area.FindType 
	Area.FirstChild 
Area.FirstLine 
Area.FirstSegmentInObject 
Area.FirstSegmentOnLine 
Area.GetCharacter 
Area.GetCurrent 
Area.GetCurrentApplication 
Area.GetCurrentLine 
Area.GetCurrentWindow 
Area.GetFromXY 
	Area.GetLabel 
	Area.GetProperties 
Area.GetScreen 
Area.GetState 
	Area.GetText 
Area.Insert 
Area.IsInside 
	Area.IsValid 
	Area.LastChild 
Area.LastSegment 
Area.Leaves 
Area.MoveToMarker 
Area.Next 
Area.NextLine 
Area.NextLineInObject
Area.NextObject 
Area.NextSegment 
Area.NextSegmentInObject 
Area.NextSegmentOnLine 
	Area.Parent 
Area.Previous 
Area.PreviousLine 
Area.PreviousObject 
Area.PreviousSegmentOnLine 
Area.Remove 
Area.SetCharacter 
Area.SetProperties 
Area.SetState 
Area.SetTag 
Area.SetText 
Area.SetText2 
Area.SetType 
Area.SortFirstChild 
Area.SortParent 
--]]

  
--[[--------------------------------------------------------------------------------
--]]
function testAreaObject(a)
	OutputDebugInfo("-------------------- entry testAreaObject --------------------")
	OutputDebugInfo({"Area.IsValid: ",	tostring( Area.IsValid(a))})
	OutputDebugInfo({"Area.GetLabel: ",	tostring( Area.GetLabel(a))})
	OutputDebugInfo({"Area.GetText: ",	tostring( Area.GetText(a))})

	local p = Area.GetProperties(a) 
	if p == nil then 
		OutputDebugInfo({"!!!! Area.GetProperties() failed"})
	else
		OutputDebugInfo({"Prop.text: ", tostring(p.text)})
		OutputDebugInfo({"left:top:right:bottom", p.left, p.top, p.right, p.bottom})	--Position of the left edge,top, rigt edge, bottom of the area 
	end

	local c = Area.FirstChild( a)
	if c == nil then 
		OutputDebugInfo({"!!!! Area.FirstChild() failed"})
	else
		OutputDebugInfo({"Area.FirstChild: ", tostring(c)})
		OutputDebugInfo({"FirstChild Area.IsValid: ",	tostring( Area.IsValid(c))})
	end

	c = Area.LastChild( a)
	if c == nil then 
		OutputDebugInfo({"!!!! Area.LastChild() failed"})
	else
		OutputDebugInfo({"Area.LastChild: ", tostring(c)})
		OutputDebugInfo({"LastChild Area.IsValid: ",	tostring( Area.IsValid(c))})
	end
	
	local parent = Area.Parent( a) 
	if parent == nil then 
		OutputDebugInfo({"!!!! Area.Parent() failed"})
	else
		OutputDebugInfo({"Area.Parent: ", tostring(parent)})
		OutputDebugInfo({"Parent Area.IsValid: ",	tostring( Area.IsValid(parent))})
	end
	
	local count = 0
	for c in Area.DirectChildren( a) do 
		count = count + 1
		if c == nil then 
			OutputDebugInfo({"!!!! Area.DirectChildren() failed at #", count, "how screwy can you get"})
		else
			OutputDebugInfo({"---------- Area.DirectChildren #", count})
			listChildProperties( c)
		end
	end
	if count == 0 then OutputDebugInfo({"!!!! no DirectChildren"}) 
	else OutputDebugInfo({"---------- DirectChildren #:", count}) end

	count = 0
	for c in Area.Children( a) do 
		count = count + 1
		if c == nil then 
			OutputDebugInfo({"!!!! Area.Children() failed at #", count, "how screwy can you get"})
		else
			OutputDebugInfo({"---------- Area.Children #", count})
			listChildProperties( c)
		end
	end
	if count == 0 then OutputDebugInfo({"!!!! no Children"}) 
	else OutputDebugInfo({"---------- Children #:", count}) end

end -- testAreaObject	

--[[------------------------------------------------------------------------------
----]]
function listChildProperties( c)
	OutputDebugInfo({"Area.IsValid: ",	tostring( Area.IsValid(c))})
	local p = Area.GetProperties(c) 
	if p == nil then 
		OutputDebugInfo({"!!!! listChildProperties::Area.GetProperties() failed"})
	else
		local t = tostring(p.text)
		OutputDebugInfo({"text:", t})					--Text in the area 
		--	GetPropertyTable(p)	
		local myX, myY = Utils.RectCenter(p) 
		local left, top , right, bottom = p.left, p.top, p.right, p.bottom
		OutputDebugInfo({"applicationDetection: left:top:right:bottom", left, top , right, bottom, "x:y::", myX, ":", myY}, OUT_HIGH)	
		OutputDebugInfo({"applicationDetection:      x:y:width:height", top , left, right - left, bottom - top }, OUT_HIGH)	
		OutputDebugInfo({"hwnd:", tostring(p.hwnd)})					--Window handle of the area, if applicable 
		OutputDebugInfo({"type:", TranslateType(p.type)})
	end
end -- listChildProperties

--[[------------------------------------------------------------------------------
	call like: performFindType( a, "AREA_EDIT") or performFindType( a, 7)
	parameter ctrl specifies which type of control should be located
	ctrl is either the numeric identification of one of the mnemonics defined in AreaTypeTable
	returns the number of controls with the type as specified with the parameter ctrl
----]]
function performFindType( area, ctrl)
	local count = 0														-- presume none found

	local myCtrl = ctrl
	if type(ctrl) == "string" then 
		myCtrl = GetKeyForValue( AreaTypeTable, ctrl )					-- reversed lookup to translate string into number
	end
	local myArea = Area.FindFirstType( area, myCtrl, {0}, SORT_ROWS)	-- location {0} means the whole area
	while myArea do
		count = count +1
		myArea = Area.FindNextType( area, myCtrl, {0}, SORT_ROWS, myArea)
	end
	return count
end -- performFindType


  
--[[--------------------------------------------------------------------------------
--]]
local windowsFlag
local fnlChildFlag
local flLineFlag
local flObjectFlag
local allChildFlag
local directChildFlag

function TestProperties()
	windowsFlag = values[2].checked == 1
	fnlChildFlag = values[3].checked == 1
	flLineFlag = values[4].checked == 1
	flObjectFlag = values[5].checked == 1
	allChildFlag = values[6].checked == 1
	directChildFlag = values[7].checked == 1
	local a = Area.GetCurrentApplication() 
	if a == nil then 
		OutputDebugInfo({"!!!! Area.GetCurrentApplication() failed"})
	else
		local p = Area.GetProperties(a) 
		if p == nil then 
			OutputDebugInfo({"!!!! Area.GetProperties() failed"})
		else
			GetPropertyTable(p)
			if allChildFlag then
				OutputDebugInfo({"allChildFlag"})
				local count = 0
				for c in Area.Children( a) do 
					count = count + 1
					if c == nil then 
						OutputDebugInfo({"!!!! Area.Children() failed at #", count, "how screwy can you get"})
					else
						OutputDebugInfo({"---------- Area.Children #", count})
						listChildProperties( c)
						testMsaa( c)
					end
				end
				if count == 0 then OutputDebugInfo({"!!!! no Children"}) 
				else OutputDebugInfo({"---------- Children #:", count}) end
			end
			if directChildFlag then
				OutputDebugInfo({"directChildFlag"})
				local count = 0
				for c in Area.DirectChildren( a) do 
					count = count + 1
					if c == nil then 
						OutputDebugInfo({"!!!! Area.DirectChildren() failed at #", count, "how screwy can you get"})
					else
						OutputDebugInfo({"---------- Area.DirectChildren #", count})
						listChildProperties( c)
					end
				end
				if count == 0 then OutputDebugInfo({"!!!! no DirectChildren"}) 
				else OutputDebugInfo({"---------- DirectChildren #:", count}) end
			end
		end
	end
end -- TestProperties	

--[[--------------------------------------------------------------------------------
 when clicking a control in the dialog the following happens:
  -  TopDialogCallback gets control. The 1st 2 parameters identify the exact event:
	 event = EVENT_DIALOG_START (1)			, id = 0: Dialog Started,
	 event = EVENT_DIALOG_OK (2)			, id = 0: Dialog Ended, a button with the property "command = ID_OK" is pressed 
	 event = EVENT_DIALOG_CANCEL (3)		, id = 0: Dialog Ended, a button with the property "command = ID_CANCEL" is pressed 
	 event = EVENT_DIALOG_COMMAND (4)		, id = n: A control is manipulated. The number n corresponds with the index of the control in
			 								  	      the controls table, e.g. 8 is the test1 button
													  Also left double clicking a list box entry brings you
													  here. Note that a double click is always perceived as a
													  single click (event = 5) followed by a double click (event = 4)
	 event = EVENT_DIALOG_NOTIFICATION (5)	, id = n: The listbox control is manipulated by means of arrow,
													  left mouse click or typing the first letter of an entry.
													  The number n corresponds with the index of the control
													  in the controls table.
	 window) 
	 If a button  with the property "command = ID_OK/CANCEL" is pressed, 2 events occur.
	 The 1st event is of the form: event = 4, id = n
	 The 2nd event is of the form: event = 2/3, id = 0
	 Alt-F4/Ctrl-F4/Esc result in .......

One of the following event codes: 
EVENT_DIALOG_START (Dialog started) 
EVENT_DIALOG_OK (User pressed the OK button) 
EVENT_DIALOG_CANCEL (User pressed the Cancel 
button) 
EVENT_DIALOG_COMMAND (User updated a 
control in the dialog, whose index in the controls table 
in the initial call to Dialog.Custom is passed through 
the id parameter) 
EVENT_DIALOG_NOTIFICATION (Currently only 
fires when the selection in a list box has changed as a 
result of user input - LBN_SELCHANGE) 


--]]

--[[ for a simpler example of a dialog see VF_zoeken.lua where Dialog.ListBox i.s.o. Dialog.Custom is used
--]]
local ID_DELAY = 100
local ID_LOGLEVEL = 101

top_params = {title = "Dolphin Script Functions TestTool v0.02   -  Select Engineering Function", width = 400, height = 330, callback="TopDialogCallback", style="DS_MODALFRAME"}   

-- Table of controls for the toplevel dialog 
top_controls = { 
	{control = "button",		x =  10,	y = 170, width = 160, height = 14, text = "&OK", command = ID_OK}, 									-- 01
	{control = "button",		x =  10,	y = 200, width =  50, height = 14, text = "&Event", command = ID_OK}, 								-- 02
	{control = "button",		x =  10,	y = 220, width =  50, height = 14, text = "&Test", command = ID_OK}, 								-- 03
	{control = "button",		x =  10,	y = 240, width =  50, height = 14, text = "&Detector", command = ID_OK}, 							-- 04
	{control = "button",		x =  10,	y = 260, width =  50, height = 14, text = "&Properties", command = ID_OK}, 							-- 05
	{control = "button",		x =  10,	y = 280, width =  50, height = 14, text = "&Repeat Previous", command = ID_OK}, 					-- 06
	{myFlag = "lastButton", control = "button",		x =  10,	y = 480, width =  50, height = 14, text = "Cancel (Esc)", command = ID_CANCEL},	-- 07
	{control = "static",	x =  10,	y = 40, width =  50, height = 20, text = "Delays"}, 													-- 08 label of Debug Delay values
	{control = "list",		x =  10,	y = 60, width =  50, height = 100, text = "Delays", command = ID_DELAY, 								-- 09 tc_DebugDelayEntry: list of Debug Delay values
	 sorted = 0, items = { "0", "1", "10", "20", "50", "100", "200", "500", "1000"}
	},																											
	{control = "static",	x =  70,	y = 40, width =  50, height = 20, text = "Log levels"}, 												-- 10  label of Debug Log levels
	{control = "list",		x =  70,	y = 60, width =  70, height = 100, text = "Log level", command = ID_LOGLEVEL, 							-- 11  tc_LogLevelEntry: list of Debug Log levels
	 sorted = 0, items = { "OUT_ERROR", "OUT_HIGH", "OUT_MEDIUM", "OUT_INFO", "OUT_LOW", "OUT_VERY_LOW", "OUT_EVENT_TRACE", "OUT_NONE"}
	},
	{control = "radiobutton",	x =  150,	y =  36, width =  50, height = 14, text = "Screen", selected = 0, testFunction = Area.GetScreen}, 				-- 12
	{control = "radiobutton",	x =  150,	y =  50, width =  50, height = 14, text = "Application", selected = 1, testFunction = Area.GetCurrentApplication},	     	-- 13
	{control = "radiobutton",	x =  150,	y =  64, width =  50, height = 14, text = "Current", selected = 0, testFunction = Area.GetCurrent}, 			-- 14
	{control = "radiobutton",	x =  150,	y =  78, width =  50, height = 14, text = "Line", selected = 0, testFunction = Area.GetCurrentLine}, 				-- 15
	{control = "radiobutton",	x =  150,	y =  92, width =  50, height = 14, text = "Mouse", selected = 0, testFunction = Area.GetFromXY}, 				-- 16
} -- top_controls
local tc_DebugDelayEntry = 9
local tc_LogLevelEntry = 11

dialog_paramsTable = {
	{},																																			-- dummy for O.K button
	{title = "Dolphin Script Functions TestTool v0.02 Event Function menu", width = 400, height = 510, callback="EventDialogCallback"},   
	{title = "Dolphin Script Functions TestTool v0.02 Test Function menu", width = 400, height = 510, callback="TestDialogCallback"},
	{title = "Dolphin Script Functions TestTool v0.02 Detector menu", width = 400, height = 510, callback="DetectorDialogCallback"},   
	{title = "Dolphin Script Functions TestTool v0.02 Properties menu", width = 400, height = 510, callback="PropertiesDialogCallback"},
	{},																																			-- dummy for repeat test button
} -- dialog_paramsTable

dialog_controlTable = {
	-- Table of controls for the event function logging dialog
	{},		-- dialog_controlTable[1]																											-- 1: dummy for O.K button
	{		-- dialog_controlTable[2]																											-- 2: event selectie table
		{control = "button",		x =  10,	y = 480, width =  30, height = 14, text = "&OK", command = ID_OK}, 				-- 01
		{control = "button",	x =  55,	y = 480, width =  30, height = 14, text = "&None", command = ID_OK}, 			-- 02
		{control = "button",	x =  100,	y = 480, width =  30, height = 14, text = "A&ll", command = ID_OK}, 			-- 03
		{control = "checkbox",		x = 120,	y =  80, width = 100, height = 14, text = "&A Activated"},										-- 04
		{control = "checkbox",		x = 120,	y = 100, width = 100, height = 14, text = "&B Braille Pressed"},								-- 05
		{control = "checkbox",		x = 120,	y = 120, width = 100, height = 14, text = "&C Deactivated"},									-- 06
		{control = "checkbox",		x = 120,	y = 140, width = 100, height = 14, text = "&D DOM Report"},						  				-- 07
		{control = "checkbox",		x = 120,	y = 160, width = 100, height = 14, text = "&E DOM Setup"},										-- 08
		{control = "checkbox",		x = 120,	y = 180, width = 100, height = 14, text = "&F Focus Change"},									-- 09
		{control = "checkbox",		x = 120,	y = 200, width = 100, height = 14, text = "&G Key Press"},										-- 10
		{control = "checkbox",		x = 120,	y = 220, width = 100, height = 14, text = "&H Mouse Move"},										-- 11
		{control = "checkbox",		x = 120,	y = 240, width = 100, height = 14, text = "&I New Text"},										-- 12
		{control = "checkbox",		x = 120,	y = 260, width = 100, height = 14, text = "&J Screen Change"},									-- 13
		{control = "checkbox",		x = 120,	y = 280, width = 100, height = 14, text = "&K Timer Count"},									-- 14
		{control = "checkbox",		x = 120,	y = 300, width = 100, height = 14, text = "&M Virtual Focus Change"},							-- 15
		{control = "checkbox",		x = 120,	y = 320, width = 100, height = 14, text = "&P Braille"},										-- 16
		{control = "checkbox",		x = 120,	y = 340, width = 100, height = 14, text = "&Q Speech"},											-- 17
		{control = "checkbox",		x = 120,	y = 360, width = 100, height = 14, text = "&R Speech2"},										-- 18
		{control = "checkbox",		x = 120,	y = 380, width = 100, height = 14, text = "&S Close Down"},										-- 19
		{control = "checkbox",		x = 120,	y = 400, width = 100, height = 14, text = "&T Start up"},										-- 20
		{control = "checkbox",		x = 120,	y = 420, width = 100, height = 14, text = "&U MSAA"},											-- 21
		{control = "checkbox",		x = 120,	y = 440, width = 100, height = 14, text = "&V UIA"},											-- 22
	},
	
						-- Table of controls for the test sublevel dialog 
	{ 																																							-- 3: test selectie table
--		{control = "button",		x =  10,	y = 480, width =  30, height = 14, text = "&OK", command = ID_OK}, 								-- 06     Except for this escape, everything is O.K  in this buttons-only menu
		{control = "button",		x =  55,	y = 480, width =  50, height = 14, text = "Cancel (Esc)", command = ID_CANCEL},				-- 07     Except for this escape, everything is O.K  in this buttons-only menu
		{control = "button",		x =  55,	y = 240, width =  30, height = 14, text = "myTest&a", command = ID_OK, disabled = 1}, 		-- 08
		{control = "button",		x =  55,	y = 260, width =  30, height = 14, text = "myTest&b", command = ID_OK, disabled = 0}, 		-- 08
		{control = "button",		x =  55,	y = 280, width =  30, height = 14, text = "myTest&c", command = ID_OK, disabled = 1}, 		-- 09
		{control = "button",		x =  55,	y = 300, width =  30, height = 14, text = "myTest&d", command = ID_OK, disabled = 0}, 		-- 10
		{control = "button",		x =  55,	y = 320, width =  30, height = 14, text = "myTest&e", command = ID_OK, disabled = 0}, 		-- 08
		{control = "button",		x =  55,	y = 340, width =  30, height = 14, text = "myTest&f", command = ID_OK, disabled = 0}, 		-- 09
		{control = "button",		x =  55,	y = 360, width =  30, height = 14, text = "myTest&g", command = ID_OK, disabled = 0}, 		-- 10
		{control = "button",		x =  55,	y = 380, width =  30, height = 14, text = "myTest&h", command = ID_OK, disabled = 0}, 		-- 08
		{control = "button",		x =  55,	y = 400, width =  30, height = 14, text = "myTest&i", command = ID_OK, disabled = 1}, 		-- 09
		{control = "button",		x =  55,	y = 420, width =  30, height = 14, text = "myTest&j", command = ID_OK, disabled = 0}, 		-- 10
		{control = "button",		x =  55,	y = 440, width =  30, height = 14, text = "myTest&k", command = ID_OK, disabled = 0}, 		-- 08
		{control = "button",		x =  55,	y = 460, width =  30, height = 14, text = "myTest&l", command = ID_OK, disabled = 0}, 		-- 09
		{control = "button",		x =  55,	y = 480, width =  30, height = 14, text = "myTest&m", command = ID_OK, disabled = 0}, 		-- 10
	},

	-- Table of controls for the detector type dialog
	{ 																																				-- 04: detector selectie table
		{control = "button",		x =  10,	y = 480, width =  30, height = 14, text = "&OK", command = ID_OK}, 								-- 01
		{control = "button",		x =  55,	y = 480, width =  50, height = 14, text = "Cancel (Esc)", command = ID_CANCEL},				-- 02
			--		{control = "group",			x =   5,	y =  95, width =  80, height =110, text = "Detector Type", disabled = 1},							--
		{control = "checkbox",		x =   9,	y = 105, width = 100, height = 14, text = "&windows"},															-- 03
		{control = "checkbox",		x =   9,	y = 125, width = 100, height = 14, text = "&MSAA"},																-- 04
		{control = "checkbox",		x =   9,	y = 145, width = 100, height = 14, text = "&UIA"},																-- 05
		{control = "checkbox",		x =   9,	y = 165, width = 100, height = 14, text = "&Area"},																-- 06
		{control = "checkbox",		x =   9,	y = 185, width = 100, height = 14, text = "&DOM"},																-- 07
		{control = "checkbox",		x =   9,	y = 205, width = 100, height = 14, text = "&COM"},																-- 08
		{control = "checkbox",		x =   9,	y = 225, width = 100, height = 14, text = "&Situation"},														-- 09
	},


				-- Table of controls for the properties sublevel dialog 
	{ 
					--Area Function
		{control = "button",		x =  10,	y = 480, width =  30, height = 14, text = "&OK", command = ID_OK}, 								-- 06
		{control = "checkbox",		x =   9,	y = 105, width = 100, height = 14, text = "windows"},															-- 11
			--		{control = "group",			x =   5,	y =  95, width = 110, height =290, text = "Property Type", disabled = 1},							-- 11
		{control = "checkbox",		x = 120,	y = 100, width = 100, height = 14, text = "first/next/last &child"},											-- 16
		{control = "checkbox",		x = 120,	y = 120, width = 100, height = 14, text = "first/last &line segment"},														-- 17
		{control = "checkbox",		x = 120,	y = 140, width = 100, height = 14, text = "first/last &object segment"},										-- 18
		{control = "checkbox",		x = 120,	y = 160, width = 100, height = 14, text = "&all childern"},														-- 19
		{control = "checkbox",		x = 120,	y = 180, width = 100, height = 14, text = "&direct childern"},													-- 20
		{control = "checkbox",		x = 120,	y = 200, width = 100, height = 14, text = "First Line"},														-- 21
		{control = "checkbox",		x = 120,	y = 220, width = 100, height = 14, text = "Current &Line"},														-- 22
		{control = "checkbox",		x = 120,	y = 240, width = 100, height = 14, text = "Current *Window"},													-- 23
		{control = "checkbox",		x = 120,	y = 260, width = 100, height = 14, text = "L&abel"},															-- 24
		{control = "checkbox",		x = 120,	y = 280, width = 100, height = 14, text = "&properties"},														-- 25
		{control = "checkbox",		x = 120,	y = 300, width = 100, height = 14, text = "screen"},															-- 26
		{control = "checkbox",		x = 120,	y = 320, width = 100, height = 14, text = "state"},																-- 27
		{control = "checkbox",		x = 120,	y = 340, width = 100, height = 14, text = "text"},																-- 28
		{control = "checkbox",		x = 120,	y = 360, width = 100, height = 14, text = "valid"},																-- 29
		{control = "checkbox",		x = 120,	y = 380, width = 100, height = 14, text = "previous"},															-- 30

		{control = "list",			x =   5,	y = 230, width =  80, height = 80, items = {"item 1", "item 2", 'item 3', "aap", "noot", "mies"}}, 				-- 31
		{control = "static",		x =   5,	y = 420, width =  50, height = 20, text = "Some text..."}, 														-- 32
		{control = "edit",			x =   5,	y = 435, width =  80, height = 14}, 																			-- 33
	} 
}

  
--[[--------------------------------------------------------------------------------
--]]
function DebugExtra()
	DebugDialog()

end -- DebugExtra

--[[--------------------------------------------------------------------------------
--]]
function DebugDialog(scanCode, modifierUnused)
	OutputDebugInfo({"-------------------- Entry DebugDialog --------------------"}, OUT_MEDIUM)
	if scanCode == nil then
		OutputDebugInfo({"you choose \"Repeat Previous\" !!!!!!!!!!!!!"}, OUT_HIGH)
--		mySubIndex = 4
	else
		top_controls[tc_LogLevelEntry].selected = DEBUGLEVEL					-- set the selected entry of the Debug Log level list

		top_controls[tc_DebugDelayEntry].selected = 3							-- default slected Debug Delay entry to "something"
		for key, val in pairs(top_controls[tc_DebugDelayEntry].items) do		-- if the actual value of Debug Delay is in the table then select that corresponding entry
			if g_DebugDelay == tonumber(val) then top_controls[tc_DebugDelayEntry].selected = key end
		end
		
		topValues = Dialog.Custom(top_params, top_controls)						-- Top level dialog
		if topValues then															-- if a test button pressed (i.e. not cancel)
--			printTable( topValues)
			
			local i =  topValues[tc_LogLevelEntry].selected 
			OutputDebugLevel(i)

			i =  topValues[tc_DebugDelayEntry].selected 
			local v =  topValues[tc_DebugDelayEntry].items[i].name
			g_DebugDelay = tonumber(v)
			
			mySubIndex = 0														-- identifies the selected activity, default to invalid value
			i = 1
			repeat
				if topValues[i].pressed == 1 then mySubIndex = i end			-- found the pressed button
				i = i + 1
			until (top_controls[i].myFlag == "lastButton") 

			if top_controls[mySubIndex].text == "&OK" then
				OutputDebugInfo({"you choose OK in the top dialog"}, OUT_VERY_LOW)
			elseif top_controls[mySubIndex].text == "&Repeat Previous" then
				OutputDebugInfo({"you choose \"Repeat Previous\" in the top dialog. We are going to fake Detector test !!!!!!!!!!!!!"}, OUT_HIGH)
--				mySubIndex = 4
			else																-- 2nd level dialog
				if mySubIndex == 2 then TestEventsPrepare() end
				OutputDebugInfo({"dialog_params:", tostring(dialog_paramsTable[mySubIndex].title)}, OUT_VERY_LOW)
				subValues = Dialog.Custom(dialog_paramsTable[mySubIndex], dialog_controlTable[mySubIndex]) 
			end
		end
	end

	OutputDebugInfo({"mySubIndex:", mySubIndex}, OUT_VERY_LOW)
	if mySubIndex > 1 then											-- if a test button pressed (i.e. not cancel (=0) or O.K (=1))
--		printTable( subValues)										-- use this if things don't seem to work
		if mySubIndex == 2 then										-- event functions
			OutputDebugInfo({"Events:", mySubIndex}, OUT_MEDIUM)
			TestEvents( subValues)
		elseif mySubIndex == 3 then									-- test functions
			OutputDebugInfo({"Tests:", mySubIndex}, OUT_MEDIUM)
			if scanCode then										-- no need to sleep if there was no dialog
				DebugSleep( 1000, "!! sleep in the hope the dialog is gone. I dislike Dolphin once in a while") --needed because otherwise search sometimes takes place in the dialog window rather then the intended application window
				DebugSleep( 1000, "!! sleep in the hope the dialog is out of the way, CHECK HOW DOLPHIN HANDLES THIS")
			end
			TestFunctions( subValues)
		elseif mySubIndex == 4 then 								-- Detector
			OutputDebugInfo({"Detector tests", mySubIndex}, OUT_MEDIUM)
			TestDetector( subValues)
		elseif mySubIndex == 5 then 								-- Properties
			OutputDebugInfo({"Properties:", mySubIndex}, OUT_MEDIUM)
			TestProperties( subValues)
		else
			OutputDebugInfo({"!!!! mySubIndex out of range:", mySubIndex})
		end
	end 
	OutputDebugInfo({"-------------------- Exit  DebugDialog --------------------"}, OUT_MEDIUM)
end -- DebugDialog	

  
--[[--------------------------------------------------------------------------------
--]]
function TestEventsPrepare()	
	dialog_controlTable[2][4].selected = EAp_ActivatedFlag		
	dialog_controlTable[2][5].selected = EAp_BraillePressFlag	
	dialog_controlTable[2][6].selected = EAp_DeactivatedFlag		
	dialog_controlTable[2][7].selected = EAp_DomReportFlag		
	dialog_controlTable[2][8].selected = EAp_DomSetupFlag		
	dialog_controlTable[2][9].selected = EAp_FocusChangeFlag		
	dialog_controlTable[2][10].selected = EAp_KeyPressFlag		
	dialog_controlTable[2][11].selected = EAp_MouseMoveFlag		
	dialog_controlTable[2][12].selected = EAp_NewTextFlag			
	dialog_controlTable[2][13].selected = EAp_ScreenChangeFlag	
	dialog_controlTable[2][14].selected = EAp_TimerFlag			
	dialog_controlTable[2][15].selected = EAp_VirtualFocusChangeFlag 	
	dialog_controlTable[2][16].selected = EAu_BrailleFlag			
	dialog_controlTable[2][17].selected = EAu_SpeechFlag			
	dialog_controlTable[2][18].selected = EAu_Speech2Flag			
	dialog_controlTable[2][19].selected = ES_CloseDownFlag		
	dialog_controlTable[2][20].selected = ES_StartupFlag			
	dialog_controlTable[2][21].selected = ES_MSAAFlag				
	dialog_controlTable[2][22].selected = ES_UIAutomationFlag		
end -- TestEventsPrepare

  
--[[--------------------------------------------------------------------------------
--]]
function TestEvents( values)
			local value = nil
			OutputDebugInfo({"TestEvents myId", myId}, OUT_HIGH) 
			if myId == 2 then
				OutputDebugInfo({"None button"}, OUT_HIGH) 
				value = 0
			elseif myId == 3 then
				OutputDebugInfo({"All button"}, OUT_HIGH) 
				value = 1
			end
			if value then
				EAp_ActivatedFlag			, EAp_ActivatedCount			= value, 0
				EAp_BraillePressFlag		, EAp_BraillePressCount			= value, 0
				EAp_DeactivatedFlag			, EAp_DeactivatedCount			= value, 0
				EAp_DomReportFlag			, EAp_DomReportCount			= value, 0
				EAp_DomSetupFlag			, EAp_DomSetupCount				= value, 0
				EAp_FocusChangeFlag			, EAp_FocusChangeCount			= value, 0
				EAp_KeyPressFlag			, EAp_KeyPressCount				= value, 0
				EAp_MouseMoveFlag			, EAp_MouseMoveCount			= value, 0
				EAp_NewTextFlag				, EAp_NewTextCount				= value, 0
				EAp_ScreenChangeFlag		, EAp_ScreenChangeCount			= value, 0
				EAp_TimerFlag				, EAp_TimerCount				= value, 0
				EAp_VirtualFocusChangeFlag 	, EAp_VirtualFocusChangeCount	= value, 0
				EAu_BrailleFlag				, EAu_BrailleCount				= value, 0
				EAu_SpeechFlag				, EAu_SpeechCount				= value, 0
				EAu_Speech2Flag				, EAu_Speech2Count				= value, 0
				ES_CloseDownFlag			, ES_CloseDownCount				= value, 0
				ES_StartupFlag				, ES_StartupCount				= value, 0
				ES_MSAAFlag					, ES_MSAACount					= value, 0
				ES_UIAutomationFlag			, ES_UIAutomationCount			= value, 0
			else
				EAp_ActivatedFlag			, EAp_ActivatedCount			= values[4].checked, 0
				EAp_BraillePressFlag		, EAp_BraillePressCount			= values[5].checked, 0
				EAp_DeactivatedFlag			, EAp_DeactivatedCount			= values[6].checked, 0
				EAp_DomReportFlag			, EAp_DomReportCount			= values[7].checked, 0
				EAp_DomSetupFlag			, EAp_DomSetupCount				= values[8].checked, 0
				EAp_FocusChangeFlag			, EAp_FocusChangeCount			= values[9].checked, 0
				EAp_KeyPressFlag			, EAp_KeyPressCount				= values[10].checked, 0
				EAp_MouseMoveFlag			, EAp_MouseMoveCount			= values[11].checked, 0
				EAp_NewTextFlag				, EAp_NewTextCount				= values[12].checked, 0
				EAp_ScreenChangeFlag		, EAp_ScreenChangeCount			= values[13].checked, 0
				EAp_TimerFlag				, EAp_TimerCount				= values[14].checked, 0
				EAp_VirtualFocusChangeFlag 	, EAp_VirtualFocusChangeCount	= values[15].checked, 0
				EAu_BrailleFlag				, EAu_BrailleCount				= values[16].checked, 0
				EAu_SpeechFlag				, EAu_SpeechCount				= values[17].checked, 0
				EAu_Speech2Flag				, EAu_Speech2Count				= values[18].checked, 0
				ES_CloseDownFlag			, ES_CloseDownCount				= values[19].checked, 0
				ES_StartupFlag				, ES_StartupCount				= values[20].checked, 0
				ES_MSAAFlag					, ES_MSAACount					= values[21].checked, 0
				ES_UIAutomationFlag			, ES_UIAutomationCount			= values[22].checked, 0
			end
end -- TestEvents
  
--[[--------------------------------------------------------------------------------
--]]
function TestFunctions( values)
	local p, s = nil, ""
	if values[2].pressed == 1 then p = myTest_a ; s = "myTest_a"
	elseif values[ 3].pressed == 1 then p = myTest_b ; s = "myTest_b"
	elseif values[ 4].pressed == 1 then p = myTest_c ; s = "myTest_c"
	elseif values[ 5].pressed == 1 then p = myTest_d ; s = "myTest_d"
	elseif values[ 6].pressed == 1 then p = myTest_e ; s = "myTest_e"
	elseif values[ 7].pressed == 1 then p = myTest_f ; s = "myTest_f"
	elseif values[ 8].pressed == 1 then p = myTest_g ; s = "myTest_g"
	elseif values[ 9].pressed == 1 then p = myTest_h ; s = "myTest_h"
	elseif values[10].pressed == 1 then p = myTest_i ; s = "myTest_i"
	elseif values[11].pressed == 1 then p = myTest_j ; s = "myTest_j"
	elseif values[12].pressed == 1 then p = myTest_k ; s = "myTest_k"
	elseif values[13].pressed == 1 then p = myTest_l ; s = "myTest_l"
	elseif values[14].pressed == 1 then p = myTest_m ; s = "myTest_m"
	else
		OutputDebugInfo({"!!!! TestFunctions: unexpected values"})
		printTable( values)
	end
	if p then
		OutputDebugInfo({"-------------------- Entry TestFunction", s, "--------------------"}, OUT_MEDIUM)
		p(values)
		OutputDebugInfo({"-------------------- Exit  TestFunction", s, "--------------------"}, OUT_MEDIUM)
	end
end -- TestFunctions



  
--[[--------------------------------------------------------------------------------
Following are the Area functions: 
•   Area.Children 
•   Area.DirectChildren 
•   Area.FindFirstType 
•   Area.FindNextType Reference  171 
 
•   Area.FindType 
•   Area.FirstChild 
•   Area.FirstLine 
•   Area.FirstSegmentInObject 
•   Area.FirstSegmentOnLine 
•   Area.GetCharacter 
•   Area.GetCurrent 
•   Area.GetCurrentApplication 
•   Area.GetCurrentLine 
•   Area.GetCurrentWindow 
•   Area.GetFromXY 
•   Area.GetLabel 
•   Area.GetProperties 
•   Area.GetScreen 
•   Area.GetState 
•   Area.GetText 
•   Area.Insert 
•   Area.IsInside 
•   Area.IsValid 
•   Area.LastChild 
•   Area.LastSegment 
•   Area.Leaves 
•   Area.MoveToMarker 
•   Area.Next 
•   Area.NextLine 
•   Area.NextLineInObject  
•   Area.NextObject 
•   Area.NextSegment 
•   Area.NextSegmentInObject 
•   Area.NextSegmentOnLine 
•   Area.Parent 
•   Area.Previous 
•   Area.PreviousLine 
•   Area.PreviousObject 
•   Area.PreviousSegmentOnLine 
•   Area.Remove 
•   Area.SetCharacter 
•   Area.SetProperties 
•   Area.SetState 
•   Area.SetTag 
•   Area.SetText 
•   AreaSetText2 
•   Area.SetType 
•   Area.SortFirstChild 
•   Area.SortParent
--]]
local windowsDetectFlag
local MsaaDetectFlag 
local UiaDetectFlag 
local AreaDetectFlag 
local DomDetectFlag 
local ComDetectFlag 
local SituationDetectFlag 

function TestDetector( values)
--	OutputDebugInfo("printTable(values)")
--	printTable(values)

	windowsDetectFlag = values[3].checked 
	OutputDebugInfo({"windowsDetectFlag", windowsDetectFlag})

	MsaaDetectFlag =  values[4].checked 
	OutputDebugInfo({"MsaaDetectFlag", MsaaDetectFlag})
	if MsaaDetectFlag == 1 then
		local area = Area.GetCurrentApplication() 
		testMsaa( area)
	end

	UiaDetectFlag =  values[5].checked 
	OutputDebugInfo({"UiaDetectFlag", UiaDetectFlag})
	if UiaDetectFlag == 1 then
		local uia_handle = UIA.ObjectFromProcessId( myPid) 
		local help_info = UIA.GetProperty( uia_handle, UIA_HelpTextPropertyId) 
		local name_info = UIA.GetProperty( uia_handle, UIA_NamePropertyId)
		OutputDebugInfo({ "UIA:", tostring(uia_handle), tostring(help_info), tostring(name_info)})
		printTable(uia_handle)
		printTable(uia_handle["handle"])
	end

	AreaDetectFlag =  values[6].checked 
	OutputDebugInfo({"AreaDetectFlag", AreaDetectFlag})
	if AreaDetectFlag == 1 then
		local area = Area.GetCurrentApplication() 
		testArea( area)
	end


	AreaDetectFlag =  values[7].checked 
	OutputDebugInfo({"DomDetectFlag", UiaDetectFlag})

	AreaDetectFlag =  values[8].checked 
	OutputDebugInfo({"ComDetectFlag", UiaDetectFlag})

	AreaDetectFlag =  values[9].checked 
	OutputDebugInfo({"SituationDetectFlag", UiaDetectFlag})

--local area_screen = Area.GetScreen( ) 
--local area_current = Area.GetCurrent()
--local area_current_window = Area.GetCurrentWindow()
	local area_current_application = Area.GetCurrentApplication()
--local area_current_line = Area.GetCurrentLine()
--local area_xy = Area.GetFromXY()

--In Detection Scripts, you will be given the area as a parameter to the detection script function. 
	local child = Area.FirstChild(area_current_application)
--Area.LastChild, 
--Area.Next
--Area.Previous
--Area.Parent. 
--Area.IsValid 
--Area.SortFirstChild
--Area.SortParent
--Area.FirstLine, 
--Area.NextObject
--Area.PreviousSegmentOnLine. 
	local area_line = Area.FirstLine( area_current_application, SORT_ROWS) 
	local area_next = Area.Next( area_line) 


--	for child in Area.Children( area_current_application) do 
----		local p = Area.GetProperties( child)
----		local t = {}	
----		if p then
----			t = GetPropertyTable(p)
----			if t then
----				OutputDebugInfo({"child detector:", t["detection"] }, OUT_HIGH)
----			else OutputDebugInfo({"!!!! failed GetPropertyTable for child"}, OUT_ERROR)
----			end
----		else OutputDebugInfo({"!!!! failed to get properties for child"}, OUT_ERROR)
----		end
--		OutputDebugInfo("still alive")
--	end 
--	OutputDebugInfo("still kicking")
--[[

First, get a handle to the UIA object, use either the UIA.ObjectFromPoint, 
UIA.ObjectFromWindow, UIA.ObjectFromMSAA, UIA.ObjectFromRuntimeId, 
or UIA.ObjectFromProcessId function. These functions retrieve a handle to the 
UIA object using either its window handle, a point on the screen, its 
corresponding MSAA object, its UI Automation RuntimeId, or its process ID 
(respectively). 
For example, assuming that window_handle is a window handle, then you can 
call: 
local uia_handle = UIA.ObjectFromWindow 
(window_handle) 
Once you have a UIA object handle, you can use functions such as 
UIA.GetProperty and UIA.GetPattern to retrieve UIA information.  For 
example, to find out if the UIA object has any help text, call: 
local help_info = UIA.GetProperty( uia_handle, 
UIA_HelpTextPropertyId) 
When you have finished with a UIA object handle, you must call 
UIA.DeleteObject to delete it and free the resources associated with the 
handle. 
UIA Events 
Call the UIA.AddEvent function to register that your script should receive a UIA 
event.  You pass the particular event you wish to register as a parameter to 
this function, along with the process ID that you want events for: 
my_event = 
UIA.AddEvent(UIA_AutomationFocusChangedEventId, 
process) 
Whenever the UIA event occurs, the EventScriptUIAutomationEvent event 
function will be called and you can take any necessary action. 
You can call UIA.AddEvent several times to register different UIA events. 


You should call UIA.DeleteObject to release the UIA object once it is no 
longer needed. 

--]]


--[[
--
--UIA_AcceleratorKeyPropertyId  The AcceleratorKey property is a string containing the shortcut key combinations for the specified automation element. For example "CTRL+O". 
UIA_AccessKeyPropertyId  The AccessKey property is a character in the text of  the specified automation element, such as a menu, menu item, or the label of a control such as a push button, that activates the control. For example, the access 
key of a File menu is usually “F”. 
UIA_AriaPropertiesPropertyId  The AriaProperties property is a 
formatted string containing the 
Accessible Rich Internet Application 
property information for the specified 
automation element. AriaProperties is 
a collection of Name,Value pairs with 
delimiters of = (equals) and ; 
(semicolon). For example, 
"checked=true;disabled=false". \ 
(backslash) is used as an escape 
character if backslash appears in the 
values.  
UIA_AriaRolePropertyId  The AriaRole property is a string 
containing the Accessible Rich 
Internet Application role information 
for the specified automation element. 
UIA_AutomationIdPropertyId  Tthe AutomationId property is a string 
containing the UI Automation identifier 
(if available) for the specified 
automation element. 
UIA_BoundingRectanglePropertyId  The BoundingRectangle property 
specifies the screen coordinates of the 
rectangle that completely encloses the 
specified automation element. 
UIA_ClassNamePropertyId  The ClassName property is a string 
containing the class name for the 
specified automation element as 
assigned by the control developer. 
UIA_ClickablePointPropertyId  The ClickablePoint property is the Reference  486 
 
screen coordinates on the specified 
automation element that can be 
clicked. 
UIA_ControllerForPropertyId  The ControllerFor property is a table 
of automation elements that are 
manipulated by the speficied 
automation element (that supports this 
property). 
UIA_ControlTypePropertyId  The ControlType property is an 
integer that identifies the type of the 
speficied automation element. 
UIA_CulturePropertyId  The Culture property is an integer that 
represents the Microsoft LCID (Locale 
identifier) for the specified automation 
element. For example, 0x0809 for 
English (United Kingdom). 
UIA_DescribedByPropertyId  The DescribedBy property is a table of 
automation elements that provide 
more information about the specified 
automation element. 
UIA_FlowsFromPropertyId  The FlowsFrom property 
(implemented from Windows 8 
onwards) is a table of automation 
elements that specifies the reading 
order before the specified automation 
element (when automation elements 
are not structured in the same reading 
order as perceived by the user). 
UIA_FlowsToPropertyId  The FlowsFrom property 
(implemented from Windows 8 
onwards) is a table of automation 
elements that specifies the reading 
order after the specified automation 
element (when automation elements 
are not structured in the same reading 
order as perceived by the user). 
UIA_FrameworkIdPropertyId  The FrameworkId property is a string 
containing the name of the underlying 
user interface framework that the 
specified automation element belongs 
to. For example, "Win32", or 
"WinForm", or "DirectUI", etc. Reference  487 
 
UIA_HasKeyboardFocusPropertyId  The HasKeyboardFocus property is a 
boolean value that indicates whether 
the specified automation element has 
the keyboard focus or not. 
UIA_HelpTextPropertyId  The HelpText property is the help text 
string associated with the specified 
automation element and is typically 
obtained from the tooltip text 
associated with the element. 
UIA_IsContentElementPropertyId  The IsContentElement property is a 
boolean value that specifies whether 
the specified automation element 
appears in the content view of the 
automation element tree. 
UIA_IsControlElementPropertyId  The IsControlElement property is a 
boolean value that specifies whether 
the specified automation element 
appears in the control view of the 
automation element tree. 
UIA_IsDataValidForFormPropertyId  The IsDataValidForForm property is a 
boolean value that indicates whether 
the entered or selected value is valid 
for the form rule associated with the 
specified automation element. For 
example, if the user entered "754577" 
in a five-digit zip code field, the value 
of the IsDataValidForForm property 
would be false. 
UIA_IsEnabledPropertyId  The IsEnabled property is a boolean 
value that indicates whether the 
specified automation element can be 
interacted with or not. 
UIA_IsKeyboardFocusablePropertyId  The IsKeyboardFocusable property is 
a boolean value that indicates whether 
the specified automation element can 
accept the keyboard focus or not. 
UIA_IsOffscreenPropertyId  The IsOffscreen property is a boolean 
value that indicates whether the 
specified automation element is 
entirely scrolled out of view or not. For 
example, a list box item that’s 
currently outside the viewport of its 
parent list box control. Reference  488 
 
UIA_IsPasswordPropertyId  The IsPassword property is a boolean 
value that indicates whether the 
specified automation element contains 
protected content, such as a 
password, or not. 
UIA_IsPeripheralPropertyId  The IsPeripheral property (supported 
from Windows 8.1 onwards) is a 
boolean value that indicates whether 
the specified automation element is a 
peripheral user interface element or 
not. Peripheral user interface 
elements support user interaction, but 
do not take the keyboard focus when 
they appear, such as popups, flyouts, 
context menus, or floating 
notifications. 
UIA_IsRequiredForFormPropertyId  The IsRequiredForForm property is a 
boolean value that indicates whether 
the specified automation element is a 
mandatory field in a form or not. 
UIA_ItemStatusPropertyId  TtemStatus property is a string 
describing the status of an item of the 
specified automation element. For 
example, an item associated with a 
contact in a messaging application 
might be "Busy" or "Connected". 
UIA_ItemTypePropertyId  The ItemType property is a string 
describing the type of the specified 
automation element. For example, an 
element in a file flder might have an 
ItemType of "Document File" or a 
"Folder". 
UIA_LabeledByPropertyId  The LabeledBy property is an 
automation element that contains the 
text label for the specified automation 
element. For example, this property 
can be used to retrieve the static text 
label for a list box. 
UIA_LiveSettingPropertyId  The LiveSetting property (supported 
from Windows 8 onwards) indicates 
the "politeness" level that your script 
should use to notify the user of 
changes to the specified live region Reference  489 
 
automation element. 
UIA_LocalizedControlTypePropertyId  The LocalizedControlType property is 
a string describing the type of control 
that the specified automation element 
represents. 
UIA_NamePropertyId  The Name property is a string that 
holds the name of the specified 
automation element. For example, 
"Open" for a push button automation 
element with the label "Open". 
UIA_NativeWindowHandlePropertyId  The NativeWindowHandle property is 
an integer that represents the HWND 
handle of the automation element 
window (if it exists). 
UIA_OptimizeForVisualContentPropertyId The OptimizeForVisualContent 
property (from Windows 8 onwards) is 
a boolean value that indicates whether 
the UI Automation provider exposes 
only elements that are visible or not. 
For example, as the user pages 
through a large piece of content, the 
UI Automation provider can destroy 
content elements that are no longer 
visible. 
UIA_OrientationPropertyId  The Orientation property is an integer 
value that indicates the screen 
orientation of the specified automation 
element. 
UIA_ProcessIdPropertyId  The ProcessId property is an integer 
representing the process identifier (ID) 
of the specified automation element. 
UIA_ProviderDescriptionPropertyId  The ProviderDescription property is a 
string containing the source 
information of the UI Automation 
provider for the specified automation 
element. 
UIA_RuntimeIdPropertyId  The RuntimeId property is a table of 
integers representing the identifier for 
an automation element. Reference  490 
 
Requirements 
Version 13.50 
See Also 
UIA.ObjectFromPoint, UIA.ObjectFromWindow, UIA.ObjectFromMSAA, 
UIA.ObjectFromRuntimeId, UIA.ObjectFromRuntimeId, UIA.DeleteObject, 
UIA.Navigate, UIA.SetFocus, UIA.ObjectBoundingRectangle, 
UIA.GetChildCount, UIA.GetChild, UIA.GetPattern, UIA.AddEvent, 
UIA.RemoveEvent 
Example 
 
local parent = UIA.Navigate(uia_object, 
UIA_NAVIGATE_PARENT) 
if parent ~= nil then 
  local parent_name = UIA.GetProperty(parent, 
UIA_NamePropertyId) 
  UIA.DeleteObject(parent) 
end 
UIA.GetPattern 
Retrieves a Lua table containing control type-specific values of the individual 
properties and states of the the specified UIA object. 
UIA.GetPattern (uia_object, pattern_id) 
Parameters 
uia_object 
Handle to the UIA object. 
pattern_id 
id of the control pattern to use. 
Return Values 
Returns a table if successful, or nil if it failed.  Reference  491 
 
Remarks 
You use control patterns to retrieve control-type specific properties of the 
specified automation element. For example, for a grid control automation 
element, use the UIA_GridPatternId control pattern to retrieve the number of 
rows and columns in the grid. 
Currently pattern_id can be one of the following values: 
Value  Description 
UIA_ValuePatternId  Used for automation elements that have an 
intrinsic value that can be represented as a 
string, such as a list box item or a tree view 
item. The individual fields of the returned Lua 
table are value (a Unicode string) and 
read_only (a boolean value). 
UIA_ExpandCollapsePatternId  Used for automation elements that visually 
expand to display more content and collapse 
to hide content, such as tree view items, split 
buttons, combo boxes and app bars. The 
only field in the returned Lua table is 
expand_collapse_state whose value is 0 if 
the specified automation element is currently 
collapsed, 1 if its expanded, 2 if its partially 
expanded and 3 if the specified automation 
element has no child content. 
UIA_GridPatternId  Used for automation elements that act as 
containers for a collection of child elements, 
such as a table, calendar or data grid. The 
individual fields of the returned Lua table are 
row_count (an integer) and column_count 
(an integer). 
UIA_GridItemPatternId  Used for individual automation elements of a 
parent table, calendar or data grid 
automation element. The individual fields of 
the returned Lua table are column (an 
integer), row (an integer), column_span (an 
integer), row_span (an integer) and 
containing_grid (a handle to the parent 
automation element that needs 
UIA.DeleteObject to free it afterwards). 
UIA_TogglePatternId  Used for automation elements that can cycle 
through a set of states and maintain a state 
once set, such as check boxes, app bars and 
semantic zoom controls. The only field in the Reference  492 
 
returned Lua table is toggle_state whose 
value is 0 (for off), 1 (for on) and 2 (for 
indeterminate). 
UIA_SpreadsheetItemPatternId  (Implemented from Windows 8 onwards). 
Used for automation elements (that expose 
the properties of a cell in a spreadsheet (or 
other grid-based document). The only field in 
the returned Lua table is formula whose 
value is the formula for this spreadsheet cell. 
(A separate formula control pattern is 
necessary because a cell’s value control 
pattern usually returns the computed value of 
the cell and not is formula). 
Requirements 
Version 13.50 
See Also 
UIA.ObjectFromPoint, UIA.ObjectFromWindow, UIA.ObjectFromMSAA, 
UIA.ObjectFromRuntimeId, UIA.ObjectFromRuntimeId, UIA.DeleteObject, 
UIA.Navigate, UIA.SetFocus, UIA.ObjectBoundingRectangle, 
UIA.GetChildCount, UIA.GetChild, UIA.GetProperty, UIA.AddEvent, 
UIA.RemoveEvent 
Example 
This example speaks the name property of the specified UIA object’s parent 
object: 
local uia_event_info = {} 
local grid_item_pattern = UIA.GetPattern(uia_object, 
UIA_GridItemPatternId) 
if grid_item_pattern ~= nil then 
  uia_event_info.cell_row = grid_item_pattern.row + 
1 
  uia_event_info.cell_column = 
grid_item_pattern.column + 1 
  uia_event_info.cell_row_span = 
grid_item_pattern.row_span 
  uia_event_info.cell_column_span = 
grid_item_pattern.column_span 
  if grid_item_pattern.containing_grid ~= nil then Reference  493 
 
    local grid_pattern = 
UIA.GetPattern(grid_item_pattern.containing_grid, 
UIA_GridPatternId) 
    if grid_pattern ~= nil then 
      uia_event_info.table_rows = 
grid_pattern.row_count 
      uia_event_info.table_columns = 
grid_pattern.column_count 
    end 
    
UIA.DeleteObject(grid_item_pattern.containing_grid) 
  end 
end 
UIA.AddEvent 
--]]	


end -- TestDetector

	--[[
			if control.control == "button" then 
			elseif control.control == "radiobutton" then 
				if index == CONTROL_RB_EVENT then 
					g_ControlCbScreen = values[index].checked 
				elseif index == CONTROL_RB_TEST then 
					g_ControlCbApplication = values[index].checked 
				elseif index == CONTROL_RB_SPARE then 
					g_ControlCbFocus = values[index].checked 
				end
			elseif control.control == "checkbox" then 
				if index == CONTROL_CB_WINDOWS then 
					OutputDebugInfo("----WINDOWS selected: ".. values[index].checked) 
					g_ControlCbWindows = values[index].checked 
 				elseif index == CONTROL_CB_MSAA then 
					OutputDebugInfo("----MSAA selected: ".. values[index].checked) 
					g_ControlCbMsaa = values[index].checked 
 				elseif index == CONTROL_CB_UIA then 
					OutputDebugInfo("----UIA selected: ".. values[index].checked) 
					g_ControlCbUia = values[index].checked 
 				elseif index == CONTROL_CB_AREA then 
					OutputDebugInfo("----AREA selected: ".. values[index].checked) 
					g_ControlCbArea = values[index].checked 
 				elseif index == CONTROL_CB_DOM then 
					OutputDebugInfo("----DOM selected: ".. values[index].checked) 
					g_ControlCbDom = values[index].checked 
				end
			elseif control.control == "edit" or control.control == "combobox" then 
--!				OutputDebugInfo(wstring.format(L"%S, content = %s", control.control, values[index].content)) 
			elseif control.control == "list" then 
--!				OutputDebugInfo(control.control ..  ", selected = " .. values[index].selected .. ", items=" .. #values[index].items) 
				for item_index, item in ipairs(values[index].items) do 
--!				  OutputDebugInfo(wstring.format(L"%d name = %s value = %d", item_index, item.name, item.data)) 
				end 
			else 
--!				OutputDebugInfo(control.control) 
			end 
		end 
	--]]

--[[--------------------------------------------------------------------------------
DialogCallback is the common routine used by all the dialogs to output some debug oriented information
	* location is a string to identify the specific dialog call back routine
	* event  One of the following event codes: 
	  - EVENT_DIALOG_START (Dialog started) 
	  - EVENT_DIALOG_OK (User pressed the OK button) 
	  - EVENT_DIALOG_CANCEL (User pressed the Cancel button) 
	  - EVENT_DIALOG_COMMAND (User updated a control in the dialog, whose index in the controls table in the
		initial call to Dialog.Custom is passed through the id parameter) 
	  -	EVENT_DIALOG_NOTIFICATION (Currently only fires when the selection in a list box has changed as a result
		of user input - LBN_SELCHANGE) 
	* id  The index of the control from the controls table in the initial call to Dialog.Custom. (Only valid with EVENT_DIALOG_COMMAND) 
	* window  The window handle of the control. (Only valid with EVENT_DIALOG_COMMAND) 
	* notification  Currently only valid with EVENT_DIALOG_NOTIFICATION 
--]]
function DialogCallback(location, event, id, window, notification) 
	myEvent = event														--make them persistant
	local msg = location .. " event: " .. event
   
	if event == EVENT_DIALOG_START then msg = msg .. " (Dialog Started)"
	elseif event == EVENT_DIALOG_OK then  msg = msg .. " (Dialog Pressed OK)"
	elseif event == EVENT_DIALOG_CANCEL then  msg = msg .. " (Dialog Pressed Cancel)"
	elseif event == EVENT_DIALOG_NOTIFICATION then
		msg = msg ..  " (Dialog Listbox changed)"
		msg = msg .. " notification: " .. tostring(notification)
		myNotification = notification									--make them persistant
	elseif event == EVENT_DIALOG_COMMAND then
		msg = msg ..  " (Dialog Control updated)"
		msg = msg .. "\tid: " .. tostring(id) .. "\twindow: " .. tostring(window)
		myId, myWindow = id, window										--make them persistant
	end 
	OutputDebugInfo( msg, OUT_MEDIUM)
end -- DialogCallback


--[[--------------------------------------------------------------------------------
TopDialog allows to set some overall values bnas of dome listboxes, i.e.:
 - the Debug level
 - the Debug Delay level
In addition, the next level action can be selected by menas of a button , i.e.:

--]]
function TopDialogCallback( event, id, window, notification) 
	DialogCallback( "TopDialogCallback()", event, id, window, notification) 
end -- TopDialogCallback


--[[ old left over code to t on checkboxes and the like
  possibly usable when these controls are reinstated
--]]
function RememberMe()
	if event == EVENT_DIALOG_COMMAND then 
--		OutputDebugInfo({"TopDialog Control updated:: id =", id, "control =", top_controls[id].control}, OUT_LOW) 
		if top_controls[id].control == "button" then 
		elseif top_controls[id].control == "radiobutton" then 
			for i = 2, 4 do top_controls[i].selected = 0 end
			top_controls[id].selected = 1
			if id == 2 then -- CONTROL_RB_EVENT then 
				OutputDebugInfo("Event selected") 
----				top_controls[CONTROL_RB_TEST].selected = 1 			-- select radiobutton labelled Test
--!			local checked = Dialog.CheckboxGet(window) 
--!			local enable = 0 
--!			if checked == BST_CHECKED then 
--!				enable = 1 
--!			end 
--!			-- Enable / disable radio controls 
--!			-- depending on the checkbox status. 
--!			for radio = CONTROL_RB_TEST, CONTROL_AUTOLENS do 
--!				Dialog.EnableControl(radio, enable) 
--!			end 
			elseif id == 3 then -- CONTROL_RB_TEST then 
				OutputDebugInfo("Test selected") 
			elseif id == 4 then -- CONTROL_RB_SPARE then 
				OutputDebugInfo("Spare selected") 
--		elseif id == CONTROL_TEST1 then 
--!			-- 'Add' button 
--!			-- Get text from the edit area.  
--!			local text = Dialog.GetControlText(CONTROL_EDIT) 
--!			-- Get window handle for the list box. 
--!			local list_box = Dialog.GetControl(CONTROL_LIST) 
--!			if list_box ~= nil then 
--!				local index = Dialog.ListAdd(list_box, text) 
--!				if index ~= LB_ERR then 
--!					Dialog.ListSetItemData(list_box, index, index + 1) 
--!					Dialog.ListSetSelected(list_box, index) 
--!					Dialog.EnableControl(CONTROL_TEST2, 1) 
--!				end 
--!			end 
--		elseif id == CONTROL_TEST2 then 
--			OutputDebugInfo("myTest_c()")
--!			-- 'Remove' button 
--!			-- Get window handle for the list box. 
--!			local list_box = Dialog.GetControl(CONTROL_LIST) 
--!			local item = Dialog.ListGetSelected(list_box) 
--!			if item ~= LB_ERR then 
--!				Dialog.ListRemove(list_box, item) 
--!				if Dialog.ListGetCount(list_box) == 0 then 
--!					Dialog.EnableControl(id, 0) 
--!				end         
--!			end 
			end 
		end 
	end 
end -- RememberMe


--[[--------------------------------------------------------------------------------
--]]
function EventDialogCallback(event, id, window, notification) 
	DialogCallback( "EventDialogCallback()", event, id, window, notification) 

	local value = nil
	if id == 2 then
		OutputDebugInfo({"None button"}, OUT_HIGH) 
		value = 0
	elseif id == 3 then
		OutputDebugInfo({"All button"}, OUT_HIGH) 
		value = 1
	end
	if value then
		dialog_controlTable[2][4].selected = value
		dialog_controlTable[2][5].selected = value
		dialog_controlTable[2][6].selected = value
		dialog_controlTable[2][7].selected = value
		dialog_controlTable[2][8].selected = value
		dialog_controlTable[2][9].selected = value
		dialog_controlTable[2][10].selected = value
		dialog_controlTable[2][11].selected = value
		dialog_controlTable[2][12].selected = value
		dialog_controlTable[2][13].selected = value
		dialog_controlTable[2][14].selected = value
		dialog_controlTable[2][15].selected = value
		dialog_controlTable[2][16].selected = value
		dialog_controlTable[2][17].selected = value
		dialog_controlTable[2][18].selected = value
		dialog_controlTable[2][19].selected = value
		dialog_controlTable[2][20].selected = value
		dialog_controlTable[2][21].selected = value
		dialog_controlTable[2][22].selected = value
	end
end -- EventDialogCallback


--[[--------------------------------------------------------------------------------
--]]
function PropertiesDialogCallback(event, id, window, notification) 
	DialogCallback( "PropertiesDialogCallback()", event, id, window, notification) 
end -- PropertiesDialogCallback


--[[--------------------------------------------------------------------------------
--]]
function TestDialogCallback(event, id, window, notification) 
	DialogCallback( "TestDialogCallback()", event, id, window, notification) 
end -- TestDialogCallback


--[[--------------------------------------------------------------------------------
--]]
function DetectorDialogCallback(event, id, window, notification) 
	DialogCallback( "DetectorDialogCallback()", event, id, window, notification) 
end -- DetectorDialogCallback


--[[--------------------------------------------------------------
the detection function should be located in the script file associated with the map.
This is particularly important when you have maps based on other maps, see the 
Dolphin Scripting Manual, Chain of Scripts for more information. 

Adding the Detection Function from a Script 
Instead of modifying a rule in the map, use the function 
System.AddDetectionFunction to add the detection function to an area.   
System.AddDetectionFunction takes various parameters, including the 
name of the map file, the name of the rule and the number of the target to 
which the detection function should be added. 
--]]		 

local dsCount = 0
function sampleDetectionScript(myArea, myScanCode, myModifier, myDamage)
	dsCount = dsCount + 1
--	local myText = "moved to veeleditvelden.exe.luasample:"..dsCount
--	OutputDebugInfo(myText, OUT_MEDIUM)  
	
--[[return DETECT_HANDLED  --see the manual for the impact of this return status
--]]	
end -- sampleDetectionScript

-- -- Modifiers
--   0	0x00 MODIFIER_NONE
--   1	0x01 MODIFIER_LEFT_CONTROL
--   2	0x02 MODIFIER_RIGHT_CONTROL
--   4	0x04 MODIFIER_LEFT_SHIFT
--   8	0x08 MODIFIER_RIGHT_SHIFT
--  16	0x10 MODIFIER_LEFT_ALT
--  32	0x20 MODIFIER_RIGHT_ALT
--  64	0x40 MODIFIER_CUSTOM
-- 128	0x80 MODIFIER_SHIFT



--VF_zoekenDebugReport	VF_zoeken.lua			RAlt-RShift-B	app specific debug report routine, should call general debug report routine in engineering, if enginering present
--DebugLevelModify		BabbageSupport.lua		RCtrl-B			cycles through set of DebugLevel values
--DebugDelayModify 		BabbageSupport.lua		RAlt-B			cycles through set of DebugSleep values
--DebugMark 			BabbageSupport.lua		RAlt-T			places a mark in the log file
--DebugExtra 			BabbageEngineering.lua	RCtrl-RShift-X	whatever special of the day 

	--!  local enabled = 0 
	--!  if enabled == 0 then 
	--!    -- Grey out radios on startup. 
	--!    for radio = 3, 6 do 
	--!      controls[radio].disabled = 1 
	--!    end 
	--!  end 


-- local SCRIPT_NAME


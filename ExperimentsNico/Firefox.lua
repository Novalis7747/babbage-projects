-- Dolphin Script File for Firefox.exe
--
-- Dolphin Script File to test interfacing to a DLL and magnification manipulation as a joint SN-NVDA
-- adventure
-- Contains also a LUA custom_dialog() experiment (totally unrelated to DLL's and magnification experiment)

	--ToDo close the DLL at exit of this app


require "strict" -- Variables must be declared, use during debugging.
require "windows_functions"			--ToDo Really needed ?
require "dolphin"
require "BabbageSupport"

local SCRIPT_NAME = "Firefox_BabDll"
local SCRIPT_TIMESTAMP = "2015/09/17 9:25"

-- Constants
DEBUGLEVEL = 9
local DllTest_DebugCount = 0				-- Debug Convenience

local MY_TIMER_ID = 543		--nv apparently 501 can conflict with MS Word
local timerFlag = false
local my_x = 0					--cursor coordinates
local my_y = 0
local my_old_x = my_x - 1
local my_old_y = my_y - 1

sBABBAGETESTDLL = L"c:\\NVDA\\BabDll.dll"	--L"BabDll.dll"  must share with NVDA
sBABBAGETESTDLL = L"BabDll.dll"	
sBABBAGETESTDLLPATH = nil

local position = System.AllocateUserData(16) -- Set up a buffer to receive 2 64-bits ints
local dll_handle
local dll_params = {position}

--cope with the chaining of EventScriptStartup functions
DllTest_Startup = System.GetFunction("EventScriptStartup")	

local funTable
local dll_function

-- Store the original function to call later on
_extension_BabDll_startup_event = System.GetFunction("EventScriptStartup")

-- -----------------------------------------------------------------------------
-- Event handlers
function EventScriptStartup ()
	local msg = string.format( "SOD_"..SCRIPT_NAME, string.format( "---------------- %s ----------------", os.date()))
	OutputDebugInfo( msg )	

	-- Set file paths
	setFilePaths()
	
	--can't initialise this at load time because then callDll0 etc are not yet known
	funTable = {[KEY_0] = callDll0,		--toggle timer
				[KEY_1] = callDll1,		--!!CURRENTLY!! BabbageGetPosition and NO "move the mouse there"
-- 				[KEY_2] = callDll2,		--report current magnifivation settings
-- 				[KEY_3] = callDll3,		--PARAM_MAG_HOOKS experiment
-- 				[KEY_4] = callDll4,		--MAG_CMD... experiment
-- 				[KEY_5] = callDll5,		--LUA custom_dialog() experiment (totally unrelated to DLL's and magnification experiemnt)
-- 				[KEY_6] = callDll6,		--report BabbageGetPosition
-- 				[KEY_1] = callDll7,		--toggle SETTING_MAGNIFICATION_ON
-- 				[KEY_8] = callDll8,		--call BabbageSetPosition function of DLL with 2 fake values
-- 				[KEY_9] = callDll9,		--[[report MousePosition
-- 										    left-shift:  move x,y by +1
-- 										    right-shift: move x,y by -1 --]]
				}
	--some debug output to see the funTable
 	for k,v in pairs(funTable) do OutputDebugInfo({tostring(k),tostring(v)}) end

	--ToDo check wheteher you can initialise this at load time
	dll_function = {dll_name = sBABBAGETESTDLLPATH,
					function_name = "",
					standard_call = 0,
					return_user_data = 0, --with 1 you could possibly return a structure
					parameters = 1,
					keep_open = 1}


	if _extension_BabDll_startup_event ~= nil then
		_extension_BabDll_startup_event()
	end
end


-- -----------------------------------------------------------------------------
-- EventScriptCloseDown
-- At close down cleanup and collect garbage to prevent SuperNova crash
--[[The Dolphin Scripting manual states:
	"A script file is loaded when the associated application first loads. It stays loaded in memory until the
	application is closed or until you close the access software"
	This is plainly not true because EventScriptCloseDown is not called when the application closes but it is
	called twice when the application re-opens. In other words, to me (nv) EventScriptCloseDown seems a pretty
	worthless function
	P.S. of corse the quoted statement above does not say anything about unloading, it merely suggests the
	script is unloaded
--]]	
_extension_BabDll_eventscriptclosedown = System.GetFunction("EventScriptCloseDown")
function EventScriptCloseDown()	
	OutputDebugInfo({SCRIPT_NAME, "EventScriptCloseDown"}, 1)
	System.StopTimer(MY_TIMER_ID)
	collectgarbage("collect")
	if _extension_BabDll_eventscriptclosedown then _extension_BabDll_eventscriptclosedown() end
end

-- -----------------------------------------------------------------------------
function EventApplicationDeactivated()
	OutputDebugInfo({SCRIPT_NAME, "EventApplicationDeactivated"}, 1)
	--[[Too Bad, EventApplicationDeactivated is not called reliable
	System.StopTimer(MY_TIMER_ID)
	--]]
end

-- -----------------------------------------------------------------------------
function EventApplicationActivated()
	OutputDebugInfo({SCRIPT_NAME, "EventApplicationActivated"}, 1)
	--[[Too Bad, EventApplicationAactivated is not called reliable
	System.StartTimer(1000, TIMER_MULTIPLE, MY_TIMER_ID)
	--]]
end

-- -----------------------------------------------------------------------------
-- Set paths to DLL file 
function setFilePaths()

	local sFilePath = nil

	sFilePath = System.GetInfo(INFO_SCRIPT_DATA_PATH)
	if sFilePath ~= nil then 
		sBABBAGETESTDLLPATH = sFilePath .. L"\\" .. sBABBAGETESTDLL
	else
		sBABBAGETESTDLLPATH = sBABBAGETESTDLL
	end
--! 		sBABBAGETESTDLLPATH = sBABBAGETESTDLL		-- must share with NVDA, so fall back at hard coded path
	OutputDebugInfo({SCRIPT_NAME, "Dll-path:", tostring(sBABBAGETESTDLLPATH)}, 1)
end

-- -----------------------------------------------------------------------------
function printMagnificationSettings( s )
	OutputDebugInfo({SCRIPT_NAME,"MagnificationSettings", 
	"s:", tostring(s),
	"\non: ", tostring(s.on),
	"\nimage_smoothing: ", tostring(s.image_smoothing),
	"\ncolour_changer: ", tostring(s.colour_changer),
	"\nhooked_areas: ", tostring(s.hooked_araes),
	"\nx_y: ", tostring(s.x_y),
	"\nx: ", tostring(s.x),
	"\ny: ", tostring(s.y),
	"\ntype: ", tostring(s.type),
	"\norientation: ", tostring(s.orientation),
	"\nenhanced_doc_read: ", tostring(s.enhanced_doc_read) },1)	
end

-- -----------------------------------------------------------------------------
-- EventApplicationTimer
-- handles timer events 
-- Because the timer fires regardless whether the application coresponding with the script has focus, we need
-- some logic to ignore timer events when the applivcation has no focus. This is done based on the class
-- At every timer tick, callDll1 is invoked to bring the mouse to the coordinates specified via
-- BabbageGetPosition. !!!Note check wheteher callDll1 is dummified by out-commenting some code in callDll1 !!! 
-- If BabbageGetPosition reported new coordinates, the new and old coordinates are logged

--cope with the chaining of EventApplicationTimer functions
at_eventapplicationtimer = System.GetFunction("EventApplicationTimer")
function EventApplicationTimer (timer_id)

	if timer_id == MY_TIMER_ID then
		local hWndFocus = System.GetFocus()
		if not hWndFocus then return EVENT_PASS_ON end
--! 		OutputDebugInfo({SCRIPT_NAME,"EventApplicationTimer:ClassName", tostring(System.GetClassName(hWndFocus))},1)	
		if not (System.GetClassName(hWndFocus) == L"MozillaWindowClass") then return EVENT_PASS_ON end
		--[[ copied from
			if not System.GetClassName(hWndFocus) == L"Internet Explorer_Server" then return nil end
			but SN trainings mode suggests to me: class=IEFrame
		--]]
--! 		OutputDebugInfo({SCRIPT_NAME,"EventApplicationTimer:ClassName", tostring(System.GetClassName(hWndFocus))},1)	
	
		callDll1();		--update my_x, my_y
		if ( my_x ~= my_old_x or my_y ~= my_old_y ) then
			OutputDebugInfo({SCRIPT_NAME,"EventApplicationTimer", my_x, my_y, "<--", my_old_x, my_old_y},1)	
			my_old_x = my_x
			my_old_y = my_y
		end
	end
	
	if at_eventapplicationtimer then at_eventapplicationtimer(timer_id) end
	return EVENT_PASS_ON
end

-- -----------------------------------------------------------------------------
--[[ EventApplicationKeyPress
		intercept the keys Alt-0 through 8 or whatever
		This seems more reliable then regsitering the keys at SOD but I assume intercepting this way has more
		impact on performance
]]--	 
function EventApplicationKeyPress (scancode, modifier)

	DllTest_DebugCount = DllTest_DebugCount + 1
-- 	OutputDebugInfo( string.format("count: %d key: %d", DllTest_DebugCount, scancode))  
	if ( scancode == KEY_0 or ( KEY_1 <= scancode and scancode <= KEY_1 )) and 
			 System.BitwiseAnd( modifier, MODIFIER_LEFT_ALT) ~= 0  then

--  		OutputDebugInfo({scancode,tostring(funTable[scancode])}) 
		funTable[scancode](scancode, modifier)
	else
--  		OutputDebugInfo( string.format("key: %d ignored", scancode))  --this seems to be too much for dolphin to handle
	end
	return EVENT_PASS_ON  --!	return EVENT_HANDLED
end

-- -----------------------------------------------------------------------------
--[[ callDll0
		toggle timer
--]]		
function callDll0()
	timerFlag = not timerFlag
	local rc
	if timerFlag then rc = System.StartTimer(1000, TIMER_MULTIPLE, MY_TIMER_ID)
	else rc = System.StopTimer(MY_TIMER_ID)	
	end
	OutputDebugInfo( string.format("TimerFlag: %s  Start/Stop timer result: %d",tostring(timerFlag), rc))
end
 
-- -----------------------------------------------------------------------------
--BabbageGetPosition 
--!!! move the mouse there TEMPORARILY?? commented out
--ToDo reconsider whose responsibity (NVDA or SN) it is to move which focus where
function callDll1(scancode, modifier)
	dll_function.function_name = "BabbageGetPosition"
--! 	local position = System.AllocateUserData(8) -- Set up a buffer to receive 2 ints
--! 	local dll_params = {position}
	local iReturnCode = System.CallDllFunction (dll_function, dll_params)

	-- Now decode the result, note that values are 16-bit
	local temp -- To access the structure members
	my_x = System.BitwiseAnd(System.UserDataToNumber(position), 65535)
	temp = System.GetUserDataAtOffset (position, 4)   --!!!!why still 4 while I think I changed to 64 bits long !!!!!!!
	my_y = System.BitwiseAnd(System.UserDataToNumber(temp),65535)

--! 	local mouse_x, mouse_y = System.GetMousePosition ()
--! 	OutputDebugInfo( string.format("GetMousePosition x:y=%d:%d", mouse_x, mouse_y) )	
	local absolute = 1
 	System.MoveMouseTo(my_x, my_y, absolute)
-- 	VF.ChooseFocus(FOCUS_ROUTE_TO_MOUSE)
--! 	local mouse_x, mouse_y = System.GetMousePosition ()
--! 	OutputDebugInfo( string.format("GetMousePosition x:y=%d:%d", mouse_x, mouse_y) )	
end


function callDll1_disabled()
	local old = Settings.GetMagnification(SETTING_MAGNIFICATION_ON)
	local new = 1 -old
	local rc = Settings.SetMagnification(SETTING_MAGNIFICATION_ON, new)
	OutputDebugInfo( string.format("SETTING_MAGNIFICATION_ON: %d --> %d status: %s", old, new, tostring(rc)))
end
 
 
--
-- -----------------------------------------------------------------------------
--report current magnification settings
function callDll2()
	local s = Settings.GetMagnificationAll()
	printMagnificationSettings( s )
end
 
 
-- -----------------------------------------------------------------------------
--PARAM_MAG_HOOKS experiment
function callDll3()
--! 	local count = Focus.GetCount()			--works only in detection scripts
	local magHook = System.BitwiseAnd( DllTest_DebugCount, 1)
	Param.Set( PARAM_MAG_HOOKS, magHook) 
	OutputDebugInfo( "PARAM_MAG_HOOKS: " .. magHook )	
end
 
-- -----------------------------------------------------------------------------
--MAG_CMD... experiment
function callDll4(scancode, modifier)
	local cmd = ( System.BitwiseAnd( modifier, MODIFIER_LEFT_SHIFT) == 0) and MAG_CMD_MOVE_DOWN or MAG_CMD_MOVE_UP
	cmd = ( System.BitwiseAnd( modifier, MODIFIER_LEFT_SHIFT) == 0) and MAG_CMD_MOD_INC_X or MAG_CMD_MOD_INC_Y
	cmd = ( System.BitwiseAnd( modifier, MODIFIER_LEFT_SHIFT) == 0) and MAG_CMD_MOD_DEC_X or MAG_CMD_MOD_DEC_Y
	cmd = MAG_CMD_MOD_ORIENTATION
	cmd = MAG_CMD_MOD_TRACKING
	cmd = MAG_CMD_HIGHLIGHT
	Mag.ExecuteCommand(cmd)
	OutputDebugInfo( {"CMD: ", cmd, scancode, modifier, MODIFIER_LEFT_SHIFT, MAG_CMD_MOVE_DOWN, MAG_CMD_MOVE_UP}  )	
end
 
-- -----------------------------------------------------------------------------
--LUA Dialog experiment (totally unrelated to DLL's and magnification experiemnt)
function callDll5()
	OutputDebugInfo( "custom_dialog entry")	
	custom_dialog()
	OutputDebugInfo( "custom_dialog exit")	
end

-- -----------------------------------------------------------------------------
--report BabbageGetPosition
function callDll6()
	dll_function.function_name = "BabbageGetPosition"
-- 	local position = System.AllocateUserData(8) -- Set up a buffer to receive 2 ints
-- 	local dll_params = {position}

	local iReturnCode = System.CallDllFunction (dll_function, dll_params)

	-- Now decode the result, note that values are 16-bit
	local temp -- To access the structure members
	local x = System.BitwiseAnd(System.UserDataToNumber(position), 65535)
	temp = System.GetUserDataAtOffset (position, 4)
	local y = System.BitwiseAnd(System.UserDataToNumber(temp),65535)

	OutputDebugInfo( string.format("BabbageGetPosition rc=%d x:y=%d:%d", iReturnCode, x , y) )	
end
 
-- -----------------------------------------------------------------------------
--toggle SETTING_MAGNIFICATION_ON
function callDll7()
	local old = Settings.GetMagnification(SETTING_MAGNIFICATION_ON)
	local new = 1 -old
	local rc = Settings.SetMagnification(SETTING_MAGNIFICATION_ON, new)
	OutputDebugInfo( string.format("SETTING_MAGNIFICATION_ON: %d --> %d status: %s", old, new, tostring(rc)))
end
 

-- -----------------------------------------------------------------------------
--[[callDll8 
--	call BabbageSetPosition function of DLL with 2 fake values
--	values are diffrent at each call
--]]
function callDll8()
	dll_function.function_name = "BabbageSetPosition"
-- 	local position = System.AllocateUserData(8) -- Set up a buffer to receive 2 ints
-- 	local dll_params = {position}

	-- Now encode the data, note that values are 32-bit
	System.NumberToUserData(position, DllTest_DebugCount)
	local temp -- To access the 2nd field of the structure
	temp = System.GetUserDataAtOffset (position, 4)
	System.NumberToUserData(temp, DllTest_DebugCount*2)
	local iReturnCode = System.CallDllFunction (dll_function, dll_params)
	OutputDebugInfo( string.format("BabbageSetPosition rc=%d x:y=%d:%d", iReturnCode,DllTest_DebugCount ,DllTest_DebugCount*2) )	
end

-- -----------------------------------------------------------------------------
--[[report MousePosition
    left-shift:  move x,y by +1
    right-shift: move x,y by -1
--]]
function callDll9(scancode, modifier)
	local mouse_x, mouse_y = System.GetMousePosition()
	OutputDebugInfo( string.format("GetMousePosition x:y=%d:%d", mouse_x, mouse_y) )	

	local absolute = 0
	local my_x, my_y = 0, 0
	if ( System.BitwiseAnd( modifier, MODIFIER_LEFT_SHIFT) ~= 0)  then
		my_x = 1
		my_y = 1
	end
	if ( System.BitwiseAnd( modifier, MODIFIER_RIGHT_SHIFT) ~= 0)  then
		my_x = -1
		my_y = -1
	end	
	if ( my_y ~= 0 ) then 
		System.MoveMouseTo(my_x, my_y, absolute)
		mouse_x, mouse_y = System.GetMousePosition()
		OutputDebugInfo( string.format("GetMousePosition x:y=%d:%d", mouse_x, mouse_y) )	
	end

end
 



-- IDs for our custom controls
--nv what a crummy code thaty these values have to match the table entry
CONTROL_MAG_CHECKBOX = 1
CONTROL_FULLSCREEN = 3
CONTROL_SPLITSCREEN = 4
CONTROL_LENS = 5
CONTROL_AUTOLENS = 6
CONTROL_LIST = 7
CONTROL_EDIT = 8
CONTROL_ADD = 9			--nv now a misnomer
CONTROL_REMOVE = 10
CONTROL_OK = 11
CONTROL_CANCEL = 12

-- -----------------------------------------------------------------------------
function custom_dialog()
	local enabled = 0
	-- Define our dialog
	local dialog_params = {title = "Settings", width = 320, height = 120, callback="custom_dialog_callback"}
	-- Table of controls for our dialog
	local controls =
	{
		{control = "checkbox", x = 9, y = 10, width = 100, height = 14, text = "Enable magnification"},
		{control = "group", x = 10, y = 25, width = 80, height = 70, text = "Type:"},
		{control = "radiobutton", x = 20, y = 36, width = 50, height = 14, text = "Full screen"},
		{control = "radiobutton", x = 20, y = 50, width = 50, height = 14, text = "Split screen"},
		{control = "radiobutton", x = 20, y = 64, width = 50, height = 14, text = "Lens"},
		{control = "radiobutton", x = 20, y = 78, width = 50, height = 14, text = "Auto Lens"},
		{control = "list", x = 120, y = 9, width = 100, height = 80, items = {"Initial item"} },
		{control = "edit", x = 120, y = 100, width = 50, height = 14},
		{control = "static", x = 230, y = 9, width = 50, height = 20, text = "Some text..."},
		{control = "button", x = 200, y = 100, width = 30, height = 14, text = "Move&Down"},
		{control = "button", x = 240, y = 100, width = 30, height = 14, text = "&Remove"},
		{control = "button", x = 9, y = 100, width = 50, height = 14, text = "OK", command = ID_OK},
		{control = "button", x = 60, y = 100, width = 50, height = 14, text = "Cancel", command = ID_CANCEL},
	}
	if enabled == 0 then
		-- Grey out radios on startup.
		for radio = 3, 6 do
			controls[radio].disabled = 1
		end
	end

	-- Show the dialog
	local values = Dialog.Custom(dialog_params, controls)
	-- Dump the contents of the dialog value table into the Script Editor’s debug window
	if values ~= nil then
		for index, control in ipairs(controls) do
			if control.control == "button" then
				System.OutputDebugString(control.control .. ", pressed = " .. values[index].pressed)
			elseif control.control == "checkbox" or control.control == "radiobutton" then
				System.OutputDebugString(control.control .. ", checked = " .. values[index].checked)
			elseif control.control == "edit" or control.control == "combobox" then
				System.OutputDebugString(wstring.format(L"%S, content = %s", control.control, values[index].content))
			elseif control.control == "list" then
				System.OutputDebugString(control.control ..  ", selected = " .. values[index].selected .. ", items=" .. #values[index].items)
				for item_index, item in ipairs(values[index].items) do
					System.OutputDebugString(wstring.format(L"%d name = %s value = %d", item_index, item.name, item.data))
				end
			else
				System.OutputDebugString(control.control)
			end
		end
	end
end

-- -----------------------------------------------------------------------------
function custom_dialog_callback(event, id, window)
		System.OutputDebugString("custom_dialog_callback. id = %d", id)
		if event == EVENT_DIALOG_START then
		System.OutputDebugString("Dialog Started...")
	elseif event == EVENT_DIALOG_OK then
		System.OutputDebugString("Pressed OK...")
	elseif event == EVENT_DIALOG_CANCEL then
		System.OutputDebugString("Pressed Cancel...")
	elseif event == EVENT_DIALOG_COMMAND then
		System.OutputDebugString("Update. id = %d", id)
		if id == CONTROL_MAG_CHECKBOX then
			local checked = Dialog.CheckboxGet(window)
			local enable = 0
			if checked == BST_CHECKED then
				enable = 1
			end
			-- Enable / disable radio controls depending on the checkbox status.
			for radio = CONTROL_FULLSCREEN, CONTROL_AUTOLENS do
				Dialog.EnableControl(radio, enable)
			end
		elseif id == CONTROL_ADD then -- 'Add' button --nv now MoveDown
			System.OutputDebugString("MoveDown. id = %d", id)
			local absolute = 0
--! 			VF.ChooseFocus (FOCUS_VF)
--! 	VF.MoveToXY(my_x, my_y)	--does not seem to do what I hoped for
			local mouse_x, mouse_y = System.GetMousePosition()
			OutputDebugInfo( string.format("GetMousePosition x:y=%d:%d", mouse_x, mouse_y) )	
			System.MoveMouseTo(my_x, my_y, absolute)
			mouse_x, mouse_y = System.GetMousePosition ()
			OutputDebugInfo( string.format("GetMousePosition x:y=%d:%d", mouse_x, mouse_y) )	
			Mag.Auto()
--! 			VF.ChooseFocus (FOCUS_BACK)	

		
		
			-- Get text from the edit area.
			local text = Dialog.GetControlText(CONTROL_EDIT)
			-- Get window handle for the list box.
			local list_box = Dialog.GetControl(CONTROL_LIST)
			if list_box ~= nil then
				local index = Dialog.ListAdd(list_box, text)
				if index ~= LB_ERR then
					Dialog.ListSetItemData(list_box, index, index + 1)
					Dialog.ListSetSelected(list_box, index)
					Dialog.EnableControl(CONTROL_REMOVE, 1)
				end
			end
		elseif id == CONTROL_REMOVE then -- 'Remove' button
			-- Get window handle for the list box.
			local list_box = Dialog.GetControl(CONTROL_LIST)
			local item = Dialog.ListGetSelected(list_box)
			if item ~= LB_ERR then
				Dialog.ListRemove(list_box, item)
				if Dialog.ListGetCount(list_box) == 0 then
					Dialog.EnableControl(id, 0)
				end
			end
		end
	end
end



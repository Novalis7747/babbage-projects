local SCRIPT_NAME = "VF_zoeken"
local SCRIPT_TIMESTAMP = "5/11/2017 12:30:45 PM"

-- Copyright (C) 2016-2017 Babbage. All rights reserved.

--[[ future enhancements
	User initiated action to put current x-y , control or even tekst or tekst via edit box in curent window or in specific title section
--]]	


--[[
	the magic characters ^$()%.[]*+-?) needs to be escaped by %

    hardcode keys (may be overridden by QBM)
     - g_VfZoekenKey-C 			CBM (Control Babbage Mode)
     - g_VfZoekenKey-F 			Form Modus
     - g_VfZoekenKey-N 			search next occurence
     - g_VfZoekenKey-Shift-N	search previous occurence
     - g_VfZoekenKey-W 			Window Modus
     - g_VfZoekenKey-; 			search for next entry from ini-file
     - g_VfZoekenKey-shift-; 	search for previous entry from ini-filey
	 - g_VfZoekenKey-Tab		search for next control in CBM
	 - g_VfZoekenKey-shift-Tab	search for previous control in CBM
--]]


-- Dolphin Script File to perform a search for a specific string or control and perform one or more specific actions when found.
-- The Virtual Focus and/or the Area mechanism is used for the search proces
-- The strings and controls to search for are specified in an ini-file. A subset of the controls can be specified in CBM.
-- The strings are presented to the user in a ListBox based dialog
-- The user can then select a string and a number of actions
-- The actions supported by the dialog are:
--   - Alt-Z "zoeken" (search, this is the default action)
--   - Alt-K "zoek en klik" (search and click)
--   - Alt-T "zoek en tab" (search and tab)
-- In addition to the above actions, numerous actions can be specified via the ini-file
-- There are basically 2 ways to invoke the dialog
--   - g_VfZoekenKey-W for Window title-based search
--   - g_VfZoekenKey-F for form-based search
-- MODIFIER_CUSTOM is a Dolphin entity en can be customized. Its default value is the Capslock key.
-- After the initial search, there are 2 possible subsequent searches
-- 1: search again for the just selected string, either in forward or in backward direction.
--    This is tied to the hotkey g_VfZoekenKey-N and g_VfZoekenKey-SHIFT- N respectively
-- 2: search for the string preceding or following the last used string in the ini-file.
--    This is tied to the hotkey g_VfZoekenKey-SEMICOLON and g_VfZoekenKey-SHIFT-SEMICOLON respectively.

-- OutputDebugInfo is defined in BabbageSupport.lua. It writes debugging output to the debug window of the
-- Dolphin script editor and to the log file "operation.log" in the Settings folder.
-- The hotkey ControlRight-B cycles through the predefined logging levels

--[[
Note 1: Supernova turns out to need sometimes a sleep in order to function reliable. When you run during
	development into non-functioning code, adding a sleep is worthwhile as experiment. See the DebugSleep
	calls in this script.
--]]

--[[
	ToDo:
	* make de search optionally case-sensitive
	* actually use [DONOT_]SCROLL_INTO_VIEW in e.g. VF.Move rather then relying on te unspecified default		
		SCROLL_INTO_VIEW = 1
		DONOT_SCROLL_INTO_VIEW = 0

	* investigate these files in VM :
		c:\Users\Tester\AppData\Local\Dolphin\SnovaSuite1505\Settings\scripts\DolphinMozillaFirefox.lua
		C:\ProgramData\dolphin\SnovaSuite1505\defaults\scripts\operations.lua
		C:\ProgramData\dolphin\SnovaSuite1505\defaults\scripts\braille.lua, e.g. Braille.GetCell() as wrapper around ScreenReader object
		C:\ProgramData\dolphin\SnovaSuite1505\defaults\scripts\detect.lua, e.g. Detector.GetFromXY() as wrapper around ScreenReader object
--]]

--[[ Change History
--]]

-- Requirements
require "strict"
require "dolphin"
require "windows_functions"
require "inifile"							--parse ini-file

--VF_zoeken.lua is assumed to be a subsidiary script. The main script should either
-- 'System.Include "BabbageSupportEnc"' or 'require "BabbageSupport"' as appropriate
System.Include "EncTable"					--get the actual serialTable

-- Global environment
local g_VfZoekenKey = MODIFIER_CUSTOM		--configurable via ini-file, default to Dolphin Key
local g_VfZoekenKeyShift = nil
local g_VfZoekenKeyControl = nil



local g_ScriptName = tostring( System.GetInfo( INFO_SCRIPT_NAME))	--get the name of the "main"-script
local g_ProductSerial = System.GetInfo( INFO_PRODUCT_SERIAL, 0)		--get the SN serial number APPARENTLY this fails outside a function in an included script

local BabbageModeOff = 0
local BabbageModeControl = 8
local g_BabbageMode = BabbageModeOff		-- flag to reflect Babbage Mode status (0: off, 8: control)

local g_LicenseFlag = serialUnlicensed		-- to be set via EncTable::validateSerial at licensed, trial or unlicensed
local g_SettingsFile = nil					-- name of actual ini file
local g_defaultSettingsFile = ""			-- name of default ini file
local g_Table = {}							-- ini-file converted to table,
	  										--  - keys are the section names
											--  - values are tables containing the contents of the corresponding section
											-- For performance reasons and ease of coding the 2 g_xxxTables
											-- contain a specific subset of the information in g_Table
local g_FormTable = {}						-- array (i.e. a degraded table) containing all the "form" section-strings in g_Table
local g_TitleTable = {}						-- array (i.e. a degraded table) containing all the "title" section-strings in g_Table
local g_defaultSection = false				-- flag reflecting presence of default section in ini file
local g_action_separator = "@@"				-- (aktie-string) separator in inifile between a compound search-string and its action
local g_comment_separator = ";;"			-- (control-string) separator in inifile, preceeds a control-identifier like AREA_EDIT
local g_control_separator = "##"			-- (control-string) separator in inifile, preceeds a control-identifier like AREA_EDIT
local g_location_separator = "~~"			-- (location-string) separator in inifile, preceeds a x~y coordinaten pair
local g_multiplier_separator = "%-%-"		-- (herhalings-string) separator in inifile between a search-string and its repeat-count
local g_sequence_separator = "%+%+"			-- (volgorde-string) separator in inifile between sub-search-strings in a search-string
local g_TableLength = 0						-- upperlimit for next entry search
local g_TableSelectedIndex = 0				-- index of user selected entry in the list
local g_TableSelectedAction = 0				-- number representing the user selected action to perform after the selected entry is found
local g_TableSearchString = ""
local g_TableSection = ""
local g_TableSearchMultiplier = 0			--
local g_cx, g_cy = nil, nil					-- track last point in order to find next in Q
local g_ctrl = nil							-- track last control searched for



PAGE_STEP = 3 								-- alternative step-size ToDo customizable via ini-file ? 


--[[------------------------------------------------------------------------------
	VF_ZoekenInitialize must be called at SOD from the EventScriptStartup function
	of the script associated with the application to be instrumented
--]]

function VF_ZoekenInitialize()
	-- output SOD message
	OutputDebugInfo({"loaded", SCRIPT_NAME, "dated(", SCRIPT_TIMESTAMP, ") loaded by", g_ScriptName}, OUT_HIGH)

	-- BabbageSupportInitialize()			This is assumed to be called from the main script

	-- check the licensing
	g_ProductSerial = System.GetInfo( INFO_PRODUCT_SERIAL, 0)	--get the SN serial number APPARENTLY this fails outside a function in an included script
	g_LicenseFlag = validateSerial("VF_Zoeken")
--! g_LicenseFlag = serialLicensed								--to enforce running despite license
	if g_LicenseFlag == serialUnlicensed then
		System.Alert("VF_Zoeken will !!!!!NOT!!!! run in evaluation mode\r\ncontact helpdesk@babbage.com to request a license based on your SN serial number and corresponding Supernova license"..g_ProductSerial,
					 "VF_Zoeken not licensed for Supernova serial number",
					 MB_OK)
	else
		if g_LicenseFlag == serialLicensed then
-- 			System.Alert("VF_Zoeken licensed for Supernova serial number "..g_ProductSerial, "Supernova licensed", MB_OK)
		end
		if g_LicenseFlag == serialTrial then
			System.Alert("VF_Zoeken will run in evaluation mode\r\ncontact helpdesk@babbage.com to request a license for VF_Zoeken once you have acquired a SN serial number",
						 "Supernova not licensed",
						 MB_OK)
		end

		--load and parse the ini-file into g_Table
		local folderName = tostring( System.GetInfo( INFO_SCRIPT_DATA_PATH))
		g_defaultSettingsFile = tostring( System.GetInfo( INFO_SCRIPT_NAME))
		g_defaultSettingsFile = string.gsub( g_defaultSettingsFile, "\.lu.$", ".ini")
		g_defaultSettingsFile = string.format("%s\\%s", folderName, g_defaultSettingsFile)
		LoadSettingsFile()

		-- register all the VF_zoeken hotkeys (keys are defined in
		-- c:\ProgramData\dolphin\SnovaSuite1505\defaults\scripts\keyboard.lua
		-- -- Modifiers
		--  0	0x00 MODIFIER_NONE = 0
		--  1	0x01 MODIFIER_LEFT_CONTROL = 1
		--  2	0x02 MODIFIER_RIGHT_CONTROL = 2
		--  4	0x04 MODIFIER_LEFT_SHIFT = 4
		--  8	0x08 MODIFIER_RIGHT_SHIFT = 8
		-- 16	0x10 MODIFIER_LEFT_ALT = 16
		-- 32	0x20 MODIFIER_RIGHT_ALT = 32
		-- 64	0x40 MODIFIER_CUSTOM = 64
		-- -- RegisterScriptKey definitions and flags
		-- 128	0x80 MODIFIER_SHIFT = 128									<<<<<<<!!!!!!!!!!!!!!!!! ?????????????
--;  1	0x01 MODIFIER_LEFT_CONTROL
--;  2	0x02 MODIFIER_RIGHT_CONTROL
--;  4	0x04 MODIFIER_LEFT_SHIFT
--;  8	0x08 MODIFIER_RIGHT_SHIFT
--; 16	0x10 MODIFIER_LEFT_ALT
--; 32	0x20 MODIFIER_RIGHT_ALT
--; 64	0x40 MODIFIER_CUSTOM
--; modifiers kunnen gecombineerd worden, bijvoorbeeld 10 (0x0A) voor RechterControl samen met RechterShift


		registerKey( KEY_CURSOR_UP, g_VfZoekenKey,					"tableMove", "UpArrow")
		registerKey( KEY_CURSOR_UP, g_VfZoekenKeyShift,				"tableMove", "Shift-UpArrow")
		registerKey( KEY_CURSOR_DOWN, g_VfZoekenKey,				"tableMove", "DownArrow")
		registerKey( KEY_CURSOR_DOWN, g_VfZoekenKeyShift,				"tableMove", "Shift-DownArrow")
		registerKey( KEY_CURSOR_LEFT, g_VfZoekenKey,				"tableMove", "LeftArrow")
		registerKey( KEY_CURSOR_LEFT, g_VfZoekenKeyShift,				"tableMove", "Shift-LeftArrow")
		registerKey( KEY_CURSOR_RIGHT, g_VfZoekenKey,				"tableMove", "RightArrow")
		registerKey( KEY_CURSOR_RIGHT, g_VfZoekenKeyShift,			"tableMove", "Shift-RightArrow")
		registerKey( KEY_PAGE_UP, g_VfZoekenKey,					"tableMove", "PageUp")
		registerKey( KEY_PAGE_DOWN, g_VfZoekenKey,			 		"tableMove", "PageDown")
		registerKey( KEY_HOME, g_VfZoekenKey,						"tableMove", "Home")
--		registerKey( KEY_END, g_VfZoekenKey,						"tableMove", "End")
		registerKey( KEY_TAB, g_VfZoekenKey,						"tableMove", "Tab")
		registerKey( KEY_TAB, g_VfZoekenKeyShift,						"tableMove", "Shift-Tab")

		registerKey( KEY_SEMICOLON, g_VfZoekenKey,		   "augmentEntrySearch", "PerformIncrementalEntrySearch")
		registerKey( KEY_SEMICOLON, g_VfZoekenKeyShift,	   "augmentEntrySearch", "PerformIncrementalEntrySearch")

		registerKey( KEY_A, g_VfZoekenKey,					"VF_zoekenKeyPress", "KEY_A")
		registerKey( KEY_B, g_VfZoekenKey, 		  	 		"VF_zoekenKeyPress", "KEY_B")
		registerKey( KEY_C, g_VfZoekenKey,					"VF_zoekenKeyPress", "KEY_C BCM")
		registerKey( KEY_D, g_VfZoekenKey,					"VF_zoekenKeyPress", "KEY_D")
		registerKey( KEY_E, g_VfZoekenKey,					"VF_zoekenKeyPress", "KEY_E")
		registerKey( KEY_F, g_VfZoekenKey,					"VF_zoekenKeyPress", "KEY_F PerformFormSearch")
		registerKey( KEY_G, g_VfZoekenKey,					"VF_zoekenKeyPress", "KEY_G")
		registerKey( KEY_H, g_VfZoekenKey,					"VF_zoekenKeyPress", "KEY_H")
		registerKey( KEY_I, g_VfZoekenKey,					"VF_zoekenKeyPress", "KEY_I")
		registerKey( KEY_J, g_VfZoekenKey,					"VF_zoekenKeyPress", "KEY_J")
		registerKey( KEY_K, g_VfZoekenKey,					"VF_zoekenKeyPress", "KEY_K")
		registerKey( KEY_L, g_VfZoekenKey,					"VF_zoekenKeyPress", "KEY_L")
		registerKey( KEY_M, g_VfZoekenKey,					"VF_zoekenKeyPress", "KEY_M")
		registerKey( KEY_N, g_VfZoekenKey,					"VF_zoekenKeyPress", "KEY_N PerformForwardSearch")
		registerKey( KEY_N, g_VfZoekenKeyShift,				"VF_zoekenKeyPress", "Shift-KEY_N PerformBackwardSearch")	
		registerKey( KEY_N, g_VfZoekenKeyControl,				"VF_zoekenKeyPress", "Shift-KEY_N PerformAllSearch")	
		registerKey( KEY_O, g_VfZoekenKey,					"VF_zoekenKeyPress", "KEY_O")
		registerKey( KEY_P, g_VfZoekenKey,					"VF_zoekenKeyPress", "KEY_P")
		registerKey( KEY_Q, g_VfZoekenKey,					"VF_zoekenKeyPress", "KEY_Q")
		registerKey( KEY_R, g_VfZoekenKey,					"VF_zoekenKeyPress", "KEY_R")
		registerKey( KEY_S, g_VfZoekenKey,					"VF_zoekenKeyPress", "KEY_S")
		registerKey( KEY_T, g_VfZoekenKey,					"VF_zoekenKeyPress", "KEY_T")
		registerKey( KEY_U, g_VfZoekenKey,					"VF_zoekenKeyPress", "KEY_U")
		registerKey( KEY_V, g_VfZoekenKey,					"VF_zoekenKeyPress", "KEY_V")
		registerKey( KEY_W, g_VfZoekenKey,					"VF_zoekenKeyPress", "KEY_W window mode")
		registerKey( KEY_X, g_VfZoekenKey,					"VF_zoekenKeyPress", "KEY_X")
		registerKey( KEY_Y, g_VfZoekenKey,					"VF_zoekenKeyPress", "KEY_Y")
		registerKey( KEY_Z, g_VfZoekenKey,					"VF_zoekenKeyPress", "KEY_Z")

		local hotkey_modifier = System.BitwiseOr( MODIFIER_RIGHT_SHIFT, MODIFIER_RIGHT_ALT)
		registerKey( KEY_B, hotkey_modifier,			 	"VF_zoekenDebugReport", "VF_zoekenDebugReport")
	end
end --  VF_ZoekenInitialize


--[[------------------------------------------------------------------------------
--]]
function tableMove( scancode, modifier)
	local myArea, prevArea = nil, nil
	local count = 1
	if scancode ~= KEY_TAB then 									-- don't repeat Shift-Tab
		if modifier == g_VfZoekenKeyShift then count = 99 end 		-- this should be effectively infinite
	end
--	if scancode == KEY_END then
--		count = 99							-- this should be effectively infinite
--		scancode = KEY_CURSOR_DOWN
--	end
	if scancode == KEY_PAGE_DOWN then
		count = PAGE_STEP 
		scancode = KEY_CURSOR_DOWN
	end
	if scancode == KEY_PAGE_UP then 
		count = PAGE_STEP 
		scancode = KEY_CURSOR_UP
	end
	OutputDebugInfo({"-------------------- tableMove():: count", count, vf_zoeken_reportScancode( scancode, modifier)}, OUT_MEDIUM)
	for i = 1, count do 
		--ToDo this seems rather a lot of work when count <> 1
		local myAreaPrev, myAreaUp, myAreaLeft
		local appArea = Area.GetCurrentApplication()
		if scancode ~= KEY_HOME then							-- KEY_HOME will perform a new initial search for AREA_EDIT etc
			myArea, myAreaPrev, myAreaUp, myAreaLeft = locateArea( appArea)

			OutputDebugInfo({"tableMove() #", i, "areas:", tostring(myArea), "-", tostring(myAreaPrev), "-", tostring(myAreaUp), "-", tostring(myAreaLeft)}, OUT_LOW)
		end
		if myArea == nil then	--ToDo strange, you will allways get this if you reach the boundary
			g_cx, g_cy = nil, nil 								-- reset last point in order to find next in Q this is my cheap way out Dolphin crashing on repeated failing searches
			OutputDebugInfo({"!! tableMove:: locateArea failed, let's try to locate a new anchor as a (hopefully) workaround (also against Dolphin hangup's?)"}, OUT_MEDIUM)
			myArea = 
			PerformGotoControl( "AREA_EDIT") or					-- let's be pro-active and do it ourselves	ToDo discuss the appropriateness
			PerformGotoControl( "AREA_CONTROL") or
			PerformGotoControl( "AREA_CHECK_CONTROL") or
			PerformGotoControl( "AREA_CHECKBOX")
			OutputDebugInfo({"!! tableMove:: locateArea failed to locate a new anchor"}, OUT_HIGH, myArea == nil)
			break
		else
			if scancode == KEY_CURSOR_DOWN		then myArea = tableDown( appArea, myArea) 
			elseif scancode == KEY_CURSOR_UP	then myArea = myAreaUp
			elseif scancode == KEY_CURSOR_RIGHT	then myArea = tableRight( appArea, myArea)
			elseif scancode == KEY_CURSOR_LEFT 	then myArea = myAreaLeft
			elseif scancode == KEY_TAB			then 
				if modifier == g_VfZoekenKeyShift then myArea = myAreaPrev
				else myArea = Area.FindNextType( appArea, g_ctrl, {0}, SORT_ROWS, myArea)
				end
			else
				OutputDebugInfo({"!!tableMove():: invalid scancode"}, OUT_MEDIUM)
				break
			end
		end
		if myArea then 								-- update anchor for each succesful step of a PgUp/Down move
			prevArea = myArea
			local p = Area.GetProperties( myArea) or nilProperties
			g_cx, g_cy = Utils.RectCenter( p)		-- screen coordinates
		else
			myArea = prevArea 						--if PgUp/Down hit the boundary, invoke routeLiveToVF for that cell
			break
		end
	end
	if myArea == nil then
		OutputDebugInfo({"!! tableMove():: mismatch or no predecessor/successor"}, OUT_MEDIUM)
	else
		local p = Area.GetProperties( myArea) or nilProperties
		local msg = "tableMove():: Area:: l:t:r:b:"..p.left..":"..p.top..":"..p.right..":"..p.bottom.." center="..g_cx..":"..g_cy
		msg = msg.." hwnd:"..tostring( p.hwnd).." type:"..tostring( p.type).." text:"..tostring( p.text)
		OutputDebugInfo({msg}, OUT_MEDIUM)
		routeLiveToVF( "tableMove")
	end
	return myArea
end -- tableMove

--[[------------------------------------------------------------------------------
	function tableDown( 
--]]
function tableDown( appArea, myArea)
	repeat
		myArea = Area.FindNextType( appArea, g_ctrl, {0}, SORT_ROWS, myArea)
		if myArea == nil then break end 
		local p = Area.GetProperties( myArea) or nilProperties
		if p.left < g_cx and g_cx < p.right then							--found a control which is not within the same row
			break
		else
--			OutputDebugInfo({"tableDown: presumably a match but not at the right location"})
		end
	until myArea == nil
	return myArea
end -- tableDown


--[[------------------------------------------------------------------------------
	function tableRight( )
--]]
function tableRight( appArea, myArea)
	repeat
		myArea = Area.FindNextType( appArea, g_ctrl, {0}, SORT_ROWS, myArea)
		if myArea == nil then break end 
		local p = Area.GetProperties( myArea) or nilProperties
		local cx, cy = Utils.RectCenter( p)			-- screen coordinates
		if p.bottom > g_cy and g_cy > p.top then	--found a control which is not within the same column
			break
		else
			local msg = "tableRight: presumably a match but not at the right location"
			msg = msg.."\r\nmyArea:: l:t:r:b:"..":"..p.left..":"..p.top..":"..p.right..":"..p.bottom.." center="..cx..":"..cy
			msg = msg.." hwnd:"..tostring( p.hwnd).." type:"..tostring( p.type).." text:"..tostring( p.text)
			OutputDebugInfo({msg}, OUT_LOW )
		end
	until myArea == nil
	return myArea
end -- tableRight


--[[------------------------------------------------------------------------------
	function locateArea( searchArea)
	at return:
	 myArea == nil: no area matching g_cx:g_cy is found 
	 myAreaUp area above in same column (if any)
	 myAreaLeft area to the left at same row (if any)
	 myAreaPrev area "before" myArea in the left-to-right-and-top-to-bottom fashion of VF (if any)
	 Note: if myArea == nil
--]]
function locateArea( searchArea)
	local msg = ""
	local myArea, myAreaPrev, myAreaUp, myAreaLeft = nil, nil, nil, nil
	local logLvl = OUT_LOW

	if searchArea == nil then
		logLvl = OUT_HIGH								--raise loglevel in case of Dolphin or script error
		msg = "!!!! locateArea(): no searchArea"
		playSound(5)									--Dolphin or script error
	else
		if g_ctrl then   --if g_ctrl is non-nil , so are presumably g_cx and g_cy
			myArea = Area.FindFirstType( searchArea, g_ctrl, {0}, SORT_ROWS)
			if myArea == nil then
				playSound(4)							--user "error"
				msg = "!! locateArea(): FindFirstType failed for "..AreaTypeTable[g_ctrl].." ("..g_ctrl..")"
			end
		end
	end
	while myArea do
		local p = Area.GetProperties( myArea) or nilProperties
		local cx, cy = Utils.RectCenter( p)				-- screen coordinates
		if cx == g_cx and cy == g_cy then
			msg = "locateArea(): match for "..g_cx..":"..g_cy
			break
		elseif p.left < g_cx and g_cx < p.right then	--a potential column based predecessor
			myAreaUp = myArea
			OutputDebugInfo({"locateArea():  x-match found:", cx, cy, "target:", g_cx, g_cy}, OUT_LOW)
		elseif p.top < g_cy and g_cy < p.bottom then	--a potential row based predecessor
			myAreaLeft = myArea
			OutputDebugInfo({"locateArea():  y-match found:", cx, cy, "target:", g_cx, g_cy}, OUT_LOW)
		else
			OutputDebugInfo({"locateArea(): mismatch found:", cx, cy, "target:", g_cx, g_cy}, OUT_LOW)
		end
		myAreaPrev = myArea
		myArea = Area.FindNextType( searchArea, g_ctrl, {0}, SORT_ROWS, myArea)
	end
	OutputDebugInfo({ msg}, logLvl)
	return myArea, myAreaPrev, myAreaUp, myAreaLeft
end -- locateArea


--[[------------------------------------------------------------------------------
--]]
function routeLiveToVF( caller)
	if caller == nil then caller = "routeLiveToVF()" end
		myWrapper( VF.ChooseFocus, caller.."::VF.ChooseFocus", FOCUS_ROUTE_TO_LIVE)
		myWrapper( VF.MoveToXY, caller.."::VF.MoveToXY",  g_cx, g_cy)
--! 		local x = true
--! 		local x = false
--! 		if x then -- eXperiment
--! 			myWrapper( VF.Action, caller.."::VF.Action( CLICK_MOVE_ONLY) "..CLICK_MOVE_ONLY, CLICK_MOVE_ONLY)
--! 		else
--! 			OutputDebugInfo({"????!!!!", caller, "::skip VF.Action( CLICK_MOVE_ONLY)"}, OUT_HIGH)
--! 		end
		myWrapper( VF.Action, caller.."::VF.Action( CLICK_FOCUS) "..CLICK_FOCUS, CLICK_FOCUS)			--ToDo getting desparate, is this the solution
end -- routeLiveToVF

--------------------------------------------------------------------------------
--[[ VF_zoekenKeyPress is only called for individual key-combinations registered via registerKey
	 Functions registered via RegisterScriptKey have apparently 2 undocumented parameters,
	 scancode and modifier
	 You can convert scancode to a Virtual Keycode, using user32.dll.

	 VF_zoekenKeyPress used to be EventApplicationKeyPress, but EventApplicationKeyPress is not useable for the VF_zoeken purpose
	 because you can't prevent the keys to be passed to the application. You can only prevent further processing within SN itself,
	 e.g. by braille, sound or another script

	return code:
	 - EVENT_HANDLED (254) if the script acted on the scancode+modifier
	 - EVENT_PASS_ON (255) if the script did not act on the scancode+modifier

--		elseif scancode == KEY_Q then					-- Vennootsschapbelasting aangifte zoekformulier (VpB-client jaargegevens details)
		--this was intended as demo code to show how powerful VF_zoeken is
		--could not get to work reliable, so now it is commented out as showcase
		--			do_keypress_alt_sequence("VENAAN")
		--			DebugSleep( 1000, "Q: wait after VENAAN before tab")
		--			KeyPress( VK_TAB, 0, KEYPRESS_NORMAL)
		--			DebugSleep( 1000, "Q: wait after tab before return")
		--			KeyPress( VK_RETURN, 0, KEYPRESS_NORMAL)
		--	--		from hereon it does not work reliable
		--	-- 		DebugSleep( 1000, "Q: wait after return before alt-G")
		--	-- 		KeyPress( VK_RETURN, 0, KEYPRESS_NORMAL)
		--	-- 		DebugSleep( 1000, "Q: wait after return before alt-G")
		--	-- 		-- do_keypress_alt_sequence("G")			since we know this works skightly diffrent compared
		--	--													-- with clicking the icon, lets do it differently
		--	--		VF_zoekenKeyPress( KEY_G, modifier)
--]]
function VF_zoekenKeyPress( scancode, modifier)

	local rc = EVENT_HANDLED									--assume we are going to process the key
	OutputDebugInfo({"==================== VF_zoekenKeyPress::", vf_zoeken_reportScancode( scancode, modifier)}, OUT_MEDIUM)

	-- Level 1: QBM under control of the ini-file
	if PerformQuickSearch( scancode, modifier) ~= 0 then return rc end -- EVENT_HANDLED 

	-- Level 2: Customer specific escapes via the xxxx.lua file
	-- ToDo due to the current sequencing of  the base script (e.g. UNIT4 Business Suite u4crm.exe.lua) and
	-- VF_zoeken.lua, is the customer specific sequence winning of the ini-file specified sequence CORRECT THIS

	-- Level 3: the hard coded VF_zoeken functionaliteit
	rc = PerformBabbageMode( scancode, modifier)				--escape into 2-level Babbage Mode ToDo determine whether we want to keep this feature
 	if rc == EVENT_HANDLED then	return rc end
	if modifier == g_VfZoekenKey then							-- DolphinKey without additional modifiers
		if scancode == KEY_A then								-- just to start the if, elseif ...... train
--		elseif scancode == KEY_B then 
--		elseif scancode == KEY_C then
--		elseif scancode == KEY_D then
--		elseif scancode == KEY_E then
		elseif scancode == KEY_F then PerformFormSearch()		-- form modus
--		elseif scancode == KEY_G then
--		elseif scancode == KEY_H then
--		elseif scancode == KEY_I then
--		elseif scancode == KEY_J then
--		elseif scancode == KEY_K then
--		elseif scancode == KEY_L then
--		elseif scancode == KEY_M then
		elseif scancode == KEY_N then PerformForwardSearch()	-- search forward for same entry
--		elseif scancode == KEY_O then
--		elseif scancode == KEY_P then
--		elseif scancode == KEY_Q then
--		elseif scancode == KEY_R then
--		elseif scancode == KEY_S then
--		elseif scancode == KEY_T then
--		elseif scancode == KEY_U then
--		elseif scancode == KEY_V then
		elseif scancode == KEY_W then PerformTitleSearch()
--		elseif scancode == KEY_X then
--		elseif scancode == KEY_Y then
--		elseif scancode == KEY_Z then
		else
			rc =  EVENT_PASS_ON									-- we did not process the key, maybe there is another SCRIPT interested
		end
	elseif modifier == g_VfZoekenKeyShift then					-- DolphinKey with left-shift as modifier
		if scancode == KEY_N then PerformBackwardSearch()		-- search backward for same entry
		else
			rc =  EVENT_PASS_ON									-- we did not process the key, maybe there is another SCRIPT interested
		end
	elseif modifier == g_VfZoekenKeyControl then				-- DolphinKey with left-control as modifier
		if scancode == KEY_N then PerformAllSearch()			-- search all occurences for same entry
		else
			rc =  EVENT_PASS_ON									-- we did not process the key, maybe there is another SCRIPT interested
		end
	else
		rc =  EVENT_PASS_ON										-- we did not process the key, maybe there is another SCRIPT interested
	end
	if rc == EVENT_PASS_ON then
		OutputDebugInfo({"!!!!VF_zoekenKeyPress, value not supported rc:", rc}, OUT_LOW)
	end
	return rc													-- inform SN whether or not to process the key
end -- VF_zoekenKeyPress


--------------------------------------------------------------------------------
--Potential areas to be used in BabbageControlMode (BCM)
--##AREA_ALT_TAB				;; 45
--##AREA_ANIMATION				;; 5
--##AREA_APPLICATION			;; 46
--##AREA_BALLOON				;; 54
--##AREA_BUTTON					;; 12
--##AREA_BUTTON_BAR				;; 55
--##AREA_CELL					;; 22
--##AREA_CHECK_CONTROL			;; 11
--##AREA_CHECKBOX				;; 9
--##AREA_CONSOLE				;; 14
--##AREA_CONTAINER				;; 34
--##AREA_CONTEXT1				;; 58
--##AREA_CONTROL				;; 50
--##AREA_DIALOG					;; 26
--##AREA_DOCUMENT				;; 41
--##AREA_DRAWING				;; 4
--##AREA_EDIT					;; 16
--##AREA_EMBEDDED				;; 57
--##AREA_GRAPHIC				;; 1
--##AREA_GRIP					;; 36
--##AREA_GROUP					;; 33
--##AREA_HEADING				;; 18
--##AREA_HEADING_TABLE			;; 51
--##AREA_HYPERTEXT				;; 25
--##AREA_IGNORE					;; 49
--##AREA_ITEM					;; 17
--##AREA_LINK					;; 13
--##AREA_LISTBOX				;; 21
--##AREA_LISTVIEW				;; 53
--##AREA_MENU					;; 43
--##AREA_MENU_BAR				;; 35
--##AREA_MENU_EMBEDDED			;; 60
--##AREA_PANE					;; 24
--##AREA_POPUP_COMBO			;; 42
--##AREA_POPUP_DIALOG			;; 44
--##AREA_PROGRESS				;; 3
--##AREA_RADIO					;; 8
--##AREA_RADIO_CONTROL			;; 10
--##AREA_RULER					;; 38
--##AREA_SCREEN					;; 47
--##AREA_SCROLL					;; 15
--##AREA_SHEET					;; 29
--##AREA_SPIN					;; 6
--##AREA_STATUS_BAR				;; 39
--##AREA_SYMBOL					;; 56
--##AREA_TAB					;; 30
--##AREA_TAB_CONTROL			;; 31
--##AREA_TAB_SHEET				;; 32
--##AREA_TABLE					;; 23
--##AREA_TEXT					;; 2
--##AREA_TEXT_LINK				;; 28
--##AREA_TIP					;; 52
--##AREA_TITLE_BAR				;; 37
--##AREA_TOOLBAR				;; 40
--##AREA_TRACKBAR				;; 7
--##AREA_TREE					;; 20
--##AREA_WINDOW_EMBEDDED		;; 59
--##AREA_WORKSPACE				;; 27
--;;-- AREA_ROOT				;; 48
--[[ Functions registered via RegisterScriptKey have apparently 2 undocumented parameters,
	 scancode and modifier
	 You can convert scancode to a Virtual Keycode, using user32.dll.
--]]

--------------------------------------------------------------------------------
function vf_zoeken_reportScancode( scancode, modifier)
	local msg = reportScancode( scancode, modifier)
	msg = string.format( "%s Babbage mode: %d", msg, g_BabbageMode)
	return msg
end -- vf_zoeken_reportScancode

--------------------------------------------------------------------------------
function PerformBabbageMode( scancode, modifier)

--	local rc = EVENT_HANDLED			--assume we are going to process the key
	local rc = EVENT_PASS_ON			--assume we are not going to process the key

	if g_BabbageMode == BabbageModeOff then
		rc = StartBabbageMode( scancode, modifier)   
	elseif g_BabbageMode == BabbageModeControl then			--CBM
		rc = EVENT_HANDLED				--assume we are going to process the key
		local msg = vf_zoeken_reportScancode( scancode, modifier)
		OutputDebugInfo({"---------- PerformBabbageMode:: ", msg}, OUT_MEDIUM)

		if scancode == KEY_B then 						-- 
			PerformGotoControl( "AREA_BUTTON")
		elseif scancode == KEY_C then 		
			--ToDo this is sub-optimal because each failing PerformGotoControl makes a sound while the next one may be succesfull
			local dontCare =
			PerformGotoControl( "AREA_CONTROL") or
			PerformGotoControl( "AREA_CHECK_CONTROL") or
			PerformGotoControl( "AREA_CHECKBOX")
		elseif scancode == KEY_E then 		
			PerformGotoControl( "AREA_EDIT")
		elseif scancode == KEY_L then 					--
			PerformGotoControl( "AREA_TEXT")
		elseif scancode == KEY_R then 		
			PerformGotoControl( "AREA_RADIO_CONTROL")
		else
			OutputDebugInfo({"!!!!value not supported in Control Babbage Mode"}, OUT_LOW)
		end
	else  -- strange BabbageMode
		OutputDebugInfo({"!!!! ASSERT don't know this mode:", g_BabbageMode})
		rc = EVENT_PASS_ON			--we did not process the key
	end

	OutputDebugInfo({"PerformBabbageMode() rc: ", rc }, OUT_LOW)
	return rc						--inform SN whether or not to process the key
end -- PerformBabbageMode

--[[------------------------------------------------------------------------------
  ______               _     ______                _   _                 
 |  ____|             | |   |  ____|              | | (_)                
 | |____   _____ _ __ | |_  | |__ _   _ _ __   ___| |_ _  ___  _ __  ___ 
 |  __\ \ / / _ \ '_ \| __| |  __| | | | '_ \ / __| __| |/ _ \| '_ \/ __|
 | |___\ V /  __/ | | | |_  | |  | |_| | | | | (__| |_| | (_) | | | \__ \
 |______\_/ \___|_| |_|\__| |_|   \__,_|_| |_|\___|\__|_|\___/|_| |_|___/
                                                                         
	BabbageSupport contains a s skeleton for all event functions
	Event functions in VF_Zoeken.lua take precedence over those in Babbage Support
--]]------------------------------------------------------------------------------


--[[------------------------------------------------------------------------------
EventApplicationKeyPress is pretty useless for VF_Zoeken because we can't prevent the key to be passed on to the application.
Note: registered key combinations are not passed on but they don't show up in EventApplicationKeyPress either
--]]
function EventApplicationKeyPress( scancode, modifier)
	EAp_KeyPressCount = EAp_KeyPressCount + 1
	local rc = EVENT_PASS_ON					--let's satisfy the fuzzy Dolphin logic
	if EAp_KeyPressFlag then
		OutputDebugInfo({"====================", SCRIPT_NAME, "EAp_KeyPress() #", EAp_KeyPressCount, vf_zoeken_reportScancode( scancode, modifier)}, OUT_MEDIUM)
	end
	if rawget( _G, "babSup_EventApplicationKeyPress") then babSup_EventApplicationKeyPress( scancode, modifier) end	--ToDo document this feature

	if g_BabbageMode ~= BabbageModeOff then
		if scancode == KEY_SPACE or scancode == KEY_ESCAPE then	-- if scancode == 57 or scancode == 1 then								-- 
			StopBabbageMode()
		end
	end
	return rc
end -- EventApplicationKeyPress


--[[------------------------------------------------------------------------------
ToDo is this an alternative: System.TextStringToKeyPresses
Translate a string of text into a sequence of key presses.
System.TextStringToKeyPresses( text [, window_handle])
	--]]
function do_keypress_sequence( sequence)
	OutputDebugInfo({"do_keypress_sequence()::", sequence}, OUT_LOW)
	--for digits 0-9 and capital characters A-Z matches the ASCII code the VK-code
	--This may be a way to simplify the generation of key presses
--! 		DebugSleep( 1000, "do_keypress_sequence before extra delay of 1000")
	 for i = 1, #sequence do
	    local s = sequence:sub( i, i)
-- 		local c = string.format("%c", s)
		local v = string.byte( s)
		KeyPress( v, 0, KEYPRESS_NORMAL)
--! 		DebugSleep( g_DebugDelay, "do_keypress_sequence")
		DebugSleep( 25, "!!do_keypress_sequence with extra post-delay")
	 end
end -- do_keypress_sequence


--[[------------------------------------------------------------------------------
do_keypress_alt_sequence presses and releases the Alt key, followed by
succesive typing of each character of the string aparameter sequence
--]]
function do_keypress_alt_sequence( sequence)
	OutputDebugInfo({"do_keypress_alt_sequence()::", sequence}, OUT_LOW)
	-- Alt down and up
	KeyPress( VK_LMENU, 0, KEYPRESS_PRESS)
	DebugSleep( 200, "do_keypress_alt_sequence")
	KeyPress( VK_LMENU, 0, KEYPRESS_RELEASE)
	DebugSleep( 1000, "do_keypress_alt_sequence")

	--for digits 0-9 and capital characters A-Z matches the ASCII code the VK-code
	--This may be a way to simplify the generation of key presses
	for i = 1, #sequence do
		local s = sequence:sub( i, i)
--		local c = string.format("%c", s)
		local v = string.byte( s)
		KeyPress( v, 0, KEYPRESS_NORMAL)
	end
end -- do_keypress_alt_sequence

--[[------------------------------------------------------------------------------
do_keypress_control_sequence presses the Control key, followed by
succesive typing of each character of the string aparameter sequence, followed by
releasing the Control key
--]]
function do_keypress_control_sequence( sequence)
 	-- Ctrl down
	myWrapper( KeyPress, "do_keypress_control_sequence", VK_LCONTROL, 0, KEYPRESS_PRESS)
-- 	KeyPress( VK_LCONTROL , 0, KEYPRESS_PRESS)
-- 	DebugSleep( 100, "do_keypress_control_sequence sleep")

 	--for digits 0-9 and capital characters A-Z matches the ASCII code the VK-code
 	--This may be a way to simplify the generation of key presses
 	 for i = 1, #sequence do
 		DebugSleep( 25, "do_keypress_control_sequence sleep")
 	    local s = sequence:sub( i, i)
 -- 		local c = string.format("%c", s)
 		local v = string.byte( s)
 		KeyPress( v, 0, KEYPRESS_NORMAL)
 	 end

 	-- Ctrl up
-- 	DebugSleep( 100, "do_keypress_control_sequence sleep")
	myWrapper( KeyPress, "do_keypress_control_sequence", VK_LCONTROL, 0, KEYPRESS_RELEASE)
-- 	KeyPress( VK_LCONTROL , 0, KEYPRESS_RELEASE)
-- 	OutputDebugInfo({"do_keypress_control_sequence:", sequence}, OUT_HIGH)

end -- do_keypress_control_sequence

--[[------------------------------------------------------------------------------
--]]
function do_keypress_control_single_key( key)
	System.SimulateKeyPress( key, MODIFIER_LEFT_CONTROL)   --ToDo System.SimulateKeyPress i.s.o keyPress
end -- do_keypress_control_single_key

--[[------------------------------------------------------------------------------
--]]
function do_keypress_rightcontrol_rightshift_sequence( sequence)
	OutputDebugInfo({"do_keypress_rightcontrol_rightshift_sequence()::", sequence}, OUT_LOW)
	
	-- Rctrl en Rshift down
	KeyPress( VK_RCONTROL, 0, KEYPRESS_PRESS)
	KeyPress( VK_RSHIFT, 0, KEYPRESS_PRESS)
	DebugSleep( 100, "do_keypress_rightcontrol_rightshift_sequence after pressing RCtrl en RShift")

	--for digits 0-9 and capital characters A-Z matches the ASCII code the VK-code
	--This may be a way to simplify the generation of key presses
	for i = 1, #sequence do
		local s = sequence:sub( i, i)
--		local c = string.format("%c", s)
		local v = string.byte( s)
		KeyPress( v, 0, KEYPRESS_NORMAL)
	end

	-- Rctrl en Rshift up
	DebugSleep( 100, "do_keypress_rightcontrol_rightshift_sequence before releasing RCtrl en RShift")
	KeyPress( VK_RSHIFT, 0, KEYPRESS_RELEASE)
	KeyPress( VK_RCONTROL, 0, KEYPRESS_RELEASE)
	DebugSleep( 100, "do_keypress_rightcontrol_rightshift_sequence after releasing RCtrl en RShift")

end -- do_keypress_rightcontrol_rightshift_sequence("7")


--------------------------------------------------------------------------------
--[[
	ToDo: to be generalized and moved to BabbageSupport.lua
	VF_zoekenStatusReport reports on information which is .....
	reportType:
		0x0007: sound
		0x0070: OutputDebugInfo
		0x0100: System.Alert
	msgText is either a single string or a table of strings
--]]
function VF_zoekenStatusReport( reportType, msgText, dialogText)
	local reportLevel = OUT_HIGH								-- ToDo should this be an optional parameter
	local sound = System.BitwiseAnd( reportType, 0x07)
	playSound( sound )
	if not System.BitwiseAnd( reportType, 0x10) == 0 then reportLevel = OUT_LOW end 
	if not System.BitwiseAnd( reportType, 0x20) == 0 then reportLevel = OUT_MEDIUM end
	if not System.BitwiseAnd( reportType, 0x40) == 0 then reportLevel = OUT_HIGH end
	OutputDebugInfo(msgText, reportLevel)
	if not System.BitwiseAnd( reportType, 0x100) == 0 then 
		System.Alert( dialogText, "VF-zoeken.lua", MB_OK)
	end
end	-- VF_zoekenStatusReport

--------------------------------------------------------------------------------
--[[
	VF_zoekenDebugReport reports on information which is considered to be potentially usefull
	when debugging VF_zoeken.
--]]
function VF_zoekenDebugReport(scancode, modifier)

	OutputDebugInfo("-------------------- VF_zoekenDebugReport --------------------")

	OutputDebugInfo({tostring( KeyPress), "KeyPress"})
	OutputDebugInfo({tostring( Mag.Auto), "Mag.Auto"})
	OutputDebugInfo({tostring( Mag.ExecuteCommand), "Mag.ExecuteCommand"})
	OutputDebugInfo({tostring( System.MoveMouseTo), "System.MoveMouseTo"})
	OutputDebugInfo({tostring( VF.Action), "VF.Action"})
	OutputDebugInfo({tostring( VF.ChooseFocus), "VF.ChooseFocus"})
	OutputDebugInfo({tostring( VF.FindNext), "VF.FindNext"})
	OutputDebugInfo({tostring( VF.FindText), "VF.FindText"})
	OutputDebugInfo({tostring( VF.Move), "VF.Move"})
	OutputDebugInfo({tostring( VF.MoveToXY), "VF.MoveToXY"})
--	OutputDebugInfo({tostring( VF.RestorePosition), "VF.RestorePosition"})
--	OutputDebugInfo({tostring( VF.StorePosition), "VF.StorePosition"})
	OutputDebugInfo({tostring( Win.mouse_event), "Win.mouse_event"})

	OutputDebugInfo({"Debug Level:", DEBUGLEVEL })							-- ToDo impriove the I/F to BabbageSupport.lua
	OutputDebugInfo({"Debug Delay:", g_DebugDelay})
	OutputDebugInfo({"g_ProductSerial:", g_ProductSerial})
	OutputDebugInfo({"g_LicenseFlag:", g_LicenseFlag})
	OutputDebugInfo({"g_ScriptName:", g_ScriptName})
	OutputDebugInfo({"g_SettingsFile:", tostring(g_SettingsFile)})
	OutputDebugInfo({"g_BabbageMode:", g_BabbageMode})
	OutputDebugInfo({"g_action_separator:", g_action_separator})			-- (aktie-string) separator in inifile between a compound search-string and its action
	OutputDebugInfo({"g_multiplier_separator:", g_multiplier_separator})	-- (herhalings-string) separator in inifile between a search-string and its repeat-count
	OutputDebugInfo({"g_sequence_separator:", g_sequence_separator})		-- (volgorde-string) separator in inifile between sub-search-strings in a search-string
	OutputDebugInfo({"g_control_separator:", g_control_separator})			-- ...... separator in inifile between ......
	OutputDebugInfo({"g_location_separator:", g_location_separator})		-- ...... separator in inifile between ......
	OutputDebugInfo({"g_defaultSection:", tostring(g_defaultSection)})		-- default section presence flag

	OutputDebugInfo({"------g_FormTable------", tostring( g_FormTable)})	-- table containing all the "form" section-strings in g_Table
	printTable(g_FormTable)
	OutputDebugInfo({"------g_TitleTable------:", tostring( g_TitleTable)})	-- table containing all the "title" section-strings in g_Table
	printTable(g_TitleTable)
	OutputDebugInfo({"------g_Table:------", tostring( g_Table)})			-- ini-file converted to table
	printTable(g_Table)

	OutputDebugInfo({"g_TableLength:", g_TableLength })						-- upperlimit for next enry search
	OutputDebugInfo({"g_TableSelectedIndex:", g_TableSelectedIndex})		-- index of user selected entry in the list
	OutputDebugInfo({"g_TableSelectedAction:", g_TableSelectedAction})		-- number representing the user selected action to perform after the selected entry is found
	OutputDebugInfo({"g_TableSearchString:", g_TableSearchString})
	OutputDebugInfo({"g_TableSection:", g_TableSection})
	OutputDebugInfo({"g_TableSearchMultiplier:", g_TableSearchMultiplier})
	OutputDebugInfo({"g_cx:g_cy:", tostring(g_cx)..":"..tostring(g_cy)})
	OutputDebugInfo({"g_ctrl:", tostring(g_ctrl)..":"..tostring(AreaTypeTable[g_ctrl])})

	OutputDebugInfo({"EAp_ActivatedCount:", EAp_ActivatedCount})
	OutputDebugInfo({"EAp_BraillePressCount:", EAp_BraillePressCount})
	OutputDebugInfo({"EAp_DeactivatedCount:", EAp_DeactivatedCount})
	OutputDebugInfo({"EAp_DomReportCount:", EAp_DomReportCount})
	OutputDebugInfo({"EAp_DomSetupCount:", EAp_DomSetupCount})
	OutputDebugInfo({"EAp_FocusChangeCount:", EAp_FocusChangeCount})
	OutputDebugInfo({"EAp_MouseMoveCount:", EAp_MouseMoveCount})
	OutputDebugInfo({"EAp_NewTextCount:", EAp_NewTextCount})
	OutputDebugInfo({"EAp_ScreenChangeCount:", EAp_ScreenChangeCount})
	OutputDebugInfo({"EAp_TimerCount:", EAp_TimerCount})
	OutputDebugInfo({"EAp_VirtualFocusChangeCount:", EAp_VirtualFocusChangeCount})
	OutputDebugInfo({"EAu_BrailleCount:", EAu_BrailleCount})
	OutputDebugInfo({"EAu_SpeechCount:", EAu_SpeechCount})
	OutputDebugInfo({"EAu_Speech2Count:", EAu_Speech2Count})
	OutputDebugInfo({"ES_CloseDownCount:", ES_CloseDownCount})
	OutputDebugInfo({"ES_MSAACount:", ES_MSAACount})
	OutputDebugInfo({"ES_StartupCount:", ES_StartupCount})
	OutputDebugInfo({"ES_UIAutomationCount:", ES_UIAutomationCount})
	OutputDebugInfo("-------------------- VF_zoekenDebugReport --------------------")

	if scancode == KEY_B then 
		local x = rawget( _G, "DebugReport")			--ToDo document this feature
--		local x = getmetatable( "DebugReport" )
		OutputDebugInfo({"----------------------------------------", tostring(x)} )
		if x then DebugReport() end		--call the overall debug support function in BabbageEngineering.lua
	end

end -- VF_zoekenDebugReport


--------------------------------------------------------------------------------
--------------------------------------------------------------------------------
--[[ VF.Action codes.
0	CLICK_LEFT 						Perform a single left mouse click
1	CLICK_RIGHT 					Perform a single right mouse click
2	CLICK_LEFT_DOUBLE 				Perform a double left mouse click
3	CLICK_RIGHT_DOUBLE 				Perform a double right mouse click
4	CLICK_MOVE_ONLY 				Move the mouse, but do not click			apparently: place beam cursor in field
5	CLICK_MIDDLE 					Perform a single middle mouse click
6	CLICK_MIDDLE_DOUBLE 			Perform a double middle mouse click
7	CLICK_MOUSE_WHEEL_UP 			Simulate moving the mouse wheel up
8	CLICK_MOUSE_WHEEL_DOWN 			Simulate moving the mouse wheel down
9	CLICK_FOCUS 					Set the input focus
10	ACTIVATE_PRESS 					Activate the item
11	ACTIVATE_UP 					Activate the item, scrolling it up
12	ACTIVATE_DOWN 					Activate the item, scrolling it down
13	CLICK_HOVER 					Cause the mouse to hover over the item
--]]

--------------------------------------------------------------------------------
--[[
-- VF Movement codes.
0	MOVE_VF_OBJECT_NEXT  Next object
1	MOVE_VF_OBJECT_PREVIOUS  Previous object
2	MOVE_VF_LINE_NEXT  Next line
3	MOVE_VF_LINE_PREVIOUS  Previous line
4	MOVE_VF_CHAR_RIGHT  One character right
5	MOVE_VF_CHAR_LEFT  One character left
6	MOVE_VF_WORD_RIGHT  Right a word
7	MOVE_VF_WORD_LEFT  Left a word
8	MOVE_VF_LINE_START  Start of the line
9	MOVE_VF_LINE_END  End of the line
10	MOVE_VF_AREA_TOP  Top of area
11	MOVE_VF_AREA_BOTTOM  Bottom of area
12	MOVE_VF_PHYSICAL_UP  Physically upwards
13	MOVE_VF_PHYSICAL_DOWN  Physically downwards
14	MOVE_VF_PHYSICAL_LEFT  Physically left
15	MOVE_VF_PHYSICAL_RIGHT  Physically right
16	MOVE_VF_PHYSICAL_TOP  Top of the physical area
17	MOVE_VF_PHYSICAL_BOTTOM  Bottom of the physical area
18	MOVE_VF_PHYSICAL_ON_OFF  Toggle physical movement
19	MOVE_VF_TABLE_UP  Up in a table
20	MOVE_VF_TABLE_DOWN  Down in a table
21	MOVE_VF_TABLE_LEFT  Left in a table
22	MOVE_VF_TABLE_RIGHT  Right in a table Reference  514
23	MOVE_VF_TABLE_HEADING_COLUMN  Table column heading
24	MOVE_VF_TABLE_HEADING_ROW  Table row heading
25	MOVE_VF_START_ATTR  First character with same attribute
26	MOVE_VF_VIRTUAL  Line mode
27	MOVE_VF_SENTENCE_NEXT  Next sentence
28	MOVE_VF_SENTENCE_PREVIOUS  Previous sentence
29	MOVE_VF_PARAGRAPH_NEXT  Next paragraph
30	MOVE_VF_PARAGRAPH_PREVIOUS  Previous paragraph
31	MOVE_VF_SENTENCE_START  Start of sentence
32	MOVE_VF_PARAGRAPH_START  Start of paragraph

-- Specal case VF movements
MOVE_VF_MARKER = 34							ToDo UNDOCUMENTED in script manual
MOVE_VF_AREA = 35
MOVE_VF_MONITOR = 36
MOVE_VF_QUICKNAV = 37
--]]

--------------------------------------------------------------------------------
--[[
-- VF.ChooseFocus modes.
0	FOCUS_LIVE						Selects live focus
1	FOCUS_VF						Selects virtual focus mode
2	FOCUS_AREA_VF					Selects area virtual focus
3	FOCUS_NEXT_WINDOW				Selects the next window in virtual focus
4	FOCUS_PREVIOUS_WINDOW			Selects the previous window in virtual focus
5	FOCUS_NEXT_APP					Selects the next application in virtual focus
6	FOCUS_PREVIOUS_APP				Select the previous application in virtual focus
7	FOCUS_NEXT_WINDOW_MAIN			Selects the next main window
8	FOCUS_PREVIOUS_WINDOW_MAIN		Selects the previous main window
9	FOCUS_NEXT_WINDOW_DIALOG		Selects the next dialog window
10	FOCUS_PREVIOUS_WINDOW_DIALOG	Selects the previous dialog window
11	FOCUS_ROUTE_TO_LIVE				Routes the virtual focus to the  live focus position
12	FOCUS_INTERACTIVE				Selects interactive mode
13	FOCUS_ROUTE_TO_MOUSE			Routes the virtual focus to the mouse position
14	FOCUS_SELECTION					Restrict the virtual focus to the current selection
15	FOCUS_AUTO_AREA_VF				Selects auto area virtual focus
16	FOCUS_BACK						Switch focus to previous state
17	FOCUS_ROUTE_TO_DOM_VF			Routes the virtual focus to the DOM virtual focus
--]]
--------------------------------------------------------------------------------

--[[------------------------------------------------------------------------------
--]]

function myWrapper( fun, location, par1, par2, par3, par4, par5)
	local msg = "myWrapper for "..tostring( fun)
	msg = msg.." called from "..tostring( location)
	if par1 then msg = msg.." with par1:"..tostring( par1) end
	if par2 then msg = msg.." par2:"..tostring( par2) end
	if par3 then msg = msg.." par3:"..tostring( par3) end
	if par4 then msg = msg.." par4:"..tostring( par4) end  -- ToDo Why was this considered usefull and not for par1 through par3:: else par4 = 0 end
	if par5 then msg = msg.." par5:"..tostring( par5) end  -- ToDo Why was this considered usefull and not for par1 through par3:: else par5 = 0 end
	DebugSleep( g_DebugDelay, msg)
 	local rc = fun( par1, par2, par3, par4, par5)
	if rc == nil then msg = msg.." !!!! WARNING return code is nil"
	else msg = msg.." return code: "..tostring( rc)
	end
	DebugSleep( g_DebugDelay, msg)
	return rc
end -- myWrapper

--------------------------------------------------------------------------------
--[[
	StartBabbageMode is the function tied to the hotkeys g_VfZoekenKey-KEY_C
	it is only called if g_BabbageMode == BabbageModeOff 

--]]
function StartBabbageMode( scancode, modifier)
	local rc = EVENT_PASS_ON		--assume we are not going to process the key

	if scancode == KEY_C 					
	and g_BabbageMode == BabbageModeOff 			-- superfluous sanity check
	and modifier == g_VfZoekenKey then				-- should also be superfluous
	
		if g_LicenseFlag == serialTrial then		-- let's nag the user
			System.Alert("VF_Zoeken runs in evaluation mode", "Supernova not licensed", MB_OK)
		end

		rc = EVENT_HANDLED							-- we processed the key
		g_BabbageMode = BabbageModeControl
		playSound(1)
		OutputDebugInfo({"StartBabbageControlMode (CBM)"}, OUT_MEDIUM)
	end
	return rc
end -- StartBabbageMode


--------------------------------------------------------------------------------
--[[
	StopBabbageMode is the function envisaged to do general cleanup at the completion of Babbage Mode
	At this moment it only clears the g_BabbageMode flag
--]]
function StopBabbageMode()
	playSound(3)
	g_BabbageMode = BabbageModeOff
	OutputDebugInfo({"StopBabbageMode()"}, OUT_MEDIUM)
end -- StopBabbageMode


--------------------------------------------------------------------------------
--[[
	PerformTitleSearch is the function tied to the hotkey g_VfZoekenKey-KEY-B, W
	PerformTitleSearch locates the section which matches the title.
	Match in this context means: the section-string is contained case-sensitive somewhere in the title-string.
	If a match is found, PerformInitialSearch is called with the section-string.
	PerformTitleSearch uses the g_TitleTable which is supposed to allways be consistent with g_Table
--]]
function PerformTitleSearch()
	OutputDebugInfo({"====================", "PerformTitleSearch"}, OUT_HIGH)

	local foundFlag = false
	local title = GetWindowTitle()
	local defaultKey = nil
	local section

	for k, s in ipairs( g_TitleTable) do				--traverse all the title-sections in the ini-file till a match with the window title is found
		foundFlag = string.match( title, s )			--a match of section anywhere in the title is fine
		if foundFlag then
			section = s
			OutputDebugInfo({"PerformTitleSearch(): matched <"..section.."> in ", title}, OUT_HIGH)
			--ToDo handle multiple matches
			break
--		else
--			OutputDebugInfo({"PerformTitleSearch(): no matched between <"..s.."> and ", title}, OUT_HIGH)
--			if string.match( "*", s) then			--remenber the default section if any
--				OutputDebugInfo({"PerformTitleSearch() POTENTIALLY using wildcard section for ", title}, OUT_HIGH)
--				defaultKey = k
--			end
		end
	end
--	if (not foundFlag) and defaultKey then
	if (not foundFlag) and g_defaultSection then
--		section = g_TitleTable[defaultKey]
		section = "%*"
		OutputDebugInfo({"wildcard section ", section}, OUT_HIGH)
		foundFlag = true
		OutputDebugInfo({"PerformTitleSearch() using wildcard section for ", title}, OUT_HIGH)
	end
	if foundFlag then
		PerformInitialSearch( section)					--invoke the user dialog
	else
		local msg = "!!!! PerformTitleSearch(): title: <"..title.."> does not exists as section in ini-file"
		VF_zoekenStatusReport( 0x0001 + 0x0010, msg, "")
		msg = {"!!!! PerformTitleSearch(): title: <", title, "> does not exists as section in ini-file"}
		VF_zoekenStatusReport( 0x0001 + 0x0010, msg, "")
--		OutputDebugInfo({"!!!! PerformTitleSearch(): title: <"..title.."> does not exists as section in ini-file"}, OUT_HIGH)
--		System.Alert("section matching "..title.." not found", "VF_zoeken::PerformTitleSearch", MB_OK)
	end
end -- PerformTitleSearch


--------------------------------------------------------------------------------
--[[
	PerformQuickSearch will only try to do a quick serach when BabbageMode i s off
	PerformQuickSearch locates the section which matches the title.
	Match in this context means: the section-string is contained case-sensitive somewhere in the title-string.
	If a match is found, PerformInitialSearch is called with the section-string.
	PerformQuickSearch uses the g_TitleTable which is supposed to allways be consistent with g_Table
--]]
function PerformQuickSearch( scancode, modifier)
	local dolphinCode = 0
	if g_BabbageMode ~= BabbageModeOff then return dolphinCode end

	if g_SettingsFile == nil then
		VF_zoekenStatusReport( 1, "!!!!no ini-file", "PerformQuickSearch: no suitable ini-file found.")
		return dolphinCode
	end

	OutputDebugInfo({"-------------------- PerformQuickSearch()::", vf_zoeken_reportScancode( scancode, modifier)}, OUT_HIGH)
	local title = GetWindowTitle()

	dolphinCode = ScanCodeToVirtualKeyCode( scancode )	-- scancode (VK code) converted to Dolphin key number (0 if not convertable)
	if dolphinCode ~= 0 then
		local s = string.format("%c", dolphinCode)				--ToDo this feels overly complicated
		local value, index = nil, nil
		local section = nil
		for _, sectionName in ipairs( g_TitleTable) do			--traverse all the title-sections in the ini-file for matches with the window title 
			section = string.match( title, sectionName ) 		--a match of section anywhere in the title is fine
			if section then
				OutputDebugInfo({"PerformQuickSearch(): section <"..sectionName.."> matched in title <"..title..">"}, OUT_LOW)
				value, index = findQbmEntry( g_Table[sectionName], s)	--check for matching QBM entry
				if value then break end
			end	
		end
		if value == nil and g_defaultSection then
			section =  "%*"
			value, index = findQbmEntry( g_Table[section], s)
		end
		if value == nil then
			OutputDebugInfo({"PerformQuickSearch(", s,") no entry in any specific or default section of ini-file:", g_SettingsFile}, OUT_LOW)
			dolphinCode = 0
		else
			OutputDebugInfo({"PerformQuickSearch(): dolphinCode:", dolphinCode, "s:", s, "v:", value}, OUT_MEDIUM)
			--ToDo test these initializations 
			g_TableSelectedIndex = index
			OutputDebugInfo({"PerformQuickSearch(): index:", index}, OUT_MEDIUM)
			g_TableSearchString = value
			g_TableSelectedAction = 1		--ToDo get from @@ sepoarator
			g_TableSection = section
			g_TableSearchMultiplier = 1		--

			PerformSequencesSearch( value)	--do the actual search
		end
	end
	return dolphinCode
end -- PerformQuickSearch


--------------------------------------------------------------------------------
function findQbmEntry( t, s)
	OutputDebugInfo({"findQbmEntry: s:", s, tostring(t[s]), tostring(t[t[s]])}, OUT_MEDIUM)
	local value = nil
	local index = t[s]
	if index then value = t[index] end

--	local value = nil
--	local index = 1
--	for key, v in pairs( t) do
----		OutputDebugInfo({"findQbmEntry: index:", index, key, v}, OUT_MEDIUM)
--		if type( key) == "string" and  s == string.upper( key:sub( 1, 1)) then
--			index = v
--			value = t[index]
--			break
--		end
--		index = index + 1
--	end
	OutputDebugInfo({"findQbmEntry: index:", index, "value", value}, OUT_MEDIUM)
	return value, index
end -- findQbmEntry			


--------------------------------------------------------------------------------
--[[
	PerformFormSearch is the function tied to the hotkey g_VfZoekenKey-F
	PerformFormSearch locates all section which represent a form and uses the section names to build
	a dialog. The user selected form (i.e. section) is then used to call PerformFormSearch.
	PerformFormSearch uses the g_FormTable which is supposed to allways be consistent with g_Table
--]]
function PerformFormSearch()
	OutputDebugInfo({"====================", "PerformFormSearch"}, OUT_HIGH)

	local entries_lenght, sections = GetSectionList( g_FormTable)	--collects a list of all the "form://" sections in the ini-file
	local index = SelectForm( sections)					--create the user dialog with the forms to choose from
	if index == nil then					--user escaped search dialog via cancel
		OutputDebugInfo({"!!!! PerformFormSearch(), no selection made"}, OUT_MEDIUM)
	else
		local entry = "form://"..sections[index]						--invoke the user dialog
		PerformInitialSearch( entry)
	end
end -- PerformFormSearch


--------------------------------------------------------------------------------
--[[
	PerformInitialSearch collects the values from the selected section.
	These values are used to build an User Dialog.
	After the user selected a specific value, the actual search is done.
--]]
function PerformInitialSearch( section)
	OutputDebugInfo({"PerformInitialSearch(", tostring( section), ")"}, OUT_LOW)

		--read the appropriate section into a tuple entries_lenght, entries
		--i.e. the number of strings to search for and the strings themselves
		local entries_lenght, entries = GetSection( g_Table, section)
		--create the user dialog with the possible search strings and associated actions.
		local index, action = SelectEntry( entries)
		-- update the global variables
		g_TableSection = section
		g_TableLength = entries_lenght				--save the upper limit for the offset tracker
		g_TableSelectedIndex = index				--save the user selections
		g_TableSelectedAction = action
		g_TableSearchString = entries[index]
		--do the actual search and action
		PerformSequencesSearch( g_TableSearchString)	--do the actual search

end -- PerformInitialSearch

--------------------------------------------------------------------------------
--[[
	The function PerformBackwardSearch() is the equivalent of PerformForwardSearch() but in the opposite direction
--]]
function PerformBackwardSearch()
	OutputDebugInfo({"====================", "PerformBackwardSearch()"}, OUT_HIGH)
	PerformRepeatedSearch( false )
end -- PerformBackwardSearch

--------------------------------------------------------------------------------
--[[
	The function PerformForwardSearch() is intended to repeat the search as setup via the last invocation of
	PerformTitleSearch()?? or PerformForwardSearch()?? in forward direction.
--]]
function PerformForwardSearch()
	OutputDebugInfo({"====================", "PerformForwardSearch"}, OUT_HIGH)
	PerformRepeatedSearch( true )
end -- PerformForwardSearch


--------------------------------------------------------------------------------
--[[
	The function PerformAllSearch() is intended to repeat the search as setup via the last invocation of
	PerformTitleSearch()?? or PerformForwardSearch()?? ......
--]]
function PerformAllSearch() 			-- search all occurences for same entry

end -- PerformAllSearch
--------------------------------------------------------------------------------
--[[
	The function PerformRepeatedSearch() is intended to repeat one time the search for the last substring of
	the last search operation in either forward or backward direction
--]]

function PerformRepeatedSearch( direction)
--[[ ToDo Dit lijkt niets te doen
	local entry = ""
	for part in gsplit2( g_TableSearchString, g_multiplier_separator) do
		OutputDebugInfo({"2: part: <"..part..">"}, OUT_HIGH)
 		entry = part
	end
	entry = gsplit2( entry, g_multiplier_separator)
--]]

	local rc = PerformSearch( g_TableSearchString, false, direction)
	--ToDo if PerformSearch is no longer moving the focus to support multiple search strings in 1 go, then
	--this must be adjusted
	if not rc then
		OutputDebugInfo({"PerformRepeatedSearch() failed"}, OUT_MEDIUM)
	end
end -- PerformRepeatedSearch

--------------------------------------------------------------------------------
--[[
	The function PerformNextEntrySearch() is intended to
function PerformNextEntrySearch()
	OutputDebugInfo({"====================", "PerformNextEntrySearch()"}, OUT_HIGH)
	PerformIncrementalEntrySearch( 1 )
end -- PerformNextEntrySearch
--]]


--------------------------------------------------------------------------------
--[[
	The function PerformPrevEntrySearch() is intended to
function PerformPrevEntrySearch()
	OutputDebugInfo({"====================", "PerformPrevEntrySearch()"}, OUT_HIGH)
	PerformIncrementalEntrySearch( -1 )
end -- PerformPrevEntrySearch
--]]


--------------------------------------------------------------------------------
--[[
	The function augmentEntrySearch() is intended to
--]]
function augmentEntrySearch( scancode, modifier) -- ( direction)
	local direction = 1											-- presume forward
	if modifier == g_VfZoekenKeyShift then direction = -1 end			-- DolphinKey with left-shift as modifier
	if g_TableSelectedIndex == nil then			--user escaped search dialog via cancel
		local msg = {"!!!! augmentEntrySearch(), no selection available"}
		VF_zoekenStatusReport( 0x0001 + 0x0010, msg, "")
--		OutputDebugInfo({"!!!! augmentEntrySearch(), no selection available"}, OUT_MEDIUM)
	else
		OutputDebugInfo({"====================", "augmentEntrySearch() direction:", direction}, OUT_MEDIUM)
		g_TableSelectedIndex = g_TableSelectedIndex + direction
		if g_TableSelectedIndex == 0 then g_TableSelectedIndex = 1 end
		if g_TableSelectedIndex > g_TableLength then g_TableSelectedIndex = g_TableLength end    --ToDo feels wrong use of the wrong length


		local entries_lenght, entries = GetSection( g_Table, g_TableSection)

		g_TableLength = entries_lenght				--save the upper limit for the offset tracker   --ToDo feels wrong use of the wrong length
		g_TableSearchString = entries[g_TableSelectedIndex]

		PerformSequencesSearch( g_TableSearchString)
		--even on unsuccessful search, don't undo the g_TableSelectedIndex modification
	end
end -- augmentEntrySearch


--------------------------------------------------------------------------------
--[[
	The function GetWindowTitle() returns the contents of the title bar of the currently active application as ASCII value
	ToDo is there a better strategy to determine the title of the more interesting window which is seen by SN as a pseudo-application 

	Historical note: once we tried in a bookkeeping application, to use the window title to detect switching from one
	window representing a table to another window representing an other table. This did not work, partly because the title was sometimes
	adorned with some "control?" characacters, with a (sofar) unkown meaning.
	The "tables" in this description were individual windows (i.e. in the OSM they were not sub-windows of the
	main application), apparently to mimick an MDI I/F 
--]]
function GetWindowTitle()
	--[[ this code turned out to be not the code we need because it may return e.g. the text on a button or in
	--an edit field
	local handle = Win.GetForegroundWindow()				--Return a handle to the window which has the keyboard input focus
	--GetWindowText sometimes return Unicode string, sometimes ANSI, so convert to ANSI to be consistent
	local title = tostring( System.GetWindowText( handle)
	title = Trim( title)									--remove leading and trailing white space
	--]]
	local area = Area.GetCurrentApplication () 				-- Return the current top level application window as an area. 
	local title = "!<!No Title!>!"
	if area then 
		local p = Area.GetProperties (area) 
		title = tostring(p.text)
	end 
--! 	area = Area.GetCurrent()							-- Return the current control area. 
--! 	if area then 
--! --		area_state = Area.GetState (area) 
--! 		local p = Area.GetProperties (area) 
--! 		local text = tostring(p.text)
--! 		local tag = tostring(p.tag) 
--! --		OutputDebugInfo({"GetCurrent text:", text, "tag:", tag}, OUT_MEDIUM)
--! --		OutputDebugInfo({"GetCurrent:: left:top:right:bottom:"..":"..p.left..":"..p.top..":"..p.right..":"..p.bottom.." tag:"..tostring( p.tag)})		--Uni-code
--! 		OutputDebugInfo({"GetCurrent:: x:y:breedte:hoogte:"..":"..p.left..":"..p.top..":"..p.right-p.left..":"..p.bottom-p.top.." tag:"..tostring( p.tag)})		--Uni-code
--! 	end 
--! 	area = Area.GetCurrentWindow()									-- Return the current Window area. 
--! 	if area then 
--! --		local area_type = p.type 
--! 		local p = Area.GetProperties (area) 
--! 		local text = tostring(p.text)
--! 		local tag = tostring(p.tag) 
--! --		OutputDebugInfo({"GetCurrentWindow text:", text, "tag:", tag}, OUT_MEDIUM)
--! --		OutputDebugInfo({"GetCurrentWindow:: left:top:right:bottom:"..":"..p.left..":"..p.top..":"..p.right..":"..p.bottom.." tag:"..tostring( p.tag)})		--Uni-code
--! 		OutputDebugInfo({"GetCurrentWindow:: x:y:breedte:hoogte:"..":"..p.left..":"..p.top..":"..p.right-p.left..":"..p.bottom-p.top.." tag:"..tostring( p.tag)})		--Uni-code
--! 	end 
--! --	Area.GetScreen 
	OutputDebugInfo({"GetWindowTitle:<"..title..">"}, OUT_MEDIUM)
	return title
end -- GetWindowTitle

--------------------------------------------------------------------------------
--[[
	The function LoadSettingsFile reads the ini-file and parses it into g_Table and the specialized equivalents
	g_FormTable and g_TitleTable
--]]
function LoadSettingsFile()
	g_VfZoekenKey = MODIFIER_CUSTOM				-- default to Dolphin Key
	--clear all tables
	g_Table = {}								-- ini-file converted to table
	g_FormTable = {}							-- array containing all the "form" section-strings in g_Table
	g_TitleTable = {}							-- array containing all the "title" section-strings in g_Table
	g_defaultSection = false
	-- determine ini-file name
	local folderName = tostring( System.GetInfo( INFO_SCRIPT_DATA_PATH))
	local settingsFile = g_defaultSettingsFile
 	g_Table = inifile.parse( settingsFile, OUT_VERY_LOW)	 	--get ALL the sections into a single table
	if g_Table == nil then
		settingsFile = string.format("%s\\VF_zoeken.ini", folderName)
 		g_Table = inifile.parse( settingsFile, OUT_VERY_LOW) 	--get ALL the sections into a single table
	end
	if g_Table == nil then
		VF_zoekenStatusReport( 1, "!!!!no ini-file found", "no suitable ini-file found. \r\nFile: "..g_defaultSettingsFile.."\r\nAlternative file:"..settingsFile)
		settingsFile = nil 
		g_Table = {}
	end
	g_SettingsFile = settingsFile
	for section in pairs( g_Table) do
		local start, stop = string.find( section, "form://")
		if start == 1 then
 			local subKey = string.sub( section, stop + 1)
 			table.insert( g_FormTable, subKey)
			OutputDebugInfo({"form:", section}, OUT_LOW)
		else
			table.insert( g_TitleTable, section)
			OutputDebugInfo({"title: ", section}, OUT_LOW)
			if string.match( "*", section) then			--remember the default section if any
				OutputDebugInfo({"wildcard section", section}, OUT_LOW)
				g_defaultSection = true
			end
 		end
	end

	if g_Table["VF_zoeken configuration"] ~= nil then
		if g_Table["VF_zoeken configuration"]["ModifierKey"] ~= nil then 
			g_VfZoekenKey = tonumber(g_Table["VF_zoeken configuration"][g_Table["VF_zoeken configuration"]["ModifierKey"]])
		end
		if g_Table["VF_zoeken configuration"]["ActionSeparator"] ~= nil then 
			g_action_separator = g_Table["VF_zoeken configuration"]["ActionSeparator"]  
		end
		if g_Table["VF_zoeken configuration"]["ActionSeparator"] ~= nil then 
			g_action_separator = g_Table["VF_zoeken configuration"]["ActionSeparator"]  
		end
		if g_Table["VF_zoeken configuration"]["ControlSeparator"] ~= nil then
			g_location_separator = g_Table["VF_zoeken configuration"]["LocationSeparator"]
		end
		if g_Table["VF_zoeken configuration"]["ControlSeparator"] ~= nil then
			g_control_separator = g_Table["VF_zoeken configuration"]["ControlSeparator"]
		end
		if g_Table["VF_zoeken configuration"]["MultiplierSeparator"] ~= nil then
			g_multiplier_separator = g_Table["VF_zoeken configuration"]["MultiplierSeparator"]
		end
		if g_Table["VF_zoeken configuration"]["SequenceSeparator"] ~= nil then
			g_sequence_separator = g_Table["VF_zoeken configuration"]["SequenceSeparator"]
		end
	end
	g_VfZoekenKeyShift = System.BitwiseXor( g_VfZoekenKey, MODIFIER_LEFT_SHIFT)
	g_VfZoekenKeyControl = System.BitwiseXor( g_VfZoekenKey, MODIFIER_LEFT_CONTROL)
end -- LoadSettingsFile

--------------------------------------------------------------------------------
--[[
	The function GetSection converts the appropriate section of the top-table into a tuple
	g_table_entries_lenght, g_table_entries
--]]
function GetSection( table, section)
	local t = {}
	local i = 0
	if section then
		for _, value in ipairs( table[section]) do
			i = i+1
			t[i] = value
--!			OutputDebugInfo({"GetSection:", tostring( i), ": ", t[i]})
		end
	end
	return i, t
end -- GetSection

--------------------------------------------------------------------------------
--[[
	The function GetSectionList converts a table into an "array" and returns the length of that array and the array itself
	The conversion is done by discarding all the keys, and storing only the values with a new incremental key starting at 1
--]]
function GetSectionList( table)
	local s = ""
	local t = {}
	local index = 1
	for _, value in ipairs( table) do
		t[index] = value
		index = index+1
	end
	return index, t
end -- GetSectionList


--------------------------------------------------------------------------------
--[[
	Dialog.ListBox uses a Lua table as an array, i.e. a table with implied numeric keys, starting at 1 and incremented by 1.
	As a consequence our table has to start at 1

	The user could alt-tab away from the dialog, activate another application, then return to the dialog.
	Inadvertently EventApplicationDeactivated is not called in this particular situation, so we can't detect
	this in a straightforward manner. Therefore we use the detour of the window title. 

	--]]
function SelectEntry( entryList )
	local title = GetWindowTitle()	-- ASCII-code string, representing the title of the main-window of the active application
	OutputDebugInfo({"SelectEntry title:",title}, OUT_MEDIUM )
	local options = {title = "Zoeken in "..title, text = "Maak een keus uit onderstaande lijst (Esc om te annuleren)", sort = 0, selected = 1}
	local custom = {"&Zoeken", "Zoek en &Klik", "Zoek en &Tab"}

	local index, action = ProvideListBox( options, entryList, custom)
	--[[!!!! this seems bogus to me now
	--ToDo HOWEVER I doubt whether this is worth the effort in the first place
	if GetWindowTitle() ~= title then
		-- If the user alt-tabbed out of the dialog to another application and back to the dialog, then
		--	GetWindowTitle will return the title of the application the user has alt-tabbed to.
		--	Therefore, we cancel the search.
		OutputDebugInfo("!!!! SelectEntry(), current window title ("..GetWindowTitle()..") does not match title at start "..title)
	end
	--]]
	if not (index == nil) then
		for i = 1, 30 do
			DebugSleep( 100, "!! SelectEntry:: sleep in the hope the dialog disappears") --needed because otherwise search sometimes takes place in the dialog window rather then the intended application window
			if title == GetWindowTitle() then break end									 --if we are lucky, the dialog has closed
		end
		DebugSleep( 200, "!! SelectEntry:: sleep one more time to be more sure. I dislike Dolphin once in a while") --needed because otherwise search sometimes takes place in the dialog window rather then the intended application window
	end
	return index, action
end -- SelectEntry


--------------------------------------------------------------------------------
--[[
	Dialog.ListBox uses a Lua table as an array, i.e. a table with implied numeric keys, starting at 1 and incremented by 1.
	As a consequence our table has to start at 1
	a single return value representing the selection
	--]]
function SelectForm( entryList )
	OutputDebugInfo({"SelectForm" }, OUT_LOW)
	local options = {title = "Select Form ("..tostring(g_SettingsFile)..")", text = "Maak een keus uit onderstaande lijst (Esc om te annuleren)", sort = 0, selected = 1}
	local custom = {"&Select"}

	return ProvideListBox( options, entryList, custom)
end -- SelectForm


--------------------------------------------------------------------------------
--[[
	Dialog.ListBox uses a Lua table as an array, i.e. a table with implied numeric keys, starting at 1 and incremented by 1.
	As a consequence our table has to start at 1
	in case custom is nil, a single return value representing the selection
	If a custom table is specified, the first return value represents the selection in the entrylist, the second value the selection in the custom list
--]]
function ProvideListBox( options, entryList, custom)
	local customLength = #custom
	table.insert( custom, "&lees ini-file")
	table.insert( custom, "&open ini-file")
	local index, action = Dialog.ListBox( options, entryList, custom)
	if index == 0 or index == nil then	--0 in case no entries exist at all and enter i.s.o. Esc is used
		index = nil
		OutputDebugInfo("!!!! ProvideListBox(), no selection made")
	else
		OutputDebugInfo("ProvideListBox() index: "..index.." action: "..tostring( action))
	end
	OutputDebugInfo("ProvideListBox() length: "..customLength.." action: "..tostring( action))
	if action == nil or action > customLength then
		if action ~= nil and action == customLength + 1 then
			--load and parse the ini-file into g_Table
			LoadSettingsFile()
		end
		if action ~= nil and action > customLength +1 then
			--open ini file in notepad
			if g_SettingsFile == nil then
				g_SettingsFile = g_defaultSettingsFile
			end
			if g_SettingsFile then
				local rc = os.execute("start notepad.exe "..g_SettingsFile )
			end
		end
		index = nil
		action = nil
	end
	return index, action
end -- ProvideListBox


--------------------------------------------------------------------------------
--[[ 
	The function PerformSequencesSearch breaks down the compound search strings
	into individual compound entries at the sequence operator (Default: ++)
	compound search string format:  {~~x~y|string[--n]}[@@action]*[++{~~x~y|string[--n]}[@@action]*]*  [;;comment]
	Each compound entry is successively processed by PerformSearch.
	As soon as processing a compound entry fails, PerformSequencesSearch stops further processing.
	
	PerformSequencesSearch is called by by PerformQuickSearch, PerformInitialSearch and augmentEntrySearch
	return status (to be used to turn back modifications of search parameters)
		true if each component is succesfully processed, false if not 
--]]
function PerformSequencesSearch( entry)
	if entry == nil then
		OutputDebugInfo({"!!!! PerformSequencesSearch: nil entry selection "}, OUT_HIGH)
		return false
	end

	OutputDebugInfo({"PerformSequencesSearch::entry: ", entry})

	local start = string.find( entry, g_comment_separator) 	-- check for comment 
	if start then											-- if comment present
		entry = string.sub( entry, 1, start - 1)			-- strip the comment
	end
	entry = string.gsub(entry, "%s+", "")					-- strip trailing white space

	local rc = false					--presume failure
	local forwardFlag = true			--search forward
	--process each component in entry
	local i = 1
	--ToDo 2017/01/10 adhoc change at Achmea's premises Check the general consequences !!!!
	local action = g_TableSelectedAction
	g_TableSelectedAction = 0
	for sequence in gsplit2( entry, g_sequence_separator) do
		OutputDebugInfo({"PerformSequencesSearch:: sequence: ", i, "<"..sequence..">"}, OUT_LOW)
		rc = PerformSearch( sequence, i == 1, true)	--move VF to top of area only the first time, allways serach forward
		if not rc then break end
		i = i + 1
	end
	--ToDo 2017/01/10 adhoc change at Achmea's premises Check the general consequences !!!!
 	myWrapper( VF.Action, "PerformSequencesSearch() i.s.o. in PerformSearch::VF.Action( CLICK_MOVE_ONLY) "..CLICK_MOVE_ONLY, CLICK_MOVE_ONLY)		--ToDo getting desparate, is this the solution
 	myWrapper( VF.Action, "PerformSequencesSearch() i.s.o. in PerformSearch::VF.Action( CLICK_FOCUS) "..CLICK_FOCUS, CLICK_FOCUS)					--ToDo getting desparate, is this the solution
	return rc
end -- PerformSequencesSearch


--[[------------------------------------------------------------------------------
--]]
function gsplit2( s, sep)
	OutputDebugInfo({"gsplit2(): ", tostring( s), tostring( sep)}, OUT_MEDIUM)
	local lasti, done, g = 1, false, s:gmatch('(.-)'..sep..'()')
	return function()
		if done then return end
		local v, i = g()
		if s == '' or sep == '' then done = true return s end
		if v == nil then done = true return s:sub( lasti) end
		lasti = i
		return v
	end
end


--------------------------------------------------------------------------------
--[[ return status: true if found, false if not found
	 
	ToDo: explain the use of empty text in compoundEntry parameter
	ToDo: if not iniFlag then probably g_TableSelectedIndex should play a role
	compoundEntry format:  {~~x~y|string[--n]}[@@action]*
	the "++" is handled by PerformSequencesSearch
	PerformSequencesSearch is called by by PerformQuickSearch, PerformInitialSearch and augmentEntrySearch
	PerformSearch handles {~~x~y|string[--n]}[@@action]*
	--]]
function PerformSearch( compoundEntry, iniFlag, forwardFlag)
	OutputDebugInfo({"----------PerformSearch(", tostring(compoundEntry), ",", tostring( iniFlag), ",", tostring( forwardFlag), ")"}, OUT_MEDIUM)
	local title = GetWindowTitle()						--mostly to log it for debugging and sanity check at completion

	--sanity check the parameters
	if compoundEntry == nil then
		OutputDebugInfo({"!!!! PerformSearch(): nil entry compoundEntry "}, OUT_HIGH)
		return false
	end
 	if forwardFlag == nil then forwardFlag = true end
	if iniFlag == nil then iniFlag = true end

	local splitResult = {}
	--separate compoundEntry into compound search text (in compoundText variable) and action strings (in compoundAction array)
	local index = 0
	local compoundText
	local compoundAction={}
	for part in gsplit2( compoundEntry, g_action_separator) do
		if index == 0 then
			compoundText = part
			if compoundText ~= "" then
				OutputDebugInfo({"compoundText:", compoundText}, OUT_MEDIUM)
				prepareVfFocus( iniFlag)				--activate and possibly move VF only if at least some search-text specified
			else
				OutputDebugInfo({"!! compoundText empty, skip prepareVfFocus, i.e. no avtivate VF, no move to top of area"}, OUT_HIGH)
			end
		else compoundAction[index] = part
			OutputDebugInfo({"compoundAction", index, ":", compoundAction[index]}, OUT_MEDIUM)
		end
		index = index + 1
	end

	--separate compoundText into search text (in ... variable) and repeat count (in ......)
	index = 1
	for part in gsplit2( compoundText, g_multiplier_separator) do
		OutputDebugInfo({"compoundText part:", index, "<"..part..">"}, OUT_MEDIUM)
 		splitResult[index] = part
		index = index+1
	end
	local regSearchEntrie = nil							--preset at no (pseudo) regular expression search
	local searchEntrie = tostring( splitResult[1])		--convert to ANSI
	local multiplier
	if splitResult[2] == "*" then multiplier = 999 else multiplier = tonumber( splitResult[2]) end
	if multiplier == nil then
		multiplier = 1
	end
	OutputDebugInfo({"!!!! PerformSearch(): too many multipliers, ignored all but the first", tostring(splitResult[3])}, OUT_HIGH, splitResult[3] ~= nil) 
	OutputDebugInfo({"PerformSearch():", searchEntrie, " - ", multiplier}, OUT_MEDIUM)


	--ToDo improve this kludgy escape
	if searchEntrie == "%%decnum" then
		regSearchEntrie = searchEntrie
		searchEntrie = "."
	end

	local result = nil									--presume search is unsuccessful
	--ToDo improve this kludgy escape
	local a, b = string.find( searchEntrie, g_control_separator, 1, true) 
	if b and b >= 1 then
		OutputDebugInfo({"search for control_separator (", g_control_separator, ") O.K"}, OUT_MEDIUM)
		local myControl = string.sub( searchEntrie, b+1)
		result = performControlFunctionSearch( myControl, multiplier, iniFlag, forwardFlag )
		if result then result = 1 end			--convert return status
	else
		OutputDebugInfo({"sequence does not contain control_separator (", g_control_separator, ")"}, OUT_MEDIUM)

		--ToDo improve this kludgy escape
		if string.find( compoundText, g_location_separator) == 1 then	--ToDo only leading ~~ ?
			performXYSearch( compoundText)
			--ToDo performXYSearch should have a return status
			result = 1 							--For Now: simulate a success
--		end

--		if searchEntrie ~= "" then
		elseif searchEntrie ~= "" then
			local myDirection
			if forwardFlag then myDirection = DIRECTION_VF_NEXT else myDirection = DIRECTION_VF_PREVIOUS end
			local search = {direction = myDirection, scope = SCOPE_CURRENT_VF, scroll = 1, text = searchEntrie}
			if forwardFlag then myDirection = DIRECTION_VF_NEXT_OCCURRENCE else myDirection = DIRECTION_VF_PREVIOUS_OCCURRENCE end
			result = myWrapper( VF.FindText, "PerformSearch()::VF.FindText("..searchEntrie..")", search)
			local text = printAreaText()
			if regSearchEntrie then
				while result == 1 do
					if string.match( text, "%d+%.%d+") then break end		--merge with the main flow again for the time being ToDo improve this
					result = myWrapper( VF.FindNext, "PerformSearch()::VF.FindNext", myDirection)
					text = printAreaText()
				end
			end

			for times = multiplier-1, 1, -1 do
				if result ~= 1 then break end
				result = myWrapper( VF.FindNext, "PerformSearch()::VF.FindNext", myDirection)
				text = printAreaText()
			end
			if result ~= 1 then
				local msg = "!!!! VF.FindText/Next prematurely stopped for "..searchEntrie
				VF_zoekenStatusReport( 1, msg, "VF-zoeken::PerformSearch")
	--			Note that choosing the previous focus type with the VF.ChooseFocus will also restore the virtual focus position
	--			myWrapper( VF.RestorePosition)
			end
		end
	end
 	if result == 1 or (searchEntrie == "") then
		local action = g_TableSelectedAction
		OutputDebugInfo({"compoundAction:", tostring( compoundAction)}, OUT_MEDIUM)
		for index, act in ipairs( compoundAction) do
			performAction( act)
			local myLine = Speak.GetString( SCREEN_LINE)		--ToDo is there a more logical function
			OutputDebugInfo({"myLine within compoundAction loop:", tostring( myLine)}, OUT_MEDIUM)
			DebugSleep( g_DebugDelay, "compoundAction")
			action = 42											--ToDo resolve this kludgy escape
		end
		if action == 0 then		--Zoek	ToDo make this a meaning full constant or add comment
			OutputDebugInfo({"action 0: skip further action as action specified in ini-file"}, OUT_HIGH)
		elseif action == 1 then		--Zoek	ToDo make this a meaningfull constant or add comment
--![[		OutputDebugInfo({"action 1: skip further action as action is 'Zoek'"}, OUT_HIGH)
 			myWrapper( VF.Action, "performSearch()::VF.Action( CLICK_MOVE_ONLY) "..CLICK_MOVE_ONLY, CLICK_MOVE_ONLY)		--ToDo getting desparate, is this the solution
 			myWrapper( VF.Action, "performSearch()::VF.Action( CLICK_FOCUS) "..CLICK_FOCUS, CLICK_FOCUS)					--ToDo getting desparate, is this the solution
--]]
		elseif action == 2 then	--Zoek&Klik
--nv			myWrapper( VF.Action, "performSearch::VF.Action", CLICK_MOVE_ONLY)  ALSO used by original script
			OutputDebugInfo({"action 2: VF.Action( CLICK_LEFT)as action is 'Zoek&Klik'"}, OUT_HIGH)
			myWrapper( VF.Action, "performSearch()::VF.Action( CLICK_LEFT) "..CLICK_LEFT, CLICK_LEFT)
		elseif action == 3 then	--Zoek&Tab
			OutputDebugInfo({"action 3: VF.Action( CLICK_MOVE_ONLY)as action is 'Zoek&Tab'"}, OUT_HIGH)
			myWrapper( VF.Action, "performSearch()::VF.Action( CLICK_MOVE_ONLY) "..CLICK_MOVE_ONLY, CLICK_MOVE_ONLY)		--Move the mouse, but do not click
			myWrapper( VF.ChooseFocus, "performSearch()::VF.ChooseFocus( FOCUS_LIVE) "..FOCUS_LIVE, FOCUS_LIVE) 			-- Live focus moet nog naar de virtuele focus verplaatst worden...
			myWrapper( VF.Action, "performSearch()::VF.Action( CLICK_LEFT) "..CLICK_LEFT, CLICK_LEFT)
			DebugSleep( g_DebugDelay, "wait after simulated click before simulating tab")
			KeyPress( VK_TAB, 0, KEYPRESS_NORMAL)
		elseif action == 42 then	--intentionally dummified	
			--ToDo resolve this kludgy escape
		else
			OutputDebugInfo({"!!!! PerformSearch invalid action ", action}, OUT_HIGH)
		end
	end
    --On success, the virtual focus is moved to the text that was found. In order to update any magnification
    --highlighting, call Mag.Auto.
	local x = false
	local x = true
	if x then -- eXperiment
		myWrapper( Mag.Auto, "PerformSearch()::Mag.Auto()")
	else
		OutputDebugInfo({"????!!!! skip Mag.Auto()"}, OUT_HIGH)
	end


	--ToDo the design philosophy was to switch to VF and instruct the user to use numpad-minus to go back to
	--PC-focus when desired.
	--This does not work with catching the next keystrokes via EventApplicationKeyPress
	--For the time being, fall back FOCUS_BACK unconditionally
--! 	local x = true
--! 	local x = false
--! 	if x then -- eXperiment
--! 		myWrapper( Mag.ExecuteCommand, "PerformSearch()::Mag.ExecuteCommand( MAG_CMD_MOVE_SAVE) "..MAG_CMD_MOVE_SAVE, MAG_CMD_MOVE_SAVE)
--! 		myWrapper( VF.ChooseFocus, "PerformSearch()::VF.ChooseFocus( FOCUS_BACK) "..FOCUS_BACK, FOCUS_BACK)  --ToDo only if search failed ?????
--! 	else
--! 		OutputDebugInfo({"????!!!! PerformSearch: skip VF.ChooseFocus( FOCUS_BACK)"}, OUT_HIGH)
--! 	end

	if GetWindowTitle() ~= title then
		OutputDebugInfo({"!!!! PerformSearch(), current window title ("})
		OutputDebugInfo({"!!!! PerformSearch(), current window title (", tostring(GetWindowTitle()), ") does not match title at start", tostring(title)})
		OutputDebugInfo("!!!! PerformSearch(), current window title ("..tostring(GetWindowTitle())..") does not match title at start "..tostring(title))
	end

	return result == 1
end -- PerformSearch

--[[------------------------------------------------------------------------------
The function prepareVfFocus activates the VirtualFocus.
Depending on the iniFlag, is the VF left alone or moved to the top of the area
----]]
function prepareVfFocus( iniFlag)
	local index = 1
	while System.CheckVariable( CHECK_MODE, nil) ~= MODE_VF and
		  myWrapper( VF.ChooseFocus, "prepareVfFocus()::VF.ChooseFocus( FOCUS_VF)"..FOCUS_VF, FOCUS_VF) ~= 1
	do
		--[[this is obscure code intended as workaround for Dolphin quirks
			However, it does not work usually. Once the VF focus can not be chosen, it can not be chosen at retries either.
			If the user switches back and forth to/from the desktop with Win-D, the problem is over. At least,
			on all occasions where this is tried so far.
		--]]
		if index == 7 then
			OutputDebugInfo("!!!! prepareVfFocus()::VF.ChooseFocus gave up at run#: "..index)
			-- change to VF failed, so no need to restore, which I guess means: do not restore
			return 
		end
		DebugSleep( g_DebugDelay, "prepareVfFocus():: waiting before retrying to switch to VF")
		index = index+1
	end
	OutputDebugInfo({"!! prepareVfFocus(): Warning VF.ChooseFocus initially unsuccessful, successful at run#:", index}, OUT_HIGH, index > 1)

--	myWrapper( VF.StorePosition, "prepareVfFocus()::VF.StorePosition")
 	if iniFlag then
		myWrapper( VF.Move, "prepareVfFocus()::VF.Move( MOVE_VF_AREA_TOP) "..MOVE_VF_AREA_TOP, MOVE_VF_AREA_TOP)
--		DebugSleep( g_DebugDelay, "prepareVfFocus:: waiting after moving VF to top")  also part of myWrapper
	else
		OutputDebugInfo("prepareVfFocus(): iniFlag = false, hence skip :VF.Move( MOVE_VF_AREA_TOP)", OUT_MEDIUM)
 	end
end -- prepareVfFocus

--[[------------------------------------------------------------------------------
!! in the experimental phase, I experimented with modifications in PerformSearch:
!! 		OutputDebugInfo("!!!! PerformSearch():: skip all the VF riggamarole to test moveXY", OUT_HIGH)
	I also experimented with
	--MOUSEEVENTF_MOVE  Move the mouse 
	--MOUSEEVENTF_LEFTDOWN  Left button down 
	--MOUSEEVENTF_LEFTUP  Left button up 
	--MOUSEEVENTF_RIGHTDOWN  Right button down 
	--MOUSEEVENTF_RIGHTUP  Right button up 
	--MOUSEEVENTF_MIDDLEDOWN  Middle button down 
	--MOUSEEVENTF_MIDDLEUP  Middle button up 
	--MOUSEEVENTF_XDOWN  X button down 
	--MOUSEEVENTF_XUP  X button up 
	--MOUSEEVENTF_WHEEL  Mouse wheel movement 

	Note: with KeyPress you cannot simulate e.g. VK_MBUTTON

----]]
function performXYSearch( compoundText)
		local myX, myY = 0, 0
		local start, stop = string.find( compoundText, g_location_separator) 
		if start then
			myX = string.sub( compoundText, stop + 1)	--remove the leading ~~
			start = string.find( myX, "~") 				--find the Y-component
		end
		if start then
			myY = string.sub( myX, start+1)				--get the Y-component
		end
		if myY == nil then
			OutputDebugInfo({ "!!!! performXYSearch(): wrongly formatted XY in string", compoundText}, OUT_HIGH)
		else
			myX = string.sub( myX, 1, start-1) 			--get the X-component
			OutputDebugInfo({"performXYSearch(", compoundText, ") coordinates::<"..myX.."><"..myY..">" }, OUT_MEDIUM)

			local appArea = Area.GetCurrentApplication()
			if appArea == nil then
				OutputDebugInfo({ "!!!! performXYSearch()::Area.GetCurrentApplication() failed"})
			else
				local p = Area.GetProperties( appArea)
				OutputDebugInfo({"performXYSearch():: left:top:right:bottom:"..":"..p.left..":"..p.top..":"..p.right..":"..p.bottom.." text:"..tostring( p.text)}, OUT_MEDIUM)		--Uni-code
				myX = myX + p.left
				myY = myY + p.top
			end
			--ToDo decide whether we go by mouse or by VF
			--!! let's try as an alternative to nove to the desired location by mouse
 			local rc = System.MoveMouseTo( myX, myY, 1)
-- 			myWrapper( System.MoveMouseTo, "performXYSearch()::System.MoveMouseTo", myX, myY, 1)	--ToDo for some reason this does not work
 			OutputDebugInfo({tostring(System.MoveMouseTo), "performXYSearch()::System.MoveMouseTo(", myX, myY, 1, ") rc=", tostring(rc)}, OUT_MEDIUM)  
			local mouseFlag = System.BitwiseOr( MOUSEEVENTF_LEFTDOWN, MOUSEEVENTF_ABSOLUTE)
			myWrapper( Win.mouse_event, "!!?? REALLY NEEDED OR POSSIBLY EVEN COUNTERPRODUCTIVE performXYSearch()::Win.mouse_event(MOUSEEVENTF_LEFTDOWN)", mouseFlag, myX, myY, 0, 0)
			DebugSleep( 100, "sleep after MOUSEEVENTF_LEFTDOWN")
			mouseFlag = System.BitwiseOr( MOUSEEVENTF_LEFTUP, MOUSEEVENTF_ABSOLUTE)
			myWrapper( Win.mouse_event, "!!?? REALLY NEEDED OR POSSIBLY EVEN COUNTERPRODUCTIVE performXYSearch()::Win.mouse_event(MOUSEEVENTF_LEFTUP)", mouseFlag, myX, myY, 0, 0)
			DebugSleep( 100, "sleep after MOUSEEVENTF_LEFTUP")

			myWrapper( VF.ChooseFocus, "performXYSearch()::VF.ChooseFocus(FOCUS_ROUTE_TO_MOUSE)", FOCUS_ROUTE_TO_MOUSE)		--  Routes the virtual focus to the mouse position 

			myWrapper( Mag.Auto, "performXYSearch()::Mag.Auto()")

--EvenNiet			--move to the desired location by VF
--EvenNiet			myWrapper( VF.MoveToXY, "performXYSearch()::VF.MoveToXY",  myX, myY)
--EvenNiet			myWrapper( VF.Action, "performXYSearch()::VF.Action( CLICK_MOVE_ONLY) "..CLICK_MOVE_ONLY, CLICK_MOVE_ONLY)		--ToDo getting desparate, is this the solution
--EvenNiet			myWrapper( VF.Action, "performXYSearch()::VF.Action( CLICK_FOCUS) "..CLICK_FOCUS, CLICK_FOCUS)					--ToDo getting desparate, is this the solution
		end
end -- performXYSearch		


--[[------------------------------------------------------------------------------
-- inspired by JvdG
 1:01087 13:23:27 13752539 n:5 Colour is bleek grijs rgb:219:216:209 sumrgb:56754 rc6745002
 1:01088 13:23:27 13160660 n:6 Colour is bleek grijs rgb:212:208:200 sumrgb:54332 rc7668646
 multiple pixel_rgb values (13752539 en 13160660) are translated to the same color "bleek grijs"
 possibly if you would look at the hex it is obvious how pixel_rgb relates to the r,g en b value
--]]
function pixelTest( myX, myY)
	local rc = 0			--accumulated sort of sumcheck
	local pixel_rgb			--colour of the pixel based on screen-coordinates
	local msg
	local i = 0
	for n = 0, 10, 1 do 
		pixel_rgb = System.GetPixel( myX + n, myY ) --  + n) 				
		if pixel_rgb == nil then msg = "!! nilpixel n:" .. n
		else
	 		msg = pixel_rgb .. " n:" .. n .. " Colour is " ..  tostring(System.GetInfo( INFO_RGB_DESCRIPTION, pixel_rgb)) 
		end
		local rgb = System.ExtractRGB(System.GetPixel(myX+n, myY+n))		--J's fashion
		if rgb == nil then msg = msg .. "!! nil rgb"
		else
			local sumrgb = rgb.red+rgb.green*15+rgb.blue*255
			i = i + 1
			rc = rc + sumrgb*i
	 		msg = msg .. " rgb:" .. rgb.red ..":" ..rgb.green .. ":" ..rgb.blue .. " sumrgb:" ..  sumrgb .. " rc" .. rc
		end
		OutputDebugInfo(msg)
	end
	OutputDebugInfo({"pixelTest(", myX, ",", myY, ")=", rc, "window title", GetWindowTitle() }, OUT_HIGH)
	return rc
end -- pixelTest

--[[------------------------------------------------------------------------------
The function performControlFunctionSearch is a wrapper around performControlSearch, the basic function to serach for controls
This wrapper adds an escape to call special functions from the ini-file. 
Supported escapes are:
  -	FUNCTION_SCANCONTROL: collect all the controls which can be found per type 
--]]
function performControlFunctionSearch( ctrl, multiplier, iniFlag, forwardFlag )
	OutputDebugInfo({"performControlFunctionSearch(", tostring(ctrl)}, OUT_MEDIUM)
	if ctrl == "FUNCTION_SCANCONTROLCOUNT" then
		scanControlCount()
	elseif ctrl == "FUNCTION_SCANCONTROLVERBOSE" then
		scanControlVerbose()
	else
		performControlSearch( ctrl, multiplier, iniFlag, forwardFlag )
	end
end -- performControlFunctionSearch	


--[[--------------------------------------------------------------------------------
--]]
function scanControlCount()
	local msg = "--------scanControlCount--------\r\ncount control"
	local area = Area.GetCurrentApplication() 
	for key, ctrl in pairs(AreaTypeTable) do
		local count = 0				--presume none found
		local myArea = Area.FindFirstType( area, key, {0}, SORT_ROWS)
		while myArea do
			count = count +1
--					msg = msg .. "\r\nArea.FindNextType result=" .. tostring( myArea)
--					local p = Area.GetProperties( myArea) or nilProperties		-- a 1-line workaround
--					local cx, cy = Utils.RectCenter( p)
--					msg = msg .. "\r\nmyArea:: l:t:r:b:"..":".. p.left..":".. p.top..":".. p.right..":".. p.bottom .. " center=" .. cx .. ":" .. cy
--					msg = msg .. " hwnd:" .. tostring( p.hwnd) .. " type:"	.. tostring( p.type)	 .. " text:"..tostring( p.text)
			myArea = Area.FindNextType( area, key, {0}, SORT_ROWS, myArea) 
		end
		msg = msg .. string.format( "\r\n%d\t%02d=%s", count, key, ctrl)
	end
	OutputDebugInfo({ msg }, OUT_HIGH)
end -- scanControlCount


--[[--------------------------------------------------------------------------------
function OutputDebugInfo(string_table, debug_level, debug_flag, console_flag)
--]]
function scanControlVerbose()
	local tbl = {}
	local msg = "--------scanControlVerbose--------"
	OutputDebugInfo({ msg }, OUT_HIGH, nil, false)
	local area = Area.GetCurrentApplication() 
	for key, ctrl in pairs(AreaTypeTable) do
		local count = 0				--presume none found
		msg = string.format( "  ------control %02d=%s", key, ctrl)
--		OutputDebugInfo({ "\r\n\r\n1::", msg }, OUT_HIGH)
		local myArea = Area.FindFirstType( area, key, {0}, SORT_ROWS)
		while myArea do
			count = count + 1
			local p = Area.GetProperties( myArea)
			if p == nil then
				OutputDebugInfo({ "!!!! scanControlVerbose failed to get properties for area", count }, OUT_HIGH)
			else
--				local cx, cy = Utils.RectCenter( p)
--				msg = msg .. string.format("\r\n\tl:%04d t:%04d r:%04d b:%04d center:%04d-%04d", p.left, p.top, p.right, p.bottom, cx, cy)
--				OutputDebugInfo({ "\r\n\r\n2::", msg }, OUT_HIGH)
				tbl[count] = GetProperties(p)
--				OutputDebugInfo({ "\r\n\r\n3::", msg }, OUT_HIGH)
				myArea = Area.FindNextType( area, key, {0}, SORT_ROWS, myArea) 
			end
		end
		if count > 0 then 
--			OutputDebugInfo({ "\r\n\r\n4::", count, "------", msg }, OUT_HIGH)
--C:\Users\Tester\AppData\Local\Dolphin\SnovaSuite1505\Settings\Wordpad.lua : Lua script error: DoOperation: couldn't pass parameter to function
--			OutputDebugInfo({ msg }, OUT_HIGH)
			OutputDebugInfo( {msg}, OUT_HIGH, nil, false)
			for i = 1, count do
				if tbl[i] then 
					for name, value in pairs(tbl[i]) do
						OutputDebugInfo({ i, ":", name, "::", value}, OUT_HIGH, nil, false )
					end
				end
			end
		end
	end
end -- scanControlVerbose

--[[------------------------------------------------------------------------------
--]]
function performControlSearch( ctrl, multiplier, iniFlag, forwardFlag )
	local myArea = nil
	local msg = ""

	g_ctrl = GetKeyForValue( AreaTypeTable, ctrl )				--convert string representation into numerical ID
	OutputDebugInfo({"performControlSearch(", tostring(ctrl), "=", tostring(g_ctrl), "),",
			         tostring(multiplier), ", ", tostring( iniFlag), ", ", tostring( forwardFlag)}, OUT_LOW) -- ToDo add code to handle iniFlag and forwardFlag
	if not iniFlag then
		local modifier = g_VfZoekenKeyShift;
		if forwardFlag then modifier = MODIFIER_NONE end
		myArea = tableMove( KEY_TAB, modifier)
	else 
		local appArea = Area.GetCurrentApplication()
		if appArea == nil then
			msg = "!!!! performControlSearch()::GetCurrentApplication failed"
			playSound(5)											--Dolphin error
		else	-- elseif iniFlag then   is now superfluos 
			local p = Area.GetProperties( appArea) or nilProperties	-- ToDo!!!! limit area for subsequent searches to this initial area
			msg = string.format("performControlSearch():: appArea left:%04d top:%04d right:%04d bottom:%04d text:%s", 
				  p.left, p.top, p.right, p.bottom, "<"..tostring( p.text)..">")		--Uni-code
			myArea = Area.FindFirstType( appArea, g_ctrl, {0}, SORT_ROWS)
			if myArea == nil then
				msg = msg.."\r\n\t!! performControlSearch()::Area.FindFirstType() failed"
			elseif DEBUGLEVEL >= OUT_MEDIUM then					--no use to collect info if we don't print it anyway
				p = Area.GetProperties( myArea) or nilProperties
				local cx, cy = Utils.RectCenter( p)					-- screen coordinates
				msg = msg .. string.format( "\r\n\t\t\t\t\t\t FindFirstType():: myArea  left:%04d top:%04d right:%04d bottom:%04d center=%04d:%04d type:%s\ttext:%s",
					  p.left, p.top, p.right, p.bottom, cx, cy, tostring( p.type), "<"..tostring( p.text)..">")
			end
			multiplier = multiplier - 1
--		else is now superfluos
--			myArea = appArea										--force first time through loop for subsequent
--		end
			while myArea and multiplier > 0 do
				if string.len( msg) > 2000 then
					OutputDebugInfo({ msg}, OUT_MEDIUM)
					msg = ""
				end
				multiplier = multiplier - 1
				myArea = Area.FindNextType( appArea, g_ctrl, {0}, SORT_ROWS, myArea) --ToDo actually use location
				if myArea == nil then
					msg = msg.."\r\n!! performControlSearch()::Area.FindNextType() failed"
				else
					local p = Area.GetProperties( myArea) or nilProperties
					local cx, cy = Utils.RectCenter( p)				-- screen coordinates
					msg = msg.."\r\nFindNextType myArea:: l:t:r:b:"..":"..p.left..":"..p.top..":"..p.right..":"..p.bottom..
								 "\tcenter="..cx..":"..cy.."\ttype:"..tostring( p.type).."\ttext:<"..tostring( p.text)..">"
				end
			end
			OutputDebugInfo({ msg}, OUT_MEDIUM)
			msg = ""
			if not myArea then -- playSound(4) 							--user "error" ((or 1st or 2nd step in g_VfZoekenKey-C in CBM fails))
			else
				local p = Area.GetProperties( myArea) or nilProperties
				g_cx, g_cy = Utils.RectCenter( p)						-- screen coordinates
				myWrapper( VF.MoveToXY, "performControlSearch()::VF.MoveToXY",  g_cx, g_cy)
		--		local x = true
		--		local x = false
		--		if x then -- eXperiment
		--			myWrapper( VF.Action, "performControlSearch()::VF.Action( CLICK_MOVE_ONLY) "..CLICK_MOVE_ONLY, CLICK_MOVE_ONLY) -- 		skip, either done in performSearch or in PerformGotoControl
		--		else
		--			OutputDebugInfo({"????!!!! performControlSearch()::skip VF.Action( CLICK_MOVE_ONLY)"}, OUT_HIGH) -- 		skip, either done in performSearch or in PerformGotoControl
		--		end
				myWrapper( VF.Action, "performControlSearch()::VF.Action( CLICK_FOCUS) "..CLICK_FOCUS, CLICK_FOCUS) -- 		skip, either done in performSearch or in PerformGotoControl
				--report current focus type
				local focusMode = System.CheckVariable( CHECK_MODE )
				OutputDebugInfo({"performControlSearch()  at  exit, focusMode: ", tostring(focusMode), tostring( ModeTable[focusMode])}, OUT_HIGH)
			end
		end
	end
	return myArea
end -- performControlSearch


--[[------------------------------------------------------------------------------
printAreaText is a debugging/logging aid to retrieve text where the VF happens to be located
--]]
function printAreaText()
	local text = ""
	local current_area = Area.GetCurrentLine()
	if current_area == nil then
		OutputDebugInfo("areaLine: No Current Area !!!! fall back at Speak.GetString")
		text = tostring( Speak.GetString( SCREEN_LINE))		--ToDo is there a more logical function
		OutputDebugInfo("speakLine: "..text)
	else
		local area_prop = Area.GetProperties( current_area)
		text = tostring( area_prop.text)
		OutputDebugInfo("areaLine: "..text)
	end
	return text
end -- printAreaText


--[[------------------------------------------------------------------------------
	more convoluted actions can be done, e.g.
	elseif action == "courier" then
		do_keypress_sequence("COURIER")
		KeyPress( VK_TAB, 0, KEYPRESS_NORMAL)
		do_keypress_sequence("STANDAARD")
		KeyPress( VK_TAB, 0, KEYPRESS_NORMAL)
		do_keypress_sequence("10")
	elseif action == "verdana" then
		do_keypress_sequence("VERDANA")
		KeyPress( VK_TAB, 0, KEYPRESS_NORMAL)
		do_keypress_sequence("VET")
		KeyPress( VK_TAB, 0, KEYPRESS_NORMAL)
		do_keypress_sequence("40")
--]]
function performAction( action)
	local s = "performAction()::VF.Move(("..action.."))"		-- prepare output-string for myWrapper
	--VF.MOVE based actions
	local a = nil												-- set action to be performed
	if     action == "ab" then a = MOVE_VF_AREA_BOTTOM
	elseif action == "at" then a = MOVE_VF_AREA_TOP
	elseif action == "cl" then a = MOVE_VF_CHAR_LEFT			-- One character left
	elseif action == "cr" then a = MOVE_VF_CHAR_RIGHT			-- One character right
	elseif action == "le" then a = MOVE_VF_LINE_END				-- End of the line
	elseif action == "lm" then a = MOVE_VF_VIRTUAL				-- Line mode
	elseif action == "ln" then a = MOVE_VF_LINE_NEXT			-- Next line
	elseif action == "lp" then a = MOVE_VF_LINE_PREVIOUS		-- Previous line
	elseif action == "ls" then a = MOVE_VF_LINE_START			-- Start of the line
	elseif action == "on" then a = MOVE_VF_OBJECT_NEXT			-- Next object
	elseif action == "op" then a = MOVE_VF_OBJECT_PREVIOUS		-- Previous object
	elseif action == "pn" then a = MOVE_VF_PARAGRAPH_NEXT		-- Next paragraph
	elseif action == "pp" then a = MOVE_VF_PARAGRAPH_PREVIOUS	-- Previous paragraph
	elseif action == "ps" then a = MOVE_VF_PARAGRAPH_START		-- Start of paragraph
	elseif action == "pb" then a = MOVE_VF_PHYSICAL_BOTTOM		-- Bottom of the physical area
	elseif action == "pd" then a = MOVE_VF_PHYSICAL_DOWN		-- Physically downwards
	elseif action == "pl" then a = MOVE_VF_PHYSICAL_LEFT		-- Physically left
	elseif action == "pt" then a = MOVE_VF_PHYSICAL_ON_OFF		-- Toggle physical movement
	elseif action == "pr" then a = MOVE_VF_PHYSICAL_RIGHT		-- Physically right
	elseif action == "pt" then a = MOVE_VF_PHYSICAL_TOP			-- Top of the physical area
	elseif action == "pu" then a = MOVE_VF_PHYSICAL_UP			-- Physically upwards
	elseif action == "sn" then a = MOVE_VF_SENTENCE_NEXT		-- Next sentence
	elseif action == "sp" then a = MOVE_VF_SENTENCE_PREVIOUS	-- Previous sentence
	elseif action == "ss" then a = MOVE_VF_SENTENCE_START		-- Start of sentence
	elseif action == "cf" then a = MOVE_VF_START_ATTR			-- First character with same attribute
	elseif action == "td" then a = MOVE_VF_TABLE_DOWN			-- Down in a table
	elseif action == "tc" then a = MOVE_VF_TABLE_HEADING_COLUMN	-- Table column heading
	elseif action == "tr" then a = MOVE_VF_TABLE_HEADING_ROW	-- Table row heading
	elseif action == "tl" then a = MOVE_VF_TABLE_LEFT			-- Left in a table
	elseif action == "tr" then a = MOVE_VF_TABLE_RIGHT			-- Right in a table
	elseif action == "tu" then a = MOVE_VF_TABLE_UP				-- Up in a table
	elseif action == "wl" then a = MOVE_VF_WORD_LEFT			-- Left a word
	elseif action == "wr" then a = MOVE_VF_WORD_RIGHT			-- Right a word
	end
	if a then myWrapper( VF.Move, s, a)							-- At last, do the actual VF.MOVE
	
	--KeyPress based actions							ToDo if this is basically tested then restructure as the actions above
	elseif action == "space" then -- a = VK_SPACE		ToDo if this is basically tested then restructure as the actions above
		KeyPress( VK_SPACE , 0, KEYPRESS_NORMAL)
	elseif action == "bs" then
		KeyPress( VK_BACKSPACE, 0, KEYPRESS_NORMAL)
	elseif action == "ret" then
		KeyPress( VK_RETURN, 0, KEYPRESS_NORMAL)
	elseif action == "tab" then
		KeyPress( VK_TAB, 0, KEYPRESS_NORMAL)
	elseif action == "nummin" then
		KeyPress( VK_SUBTRACT, 0, KEYPRESS_NORMAL)
	elseif action == "ad" then 							-- down
 		KeyPress( VK_DOWN, 0, KEYPRESS_NORMAL) 		--I guess this won't work either, just like VK_RIGHT
	elseif action == "al" then 							-- arrow left
		KeyPress( VK_LEFT, 0, KEYPRESS_NORMAL) 		--I guess this won't work either, just like VK_RIGHT
	elseif action == "ar" then 							-- right
		KeyPress( VK_RIGHT, 0, KEYPRESS_NORMAL) 		--beweegt in tabbladen i.p.v. in veld	performAction("r") --arrow right
	elseif action == "au" then 							-- up
		KeyPress( VK_UP, 0, KEYPRESS_NORMAL)  		--I guess this won't work either, just like VK_RIGHT
	elseif action == "a" then
		KeyPress( VK_A, 0, KEYPRESS_NORMAL)
	elseif action == "k" then 							-- klik
		KeyPress( VK_K, 0, KEYPRESS_NORMAL)
	elseif action == "l" then
		KeyPress( VK_L, 0, KEYPRESS_NORMAL)
	elseif action == "s" then 							-- right
		KeyPress( VK_S , 0, KEYPRESS_NORMAL)
	elseif action == "t" then 							-- tab
		KeyPress( VK_T, 0, KEYPRESS_NORMAL)
	elseif action == "u" then 							-- up
		KeyPress( VK_U, 0, KEYPRESS_NORMAL)  		--I guess this won't work either, just like VK_RIGHT
--	if a then myWrapper( KeyPress, 0, a)				-- At last, do the actual keypres		ToDo if this is basically tested then restructure as the actions aboves

	--VF.Action based actions
	elseif action == "activate_down" then
		myWrapper( VF.Action, "performAction()::VF.Action( ACTIVATE_DOWN) "..ACTIVATE_DOWN, ACTIVATE_DOWN)										-- Activate the item, scrolling it down 
	elseif action == "activate_press" then
		myWrapper( VF.Action, "performAction()::VF.Action( ACTIVATE_PRESS) "..ACTIVATE_PRESS, ACTIVATE_PRESS)									-- Activate the item 
	elseif action == "activate_up" then
		myWrapper( VF.Action, "performAction()::VF.Action( ACTIVATE_UP) "..ACTIVATE_UP, ACTIVATE_UP)											-- Activate the item, scrolling it up 
	elseif action == "click_focus" then
		myWrapper( VF.Action, "performAction()::VF.Action( CLICK_FOCUS) "..CLICK_FOCUS, CLICK_FOCUS)											-- Set the input focus 
	elseif action == "click_hover" then
		myWrapper( VF.Action, "performAction()::VF.Action( CLICK_HOVER) "..CLICK_HOVER, CLICK_HOVER)											-- Cause the mouse to hover over the item 
	elseif action == "click_left" then
		myWrapper( VF.Action, "performAction()::VF.Action( CLICK_LEFT) "..CLICK_LEFT, CLICK_LEFT)												-- Perform a single left mouse click 
	elseif action == "click_left_double" then
		myWrapper( VF.Action, "performAction()::VF.Action( CLICK_LEFT_DOUBLE) "..CLICK_LEFT_DOUBLE, CLICK_LEFT_DOUBLE)							-- Perform a double left mouse click 
	elseif action == "click_middle" then
		myWrapper( VF.Action, "performAction()::VF.Action( CLICK_MIDDLE) "..CLICK_MIDDLE, CLICK_MIDDLE)											-- Perform a single middle mouse click 
	elseif action == "click_middle_double" then
		myWrapper( VF.Action, "performAction()::VF.Action( CLICK_MIDDLE_DOUBLE) "..CLICK_MIDDLE_DOUBLE, CLICK_MIDDLE_DOUBLE)					-- Perform a double middle mouse click 
	elseif action == "click_mouse_wheel_down" then
		myWrapper( VF.Action, "performAction()::VF.Action( CLICK_MOUSE_WHEEL_DOWN) "..CLICK_MOUSE_WHEEL_DOWN, CLICK_MOUSE_WHEEL_DOWN)			-- Simulate moving the mouse wheel down 
	elseif action == "click_mouse_wheel_up" then
		myWrapper( VF.Action, "performAction()::VF.Action( CLICK_MOUSE_WHEEL_UP) "..CLICK_MOUSE_WHEEL_UP, CLICK_MOUSE_WHEEL_UP)					-- Simulate moving the mouse wheel up 
	elseif action == "click_move_only" then
		myWrapper( VF.Action, "performAction()::VF.Action( CLICK_MOVE_ONLY) "..CLICK_MOVE_ONLY, CLICK_MOVE_ONLY)								-- Move the mouse, but do not click 
	elseif action == "click_right" then
		myWrapper( VF.Action, "performAction()::VF.Action( CLICK_RIGHT) "..CLICK_RIGHT, CLICK_RIGHT)											-- Perform a single right mouse click 
	elseif action == "click_right_double" then
		myWrapper( VF.Action, "performAction()::VF.Action( CLICK_RIGHT_DOUBLE) "..CLICK_RIGHT_DOUBLE, CLICK_RIGHT_DOUBLE)						-- Perform a double right mouse click 


	elseif action == "bb_special1" then 	
--! 		myWrapper( VF.ChooseFocus, "chooseFocus(FOCUS_LIVE) "..FOCUS_LIVE, FOCUS_LIVE)			-- 						0	Selects live focus
		do_keypress_sequence("B")
	elseif action == "bb_special2" then 	
		do_keypress_sequence("B.K")
	elseif action == "bb_special3" then 	
--! 		myWrapper( VF.ChooseFocus, "chooseFocus(FOCUS_LIVE) "..FOCUS_LIVE, FOCUS_LIVE)			-- 						0	Selects live focus
		do_keypress_sequence("B.M.")			--	B.M.")
	elseif action == "bb_special4" then 	
		do_keypress_sequence("Z")

		
	elseif action == "focus_live" then 	
		myWrapper( VF.ChooseFocus, "chooseFocus(FOCUS_LIVE) "..FOCUS_LIVE, FOCUS_LIVE)															-- 0	Selects live focus
	elseif action == "focus_vf" then 
		myWrapper( VF.ChooseFocus, "chooseFocus(FOCUS_VF) "..FOCUS_VF, FOCUS_VF)																-- 1	Selects virtual focus mode
	elseif action == "focus_area_vf" then 	
		myWrapper( VF.ChooseFocus, "chooseFocus(FOCUS_AREA_VF) "..FOCUS_AREA_VF, FOCUS_AREA_VF)													-- 2	Selects area virtual focus
	elseif action == "focus_next_window" then 	
		myWrapper( VF.ChooseFocus, "chooseFocus(FOCUS_NEXT_WINDOW) "..FOCUS_NEXT_WINDOW, FOCUS_NEXT_WINDOW)										-- 3	Selects the next window in virtual focus
	elseif action == "focus_previous_window" then 	
		myWrapper( VF.ChooseFocus, "chooseFocus(FOCUS_PREVIOUS_WINDOW) "..FOCUS_PREVIOUS_WINDOW, FOCUS_PREVIOUS_WINDOW)							-- 4	Selects the previous window in virtual focus
	elseif action == "focus_next_app" then 	
		myWrapper( VF.ChooseFocus, "chooseFocus(FOCUS_NEXT_APP) "..FOCUS_NEXT_APP, FOCUS_NEXT_APP)												-- 5	Selects the next application in virtual focus
	elseif action == "focus_previous_app" then 	
		myWrapper( VF.ChooseFocus, "chooseFocus(FOCUS_PREVIOUS_APP) "..FOCUS_PREVIOUS_APP, FOCUS_PREVIOUS_APP)									-- 6	Select the previous application in virtual focus
	elseif action == "focus_next_window_main" then 	
		myWrapper( VF.ChooseFocus, "chooseFocus(FOCUS_NEXT_WINDOW_MAIN) "..FOCUS_NEXT_WINDOW_MAIN, FOCUS_NEXT_WINDOW_MAIN)						-- 7	Selects the next main window
	elseif action == "focus_previous_window_main" then 	
		myWrapper( VF.ChooseFocus, "chooseFocus(FOCUS_PREVIOUS_WINDOW_MAIN) "..FOCUS_PREVIOUS_WINDOW_MAIN, FOCUS_PREVIOUS_WINDOW_MAIN)			-- 8	Selects the previous main window
	elseif action == "focus_next_window_dialog" then 	
		myWrapper( VF.ChooseFocus, "chooseFocus(FOCUS_NEXT_WINDOW_DIALOG) "..FOCUS_NEXT_WINDOW_DIALOG, FOCUS_NEXT_WINDOW_DIALOG)				-- 9	Selects the next dialog window
	elseif action == "focus_previous_window_dialog" then 	
		myWrapper( VF.ChooseFocus, "chooseFocus(FOCUS_PREVIOUS_WINDOW_DIALOG) "..FOCUS_PREVIOUS_WINDOW_DIALOG, FOCUS_PREVIOUS_WINDOW_DIALOG)	-- 10	Selects the previous dialog window
	elseif action == "focus_route_to_live" then 	
		myWrapper( VF.ChooseFocus, "chooseFocus(FOCUS_ROUTE_TO_LIVE) "..FOCUS_ROUTE_TO_LIVE, FOCUS_ROUTE_TO_LIVE)								-- 11	Routes the virtual focus to the  live focus position
	elseif action == "focus_interactive" then 	
		myWrapper( VF.ChooseFocus, "chooseFocus(FOCUS_INTERACTIVE) "..FOCUS_INTERACTIVE, FOCUS_INTERACTIVE)										-- 12	Selects interactive mode
	elseif action == "focus_route_to_mouse" then 	
		myWrapper( VF.ChooseFocus, "chooseFocus(FOCUS_ROUTE_TO_MOUSE) "..FOCUS_ROUTE_TO_MOUSE, FOCUS_ROUTE_TO_MOUSE)							-- 13	Routes the virtual focus to the mouse position
	elseif action == "focus_selection" then 	
		myWrapper( VF.ChooseFocus, "chooseFocus(FOCUS_SELECTION) "..FOCUS_SELECTION, FOCUS_SELECTION)											-- 14	Restrict the virtual focus to the current selection
	elseif action == "focus_auto_area_vf" then 	
		myWrapper( VF.ChooseFocus, "chooseFocus(FOCUS_AUTO_AREA_VF) "..FOCUS_AUTO_AREA_VF, FOCUS_AUTO_AREA_VF)									-- 15	Selects auto area virtual focus
	elseif action == "focus_back" then 	
		myWrapper( VF.ChooseFocus, "chooseFocus(FOCUS_BACK) "..FOCUS_BACK, FOCUS_BACK)															-- 16	Switch focus to previous state
	elseif action == "focus_route_to_dom_vf" then 	
		myWrapper( VF.ChooseFocus, "chooseFocus(FOCUS_ROUTE_TO_DOM_VF) "..FOCUS_ROUTE_TO_DOM_VF, FOCUS_ROUTE_TO_DOM_VF)							-- 17	Routes the virtual focus to the DOM virtual focus



	--Miscellanuous actions
	elseif action == "focusback" then
		myWrapper( VF.ChooseFocus, "performAction()::VF.ChooseFocus( FOCUS_BACK) "..FOCUS_BACK, FOCUS_BACK)
	elseif action == "ctrl-space" then
		do_keypress_control_single_key(KEY_SPACE)		
	elseif action == "ctrl-4" then
		do_keypress_control_single_key(VK_4)	
	elseif action == "winlefttop" then
		ChangeWindowPos( KEY_NUMPAD_7)
	elseif action == "delay" then
		DebugSleep( 1000, "action:  delay")
	--no match sofar
	else
		OutputDebugInfo("unknown action: "..tostring( action))
	end
end -- performAction

--[[------------------------------------------------------------------------------
----]]
function PerformGotoControl( control)
	local rc = performControlSearch( control, 1, true, true )
	myWrapper( VF.Action, "PerformGotoControl()::VF.Action( CLICK_MOVE_ONLY) "..CLICK_MOVE_ONLY, CLICK_MOVE_ONLY)
	myWrapper( VF.Action, "PerformGotoControl()::VF.Action( CLICK_FOCUS) "..CLICK_FOCUS, CLICK_FOCUS)
	return rc
end -- PerformGotoControl	


--[[
 Scancode:  2 1
 Scancode:  3 2
 Scancode:  4 3
 Scancode:  5 4
 Scancode:  6 5
 Scancode:  7 6
 Scancode:  8 7
 Scancode:  9 8
 Scancode: 10 9
 Scancode: 11 0
 Scancode: 16 q
 Scancode: 17 w
 Scancode: 18 e
 Scancode: 19 r
 Scancode: 20 t
 Scancode: 21 y
 Scancode: 22 u
 Scancode: 23 i
 Scancode: 24 o
 Scancode: 25 p
 Scancode: 30 a
 Scancode: 31 s
 Scancode: 32 d
 Scancode: 33 f
 Scancode: 34 g
 Scancode: 35 h
 Scancode: 36 j
 Scancode: 37 k
 Scancode: 38 l
 Scancode: 44 z
 Scancode: 45 x
 Scancode: 46 c
 Scancode: 47 v
 Scancode: 48 b
 Scancode: 49 n
 Scancode: 50 m

Reference				513
The following values for move are available:
Value							Meaning
MOVE_VF_AREA_BOTTOM				Bottom of area
MOVE_VF_AREA_TOP				Top of area
MOVE_VF_CHAR_LEFT				One character left
MOVE_VF_CHAR_RIGHT				One character right
MOVE_VF_LINE_END				End of the line
MOVE_VF_LINE_NEXT				Next line
MOVE_VF_LINE_PREVIOUS			Previous line
MOVE_VF_LINE_START				Start of the line
MOVE_VF_OBJECT_NEXT				Next object
MOVE_VF_OBJECT_PREVIOUS			Previous object
MOVE_VF_PARAGRAPH_NEXT			Next paragraph
MOVE_VF_PARAGRAPH_PREVIOUS		Previous paragraph
MOVE_VF_PARAGRAPH_START			Start of paragraph
MOVE_VF_PHYSICAL_BOTTOM			Bottom of the physical area
MOVE_VF_PHYSICAL_DOWN			Physically downwards
MOVE_VF_PHYSICAL_LEFT			Physically left
MOVE_VF_PHYSICAL_ON_OFF			Toggle physical movement
MOVE_VF_PHYSICAL_RIGHT			Physically right
MOVE_VF_PHYSICAL_TOP			Top of the physical area
MOVE_VF_PHYSICAL_UP				Physically upwards
MOVE_VF_SENTENCE_NEXT			Next sentence
MOVE_VF_SENTENCE_PREVIOUS		Previous sentence
MOVE_VF_SENTENCE_START			Start of sentence
MOVE_VF_START_ATTR				First character with same attribute
MOVE_VF_TABLE_DOWN				Down in a table
MOVE_VF_TABLE_HEADING_COLUMN	Table column heading
MOVE_VF_TABLE_HEADING_ROW		Table row heading
MOVE_VF_TABLE_LEFT				Left in a table
MOVE_VF_TABLE_RIGHT				Right in a table
MOVE_VF_TABLE_UP				Up in a table
MOVE_VF_VIRTUAL					Line mode
MOVE_VF_WORD_LEFT				Left a word
MOVE_VF_WORD_RIGHT				Right a word
The line mode option reselects the current line, if the virtual focus is, for
example, on an object or character.
Not all situations support scrolling into view.
--]]
--
--
--
--
--[[-- Table Of Contents --------------------------------------------------------------------------



VF_ZoekenInitialize()
tableMove( scancode, modifier)
tableDown( appArea, myArea)
tableRight( appArea, myArea)
locateArea( searchArea)
routeLiveToVF( caller)
VF_zoekenKeyPress( scancode, modifier)
vf_zoeken_reportScancode( scancode, modifier)
PerformBabbageMode( scancode, modifier)
EventApplicationKeyPress( scancode, modifier)
do_keypress_sequence( sequence)
do_keypress_alt_sequence( sequence)
do_keypress_control_sequence( sequence)
do_keypress_control_single_key( key)
do_keypress_rightcontrol_rightshift_sequence( sequence)
VF_zoekenStatusReport( reportType, msgText, dialogText)
VF_zoekenDebugReport(scancode, modifier)
myWrapper( fun, location, par1, par2, par3, par4, par5)
StartBabbageMode( scancode, modifier)
StopBabbageMode()
PerformTitleSearch()
PerformQuickSearch( scancode, modifier)
findQbmEntry( t, s)
PerformFormSearch()
PerformInitialSearch( section)
PerformBackwardSearch()
PerformForwardSearch()
PerformRepeatedSearch( direction)
PerformNextEntrySearch()
PerformPrevEntrySearch()
augmentEntrySearch( scancode, modifier) -- ( direction)
GetWindowTitle()
LoadSettingsFile()
GetSection( table, section)
GetSectionList( table)
SelectEntry( entryList )
SelectForm( entryList )
ProvideListBox( options, entryList, custom)
PerformSequencesSearch( entry)
gsplit2( s, sep)
PerformSearch( compoundEntry, iniFlag, forwardFlag)
prepareVfFocus( iniFlag)
performXYSearch( compoundText)
pixelTest( myX, myY)
performControlSearch( ctrl, multiplier, iniFlag, forwardFlag )
printAreaText()
performAction( action)
PerformGotoControl( control)






ToDo 	
at the end of each action: if capslock is on, toggle capslock off
display comment als onderdeel van 'key=value ;;comment' regel
[window://naam]: 
i.h.g.v auto g_VfZoekenKey-E, skip the g_VfZoekenKey-whatever what caused it


Op productieserver#1: desktop shortcut: u4crm.cmd
 @echo off
 C:\Windows\System32\cmd.exe /C start /affinity 2 u4crm.exe


Get-Content C:\Users\carlotest\AppData\Local\dolphin\SnovaSuite1406\Settings\operation.log -Wait
Get-Content env:localappdata\dolphin\SnovaSuite1405\Settings\operation.log -Wait
Get-Content c:\Users\Tester\AppData\Local\Dolphin\SnovaSuite1405\Settings\operation.log -Wait
SCRIPT_NAME = "VF_zoeken"
--]]----------------------------------------------------------------------------
--[[
local hotkey_leftshift = System.BitwiseOr( g_VfZoekenKey, MODIFIER_LEFT_SHIFT)
C:\Users\Tester\AppData\Local\Dolphin\SnovaSuite1405\Settings\scripts\VF_zoeken.lua
	all keys are g_VfZoekenKey-based
	table move keys
		g_VfZoekenKey-{KEY_TAB, KEY_CURSOR_UP, KEY_CURSOR_DOWN, KEY_CURSOR_LEFT, KEY_CURSOR_RIGHT}
		g_VfZoekenKey-Lshift-KEY_TAB< {KEY_CURSOR_UP, KEY_CURSOR_DOWN, KEY_CURSOR_LEFT, KEY_CURSOR_RIGHT}
		g_VfZoekenKey-{KEY_PAGE_UP, KEY_PAGE_DOWN, KEY_HOME}
	inifile move keys 
		g_VfZoekenKey-KEY_SEMICOLON
		g_VfZoekenKey-Lshift-KEY_SEMICOLON
	standard VF_zoeken keys
		g_VfZoekenKey-{ KEY_A, .... , KEY_Z}
		g_VfZoekenKey-Lshift-KEY_N
	control mode keys
		g_VfZoekenKey-Lshift-KEY_C
	debug keys
		g_VfZoekenKey-Ralt-{KEY_B, KEY_D}

C:\Users\Tester\AppData\Local\Dolphin\SnovaSuite1405\Settings\scripts\BabbageSupport.lua
	active window and viewport move keys
		Rctrl-Rshift-{KEY_NUMPAD_1, ..., KEY_NUMPAD_9}
	debug keys
		Rctrl-KEY_B
		Rshift-KEY_B
		Ralt-KEY_B
		Ralt-KEY_T

C:\Users\Tester\AppData\Local\Dolphin\SnovaSuite1405\Settings\scripts\BabbageEngineering.lua
	debug keys
		Rshift-Rctrl-KEY_B

local SCRIPT_NAME = "VF_zoeken"
--]]

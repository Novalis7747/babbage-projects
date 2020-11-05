local SCRIPT_NAME = "UNIT4 Business Suite u4crm.exe.lua"
local SCRIPT_TIMESTAMP = "28-2-2017 19:49:59"

-- Copyright (C) 2016-2017 Babbage. All rights reserved.

-- Dolphin Script File for UNIT4 Business Suite u4crm.exe
-- 
-- starts the default VF_Zoeken facilities by including/requiring the VF_zoeken script
-- augments the default VF_zoeken facilities by registering a number of specific DK-x key combinations


local encryption = true					-- test the encrypted version of VF_zoeken
local encryption = false				-- test the plain version of VF_zoeken

require "BabbageConversionTables"
if encryption then
	System.Include "BabbageSupportEnc"	-- get OutputDebugInfo and associated constants
	System.Include "VF_zoekenEnc"
else
	require "BabbageSupport"			-- get OutputDebugInfo and associated constants
	require "VF_zoeken"
end

myPid = 0								-- remember the ProcessId passed in by EventScriptStartup
										-- you can get thePID again at runtime using e.g. System.GetProcessInfo (hwnd) 
										-- the PID is also used in some UIA functions
myName1 = "carlo"
myName2 = "Carlo"
myName3 = "Babbage"

local dsCount = 0										--detectionscript count for U4BS_DetectionScript
local myLeft, myTop , myRight, myBottom = 0, 0, 0, 0    --remember screencoordinates where the toolbar was last seen, so you can detect changes

--------------------------------------------------------------------------------
function EventScriptStartup( pid)
	myPid = pid
	-- output SOD message
	Win.MessageBeep (MB_OK) 
	OutputDebugInfo({"loaded pid", tostring(myPid), SCRIPT_NAME, "dated(", SCRIPT_TIMESTAMP, ")"}, OUT_HIGH)

	getMiscInfo( SCRIPT_NAME .. " EventScriptStartup")							-- log PID etc

	local fileName = "tasklist.log"
	local folderName = tostring( System.GetInfo( INFO_SCRIPT_DATA_PATH))
	fileName = string.format("%s\\%s", folderName, fileName)
	local myCmd = "cmd.exe /c tasklist /NH /V /FI \"PID eq " .. myPid ..  "\" > " .. fileName .. " 2>&1" -- c:\\tmp\\tasklist2.log 2>&1"
	local rc = os.execute(myCmd)
	OutputDebugInfo({myCmd, "rc::", rc}, OUT_HIGH)

	local file = io.open(fileName, "r")					-- open the file and set it as the default input file
	if file == nil then
		OutputDebugInfo({"EventScriptStartup::", fileName .. " not found"}, OUT_HIGH)
	else
		io.input(file)
		
		for l in io.lines() do  
			local line = tostring(l)
			OutputDebugInfo({"EventScriptStartup line::", line}, OUT_HIGH )
			if string.len( line ) > 10 then 
				local start, stop  = string.find(line, myName1 ) -- [, index [, plain]])
				if start == nil then
					start, stop  = string.find(line, myName2 ) -- [, index [, plain]])
				end
				if start == nil then
					start, stop  = string.find(line, myName3 ) -- [, index [, plain]])
				end
				if start == nil then
					OutputDebugInfo({"!!!! SHOULD !!!! EventScriptStartup bail out"}, OUT_HIGH)
--					return
				end
			end
		end
		OutputDebugInfo({"EventScriptStartup  congratulations, you continue for the next round"}, OUT_HIGH)
	end

	-- Set up a buffer to receive the string
	local name = System.AllocateUserData(128) 
	local size = System.AllocateUserData(8) 
	System.NumberToUserData (size, 64) 
	-- Call the DLL function GetUserName 
	local dll_function = {dll_name = "Advapi32.dll", function_name = "GetUserNameA", standard_call = 1, parameters = 2} 
 	local dll_params = {name, size} 
	System.CallDllFunction (dll_function, dll_params) 
	-- The variable buffer now contains the result  
	local msg = System.UserDataToString (name) 
	OutputDebugInfo({"GetUserNameA:", msg})

-- [[ this was very convenient during development. I assume it is no longer needed
	OutputDebugInfo({"raised ScriptIterationCount 10 times to 500.000"}, OUT_HIGH)
--	System.SetScriptIterationCount(2147483647)					-- I need the additional time due to accumulated sleep calls
	System.SetScriptIterationCount( 500000)						-- I need the additional time due to accumulated sleep calls
--]]

 	OutputDebugLevel(OUT_HIGH)		-- set the debug_level used by OutputDebugInfo in BabbageSupport.lua to low to diminish the impact of inipars.lua
 	OutputDebugLevel(OUT_LOW)		-- set the debug_level used by OutputDebugInfo in BabbageSupport.lua to verbose

	-- register all the Client specific keys (a.k.a. as plugins)
	registerKey( KEY_A, MODIFIER_CUSTOM,			"VF_zoekenKeyPressCustom", "Relatie/Algemeen")
	registerKey( KEY_C, MODIFIER_CUSTOM,			"VF_zoekenKeyPressCustom", "Relatie/Clienten")
	registerKey( KEY_E, MODIFIER_CUSTOM,			"VF_zoekenKeyPressCustom", "find edit box, an historical rudiment")
	registerKey( KEY_G, MODIFIER_CUSTOM,			"VF_zoekenKeyPressCustom", "click Alt-G button")
	local carloSpecial = System.BitwiseOr( MODIFIER_CUSTOM, MODIFIER_RIGHT_SHIFT)
	registerKey( KEY_G, carloSpecial,				"VF_zoekenKeyPressCustom", "!!!!!! click Alt-G button WITH RightShift !!!!!")
	registerKey( KEY_I, MODIFIER_CUSTOM,			"VF_zoekenKeyPressCustom", "INKAAN1")
	registerKey( KEY_L, MODIFIER_CUSTOM,			"VF_zoekenKeyPressCustom", "HOMWIN")
	registerKey( KEY_M, MODIFIER_CUSTOM,			"VF_zoekenKeyPressCustom", "click OHW-Fiscaal tab")
	registerKey( KEY_Q, MODIFIER_CUSTOM,			"VF_zoekenKeyPressCustom", "click IB-cliënt jaargegevens tab")
	registerKey( KEY_O, MODIFIER_CUSTOM,			"VF_zoekenKeyPressCustom", "click VpB-cliënt jaargegevens tab")
	registerKey( KEY_P, MODIFIER_CUSTOM,			"VF_zoekenKeyPressCustom", "click Cliënten tab")
	registerKey( KEY_V, MODIFIER_CUSTOM,			"VF_zoekenKeyPressCustom", "VENAAN")

	VF_ZoekenInitialize()			-- register the generic VF-zoeken hotkeys and other initialization business
	BabbageSupportInitialize()		-- register the ChangeWindowPos function and some additional Debug niceties
	
	playSound(0)					-- flag that script did at least run (sometimes Dolphin seems to fail to simply load the script)
end
	

--------------------------------------------------------------------------------
--[[ Level 2: Customer specific escapes via the xxxx.lua file
	
	Functions registered via RegisterScriptKey have apparently 2 undocumented parameters, scancode and modifier
--]]
	-- 

function VF_zoekenKeyPressCustom( scancode, modifier)

	local rc = EVENT_HANDLED																	--assume we are going to process the key
	OutputDebugInfo({"VF_zoekenKeyPressCustom()::", reportScancode( scancode, modifier)}, OUT_LOW)

	if     scancode == KEY_A then do_keypress_alt_sequence("RELCLI1")							-- Relatie/Algemeen
	elseif scancode == KEY_C then do_keypress_alt_sequence("RELCLI2")							-- Relatie/Clienten
	elseif scancode == KEY_E then PerformGotoControl( "AREA_EDIT") 								-- find edit box, an historical rudiment
	elseif scancode == KEY_G then simulateAltG()  												-- click Alt-G button
	elseif scancode == KEY_I then do_keypress_alt_sequence("INKAAN1")							-- inkomstenbelasting aangifte zoekformulier (IB-client jaargegevens details)
	elseif scancode == KEY_L then do_keypress_alt_sequence("HOMWIN")							-- inkomstenbelasting aangifte zoekformulier (IB-client jaargegevens details)
	elseif scancode == KEY_M then PerformSearch("OHW Fiscaal@@click_left")
	elseif scancode == KEY_N then PerformSearch("IB-cliënt jaargegevens details@@click_left")
	elseif scancode == KEY_O then PerformSearch("VpB-cliënt jaargegevens details@@click_left")
	elseif scancode == KEY_P then PerformSearch("Cliënten@@click_left")
	elseif scancode == KEY_V then do_keypress_alt_sequence("VENAAN")							-- Vennootsschapbelasting aangifte zoekformulier (VpB-client jaargegevens details)
	else rc =  EVENT_PASS_ON																	-- we did not process the key, maybe there is another SCRIPT interested
	end
	if rc == EVENT_PASS_ON then
		OutputDebugInfo({"!!!!VF_zoekenKeyPressCustom, value not supported rc:", rc}, OUT_LOW)
	end
	return rc

end -- VF_zoekenKeyPressCustom

--[[--------------------------------------------------------------
	simulateAltG simulates clicking the alt-G button because the U4BS defined hotkey Alt-G is not 100% identical to tyoing Alt-G
--]]--------------------------------------------------------------
function simulateAltG()	
		local title = string.lower(GetWindowTitle())
		if not string.find( title, "unit4 business suite") then		--ToDo how specific do we want it a match of section anywhere in the title is fine
			OutputDebugInfo({"!!DK-G apparently not at the appropriate active window: ", title}, OUT_MEDIUM)
		elseif dsCount == 0 then									--is  the toolbar is location already reported by the detection script
			local msg = "!!DK-G while toolbar not yet ever detected "
			VF_zoekenStatusReport( 0x0001 + 0x0040, msg, "")
		else
			ChangeWindowPos( KEY_NUMPAD_7)							--make sure icon is visible (assuming the main window is active)
			local x = myLeft + 50
			local y = (myBottom + myTop)/2
			local z = calcVerticalCheck( x, y - 5,  y + 5 ) 		-- 11 pixel sumcheck
			OutputDebugInfo({"DK-G x:sumcheck", x, z}, OUT_LOW)
			if z == 2669673 or z == 2402142 then					-- (C resp G) check for Vennootsschapbelasting
				OutputDebugInfo({"DK-G OK, apparently Vennootsschapbelasting", z}, OUT_LOW)
 				z = 1
			else
				x = myLeft + 70
				z = calcVerticalCheck( x, y - 5,  y + 5 ) 			-- 11 pixel sumcheck
				if z == 3335739 or z == 2302328 or z == 1175894 then	-- (C resp G) check for inkomstenbelasting
					OutputDebugInfo({"DK-G OK, apparently inkomstenbelasting", z}, OUT_LOW)
 					z = 2
				else
					OutputDebugInfo({"DK-G apparently no match x:", x, "signature:", z}, OUT_MEDIUM)
					z = 0
				end
			end
			if z ~= 0 then											 -- button found
				local searchString = string.format("~~%d~%d@@click_left", x, y)
				PerformSearch(searchString)
				title = GetWindowTitle()
				OutputDebugInfo({"DK-G new active window: ", title}, OUT_MEDIUM)
				if z == 2 then
	  				DebugSleep( 1000, "wait a while in the hope the new window pops up after DK-G")
					x, y = 30,750
					searchString = string.format("~~%d~%d@@click_move_only", x, y)
					PerformSearch(searchString)
					OutputDebugInfo({"DK-G new active window: ", title}, OUT_MEDIUM)
				end
--				KeyPress( VK_SUBTRACT, 0, KEYPRESS_NORMAL)  					-- Num-Min ( VF to PC)
--! 				myWrapper( VF.ChooseFocus, "simulateAltG()::VF.ChooseFocus", FOCUS_ROUTE_TO_LIVE)
			end
		end
end -- simulateAltG		

--[[--------------------------------------------------------------
!script!:U4BS_DetectionScript
the detection function should be located in the script file associated with the map.
This is particularly important when you have maps based on other maps, see the 
Dolphin Scripting Manual, Chain of Scripts for more information. 

	function U4BS_DetectionScript tracks the location of the toolbar with the "unaccessible" buttons

--!! both applicationDetection and U4BS_DetectionScript are part of the mapping of Settings_CS_20161202.zip
--!! only U4BS_DetectionScript is part of mapping of Settings_20161223_ReleaseCandidate.zip
--]]
function U4BS_DetectionScript(myArea, myScanCode, myModifier, myDamage)
	dsCount = dsCount + 1
--	local myText = Area.GetText(myArea).string	-- too bad, this gives the "label" not the contents
	
	local prop = Area.GetProperties(myArea) 
	-- Just make sure  ToDo why does Dolphin thinks is a good idea
--	if prop.type ~= AREA_SYMBOL then	
--		OutputDebugInfo({"!!!!U4BS_DetectionScript: no AREA_SYMBOL"}, OUT_MEDIUM)
--		ListProperties(prop)	
--		return 
--	end

	-- get the coordinates of the tblToolbar
	local myX, myY = Utils.RectCenter(prop) 
	local left, top , right, bottom = prop.left, prop.top, prop.right, prop.bottom
	if left ~= myLeft or top ~= myTop or right ~= myRight or left ~= myLeft then
		myLeft, myTop , myRight, myBottom = prop.left, prop.top, prop.right, prop.bottom
		OutputDebugInfo({"U4BS_DetectionScript count:", dsCount, "x:y::", myX, ":", myY, "left:top:right:bottom:height", myLeft, myTop , myRight, myBottom, myBottom - myTop }, OUT_LOW)	
	end
--[[return DETECT_HANDLED  --see the manual for the impact of this return status
	because I think it is strange to return nothing at all in some cases and a meaningfull code in other cases,
	let return something that is definitely not DETECT_HANDLED (251), i.e. EVENT_PASS_ON (255)
--]]	
	return EVENT_PASS_ON 
end -- U4BS_DetectionScript

-- UNIT4 Business Suite u4crm.exe.lua

local SCRIPT_NAME = "BabbageSupport.lua"
local SCRIPT_TIMESTAMP = "5/11/2017 12:32:30 PM"

-- Copyright (C) 2016-2017 Babbage. All rights reserved.

--[[ for table style definitions, see BabbageConversionTable.lua
--]]

--[[------------------------------------------------------------------------------


BabbageSupportInitialize()
EventApplicationActivated()
EventApplicationBraillePress()
EventApplicationDeactivated()
EventApplicationDomReport()
EventApplicationDomSetup()
EventApplicationFocusChange( focus_type, focus_area)
EventApplicationKeyPress( scancode, modifier)
EventApplicationMouseMove( mouse_x, mouse_y)
EventApplicationNewText( text, window_handle, foreground_rgb, background_rgb, style)
EventApplicationScreenChange( rectangle_list)
EventApplicationTimer()
EventApplicationVirtualFocusChange(move_type)  -- e.g.  MOVE_VF_NEXT_LINE
EventAutomaticBraille( text, verbosity, control)
EventAutomaticSpeech(text, verbosity, control)
EventAutomaticSpeech2(text, verbosity, control)
EventScriptCloseDown()
EventScriptMSAAEvent( event_id, iaccessible, child_id)
EventScriptStartup()
EventScriptUIAutomationEvent( event_id, uia_object)
registerKey( key, modifier, s1, s2)
reportScancode( scancode, modifier)
OutputDebugInfo(string_table, debug_level, debug_flag)
OutputDebugLevel(debug_level)
playSound( n )
Trim(s)
DebugSleep(sleep, name)
KeyPress(vkey, character, mode)
ChangeWindowPos(scanCode, modifierUnused)
StringToTable(separator, input)
calcVerticalCheck( x, top, bottom )
DebugMark()
DebugLevelModify()
DebugDelayModify()
GetPropertyTable(p)
GetKeyForValue( t, value )
printTable ( t )

--]]------------------------------------------------------------------------------

-- a klumsy but quick semi-workaround for the annoying feauture of SN to fail once in a while to get the
-- properties. This way it is easier to write code which continues without crashing
nilProperties = { left = "nil value", top = "nil value", right  = "nil value", bottom  = "nil value", text = "nil value" }

--Flags and counters to control the "dummification" of each individual Event-function
EAp_ActivatedFlag			, EAp_ActivatedCount			= 0	, 0
EAp_BraillePressFlag		, EAp_BraillePressCount			= 0	, 0
EAp_DeactivatedFlag			, EAp_DeactivatedCount			= 0	, 0
EAp_DomReportFlag			, EAp_DomReportCount			= 0	, 0
EAp_DomSetupFlag			, EAp_DomSetupCount				= 0	, 0
EAp_FocusChangeFlag			, EAp_FocusChangeCount			= 0 , 0 --ToDo figure out why this happens extremely frequent
EAp_KeyPressFlag			, EAp_KeyPressCount				= 0	, 0
EAp_MouseMoveFlag			, EAp_MouseMoveCount			= 0	, 0
EAp_NewTextFlag				, EAp_NewTextCount				= 0	, 0
EAp_ScreenChangeFlag		, EAp_ScreenChangeCount			= 0	, 0
EAp_TimerFlag				, EAp_TimerCount				= 0 , 0
EAp_VirtualFocusChangeFlag 	, EAp_VirtualFocusChangeCount	= 0 , 0
EAu_BrailleFlag				, EAu_BrailleCount				= 0	, 0
EAu_SpeechFlag				, EAu_SpeechCount				= 0	, 0
EAu_Speech2Flag				, EAu_Speech2Count				= 0	, 0
ES_CloseDownFlag			, ES_CloseDownCount				= 0	, 0
ES_StartupFlag				, ES_StartupCount				= 0	, 0
ES_MSAAFlag					, ES_MSAACount					= 0	, 0
ES_UIAutomationFlag			, ES_UIAutomationCount			= 0	, 0

-- predefined debug_level values
OUT_ERROR					= 1	-- Important error information (suggested marker !!!!)
OUT_HIGH					= 2	-- OutputDebugInfo high priority
OUT_MEDIUM					= 3	-- OutputDebugInfo medium priority
OUT_INFO					= 4	-- interesting info like a deviating but correct path (suggested marker !!)
OUT_LOW						= 5	-- OutputDebugInfo low priority
OUT_VERY_LOW				= 6	-- OutputDebugInfo low priority
OUT_EVENT_TRACE				= 7	-- activate logging of the Event Routines defined in BabbageSupport.lua
OUT_NONE					= 8	-- OutputDebugInfo disabled

-- default debuglevel, can be modified dynamically by user of OutputDebugInfo
DEBUGLEVEL = OUT_LOW	-- set default debuglevel
g_DebugDelay = 1 		-- debug delay time which can be cycled through predefined set

-- KeyPress mode parameters
KEYPRESS_NORMAL = 1		-- Does a normal keypress - keydown followed by up
KEYPRESS_PRESS = 2		-- Presses a key down - e.g. for applying modifiers
KEYPRESS_RELEASE = 3	-- Releases a key - e.g. for removing a modifier.

-- Virtual Keycodes as used by KeyPress
VK_LBUTTON = 0x01 		-- Left mouse button
VK_RBUTTON = 0x02 		-- Right mouse button
VK_CANCEL = 0x03 		-- Control-break processing
VK_MBUTTON = 0x04 		-- Middle mouse button (three-button mouse)

VK_BACKSPACE = 8
VK_TAB = 9
VK_RETURN = 13
VK_COMMAND = 15
VK_SHIFT = 16
VK_CONTROL = 17
VK_ALT = 18
VK_PAUSE = 19
VK_CAPSLOCK = 20
VK_ESCAPE = 27
VK_SPACE = 32
VK_PAGEUP = 33
VK_PAGEDOWN = 34
VK_END = 35
VK_HOME = 36
VK_LEFT = 37
VK_UP = 38
VK_RIGHT = 39
VK_DOWN = 40
VK_PRINTSCREEN = 44
VK_INSERT = 45
VK_DELETE = 46
VK_LWIN = 91 		--*
VK_RWIN = 92 		--*
VK_APPS = 93 		--*
VK_NUMPAD0 = 96
VK_NUMPAD1 = 97
VK_NUMPAD2 = 98
VK_NUMPAD3 = 99
VK_NUMPAD4 = 100
VK_NUMPAD5 = 101
VK_NUMPAD6 = 102
VK_NUMPAD7 = 103
VK_NUMPAD8 = 104
VK_NUMPAD9 = 105
VK_MULTIPLY = 106
VK_ADD = 107
VK_SUBTRACT = 109
VK_DECIMAL = 110
VK_DIVIDE = 111
VK_F1 = 112
VK_F2 = 113
VK_F3 = 114
VK_F4 = 115
VK_F5 = 116
VK_F6 = 117
VK_F7 = 118
VK_F8 = 119
VK_F9 = 120
VK_F10 = 121
VK_F11 = 122
VK_F12 = 123
VK_F13 = 124
VK_F14 = 125
VK_F15 = 126
VK_F16 = 127
VK_NUMLOCK = 144
VK_SCROLLLOCK = 145
VK_LSHIFT = 160 		--** Available in 2000/XP/Vista only
VK_RSHIFT = 161 		--** Available in 2000/XP/Vista only
VK_LCONTROL = 162 		--** Available in 2000/XP/Vista only
VK_RCONTROL = 163 		--** Available in 2000/XP/Vista only
VK_LALT = 164 			--** Available in 2000/XP/Vista only
VK_RALT = 165 			--** Available in 2000/XP/Vista only
VK_SEMICOLON = 186
VK_EQUALS = 187
VK_COMMA = 188
VK_UNDERSCORE = 189
VK_PERIOD = 190
VK_SLASH = 191
VK_BACKSLASH = 220
VK_RIGHTBRACE = 221
VK_LEFTBRACE = 219

VK_APOSTROPHE = 222
VK_TAB = 9
VK_SPACE = 32
VK_UP = 38
VK_DOWN = 40
VK_MULTIPLY = 106
VK_ADD = 107
VK_SUBTRACT = 109
VK_DECIMAL = 110

VK_SHIFT = 16
VK_CONTROL = 17			--Description("SHIFT key")
VK_MENU = 18			--Description("ALT key")		nv? no keft and right??
VK_LSHIFT = 160			--0xA0, "Left SHIFT key"
VK_RSHIFT = 161			--0xA1, "Right SHIFT key"
VK_LCONTROL = 162		--0xA2, "Left CONTROL key" 		** Available in 2000/XP/Vista only
VK_RCONTROL = 163		--0xA3, "Right CONTROL key" 	** Available in 2000/XP/Vista only
VK_LMENU	= 164		--0xA4	Left Alt

VK_0 = 48
VK_1 = 49
VK_2 = 50
VK_3 = 51
VK_4 = 52
VK_5 = 53
VK_6 = 54
VK_7 = 55
VK_8 = 56
VK_9 = 57

VK_A = 65
VK_B = 66
VK_C = 67
VK_D = 68
VK_E = 69
VK_F = 70
VK_G = 71
VK_H = 72
VK_I = 73
VK_J = 74
VK_K = 75
VK_L = 76
VK_M = 77
VK_N = 78
VK_O = 79
VK_P = 80
VK_Q = 81
VK_R = 82
VK_S = 83 			--0x53, Description("S key")
VK_T = 84
VK_U = 85
VK_V = 86
VK_W = 87
VK_X = 88
VK_Y = 89
VK_Z = 90


-- Key mapping table "borrowed" from C:\ProgramData\dolphin\SnovaSuite1505\defaults\scripts\vktodolk.lua
local vk_keymask	= 0xff
local vk_modshift	= 256
local vk_modctrl	= 512
local vk_modalt 	= 1024
local vk_modmask	= 0x700


-- Focus types:
FOCUSTYPE_OSMCONTOUR = 0
FOCUSTYPE_OSMBEAM = 1
FOCUSTYPE_OSMCOLOR = 2
FOCUSTYPE_OSMCOLOUR = FOCUSTYPE_OSMCOLOR
FOCUSTYPE_OSMINVERT = 3
FOCUSTYPE_AREASTATUS = 4
FOCUSTYPE_OSMFLOAT = 5
FOCUSTYPE_AREAVIRTUAL = 6

FOCUSTYPE_DOM = 100 -- any above this number are DomFocus classes
FOCUSTYPE_DOMEDIT = 101
FOCUSTYPE_DOMWORD = 102
FOCUSTYPE_DOMEXCEL = 103
FOCUSTYPE_DOMRICH = 104
FOCUSTYPE_DOMIE	= 105
FOCUSTYPE_DOMJAVA = 106
FOCUSTYPE_DOMACROBAT = 107
FOCUSTYPE_DOMPOWERPOINT = 108
FOCUSTYPE_DOMMSAAEVENT = 109
FOCUSTYPE_DOMPIE = 110
FOCUSTYPE_DOMFF = 111


-- Focus methods:
FOCUSMETHOD_OSMCONTOUR = 0
FOCUSMETHOD_OSMBEAM = 1
FOCUSMETHOD_OSMCOLOR_SELECTION = 2
FOCUSMETHOD_OSMCOLOUR_SELECTION = FOCUSMETHOD_OSMCOLOR_SELECTION
FOCUSMETHOD_OSMCOLOR_FOCUS = 3
FOCUSMETHOD_OSMCOLOUR_FOCUS = FOCUSMETHOD_OSMCOLOR_FOCUS
FOCUSMETHOD_OSMINVERT_SELECTION = 4
FOCUSMETHOD_OSMINVERT_FOCUS = 5
FOCUSMETHOD_AREASTATUS_SELECTION = 6
FOCUSMETHOD_AREASTATUS_FOCUS = 7
FOCUSMETHOD_OSMFLOAT_SELECTION = 8
FOCUSMETHOD_OSMFLOAT_FOCUS = 9
FOCUSMETHOD_OSMBEAM_CARET = 10
FOCUSMETHOD_VIRTUAL_BEAM = 11
FOCUSMETHOD_VIRTUAL_CONTOUR = 12
FOCUSMETHOD_DOM_BEAM = 13
FOCUSMETHOD_DOM_CONTOUR = 14

-- Focus.Add() supported types
FOCUSADD_TYPE_COLOR = FOCUSMETHOD_OSMCOLOR_FOCUS
FOCUSADD_TYPE_COLOUR = FOCUSADD_TYPE_COLOR
FOCUSADD_TYPE_CURSOR = FOCUSMETHOD_OSMBEAM
FOCUSADD_TYPE_AREA = FOCUSMETHOD_AREASTATUS_FOCUS


--[[------------------------------------------------------------------------------
	BabbageSupportInitialize must be called at SOD from the EventScriptStartup function
	of the script associated with the application to be instrumented
	It will successively:
	 - write a SOD message to the debug console
	 - register some shortcut keycombinations to
	   - modify the debug behaviour
	   - place the active window nicely in the viewport in case SN enlargment is used
--]]

function BabbageSupportInitialize()

	-- output SOD message
	local scriptName = tostring( System.GetInfo( INFO_SCRIPT_NAME))					--get the name of the "main"-script
	OutputDebugInfo({"loaded", SCRIPT_NAME, "dated(", SCRIPT_TIMESTAMP, ") loaded by", scriptName}, OUT_HIGH)

	--let's generate an error right away if win is not required in the master script file
	local screenWidth = Win.GetSystemMetrics(SM_CXSCREEN)

	local hotkey_modifier = System.BitwiseOr( MODIFIER_RIGHT_SHIFT, MODIFIER_RIGHT_CONTROL)

	-- register the hotkeys to position active window in viewport
	registerKey( KEY_NUMPAD_1, hotkey_modifier,	"ChangeWindowPos", "LeftBottom")
	registerKey( KEY_NUMPAD_2, hotkey_modifier,	"ChangeWindowPos", "Bottom")
	registerKey( KEY_NUMPAD_3, hotkey_modifier,	"ChangeWindowPos", "RigthBottom")
	registerKey( KEY_NUMPAD_4, hotkey_modifier,	"ChangeWindowPos", "Left")
	registerKey( KEY_NUMPAD_5, hotkey_modifier,	"ChangeWindowPos", "Centre")
	registerKey( KEY_NUMPAD_6, hotkey_modifier,	"ChangeWindowPos", "Rigth")
	registerKey( KEY_NUMPAD_7, hotkey_modifier,	"ChangeWindowPos", "LeftTop")
	registerKey( KEY_NUMPAD_8, hotkey_modifier,	"ChangeWindowPos", "Top")
	registerKey( KEY_NUMPAD_9, hotkey_modifier,	"ChangeWindowPos", "RightTop")

	-- register the debug convenience hotkeys
-- 	registerKey(KEY_B, System.BitwiseOr(MODIFIER_LEFT_CONTROL, MODIFIER_RIGHT_CONTROL), "DebugLevelModify", "DebugLevelModify")	--does not work
	registerKey(KEY_B, MODIFIER_RIGHT_CONTROL, "DebugLevelModify", "!!!!!!!!!!DebugLevelModify !!!!!!!!!!")
	registerKey(KEY_B, MODIFIER_RIGHT_ALT,     "DebugDelayModify", "!!!!!!!!!!DebugDelayModify !!!!!!!!!!")
	registerKey(KEY_T, MODIFIER_RIGHT_ALT,            "DebugMark", "!!!!!!!!!!DebugMark        !!!!!!!!!!")
end --  BabbageSupportInitialize


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

--------------------------------------------------------------------------------
--[[ The function EventApplicationActivated runs when the application is activated, e.g. alt-tabbed to or
	 clicked into focus.
--]]
function EventApplicationActivated()
	EAp_ActivatedCount = EAp_ActivatedCount + 1
	if EAp_ActivatedFlag == 1 then
		local msg = listPid()
		if rawget( _G, "myPid") then 			--ToDo document this feature
			msg = "\tmyPid: " .. tostring(rawget( _G, "myPid")) .. "\r\n" .. msg
		end
		OutputDebugInfo({"EAp_Activated   #", EAp_ActivatedCount, "\r\n", msg})
	end
	return EVENT_PASS_ON
end -- EventApplicationActivated

--[[------------------------------------------------------------------------------
--]]
function EventApplicationBraillePress()
	EAp_BraillePressCount = EAp_BraillePressCount + 1
	if EAp_BraillePressFlag == 1 then
		OutputDebugInfo({"EAp_BraillePress #", EAp_BraillePressCount})
	end
	return EVENT_PASS_ON
end -- EventApplicationBraillePress


--------------------------------------------------------------------------------
--[[ The function EventApplicationDeactivated runs when the application is de-activated, e.g. alt-tabbed away.
	 Once the idea was to use this event, to recognize when the user would tab-away from the VF-Zoeken dialog.
	 In that case the dialog should be closed.
	 ToDo Although this philosophy sounds good, it did not work in practice because as long as the dialog is
	 open the EventApplicationDeactivated is not called
--]]
function EventApplicationDeactivated()
	EAp_DeactivatedCount = EAp_DeactivatedCount + 1
	if EAp_DeactivatedFlag == 1 then
		local msg = listPid()
		if rawget( _G, "myPid") then 			--ToDo document this feature
			msg = "\tmyPid: " .. tostring(rawget( _G, "myPid")) .. "\r\n" .. msg
		end
		OutputDebugInfo({"EAp_Deactivated #", EAp_DeactivatedCount, "\r\n", msg})
	end
	return EVENT_PASS_ON
end -- EventApplicationDeactivated

--[[------------------------------------------------------------------------------
--]]
function EventApplicationDomReport()
	EAp_DomReportCount = EAp_DomReportCount + 1
	if EAp_DomReportFlag == 1 then
		OutputDebugInfo({"EAp_DomReport #", EAp_DomReportCount})
	end
	return EVENT_PASS_ON
end -- EventApplicationDomReport

--[[------------------------------------------------------------------------------
--]]
function EventApplicationDomSetup()
	EAp_DomSetupCount = EAp_DomSetupCount + 1
	if EAp_DomSetupFlag == 1 then
		OutputDebugInfo({"EAp_DomSetup #", EAp_DomSetupCount})
	end
	return EVENT_PASS_ON
end -- EventApplicationDomSetup

--[[------------------------------------------------------------------------------
--]]
focusTable = {}
function EventApplicationFocusChange( focus_type, focus_area)
	EAp_FocusChangeCount = EAp_FocusChangeCount + 1		-- dit gebeurt erg vaak
	if EAp_FocusChangeFlag == 1 then
		OutputDebugInfo({"EAp_FocusChange #", EAp_FocusChangeCount})
	end
	return EVENT_PASS_ON
end -- EventApplicationFocusChange

--[[------------------------------------------------------------------------------
EventApplicationKeyPress
KB 602: Supernova quirks
	Gebaseerd op een email uitwisseling met Dolphin, de volgende aanvulling op het Scripting Manual:
	The keystroke is passed when
	 - the key is pressed and a screen change occurs
	or
	 - when a key is pressed and the screen does not change within a certain period of time.
	The key press event can only change how Supernova processes the key press not what Windows, the
	application itself or any other applications currently hooking the keyboard does with it. 
	EVENT_PASS_ON and EVENT_HANDLED relate to how Supernova handles its events. 
	Gebaseerd op ervaring: EventApplicationKeyPress wordt niet geroepen in VF-mode
--]]
function EventApplicationKeyPress( scancode, modifier)	-- only called if no one higher in the hierarchy defined EventApplicationKeyPress
	EAp_KeyPressCount = EAp_KeyPressCount + 1
	OutputDebugInfo({"====================", SCRIPT_NAME, "EAp_KeyPress() #", EAp_KeyPressCount, vf_zoeken_reportScancode( scancode, modifier)}, OUT_MEDIUM)
	babSup_EventApplicationKeyPress( scancode, modifier)
end -- EventApplicationKeyPress

function babSup_EventApplicationKeyPress( scancode, modifier)
	if EAp_KeyPressFlag == 1 then
		OutputDebugInfo({"====================", SCRIPT_NAME, "babSup_EventApplicationKeyPress()"}, OUT_MEDIUM)

	--	[KEY_DOUBLE_LEFT_MOUSE] = 216,	[KEY_DOUBLE_MIDDLE_MOUSE] = 218,	[KEY_DOUBLE_RIGHT_MOUSE] = 217,	-- Left/Right/Middle mouse button (three-button mouse)
	--	[KEY_LEFT_MOUSE] = 92,			[KEY_MIDDLE_MOUSE] = 94,			[KEY_RIGHT_MOUSE] = 93,
	--	VK_LBUTTON = 0x01,				VK_RBUTTON = 0x02,					VK_MBUTTON = 0x04 			
		if scancode == KEY_LEFT_MOUSE or scancode == KEY_MIDDLE_MOUSE or scancode == KEY_RIGHT_MOUSE or
		   scancode == KEY_DOUBLE_LEFT_MOUSE or scancode == KEY_DOUBLE_MIDDLE_MOUSE or scancode == KEY_DOUBLE_RIGHT_MOUSE then
			--double click nor middle click seems to work
			local x, y = System.GetMousePosition ()   		-- in screenpixels relative to top-left corner of the screen
			if x == nil then 
				OutputDebugInfo({ "!!!! EAp_KeyPress()::mouse (double-)click but GetMousePosition() failed"})
			else
				OutputDebugInfo({"EAp_KeyPress(): mouse click Pos:", x, ":", y, reportScancode( scancode, modifier)}, OUT_MEDIUM)
	--			pixelTest( x, y)							--restore this only for engineering purposes
				local appArea = Area.GetCurrentApplication()
				if appArea == nil then
					OutputDebugInfo({ "!!!! EAp_KeyPress()::Area.GetCurrentApplication() failed"})
				else
					local p = Area.GetProperties( appArea)
					OutputDebugInfo({"EAp_KeyPress():: left:top:right:bottom:"..":"..p.left..":"..p.top..":"..p.right..":"..p.bottom.." text:"..tostring( p.text)}, OUT_LOW)		--Uni-code
				end
			end
		end
	end

	if rawget( _G, "babEng_EventApplicationKeyPress") then	babEng_EventApplicationKeyPress( scancode, modifier) end		--ToDo document this feature

--[[ exercise to force Capslock off again when it is (supposedly) accidentally activated
--   because it does not "feel" right, this code is commented out
--   more day to day testing is needed before this is released for general use
--   ToDo: possibly this should become an option
--	[KEY_CAPSLOCK_OFF] = 58, [KEY_CAPSLOCK_ON] = 89 ToDo if capslock is turned on, turn it off again
	if scancode == KEY_CAPSLOCK_OFF then
		OutputDebugInfo({"EAp_KeyPress(): capslock changed to OFF"}, OUT_MEDIUM)
	end
	if scancode == KEY_CAPSLOCK_ON then
		OutputDebugInfo({"EAp_KeyPress(): capslock changed to ON"}, OUT_MEDIUM)
		Win.MessageBeep( MB_OK) 
		playSound( 2 )
		KeyPress( VK_CAPSLOCK)
	end
--]]	

	return EVENT_PASS_ON
end -- babSup_EventApplicationKeyPress

--[[------------------------------------------------------------------------------
--]]
function EventApplicationMouseMove( mouse_x, mouse_y)
	EAp_MouseMoveCount = EAp_MouseMoveCount + 1
	if EAp_MouseMoveFlag == 1 then
		OutputDebugInfo({"EAp_MouseMove #", EAp_MouseMoveCount, "x:y", mouse_x, mouse_y})
	end
	return EVENT_PASS_ON
end -- EventApplicationMouseMove

--[[------------------------------------------------------------------------------
--]]
function EventApplicationNewText( text, window_handle, foreground_rgb, background_rgb, style)
	EAp_NewTextCount = EAp_NewTextCount + 1
	if EAp_NewTextFlag == 1 then
		OutputDebugInfo({"EAp_NewText #", EAp_NewTextCount, "text:", tostring(text), "handle:", tostring(window_handle), "fg_rgb", tostring(foreground_rgb), "bg_rgp", tostring(background_rgb), "style:", tostring(style)})

		if string.match( tostring(text), "Alt+") then
			OutputDebugInfo({"EAp_NewText, help balloon?:", tostring(text)})
		end
	end
	return EVENT_PASS_ON
end -- EventApplicationNewText

--[[------------------------------------------------------------------------------
--]]
function EventApplicationScreenChange( rectangle_list)
	EAp_ScreenChangeCount = EAp_ScreenChangeCount + 1
	if EAp_ScreenChangeFlag == 1 then
		--[[ ToDo what is the practical use of this information
		local rectangles = System.GetRectangleCount(rectangle_list)
		OutputDebugInfo({"EAp_ScreenChange, number of rectangles", rectangles})
		for item = 1, rectangles, 1 do
			local damage_rectangle = System.GetRectangle(rectangle_list, item)
			local left, top, right, bottom = damage_rectangle.left, damage_rectangle.top, damage_rectangle.right, damage_rectangle.bottom
			local x, y = (left + right)/2, (top + bottom)/2			-- center
			local message = "Rect " .. item .. "  = " .. damage_rectangle.left .. " " ..  damage_rectangle.top .. " " .. damage_rectangle.right .. " " ..  damage_rectangle.bottom .. "\r\n"
			OutputDebugInfo({"Rect center:", x, ":", y, "l:t:r:b:", left, top, right, bottom})
			local msaa_obj, child_id = MSAA.ObjectFromPoint( x, y)
			if msaa_obj then
				OutputDebugInfo({"!!MSAA object with non-zero child_id:", tostring(child_id)}, OUT_MEDIUM, child_id ~= 0)
				getMsaaInfo( msaa_obj, child_id)
				local myCount = MSAA.GetInfo(msaa_obj, MSAA_CHILDREN) --, childId!!!!!!!)			--  Returns a value containing state information about the specified object
				OutputDebugInfo( "childcount: "..myCount )
				for i = 0, myCount do
--					OutputDebugInfo( "reportCoordinates: 3-"..i )
--					getMsaaInfo( msaa_obj, i)
				end
			  	MSAA.DeleteObject (msaa_obj)
			end

		end
		--]]
		OutputDebugInfo({"EAp_ScreenChange #", EAp_ScreenChangeCount})
	end
	return EVENT_PASS_ON
end -- EventApplicationScreenChange

--[[------------------------------------------------------------------------------
--]]
function EventApplicationTimer()
	EAp_TimerCount = EAp_TimerCount + 1
	if EAp_TimerFlag == 1 then
		OutputDebugInfo({"EAp_Timer #", EAp_TimerCount})
	end
	return EVENT_PASS_ON
end -- EventApplicationTimer

--[[------------------------------------------------------------------------------
--]]
function EventApplicationVirtualFocusChange(move_type)	-- e.g.  MOVE_VF_NEXT_LINE
	EAp_VirtualFocusChangeCount = EAp_VirtualFocusChangeCount + 1
 	if EAp_VirtualFocusChangeFlag == 1 then
		OutputDebugInfo({"EAp_VirtualFocusChange #", EAp_VirtualFocusChangeCount, "move_type:", tostring(move_type)})
 	end
	return EVENT_PASS_ON
end -- EventApplicationVirtualFocusChange


--[[------------------------------------------------------------------------------
Even when there is no change in info, EventAutomaticBraille is called frequently with the same info.
A subtle problem is that sometimes the info about the control changes as shown below
49:<11:38:49>EventAutomaticBraille, prev: Buitenlandse ondernemingswinsten pg 0 repeated 36
49:<11:38:53>EventAutomaticBraille, prev: Buitenlandse ondernemingswinsten pgÿ0ÿ repeated 2
suggested remedy: Braille verbosity to minimum: turns out not to help. The "pg" disappers but the " 0 " and "y0y" still alternate
next remedy: drop the last 5 chars: does not help because the 2 nearly identical strings differ 1 in length
next remedy: use the are identified by the control parameter to retrieve usefull info, hopefully the tab text
             does not work because that corresponds with the active control, e.g. edit box, not the tab itself
next remedy: take 10 chars just to see whether the concept works
--]]
function EventAutomaticBraille( text, verbosity, control)
	EAu_BrailleCount = EAu_BrailleCount + 1
-- nice try 	text = tostring(text)							--convert w string
-- nice try 	local len = string.len(text)
-- nice try 	if len > 15 then text = string.sub(text, 1 , 10) end
-- nice try 	if text ~= g_tabelTable[2] then
-- nice try 		local hex = "hex:"
-- nice try 		for i = 1, #text do
-- nice try 			local s = text:sub( i, i)
-- nice try 			local v = string.byte( s)
-- nice try 			hex = hex .. string.format("0x%02x", v) .. ":"
-- nice try 		end
-- nice try 	 	OutputDebugInfo( hex )
-- nice try
-- nice try 		OutputDebugInfo({"EAu_Braille, prev:", tostring(g_tabelTable[2]), "repeated", tostring(g_tabelTable[3])})
-- nice try 		OutputDebugInfo({"EAu_Braille, text:", tostring( text), "verbosity:", tostring( verbosity),"control", tostring( control)})
-- nice try 		g_tabelTable[2] = text
-- nice try 		g_tabelTable[3] = 0
-- nice try 		OutputDebugInfo({"!!!! EAu_Braille dropped anchor as a (hopefully) workaround against Dolphin hangup's"})
-- nice try 		g_cx, g_cy = nil, nil 					-- reset last point in order to find next in Q
-- nice try 	end
-- nice try 	g_tabelTable[3] = g_tabelTable[3] + 1		--count them
	if EAu_BrailleFlag == 1 then
 		local p = Area.GetProperties( control)
	 	OutputDebugInfo({"EAu_Braille #", EAu_BrailleCount, "control text:", tostring( p.text)})
	end
	return EVENT_PASS_ON
end -- EventAutomaticBraille

--[[------------------------------------------------------------------------------
--]]
function EventAutomaticSpeech(text, verbosity, control)
	EAu_SpeechCount = EAu_SpeechCount + 1
	--often called without usefull info
	if EAu_SpeechFlag == 1 then
		OutputDebugInfo({"EAu_Speech #", EAu_SpeechCount, "text:", tostring( text), "verbosity:", tostring( verbosity),"control", tostring( control)})
	end
	return EVENT_PASS_ON
end -- EventAutomaticSpeech

--[[------------------------------------------------------------------------------
--]]
function EventAutomaticSpeech2(text, verbosity, control)
	EAu_Speech2Count = EAu_Speech2Count + 1
	if EAu_Speech2Flag == 1 then
		OutputDebugInfo({"EAu_Speech2 #", EAu_Speech2Count, "text:", tostring( text), "verbosity:", tostring( verbosity),"control", tostring( control)})
	end
	return EVENT_PASS_ON
end -- EventAutomaticSpeech2


--------------------------------------------------------------------------------
--[[ The function EventScriptCloseDown runs when the script is unloaded.
	 There is no particular use for this function in this script. However I have noticed that sometimes after a
	 series of script errors and reloads of the (supposedly) corrected scripts, the SOD message is given multiple
	 times. This is weird and behavior you would only expect in for lux scripts (and then it would still be a bug).
	 Just to get a handle on this, this function gives an EOD message, so these EOD messages can be balanced against
	 the SOD messages
--]]
function EventScriptCloseDown()
	ES_CloseDownCount = ES_CloseDownCount + 1
	-- output EOD message
	local x = tostring(rawget( _G, "myPid"))			--ToDo document this feature
	OutputDebugInfo({"ES_CloseDown #", ES_CloseDownCount, "PID:", x})
	if ES_CloseDownFlag == 1 then
	end
	return EVENT_PASS_ON
end --  EventScriptCloseDown

--[[------------------------------------------------------------------------------
--EventScriptMSAAEvent (event_id, iaccessible, child_id)
event_id	Identifier of the event.
iaccessible	The event's iaccessible object.
child_id	Child id of the object.
--]]
function EventScriptMSAAEvent( event_id, iaccessible, child_id)
	ES_MSAACount = ES_MSAACount + 1
	if ES_MSAAFlag == 1 then
		OutputDebugInfo({"ES_MSAAEvent #", ES_MSAACount, "id:", event_id, "iaccessible:", iaccessible, "child:", child_id})
	end
	return EVENT_PASS_ON
end -- EventScriptMSAAEvent

--[[------------------------------------------------------------------------------
--]]
function EventScriptStartup()
	ES_StartupCount = ES_StartupCount + 1
	local x = tostring(rawget( _G, "myPid"))			--ToDo document this feature
	OutputDebugInfo({"ES_Startup #", ES_StartupCount, "PID:", x})
	return EVENT_PASS_ON
end -- EventScriptStartup

--[[------------------------------------------------------------------------------
--EventScriptUIAutomationEvent (event_id, uia_object)
event_id	Identifier of the event.
uia_object	The event's UI Automation object.
--]]
function EventScriptUIAutomationEvent( event_id, uia_object)
	ES_UIAutomationCount =  ES_UIAutomationCount + 1
	if ES_UIAutomationFlag == 1 then
		OutputDebugInfo({"ES_UIAutomationEvent #", ES_UIAutomationCount, "id:", event_id, "uia:", uia_object})
	end
	return EVENT_PASS_ON
end -- EventScriptUIAutomationEvent

--[[--------------------------------------------------------------------------------
ToDo: the check on repeating keys is too weak because it only remembers the last modifier per key
ToDo: report also the key (i.e. not the VK-code but the ASCII representation
		 9:00031 16:01:33 !!!!registerKey called twice for the same key-combination 27 64 30 VF_zoekenKeyPress KEY_A
		 should become something like
		 9:00031 16:01:33 !!!!registerKey called twice for the same key-combination count:27 mod:0x40 a (30) VF_zoekenKeyPress KEY_A

		 key is the scancode representatiojn of the key to register
--]]
local registerKeyCount = 0
local registerKeyTable = {}
function registerKey( key, modifier, s1, s2)
	registerKeyCount = registerKeyCount + 1
	local rc = registerKeyTable[key]
	if rc and not (rc == modifier) then rc = nil end
	if rc then
		OutputDebugInfo({"!!!!registerKey called twice for the same key-combination", registerKeyCount, reportScancode( key, modifier), s1, s2}, OUT_HIGH)
	else
		rc = System.RegisterScriptKey( key, modifier, s1, s2)
		if rc then
			registerKeyTable[key] = modifier
			OutputDebugInfo({string.format("registerKey succesfully registered #%02d %s %s %s", registerKeyCount, reportScancode( key, modifier), s1, s2)}, OUT_MEDIUM)
		else
			OutputDebugInfo({"!!!!registerKey failed to register", registerKeyCount, reportScancode( key, modifier), s1, s2}, OUT_HIGH)
		end
	end
end-- registerKey

--------------------------------------------------------------------------------
function reportScancode( scancode, modifier)
	local msg
	if modifier == nil then
		msg = "!MOD: nil "
	elseif modifier == 0 then
		msg = " mod: none"
	else
		msg = string.format( "!MOD: 0x%02x", modifier)
	end
	msg = string.format( "%s scancode:%d-%s", msg, tostring(scancode), TranslateScancode( scancode))
	return msg
end -- reportScancode

--[[--------------------------------------------------------------------------------
-- Debug function
-- OutputDebugInfo(string_table, debug_level, debug_flag)
-- Note: OutputDebugInfo does not work until EventScriptStartup() is started, i.e. it works already during EventScriptStartup()
--]]

--ToDo improve OutputDebugInfo so you don't stumble over badly formed tables
--ToDo apparently OutputDebugInfo can't handle unicode strings in table
--ToDo add a flush facilty, e.g. debug_flag == OUT_FLUSH
--ToDo consider to use the table not only for System.Log but also for the System.OutputDebugInfo call
local msgTable = {}
local dbgCount = 0
function OutputDebugInfo(string_table, debug_level, debug_flag, console_flag)
	dbgCount = dbgCount + 1
	if DEBUGLEVEL >= OUT_NONE then return end
	if debug_level == nil then debug_level = 1 end
	if debug_flag == nil then debug_flag = true end
	if console_flag == nil then console_flag = true end
	if (debug_flag == true) and (debug_level <= DEBUGLEVEL) then
		local msg
		if type(string_table) == "table" then msg = table.concat(string_table," ")
		else msg = tostring(string_table)
		end
		msg = string.format( "%2d:%05d %s %s", debug_level, dbgCount, string.sub(os.date(), 10), tostring(msg) )
--		if false then			-- make this a global flag controllable via dialog
		if true then			-- make this a global flag controllable via dialog
			System.Log( msg)	--text is written to the log file "operation.log" in de Settings folder.
		else
			if #msgTable < 10 then -- or even better make this number configurable and treat 1 special (like fals now)
				table.insert(msgTable, msg)
			else
				for _, msg1 in ipairs(msgTable) do
					System.Log( msg1)	--previous texts are written to the log file "operation.log" in de Settings folder.
				end
				System.Log( msg)	--current text is written to the log file "operation.log" in de Settings folder.
				msgTable = {}
			end
		end
		if console_flag then System.OutputDebugString( msg ) end
	end
end -- OutputDebugInfo

--[[
Globals are stored in a hashtable by their name. Accessing them means you have to access a table index.
While Lua has a pretty good hashtable implementation, it's still a lot slower than accessing a local variable.
If you have to use globals, assign their value to a local variable, this is faster at the 2nd variable access.

  - debug_level
 	higher values mean more logging
--]]
function OutputDebugLevel(debug_level)
	local msg = "OutputDebugLevel:: changes from " .. DEBUGLEVEL .. " to "
	if debug_level == nil then
		debug_level = DEBUGLEVEL + 1
		if debug_level > OUT_NONE then debug_level = OUT_ERROR end
	end
	if debug_level > OUT_NONE then debug_level = OUT_NONE end
	if debug_level < OUT_ERROR then debug_level = OUT_ERROR end
	msg = msg .. debug_level
	OutputDebugInfo( msg )
	DEBUGLEVEL = debug_level
	return DEBUGLEVEL
end -- OutputDebugLevel

--[[------------------------------------------------------------------------------
--]]
function playSound( n )

	local folderName = tostring( System.GetInfo( INFO_SCRIPT_DATA_PATH))
	local fileName
	if n == 1 then fileName = "b1"
	elseif n == 2 then fileName = "b2"
	elseif n == 3 then fileName = "b3"
	else
		for i = 1, 3 do playSound(i) end
		return
	end
	fileName = folderName .. "\\".. fileName .. ".wav"
	OutputDebugInfo({"playSound::", fileName}, OUT_LOW)
	System.PlaySound (fileName, 1)
end -- playSound

--[[------------------------------------------------------------------------------
-- function Trim removes leading and trailing white space
--]]
function Trim(s)
  return (s:gsub("^%s*(.-)%s*$", "%1"))
end -- Trim

--[[------------------------------------------------------------------------------
-- Debug function
-- since it is easy to forget that you threw in a delay somewhere in the hope that that makes
-- Dolphin behave, this function tracks those call
--]]------------------------------------------------------------------------------
function DebugSleep(sleep, name)
	if name == nil then name = "unknown" end
--	OutputDebugInfo({"DebugSleep(", sleep, "milliseconds) for", name}, OUT_VERY_LOW)
	if sleep > 0 then System.Sleep(sleep) end
end -- DebugSleep


INPUT_KEYBOARD = 1
KEYEVENTF_UNICODE = 4
KEYEVENTF_KEYUP = 2

--[[--------------------------------------------------------------
-- Press, release or press+release (normal) a key.
-- The key is specified either as Virtual Key code (rather universal) or
-- Scancode (basically keyboard dependent)
   Sample usage:
	KeyPress(VK_LSHIFT, 0, KEYPRESS_PRESS) 		-- Left Shift down
	KeyPress(VK_LCONTROL, 0, KEYPRESS_PRESS) 	-- Left Control down
	KeyPress(VK_MENU, 0, KEYPRESS_PRESS) 		-- Alt down
	KeyPress(K_S, 0, KEYPRESS_NORMAL) 			-- S down and up
	KeyPress(VK_LSHIFT, 0, KEYPRESS_RELEASE) 	-- Left Shift up
	KeyPress(VK_LCONTROL, 0, KEYPRESS_RELEASE) 	-- Left Control up
	KeyPress(VK_MENU, 0, KEYPRESS_RELEASE) 		-- Alt up


-- KeyPress(vkey, character, mode)
-- character parameter: not recommanded to be used

-- vkey paramaters
-- Virtual Key Codes
--]]------------------------------------------------------------------------------

function KeyPress(vkey, character, mode)
	-- 28-2-2017 18:23:13 all calls I can find use character == 0
	local rc
	--
	-- INPUT structure
	--	DWORD type					4
	-- 	KEYBDINPUT    ki;
	--		WORD      wVk;			2
	--		WORD      wScan;		2
	--		DWORD     dwFlags;		4
	--		DWORD     time;			4
	--		ULONG_PTR dwExtraInfo;	4

	local sizeof_input = 28 --4 + 2 + 2 + 4 + 4 + 4	--nv the numbers in the original comment add only up to 20

	local dwFlags = 0
	local wScan = 0
	local wVk = 0

	local s
	if mode == nil then mode = KEYPRESS_NORMAL end
	if mode==KEYPRESS_NORMAL then s = "KEYPRESS_NORMAL"
	elseif mode==KEYPRESS_RELEASE then s = "KEYPRESS_RELEASE"
	elseif mode==KEYPRESS_PRESS then s = "KEYPRESS_PRESS"
	else s = "!!!! invalid mode "..tostring(mode)
	end
	if character ~= nil and character ~= 0 then
		wScan = character
		dwFlags = KEYEVENTF_UNICODE
		OutputDebugInfo({"KeyPress character: ", tostring(wScan), s}, OUT_MEDIUM)
	else
		wVk = vkey
		OutputDebugInfo({"KeyPress vkey: ", tostring(vkey), "-", TranslateVkCode(vkey), s}, OUT_MEDIUM)
	end

	local input_structure = System.AllocateUserData(sizeof_input)

	if mode==KEYPRESS_NORMAL or mode==KEYPRESS_PRESS then
		--pack successively ULong, 2* UShort, 3* ULong (so 20 bytes)
		local s = string.pack("LHHLLL", INPUT_KEYBOARD, wVk, wScan, dwFlags, 0, 0)
		System.StringToUserData(input_structure, s, 20)

		-- Call SendInput.
		local dll_function = {
			dll_name = "user32.dll",
			function_name = "SendInput",
			standard_call = 1,
			parameters = 3}
		local dll_params = {1, input_structure, sizeof_input}

		rc = System.CallDllFunction(dll_function, dll_params)
	end

	if mode==KEYPRESS_NORMAL or mode==KEYPRESS_RELEASE then

		dwFlags = dwFlags + KEYEVENTF_KEYUP
		local s = string.pack("LHHLLL", INPUT_KEYBOARD, wVk, wScan, dwFlags, 0, 0)
		System.StringToUserData(input_structure, s, 20)

		-- Call SendInput.
		local dll_function = {
			dll_name = "user32.dll",
			function_name = "SendInput",
			standard_call = 1,
			parameters = 3}
		local dll_params = {1, input_structure, sizeof_input}

		rc = System.CallDllFunction(dll_function, dll_params)
	end

	input_structure = nil
	return rc

end -- KeyPress


--[[--------------------------------------------------------------
	ChangeWindowPos is the function tied to the hotkeys RCtrl-Rshift-numpad1 through 9 to
	move the viewport to one of the corners or the sides or the center and position the active window so it fits
	optimal in that position (e.g. when the viewport is centered, so is the active window). This is similar to the effect
	of Rctrl-numpad1 through 9 for the total screen
	Note possibly an additional wrapper to use another parameter set then the keycode is usefull for other applications
	ToDo this is presumably a poor strategy. It seems much better to leave the layout of the windows as is and only move the viewport.
	This may be problematic to implement, depednding on the facilties offeed by the Dolphin script facility.
--]]
function ChangeWindowPos(scanCode, modifierUnused)
	OutputDebugInfo({"ChangeWindowPos::", reportScancode( scanCode, modifierUnused)}, OUT_LOW)

 	local rc = EVENT_PASS_ON						--presume failure
	local magCmd, x, y = nil, nil, nil
	local screenWidth = Win.GetSystemMetrics(SM_CXSCREEN)
	local screenHeight = Win.GetSystemMetrics(SM_CYSCREEN)
	OutputDebugInfo({"ChangeWindowPos()::Screen width:height=", screenWidth, screenHeight}, OUT_LOW)
	local winHandle = Win.GetForegroundWindow()
	local win_rect = System.GetWindowRect(winHandle)
	OutputDebugInfo({"ChangeWindowPos()::rect left:right:top:bottom=", win_rect.left, win_rect.right, win_rect.top, win_rect.bottom}, OUT_LOW)
	local myWidth  = screenWidth  - (win_rect.right - win_rect.left)
	local myHeight = screenHeight - (win_rect.bottom - win_rect.top)

	if     scanCode == KEY_NUMPAD_1 then magCmd = MAG_CMD_MOVE_BOTTOM_LEFT;		x = 0;				y = myHeight
	elseif scanCode == KEY_NUMPAD_2 then magCmd = MAG_CMD_MOVE_BOTTOM;			x = win_rect.left;	y = myHeight
	elseif scanCode == KEY_NUMPAD_3 then magCmd = MAG_CMD_MOVE_BOTTOM_RIGHT;	x = myWidth;		y = myHeight
	elseif scanCode == KEY_NUMPAD_4 then magCmd = MAG_CMD_MOVE_LEFT;			x = 0;				y = win_rect.top
	elseif scanCode == KEY_NUMPAD_5 then magCmd = MAG_CMD_MOVE_MIDDLE;			x = (myWidth)/2;	y = (myHeight)/2
	elseif scanCode == KEY_NUMPAD_6 then magCmd = MAG_CMD_MOVE_RIGHT;			x = myWidth;		y = win_rect.top
	elseif scanCode == KEY_NUMPAD_7 then magCmd = MAG_CMD_MOVE_TOP_LEFT;		x = 0;				y = 0
	elseif scanCode == KEY_NUMPAD_8 then magCmd = MAG_CMD_MOVE_TOP;				x = win_rect.left;	y = 0						--tOdO DOES NOT EXIST IN MANUAL
	elseif scanCode == KEY_NUMPAD_9 then magCmd = MAG_CMD_MOVE_TOP_RIGHT;		x = myWidth;		y = 0
	end
	--[[ change to normal number iso numpad
	if     scanCode == KEY_1 then magCmd = MAG_CMD_MOVE_BOTTOM_LEFT;	x = 0;				y = myHeight
	elseif scanCode == KEY_2 then magCmd = MAG_CMD_MOVE_BOTTOM;			x = win_rect.left;	y = myHeight
	elseif scanCode == KEY_3 then magCmd = MAG_CMD_MOVE_BOTTOM_RIGHT;	x = myWidth;		y = myHeight
	elseif scanCode == KEY_4 then magCmd = MAG_CMD_MOVE_LEFT;			x = 0;				y = win_rect.top
	elseif scanCode == KEY_5 then magCmd = MAG_CMD_MOVE_MIDDLE;			x = (myWidth)/2;	y = (myHeight)/2
	elseif scanCode == KEY_6 then magCmd = MAG_CMD_MOVE_RIGHT;			x = myWidth;		y = win_rect.top
	elseif scanCode == KEY_7 then magCmd = MAG_CMD_MOVE_TOP_LEFT;		x = 0;				y = 0
	elseif scanCode == KEY_8 then magCmd = MAG_CMD_MOVE_TOP;			x = win_rect.left;	y = 0						--tOdO DOES NOT EXIST IN MANUAL
	elseif scanCode == KEY_9 then magCmd = MAG_CMD_MOVE_TOP_RIGHT;		x = myWidth;		y = 0
	end
	--]]
	if magCmd == nil then
		OutputDebugInfo({"!!!!ChangeWindowPos():: unexpected scancode"}, OUT_HIGH)
	else
		if false then							--test SetWindowPos
			local swp = System.BitwiseOr(SWP_NOSIZE,SWP_NOOWNERZORDER)
	-- 		Win.SetWindowPos (winHandle, HWND_TOPMOST, x, y, 0, 0, SWP_NOSIZE)
			Win.SetWindowPos (winHandle, HWND_TOP, x, y, 0, 0, swp)
		else									--test MoveWindow
			Win.MoveWindow(winHandle, x, y, (win_rect.right - win_rect.left), (win_rect.bottom - win_rect.top), 1) --bRepaint)
		end
		Mag.ExecuteCommand(magCmd)
		OutputDebugInfo({"ChangeWindowPos():: x:y=", x, y}, OUT_LOW)
		rc =  EVENT_HANDLED
	end
 	return rc
end -- ChangeWindowPos


--[[--------------------------------------------------------------
	The function StringToTable converts a string consisting of substrings separated by a separator
	into a table. The index of the table starts at 1.
	The function returns the number of entries in the table and the table itself.
--]]
function StringToTable(separator, input)
	local table = {}
	local index = 1
	for string in string.gmatch(input, "([^"..separator.."]+)") do
		table[index] = string
		OutputDebugInfo(tostring(index) ..": ".. string)
		index = index+1
	end
	return index, table
end -- StringToTable


--[[--------------------------------------------------------------
--]]
function calcVerticalCheck( x, top, bottom )
	local i = 0
	local rc = 0
	local msg = ""
	for y = top , bottom do
		local pixel_rgb = System.GetPixel( x, y )			--colour of the pixel based on screen-coordinates
		if pixel_rgb == nil then OutputDebugInfo( "!!!!calcVerticalCheck:: nilpixel at " .. x .. ":" .. y )
		else
--			msg =  "pixel at " .. x .. ":" .. y .. " Colour is " ..  tostring(System.GetInfo( INFO_RGB_DESCRIPTION, pixel_rgb))
			local rgb = System.ExtractRGB(pixel_rgb)		--J's fashion
			if rgb == nil then OutputDebugInfo( "!!!!calcVerticalCheck::nil rgb")
			else
				local sumrgb = rgb.red+rgb.green*15+rgb.blue*255
				i = i + 1
				rc = rc + sumrgb*i
--				msg = "y:" .. y .. " rgb:" .. rgb.red ..":" ..rgb.green .. ":" ..rgb.blue .. " sumrgb:" ..  sumrgb .. " rc" .. rc
--				OutputDebugInfo(msg)
			end
		end
--		OutputDebugInfo(msg)
	end
	OutputDebugInfo({"---------- calcVerticalCheck x:top:bottom::" .. x .. ":" .. top .. ":" .. bottom .. " rc:" .. rc}, OUT_LOW)
	return rc
end -- calcVerticalCheck


--[[--------------------------------------------------------------
	DebugMark is the function tied to the hotkey RightAlt - T
	It places a easily recognizable line in the log
--]]
function DebugMark()
	OutputDebugInfo({"================================================================================"})
end -- DebugMark


--[[--------------------------------------------------------------
	DebugLevelModify is the function tied to the hotkey RightControl - B
	Note: Apparently you can't tie to the hotkey LeftControl - RightControl - B
	It cycles through the different pre-defined debug levels
--]]
function DebugLevelModify()
--	OutputDebugInfo({"Debug Outputlevel", OutputDebugLevel()}, OUT_HIGH)	--obsolete since OutputDebugLevel reports itself the old and new level
	OutputDebugLevel()
end -- DebugLevelModify

--[[--------------------------------------------------------------
	DebugDelayModify is the function tied to the hotkey RightControl - RightShift - B
	Note: Apparently you can't tie to the hotkey LeftControl - RightControl - B
	It cycles through the different pre-defined debug delay levels

--]]
function DebugDelayModify()
	if g_DebugDelay == 1 then g_DebugDelay = 1000
	elseif g_DebugDelay == 1000 then g_DebugDelay = 100
	else g_DebugDelay = 1
	end
	OutputDebugInfo({"Debug Delay:", g_DebugDelay}, OUT_HIGH)
end -- DebugDelayModify


--[[--------------------------------------------------------------------------------
--]]
function GetPropertyTable(p, maskTable)
	local tbl = nil
	if p == nil then
		local msg = nil
		local area = Area.GetCurrentApplication() 				-- Return the current top level application window as an area.
		if area == nil then
			msg = "!!!! GetPropertyTable(nil):: unable to GetCurrentApplication\r\n"
	 		area = Area.GetCurrent()							-- Return the current control area.
		end
		if area == nil then
			msg = "!!!! GetPropertyTable(nil):: unable to GetCurrentApplication and to GetCurrent"
		else
			p = Area.GetProperties (area)
			if p then
--				OutputDebugInfo({"!! GetPropertyTable(nil):: got a suitable area and properties"})
			else
				msg = msg .. "!!!! GetPropertyTable(nil):: able to get a suitable area but no properties"
			end
		end
		if msg then OutputDebugInfo( {"GetPropertyTable:", msg}, OUT_LOW) end
	end

	if p then
		tbl = p
		tbl["detector"] = string.format( "%d - %s", p.detector, TranslateDetector(p.detector))		--The detector that created this area: DETECTOR_WIN, DETECTOR_MSAA, DETECTOR_SHAPE, DETECTOR_DOM or DETECTOR_AREA
		tbl["type"] = string.format( "%d - %s", p.type,  TranslateType(p.type))
		local x, y = Utils.RectCenter( p)												--screen coordinates
		tbl["location"] =  string.format( "centre x:%04d y:%04d left:%04d top:%04d right:%04d bottom:%04d", x, y,  p.left, p.top, p.right, p.bottom)
--		tbl["windowHandle"] = string.format( "hwnd:%s", tostring(p.hwnd))				--Window handle of the area, if applicable
		tbl.left, tbl.top, tbl.right, tbl.bottom = nil, nil, nil, nil
		tbl["flags"] = string.format( "%d - 0x%04x", p.flags, p.flags)
		tbl["flags2"] = string.format( "%d - 0x%04x", p.flags2, p.flags2)
		tbl["flags3"] = string.format( "%d - 0x%04x", p.flags3, p.flags3)
		tbl["filter_flags"] = string.format( "%d - 0x%04x", p.filter_flags, p.filter_flags)
		if maskTable then
  			for _,k in pairs(maskTable) do tbl[k] = nil end
		end
	end
	return tbl
end -- GetPropertyTable



--[[--------------------------------------------------------------------------------
--]]
function GetKeyForValue( t, value )
  for k,v in pairs(t) do
    if v==value then return k end
  end
  return nil
end -- GetKeyForValue

-- local SCRIPT_NAME = "BabbageSupport.lua"


--------------------------------------------------------------------------------
function listPid()
	local winHandle = Win.GetForegroundWindow()
	local msg =  "\twinHandle: " .. tostring(winHandle) .. "\r\n\t"
	local area = Area.GetCurrentApplication() 				-- Return the current top level application window as an area.
	if area == nil then
		msg = msg .. "!!!! Area.GetCurrentApplication:: failure"
	else
		local p = Area.GetProperties( area) 
		if p == nil then
			msg = msg .. "!!!! Area.GetProperties failure"
		else
			local uia_handle = UIA.ObjectFromWindow( p.hwnd)
			if not uia_handle then
				msg = msg .. "!!!! UIA.ObjectFromWindow failure"
			else
				local pid = UIA.GetProperty( uia_handle, UIA_ProcessIdPropertyId)
				msg = msg .. "UIA.GetProperty PID:" .. tostring(pid)
			end
		end
	end
	return msg
end -- listPid


--[[--------------------------------------------------------------------------------
function OutputDebugInfo(string_table, debug_level, debug_flag, console_flag)
--]]
function printTable ( t )
--    OutputDebugInfo({"printTable", tostring(t)})
    local print_r_cache={}
    local function sub_print_r(t,indent)
        if (print_r_cache[tostring(t)]) then
            OutputDebugInfo(indent.."*"..tostring(t), 1, true, false)
        else
            print_r_cache[tostring(t)]=true
            if (type(t)=="table") then
                for pos,val in pairs(t) do
                    if (type(val)=="table") then
                        OutputDebugInfo(indent.."["..pos.."] => "..tostring(val).." {", 1, true, false)
                        sub_print_r(val,indent..string.rep(" ",string.len(pos)+8))
                        OutputDebugInfo(indent..string.rep(" ",string.len(pos)+6).."}", 1, true, false)
                    elseif (type(val)=="string") then
                        OutputDebugInfo(indent.."["..pos..'] => "'..val..'"', 1, true, false)
                    else
                        OutputDebugInfo(indent.."["..pos.."] => "..tostring(val), 1, true, false)
                    end
                end
            else
                OutputDebugInfo(indent..tostring(t), 1, true, false)
            end
        end
    end -- sub_print_r
    if (type(t)=="table") then
        OutputDebugInfo(tostring(t).." {", 1, true, false)
        sub_print_r(t,"  ")
        OutputDebugInfo("}", 1, true, false)
    else
        sub_print_r(t,"  ")
    end
    OutputDebugInfo("\r\n", 1, true, false)
end -- printTable

-- local SCRIPT_NAME = "BabbageSupport.lua"

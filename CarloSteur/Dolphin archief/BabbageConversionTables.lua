local SCRIPT_NAME = "BabbageConversionTables.lua"
local SCRIPT_TIMESTAMP = "12-4-2017 13:18:44" 

-- Copyright (C) 2016-2017 Babbage. All rights reserved.

--[[ for "#define" style definitions, see BabbageSupport.lua
	 conversion tables for Dolphin Scripting mnemonics to their numerical values
	 conversion functions based on these tables

DetectorTypeTable = { --convert reported detector types to mnemonics
AreaTypeTable = { --convert reported area types to mnemonics
ScreenItemTypeTable = { --convert numerical screen item type values to mnemonics
FocusTypeTable = { --convert reported focus types to mnemonics
ModeTable = { --convert reported mode types to mnemonics
VkToDkTable 		--convert Virtual Keycode to DolphinCode
DkToVkTable = { --convert DolphinCode to Virtual Keycode !!!!non-functioning
MsaaStateTable = { --convert reported MSAA types to mnemonics

ScanCodeToVirtualKeyCode( scancode )   
TranslateDetector(n)
TranslateFocus(n)
TranslateType(n)
TranslateMsaaState(n)


--]]------------------------------------------------------------------------------



--[[ik geef het op
   	see: function ScanCodeToVirtualKeyCode( scancode )	
DkToVkTable = { --convert DolphinCode to Virtual Keycode !!!!non-functioning
	[KEY_0] = 11,
	[KEY_1] = 2,
	[KEY_2] = 3,
	[KEY_3] = 4,
	[KEY_4] = 5,
	[KEY_5] = 6,
	[KEY_6] = 7,
	[KEY_7] = 8,
	[KEY_8] = 9,
	[KEY_9] = 10,
	[KEY_A] = VK_A,
	[KEY_ALT] = 130,
	[KEY_APPLICATION] = 221,
	[KEY_B] = VK_B,
	[KEY_BACKSLASH] = 86,
	[KEY_BACKSPACE] = 14,
	[KEY_BREAK] = 198,
	[KEY_C] = VK_C,
	[KEY_CAPSLOCK_OFF] = 58,
	[KEY_CAPSLOCK_ON] = 89,
	[KEY_COMMA] = 51,
	[KEY_CTRL] = 128,
	[KEY_CURSOR_DOWN] = 208,
	[KEY_CURSOR_LEFT] = 203,
	[KEY_CURSOR_RIGHT] = 205,
	[KEY_CURSOR_UP] = 200,
	[KEY_D] = 32,
	[KEY_DELETE] = 211,
	[KEY_DISABLE_INTERACTIVE] = 1,
	[KEY_DISABLE_LIVE] = 4,
	[KEY_DISABLE_VF] = 2,
	[KEY_DOUBLE_LEFT_MOUSE] = 216,
	[KEY_DOUBLE_MIDDLE_MOUSE] = 218,
	[KEY_DOUBLE_RIGHT_MOUSE] = 217,
	[KEY_E] = 18,
	[KEY_END] = 207,
	[KEY_ENTER] = 28,
	[KEY_EQUALS] = 13,
	[KEY_ESCAPE] = 1,
	[KEY_F] = 33,
	[KEY_F1] = 59,
	[KEY_F10] = 68,
	[KEY_F11] = 87,
	[KEY_F12] = 88,
	[KEY_F2] = 60,
	[KEY_F3] = 61,
	[KEY_F4] = 62,
	[KEY_F5] = 63,
	[KEY_F6] = 64,
	[KEY_F7] = 65,
	[KEY_F8] = 66,
	[KEY_F9] = 67,
	[KEY_G] = 34,
	[KEY_GRAVE] = 41,
	[KEY_H] = 35,
	[KEY_HASH] = 43,
	[KEY_HOME] = 199,
	[KEY_I] = 23,
	[KEY_INSERT] = 210,
	[KEY_J] = 36,
	[KEY_K] = 37,
	[KEY_L] = 38,
	[KEY_LEFT_MOUSE] = 92,
	[KEY_LEFT_WINDOWS] = 219,
	[KEY_LEFTBRACKET] = 26,
	[KEY_M] = 50,
	[KEY_MIDDLE_MOUSE] = 94,
	[KEY_MINUS] = 12,
	[KEY_N] = 49,
	[KEY_NUMLOCK_OFF] = 197,
	[KEY_NUMLOCK_ON] = 90,
	[KEY_NUMPAD_0] = 82,
	[KEY_NUMPAD_1] = 79,
	[KEY_NUMPAD_2] = 80,
	[KEY_NUMPAD_3] = 81,
	[KEY_NUMPAD_4] = 75,
	[KEY_NUMPAD_5] = 76,
	[KEY_NUMPAD_6] = 77,
	[KEY_NUMPAD_7] = 71,
	[KEY_NUMPAD_8] = 72,
	[KEY_NUMPAD_9] = 73,
	[KEY_NUMPAD_ASTERISK] = 55,
	[KEY_NUMPAD_ENTER] = 156,
	[KEY_NUMPAD_MINUS] = 74,
	[KEY_NUMPAD_PERIOD] = 83,
	[KEY_NUMPAD_PLUS] = 78,
	[KEY_NUMPAD_SLASH] = 181,
	[KEY_O] = 24,
	[KEY_P] = 25,
	[KEY_PAGE_DOWN] = 209,
	[KEY_PAGE_UP] = 201,
	[KEY_PAUSE] = 69,
	[KEY_PAUSE_OLD] = 157,
	[KEY_PERIOD] = 52,
	[KEY_POCKET_PC_1] = 225,
	[KEY_POCKET_PC_2] = 226,
	[KEY_POCKET_PC_3] = 227,
	[KEY_POCKET_PC_4] = 228,
	[KEY_POCKET_PC_5] = 229,
	[KEY_POCKET_PC_6] = 230,
	[KEY_POCKET_PC_ENTER] = 239,
	[KEY_PRINTSCREEN] = 183,
	[KEY_Q] = 16,
	[KEY_QUOTE] = 40,
	[KEY_R] = 19,
	[KEY_RIGHT_MOUSE] = 93,
	[KEY_RIGHT_WINDOWS] = 220,
	[KEY_RIGHTBRACKET] = 27,
	[KEY_S] = 31,
	[KEY_SCROLLLOCK_OFF] = 70,
	[KEY_SCROLLLOCK_ON] = 91,
	[KEY_SEMICOLON] = 39,
	[KEY_SHIFT] = 129,
	[KEY_SLASH] = 53,
	[KEY_SMART_ASTERISK] = KEY_F8,
	[KEY_SMART_BACK] = KEY_ESCAPE,
	[KEY_SMART_END] = KEY_F4,
	[KEY_SMART_HASH] = KEY_F9,
	[KEY_SMART_HOME] = KEY_LEFT_WINDOWS,
	[KEY_SMART_SOFT_LEFT] = KEY_F1,
	[KEY_SMART_SOFT_RIGHT] = KEY_F2,
	[KEY_SMART_TALK] = KEY_F3,
	[KEY_SPACE] = 57,
	[KEY_T] = 20,
	[KEY_TAB] = 15,
	[KEY_U] = 22,
	[KEY_V] = 47,
	[KEY_W] = 17,
	[KEY_WHEEL_DOWN] = 96,
	[KEY_WHEEL_UP] = 95,
	[KEY_X] = 45,
	[KEY_Y] = 21,
	[KEY_Z] = 44,
} -- DkToVkTable
--]]


-- Key mapping table "borrowed" from C:\ProgramData\dolphin\SnovaSuite1505\defaults\scripts\vktodolk.lua
VkToDkTable = { --convert Virtual Keycode to DolphinCode
	[1] = KEY_LEFT_MOUSE, [2] = KEY_RIGHT_MOUSE, [3] = KEY_BREAK,
	[4] = KEY_MIDDLE_MOUSE,
	[8] = KEY_BACKSPACE, [9] = KEY_TAB, [13] = KEY_ENTER,
	[19] = KEY_PAUSE, [20] = KEY_CAPSLOCK_OFF, 
	[27] = KEY_ESCAPE, [32] = KEY_SPACE,
	[33] = KEY_PAGE_UP, [34] = KEY_PAGE_DOWN, [35] = KEY_END,
	[36] = KEY_HOME, [37] = KEY_CURSOR_LEFT, [38] = KEY_CURSOR_UP,
	[39] = KEY_CURSOR_RIGHT, [40] = KEY_CURSOR_DOWN,
	[44] = KEY_PRINTSCREEN, [45] = KEY_INSERT, [46] = KEY_DELETE,
	[48] = KEY_0, [49] = KEY_1, [50] = KEY_2, [51] = KEY_3,
	[52] = KEY_4, [53] = KEY_5, [54] = KEY_6, [55] = KEY_7,
	[56] = KEY_8, [57] = KEY_9,
	[65] = KEY_A, [66] = KEY_B, [67] = KEY_C, [68] = KEY_D,
	[69] = KEY_E, [70] = KEY_F, [71] = KEY_G, [72] = KEY_H,
	[73] = KEY_I, [74] = KEY_J, [75] = KEY_K, [76] = KEY_L,
	[77] = KEY_M, [78] = KEY_N, [79] = KEY_O, [80] = KEY_P,
	[81] = KEY_Q, [82] = KEY_R, [83] = KEY_S, [84] = KEY_T,
	[85] = KEY_U, [86] = KEY_V, [87] = KEY_W, [88] = KEY_X,
	[89] = KEY_Y, [90] = KEY_Z,
	[91] = KEY_LEFT_WINDOWS, [92] = KEY_RIGHT_WINDOWS, [93] = KEY_APPLICATION,
	[96] = KEY_NUMPAD_0, [97] = KEY_NUMPAD_1, [98] = KEY_NUMPAD_2,
	[99] = KEY_NUMPAD_3, [100] = KEY_NUMPAD_4, [101] = KEY_NUMPAD_5,
	[102] = KEY_NUMPAD_6, [103] = KEY_NUMPAD_7, [104] = KEY_NUMPAD_8,
	[105] = KEY_NUMPAD_9, [106] = KEY_NUMPAD_ASTERISK,
	[107] = KEY_NUMPAD_PLUS, [109] = KEY_NUMPAD_MINUS,
	[110] = KEY_NUMPAD_PERIOD, [111] = KEY_NUMPAD_SLASH,
	[112] = KEY_F1, [113] = KEY_F2, [114] = KEY_F3, [115] = KEY_F4,
	[116] = KEY_F5, [117] = KEY_F6, [118] = KEY_F7, [119] = KEY_F8,
	[120] = KEY_F9, [121] = KEY_F10, [122] = KEY_F11, [123] = KEY_F12,
	[144] = KEY_NUMLOCK_OFF, [145] = KEY_SCROLLLOCK_OFF,
	[186] = KEY_SEMICOLON, [187] = KEY_EQUALS, [188] = KEY_COMMA,
	[189] = KEY_MINUS, [190] = KEY_PERIOD, [191] = KEY_SLASH,
	[192] = KEY_QUOTE, [219] = KEY_LEFTBRACKET, [220] = KEY_BACKSLASH,
	[221] = KEY_RIGHTBRACKET, [222] = KEY_HASH, [223] = KEY_GRAVE,
	[226] = KEY_BACKSLASH
} -- VkToDkTable


-- Detectors   .....\defaults\scripts\area.lua
DetectorTypeTable = { --convert reported detector types to mnemonics
	[0]  = "DETECTOR_WIN",		--= 0
	[1]  = "DETECTOR_MSAA",		--= 1
	[2]  = "DETECTOR_SHAPE",	--= 2
	[3]  = "DETECTOR_DOM",		--= 3
	[4]  = "DETECTOR_LAST",		--= DETECTOR_DOM + 1
	[4]  = "DETECTOR_AREA",		--= DETECTOR_LAST + 0
} -- DetectorTypeTable

-- Invariant area types.
AreaTypeTable = { --convert reported area types to mnemonics
-- 	"AREA_INVALID",			--= 0
	"AREA_GRAPHIC",			--= 1
	"AREA_TEXT",			--= 2
	"AREA_PROGRESS",		--= 3
	"AREA_DRAWING",			--= 4
	"AREA_ANIMATION",		--= 5
	"AREA_SPIN",			--= 6
	"AREA_TRACKBAR",		--= 7
	"AREA_RADIO",			--= 8
	"AREA_CHECKBOX",		--= 9
	"AREA_RADIO_CONTROL",	--= 10
	"AREA_CHECK_CONTROL",	--= 11
	"AREA_BUTTON",			--= 12
	"AREA_LINK",			--= 13
	"AREA_CONSOLE",			--= 14
	"AREA_SCROLL",			--= 15
	"AREA_EDIT",			--= 16
	"AREA_ITEM",			--= 17
	"AREA_HEADING",			--= 18
	"AREA_MISSING_19",		--= 19
	"AREA_TREE",			--= 20
	"AREA_LISTBOX",			--= 21
	"AREA_CELL",			--= 22
	"AREA_TABLE",			--= 23
	"AREA_PANE",			--= 24
	"AREA_HYPERTEXT",		--= 25
	"AREA_DIALOG",			--= 26
	"AREA_WORKSPACE",		--= 27
	"AREA_TEXT_LINK",		--= 28
	"AREA_SHEET",			--= 29
	"AREA_TAB",				--= 30
	"AREA_TAB_CONTROL",		--= 31
	"AREA_TAB_SHEET",		--= 32
	"AREA_GROUP",			--= 33
	"AREA_CONTAINER",		--= 34
	"AREA_MENU_BAR",		--= 35
	"AREA_GRIP",			--= 36
	"AREA_TITLE_BAR",		--= 37
	"AREA_RULER",			--= 38
	"AREA_STATUS_BAR",		--= 39
	"AREA_TOOLBAR",			--= 40
	"AREA_DOCUMENT",		--= 41
	"AREA_POPUP_COMBO",		--= 42
	"AREA_MENU",			--= 43
	"AREA_POPUP_DIALOG",	--= 44
	"AREA_ALT_TAB",			--= 45
	"AREA_APPLICATION",		--= 46
	"AREA_SCREEN",			--= 47
	"AREA_ROOT_MISSING_48",	--= 48
	"AREA_IGNORE",			--= 49
	"AREA_CONTROL",			--= 50
	"AREA_HEADING_TABLE",	--= 51
	"AREA_TIP",				--= 52
	"AREA_LISTVIEW",		--= 53
	"AREA_BALLOON",			--= 54
	"AREA_BUTTON_BAR",		--= 55
	"AREA_SYMBOL",			--= 56
	"AREA_EMBEDDED",		--= 57
	"AREA_CONTEXT1",		--= 58
	"AREA_WINDOW_EMBEDDED",	--= 59
	"AREA_MENU_EMBEDDED",	--= 60
} -- AreaTypeTable

--[[ Item From Screen Codes 
	 These codes are used with the Braille.FromScreen, Speak.FromScreen and Speak.GetString functions. 
--]]

ScreenItemTypeTable = { --convert numerical screen item type values to mnemonics
	[22] = "SCREEN_APPLICATION_TITLE",					-- The title of the application window 
	[ 5] = "SCREEN_CHARACTER",							-- The current character 
	[ 2] = "SCREEN_CONTROL",							-- The entire contents of the current control 
	[14] = "SCREEN_CONTROL_STATUS",					-- The status of the current control, for example "selected" 
	[13] = "SCREEN_CONTROL_TYPE_AFTER",				-- The type of the current control, as spoken after the focus depending on the verbosity scheme.  For example "button" 
	[19] = "SCREEN_CONTROL_TYPE_BEFORE",				-- The type of the current control, as spoken before the focus depending on the verbosity scheme.  For example "hypertext" 
	[42] = "SCREEN_DATE_DAY_OF_WEEK",					-- The day of the week, for example "Tuesday" 
	[41] = "SCREEN_DATE_FULL",							-- The full date, for example "1 March 2008" 
	[40] = "SCREEN_DATE_NUMERIC",						-- The date in numeric form, for example "01/03/2008" 
	[23] = "SCREEN_DOCUMENT_TITLE",					-- The title of the document window 
	[ 1] = "SCREEN_FOCUS",								-- The current focus 
	[27] = "SCREEN_FOCUS_ADDITIONAL_INFO",				-- The additional information about the focus 
	[28] = "SCREEN_FOCUS_DESCRIBE",					-- Full description of the focus, including any containing areas.  For example, a dialog title, property sheet, group box, then the control name, type and state 
	[26] = "SCREEN_FOCUS_POSITION_CHAR_POS",			-- The type and position of the focus in terms of characters and lines 
	[25] = "SCREEN_FOCUS_POSITION_PERCENT",			-- The type and percentage position of the focus relative to the top left of the current window 
	[24] = "SCREEN_FOCUS_POSITION_PIXELS",				-- The type and pixel position of the focus from the top left of the screen 
	[17] = "SCREEN_GROUPS_AFTER",						-- The groups of information that are normally spoken after the focus, for example, control type, state and after label.  This will depend on the current verbosity scheme 
	[16] = "SCREEN_GROUPS_BEFORE",						-- The groups of information that are normally spoken before the focus, for example, window title and before label.  This will depend on the current verbosity scheme 
	[33] = "SCREEN_HEADING_COLUMN",					-- The current column heading 
	[34] = "SCREEN_HEADING_ROW",						-- The current row heading 
	[11] = "SCREEN_HEADING_X",							-- The column heading 
	[12] = "SCREEN_HEADING_Y",							-- The row heading 
	[18] = "SCREEN_ITEM",								-- Current item 
	[36] = "SCREEN_LABEL_ABOVE",						-- The label above the current control 
	[21] = "SCREEN_LABEL_AFTER",						-- The label (incidental text) spoken after the current control 
	[20] = "SCREEN_LABEL_BEFORE",						-- The label (incidental text) spoken before the current control 
	[38] = "SCREEN_LABEL_BELOW",						-- The label below the current control 
	[35] = "SCREEN_LABEL_LEFT",						-- The label to the left of the current control 
	[37] = "SCREEN_LABEL_RIGHT",						-- The label to the right of the current control 
	[ 7] = "SCREEN_LINE",								-- The current line 
	[ 4] = "SCREEN_LINE_FROM_CURSOR",					-- The text from the cursor to the end of the line 
	[29] = "SCREEN_LINE_FROM_CURSOR_TO_ATTR_CHANGE",	-- The text from the cursor to an attribute change 
	[ 3] = "SCREEN_LINE_TO_CURSOR",					-- The text from the start of the line to the cursor 
	[31] = "SCREEN_PARAGRAPH",							-- The entire paragraph 
	[30] = "SCREEN_SENTENCE",							-- The current sentence 
	[10] = "SCREEN_SHORTCUT",							-- The shortcut (mnemonic) key for the current item 
	[ 9] = "SCREEN_STATUS_BAR",						-- The status bar of the window 
	[46] = "SCREEN_TABLE_COLUMN",						-- The whole of the current table column 
	[48] = "SCREEN_TABLE_COLUMN_FROM_CELL",			-- From the cell below the current cell down to the bottom of the current table column 
	[47] = "SCREEN_TABLE_COLUMN_TO_CELL",				-- From the top of the current table column down to the cell above the current cell 
	[43] = "SCREEN_TABLE_ROW",							-- The whole of the current table row 
	[45] = "SCREEN_TABLE_ROW_FROM_CELL",				-- From the cell to the right of the current cell across to the end of the current table row 
	[44] = "SCREEN_TABLE_ROW_TO_CELL",					-- From the start of the current table row across to the cell to the left of the current cell 
	[39] = "SCREEN_TIME",								-- The local time, for example "14:45" 
	[ 8] = "SCREEN_WINDOW",							-- The contents of the entire window, including title bar and menu bar if they exist 
	[15] = "SCREEN_WINDOW_TITLE",						-- The title of the current window 
	[ 6] = "SCREEN_WORD",								-- The current word 
} -- ScreenItemTypeTable


FocusTypeTable = { --convert reported focus types to mnemonics
	[0]  = "FOCUS_BOX",
	[1]  = "FOCUS_BEAM",
	[2]  = "FOCUS_AREA",
} -- FocusTypeTable


-- c:\ProgramData\dolphin\SnovaSuite1405\defaults\scripts\operations.lua
-- CHECK_MODE values.
ModeTable = { --convert reported mode types to mnemonics
	"MODE_LIVE",				-- = 1
	"MODE_INTERACTIVE",			-- = 2
	"MODE_AUTO_VF",				-- = 3
	"MODE_VF",					-- = 4
	"MODE_AREA_VF",				-- = 5
	"MODE_AREA_INTERACTIVE",	-- = 6
	"MODE_AUTO_INTERACTIVE",	-- = 7
	"MODE_AUTO_SELECTION_VF",	-- = 8
	"MODE_SELECTION_VF",		-- = 9
	"MODE_AREA_SELECTION_VF",	-- = 10
} -- ModeTable

--C:\ProgramData\dolphin\SnovaSuite1405\defaults\scripts\msaa.lua
-- MSAA state flags
MsaaStateTable = { --convert reported MSAA types to mnemonics
	"STATE_SYSTEM_NORMAL",								--  = 0x00000000	0
	"STATE_SYSTEM_UNAVAILABLE",							--  = 0x00000001	1
	"STATE_SYSTEM_SELECTED",							--  = 0x00000002	2
	"STATE_SYSTEM_FOCUSED",								--  = 0x00000004	4
	"STATE_SYSTEM_PRESSED",								--  = 0x00000008	8
	"STATE_SYSTEM_CHECKED",								--  = 0x00000010	16
	"STATE_SYSTEM_MIXED/STATE_SYSTEM_INDETERMINATE",	--  = 0x00000020	32
--	STATE_SYSTEM_INDETERMINATE = STATE_SYSTEM_MIXED
	"STATE_SYSTEM_READONLY",							--  = 0x00000040	64
	"STATE_SYSTEM_HOTTRACKED",							--  = 0x00000080	128
	"STATE_SYSTEM_DEFAULT",								--  = 0x00000100	256
	"STATE_SYSTEM_EXPANDED",							--  = 0x00000200	512
	"STATE_SYSTEM_COLLAPSED",							--  = 0x00000400	1024
	"STATE_SYSTEM_BUSY",								--  = 0x00000800	2048
	"STATE_SYSTEM_FLOATING",							--  = 0x00001000	4096
	"STATE_SYSTEM_MARQUEED",							--  = 0x00002000	8192
	"STATE_SYSTEM_ANIMATED",							--  = 0x00004000	16384
	"STATE_SYSTEM_INVISIBLE",							--  = 0x00008000	32768
	"STATE_SYSTEM_OFFSCREEN",							--  = 0x00010000	65536
	"STATE_SYSTEM_SIZEABLE",							--  = 0x00020000	131072
	"STATE_SYSTEM_MOVEABLE",							--  = 0x00040000	262144
	"STATE_SYSTEM_SELFVOICING",							--  = 0x00080000	524288
	"STATE_SYSTEM_FOCUSABLE",							--  = 0x00100000	1048576
	"STATE_SYSTEM_SELECTABLE",							--  = 0x00200000	2097152
	"STATE_SYSTEM_LINKED",								--  = 0x00400000	4194304
	"STATE_SYSTEM_TRAVERSED",							--  = 0x00800000	8388608
	"STATE_SYSTEM_MULTISELECTABLE",						--  = 0x01000000	16777216
	"STATE_SYSTEM_EXTSELECTABLE",						--  = 0x02000000	33554432
	"STATE_SYSTEM_ALERT_LOW",							--  = 0x04000000	67108864
	"STATE_SYSTEM_ALERT_MEDIUM",						--  = 0x08000000	134217728
	"STATE_SYSTEM_ALERT_HIGH",							--  = 0x10000000	268435456
	"STATE_SYSTEM_PROTECTED",							--  = 0x20000000	536870912
	"STATE_SYSTEM_HASPOPUP",							--  = 0x40000000	1073741824
	"STATE_SYSTEM_VALID",								--  = 0x7fffffff	0x7fffffff
} -- MsaaStateTable	

-- MSAA roles
MsaaRoleTable = { --convert reported MSAA roles to mnemonics
	"ROLE_SYSTEM_TITLEBAR",				--  = 1
	"ROLE_SYSTEM_MENUBAR",				--  = 2
	"ROLE_SYSTEM_SCROLLBAR",			--  = 3
	"ROLE_SYSTEM_GRIP",					--  = 4
	"ROLE_SYSTEM_SOUND",				--  = 5
	"ROLE_SYSTEM_CURSOR",				--  = 6
	"ROLE_SYSTEM_CARET",				--  = 7
	"ROLE_SYSTEM_ALERT",				--  = 8
	"ROLE_SYSTEM_WINDOW",				--  = 9
	"ROLE_SYSTEM_CLIENT",				--  = 10
	"ROLE_SYSTEM_MENUPOPUP",			--  = 11
	"ROLE_SYSTEM_MENUITEM",				--  = 12
	"ROLE_SYSTEM_TOOLTIP",				--  = 13
	"ROLE_SYSTEM_APPLICATION",			--  = 14
	"ROLE_SYSTEM_DOCUMENT",				--  = 15
	"ROLE_SYSTEM_PANE",					--  = 16
	"ROLE_SYSTEM_CHART",				--  = 17
	"ROLE_SYSTEM_DIALOG",				--  = 18
	"ROLE_SYSTEM_BORDER",				--  = 19
	"ROLE_SYSTEM_GROUPING",				--  = 20
	"ROLE_SYSTEM_SEPARATOR",			--  = 21
	"ROLE_SYSTEM_TOOLBAR",				--  = 22
	"ROLE_SYSTEM_STATUSBAR",			--  = 23
	"ROLE_SYSTEM_TABLE",				--  = 24
	"ROLE_SYSTEM_COLUMNHEADER",			--  = 25
	"ROLE_SYSTEM_ROWHEADER",			--  = 26
	"ROLE_SYSTEM_COLUMN",				--  = 27
	"ROLE_SYSTEM_ROW",					--  = 28
	"ROLE_SYSTEM_CELL",					--  = 29
	"ROLE_SYSTEM_LINK",					--  = 30
	"ROLE_SYSTEM_HELPBALLOON",			--  = 31
	"ROLE_SYSTEM_CHARACTER",			--  = 32
	"ROLE_SYSTEM_LIST",					--  = 33
	"ROLE_SYSTEM_LISTITEM",				--  = 34
	"ROLE_SYSTEM_OUTLINE",				--  = 35
	"ROLE_SYSTEM_OUTLINEITEM",			--  = 36
	"ROLE_SYSTEM_PAGETAB",				--  = 37
	"ROLE_SYSTEM_PROPERTYPAGE",			--  = 38
	"ROLE_SYSTEM_INDICATOR",			--  = 39
	"ROLE_SYSTEM_GRAPHIC",				--  = 40
	"ROLE_SYSTEM_STATICTEXT",			--  = 41
	"ROLE_SYSTEM_TEXT",					--  = 42
	"ROLE_SYSTEM_PUSHBUTTON",			--  = 43
	"ROLE_SYSTEM_CHECKBUTTON",			--  = 44
	"ROLE_SYSTEM_RADIOBUTTON",			--  = 45
	"ROLE_SYSTEM_COMBOBOX",				--  = 46
	"ROLE_SYSTEM_DROPLIST",				--  = 47
	"ROLE_SYSTEM_PROGRESSBAR",			--  = 48
	"ROLE_SYSTEM_DIAL",					--  = 49
	"ROLE_SYSTEM_HOTKEYFIELD",			--  = 50
	"ROLE_SYSTEM_SLIDER",				--  = 51
	"ROLE_SYSTEM_SPINBUTTON",			--  = 52
	"ROLE_SYSTEM_DIAGRAM",				--  = 53
	"ROLE_SYSTEM_ANIMATION",			--  = 54
	"ROLE_SYSTEM_EQUATION",				--  = 55
	"ROLE_SYSTEM_BUTTONDROPDOWN",		--  = 56
	"ROLE_SYSTEM_BUTTONMENU",			--  = 57
	"ROLE_SYSTEM_BUTTONDROPDOWNGRID",	--  = 58
	"ROLE_SYSTEM_WHITESPACE",			--  = 59
	"ROLE_SYSTEM_PAGETABLIST",			--  = 60
	"ROLE_SYSTEM_CLOCK",				--  = 61
	"ROLE_SYSTEM_SPLITBUTTON",			--  = 62
	"ROLE_SYSTEM_IPADDRESS",			--  = 63
	"ROLE_SYSTEM_OUTLINEBUTTON",		--  = 64
} -- MsaaRoleTable	

--------------------------------------------------------------------------------
--[[
--]]
function ScanCodeToVirtualKeyCode( scancode )	
	--!! ToDo see C:\ProgramData\dolphin\SnovaSuite1505\defaults\scripts\vktodolk.lua
	-- to map VK to DK
	-- KEY_x codes: see C:\ProgramData\dolphin\SnovaSuite1405\defaults\scripts\keyboard.lua
	-- VK_x codes: see %localappdata%\Dolphin\SnovaSuite1405\Settings\scripts\BabbageSupport.lua
	local dolphinCode = 0					-- scancode (VK code) converted to Dolphin key number (0 if not convertable)
	if     scancode == KEY_A then dolphinCode = VK_A  --30 ->  65
	elseif scancode == KEY_B then dolphinCode = VK_B  --48 ->  66
	elseif scancode == KEY_C then dolphinCode = VK_C  --46 ->  67
	elseif scancode == KEY_D then dolphinCode = VK_D
	elseif scancode == KEY_E then dolphinCode = VK_E
	elseif scancode == KEY_F then dolphinCode = VK_F
	elseif scancode == KEY_G then dolphinCode = VK_G
	elseif scancode == KEY_H then dolphinCode = VK_H
	elseif scancode == KEY_I then dolphinCode = VK_I
	elseif scancode == KEY_J then dolphinCode = VK_J
	elseif scancode == KEY_K then dolphinCode = VK_K
	elseif scancode == KEY_L then dolphinCode = VK_L
	elseif scancode == KEY_M then dolphinCode = VK_M
	elseif scancode == KEY_N then dolphinCode = VK_N
	elseif scancode == KEY_O then dolphinCode = VK_O
	elseif scancode == KEY_P then dolphinCode = VK_P
	elseif scancode == KEY_Q then dolphinCode = VK_Q
	elseif scancode == KEY_R then dolphinCode = VK_R
	elseif scancode == KEY_S then dolphinCode = VK_S
	elseif scancode == KEY_T then dolphinCode = VK_T
	elseif scancode == KEY_U then dolphinCode = VK_U
	elseif scancode == KEY_V then dolphinCode = VK_V
	elseif scancode == KEY_W then dolphinCode = VK_W
	elseif scancode == KEY_X then dolphinCode = VK_X
	elseif scancode == KEY_Y then dolphinCode = VK_Y
	elseif scancode == KEY_Z then dolphinCode = VK_Z
	elseif scancode == KEY_PAGE_UP then dolphinCode = VK_PAGEUP
	elseif scancode == KEY_PAGE_DOWN then dolphinCode = VK_PAGEDOWN
	elseif scancode == KEY_CURSOR_LEFT then dolphinCode = VK_LEFT	-- .. -> 37
	elseif scancode == KEY_CURSOR_UP then dolphinCode = VK_UP		-- .. -> 38
	elseif scancode == KEY_CURSOR_RIGHT then dolphinCode = VK_RIGHT	-- .. -> 39
	elseif scancode == KEY_CURSOR_DOWN then dolphinCode = VK_DOWN	-- .. -> 40
	else
		OutputDebugInfo({"!! ScanCodeToVirtualKeyCode(): can't convert scancode: ", tostring( scancode)}, OUT_VERY_LOW)
	end
	return dolphinCode
end -- 	ScanCodeToVirtualKeyCode

--[[--------------------------------------------------------------------------------
--]]
function TranslateDetector(n)
	local rc = DetectorTypeTable[n]
	if rc == nil then 
		OutputDebugInfo({" !!!! WARNING TranslateDetector(", tostring(n), ")return code is nil"}, OUT_HIGH)
		rc = -1 
	end
	return rc
end -- TranslateDetector


--[[--------------------------------------------------------------------------------
--]]
function TranslateFocus(n)
	local rc = FocusTypeTable[n]
	if rc == nil then 
		OutputDebugInfo({" !!!! WARNING TranslateFocus(", tostring(n), ")return code is nil"}, OUT_HIGH)
		rc = -1 
	end
	return rc
end -- TranslateFocus


--[[--------------------------------------------------------------------------------
--]]
function TranslateType(n)
	local rc = AreaTypeTable[n]
	if rc == nil then 
		OutputDebugInfo({" !!!! WARNING TranslateType(", tostring(n), ")return code is nil"}, OUT_HIGH)
		rc = 0 
	end
	return rc
end -- TranslateType


--[[--------------------------------------------------------------------------------
--]]
function TranslateMsaaRole(n)
	local rc = MsaaRoleTable[n]
	if rc == nil then 
		OutputDebugInfo({" !!!! WARNING TranslateMsaaRole(", tostring(n), ")return code is nil"}, OUT_HIGH)
		rc = 0 
	end
	return rc
end -- TranslateMsaaRole


--[[--------------------------------------------------------------------------------
--]]
function TranslateMsaaState(n)
	local rc = ""
	if n == 0 then rc = MsaaStateTable[1] end
	local i = 2
	local maskBit = 1
	while maskBit < STATE_SYSTEM_VALID and maskBit <= n do
		if System.BitwiseAnd( n, maskBit) ~= 0 then
			local msg = MsaaStateTable[i]
			if msg then rc = rc .. "+" .. msg end
		end
		i = i + 1
		maskBit = maskBit + maskBit
	end
	if rc == "" then 
		OutputDebugInfo({" !!!! WARNING TranslateMsaaState(", tostring(n), string.format("(0x%08x)", n), ")return code is nil"}, OUT_HIGH)
	end
	return rc
end -- TranslateMsaaState

-- convert Virtual Keycode to DolphinCode

--[[--------------------------------------------------------------------------------
--]]
function TranslateVkCode( n) 
	local rc = vkCodeTable[n]
	if rc == nil then 
		OutputDebugInfo({" !!!! WARNING TranslateVkCode(", tostring(n), ")return code is nil"}, OUT_HIGH)
		rc = "!!KEY_UNKNOWN!!" 
	end
	return rc
end -- TranslateVkCode

vkCodeTable = { --convert Virtual Keycode to name
[001] = "KEY_LEFT_MOUSE",									   -- [0x001] 
[002] = "KEY_RIGHT_MOUSE",                                     -- [0x002] 
[003] = "KEY_BREAK",                                           -- [0x003] 
[004] = "KEY_MIDDLE_MOUSE",                                    -- [0x004] 
[008] = "KEY_BACKSPACE",                                       -- [0x008] 
[009] = "KEY_TAB",                                             -- [0x009] 
[013] = "KEY_ENTER",                                           -- [0x00D] 
[019] = "KEY_PAUSE",                                           -- [0x013] 
[020] = "KEY_CAPSLOCK_OFF",                                    -- [0x014] 
[027] = "KEY_ESCAPE",                                          -- [0x01B] 
[032] = "KEY_SPACE",                                           -- [0x020] 
[033] = "KEY_PAGE_UP",                                         -- [0x021] 
[034] = "KEY_PAGE_DOWN",                                       -- [0x022] 
[035] = "KEY_END",                                             -- [0x023] 
[036] = "KEY_HOME",                                            -- [0x024] 
[037] = "KEY_CURSOR_LEFT",                                     -- [0x025] 
[038] = "KEY_CURSOR_UP",                                       -- [0x026] 
[039] = "KEY_CURSOR_RIGHT",                                    -- [0x027] 
[040] = "KEY_CURSOR_DOWN",                                     -- [0x028] 
[044] = "KEY_PRINTSCREEN",                                     -- [0x02C] 
[045] = "KEY_INSERT",                                          -- [0x02D] 
[046] = "KEY_DELETE",                                          -- [0x02E] 
[048] = "KEY_0",                                               -- [0x030] 
[049] = "KEY_1",                                               -- [0x031] 
[050] = "KEY_2",                                               -- [0x032] 
[051] = "KEY_3",                                               -- [0x033] 
[052] = "KEY_4",                                               -- [0x034] 
[053] = "KEY_5",                                               -- [0x035] 
[054] = "KEY_6",                                               -- [0x036] 
[055] = "KEY_7",                                               -- [0x037] 
[056] = "KEY_8",                                               -- [0x038] 
[057] = "KEY_9",                                               -- [0x039] 
[065] = "KEY_A",                                               -- [0x041] 
[066] = "KEY_B",                                               -- [0x042] 
[067] = "KEY_C",                                               -- [0x043] 
[068] = "KEY_D",                                               -- [0x044] 
[069] = "KEY_E",                                               -- [0x045] 
[070] = "KEY_F",                                               -- [0x046] 
[071] = "KEY_G",                                               -- [0x047] 
[072] = "KEY_H",                                               -- [0x048] 
[073] = "KEY_I",                                               -- [0x049] 
[074] = "KEY_J",                                               -- [0x04A] 
[075] = "KEY_K",                                               -- [0x04B] 
[076] = "KEY_L",                                               -- [0x04C] 
[077] = "KEY_M",                                               -- [0x04D] 
[078] = "KEY_N",                                               -- [0x04E] 
[079] = "KEY_O",                                               -- [0x04F] 
[080] = "KEY_P",                                               -- [0x050] 
[081] = "KEY_Q",                                               -- [0x051] 
[082] = "KEY_R",                                               -- [0x052] 
[083] = "KEY_S",                                               -- [0x053] 
[084] = "KEY_T",                                               -- [0x054] 
[085] = "KEY_U",                                               -- [0x055] 
[086] = "KEY_V",                                               -- [0x056] 
[087] = "KEY_W",                                               -- [0x057] 
[088] = "KEY_X",                                               -- [0x058] 
[089] = "KEY_Y",                                               -- [0x059] 
[090] = "KEY_Z",                                               -- [0x05A] 
[091] = "KEY_LEFT_WINDOWS",                                    -- [0x05B] 
[092] = "KEY_RIGHT_WINDOWS",                                   -- [0x05C] 
[093] = "KEY_APPLICATION",                                     -- [0x05D] 
[096] = "KEY_NUMPAD_0",                                        -- [0x060] 
[097] = "KEY_NUMPAD_1",                                        -- [0x061] 
[098] = "KEY_NUMPAD_2",                                        -- [0x062] 
[099] = "KEY_NUMPAD_3",                                        -- [0x063] 
[100] = "KEY_NUMPAD_4",                                        -- [0x064] 
[101] = "KEY_NUMPAD_5",                                        -- [0x066] 
[102] = "KEY_NUMPAD_6",                                        -- [0x067] 
[103] = "KEY_NUMPAD_7",                                        -- [0x068] 
[104] = "KEY_NUMPAD_8",                                        -- [0x069] 
[105] = "KEY_NUMPAD_9",                                        -- [0x06a] 
[106] = "KEY_NUMPAD_ASTERISK",                                 -- [0x06b] 
[107] = "KEY_NUMPAD_PLUS",                                     -- [0x06c] 
[109] = "KEY_NUMPAD_MINUS",                                    -- [0x06d] 
[110] = "KEY_NUMPAD_PERIOD",                                   -- [0x06e] 
[111] = "KEY_NUMPAD_SLASH",                                    -- [0x06f] 
[112] = "KEY_F1",                                              -- [0x070] 
[113] = "KEY_F2",                                              -- [0x071] 
[114] = "KEY_F3",                                              -- [0x072] 
[115] = "KEY_F4",                                              -- [0x073] 
[116] = "KEY_F5",                                              -- [0x074] 
[117] = "KEY_F6",                                              -- [0x075] 
[118] = "KEY_F7",                                              -- [0x076] 
[119] = "KEY_F8",                                              -- [0x077] 
[120] = "KEY_F9",                                              -- [0x078] 
[121] = "KEY_F10",                                             -- [0x079] 
[122] = "KEY_F11",                                             -- [0x07a] 
[123] = "KEY_F12",                                             -- [0x07b] 
[144] = "KEY_NUMLOCK_OFF",                                     -- [0x090] 
[145] = "KEY_SCROLLLOCK_OFF",                                  -- [0x091] 
[164] = "KEY_LMENU", 		            				       -- [0x0A4] 
[165] = "KEY_RMENU", 					                	   -- [0x0A5]
[186] = "KEY_SEMICOLON",                                       -- [0x0BA] 
[187] = "KEY_EQUALS",                                          -- [0x0BB] 
[188] = "KEY_COMMA",                                           -- [0x0BC] 
[189] = "KEY_MINUS",                                           -- [0x0BD] 
[190] = "KEY_PERIOD",                                          -- [0x0BE] 
[191] = "KEY_SLASH",                                           -- [0x0BF] 
[192] = "KEY_QUOTE",                                           -- [0x0C0] 
[219] = "KEY_LEFTBRACKET",                                     -- [0x0DB] 
[220] = "KEY_BACKSLASH",                                       -- [0x0DC] 
[221] = "KEY_RIGHTBRACKET",                                    -- [0x0DD] 
[222] = "KEY_HASH",                                            -- [0x0DE] 
[223] = "KEY_GRAVE",                                           -- [0x0DF] 
[226] = "KEY_BACKSLASH"                                        -- [0x0E2] 
} -- vkCodeTable


--[[
0x01 VK_LBUTTON Left mouse button
0x02 VK_RBUTTON Right mouse button
0x03 VK_CANCEL Control-break processing
0x04 VK_MBUTTON Middle mouse button (three-button mouse)
0x05 VK_XBUTTON1 X1 mouse button
0x06 VK_XBUTTON2 X2 mouse button
0x07 - Undefined
0x08 VK_BACK BACKSPACE key
0x09 VK_TAB TAB key
0x0A - Reserved
0x0B - Reserved
0x0C VK_CLEAR CLEAR key
0x0D VK_RETURN ENTER key
0x0E - Undefined
0x0F - Undefined
0x10 VK_SHIFT SHIFT key
0x11 VK_CONTROL CTRL key
0x12 VK_MENU ALT key
0x13 VK_PAUSE PAUSE key
0x14 VK_CAPITAL CAPS LOCK key
0x15 VK_KANA IME Kana mode
0x15 VK_HANGUEL IME Hanguel mode (maintained for compatibility; use VK_HANGUL)
0x15 VK_HANGUL IME Hangul mode
0x16 - Undefined
0x17 VK_JUNJA IME Junja mode
0x18 VK_FINAL IME final mode
0x19 VK_HANJA IME Hanja mode
0x19 VK_KANJI IME Kanji mode
0x1A - Undefined
0x1B VK_ESCAPE ESC key
0x1C VK_CONVERT IME convert
0x1D VK_NONCONVERT IME nonconvert
0x1E VK_ACCEPT IME accept
0x1F VK_MODECHANGE IME mode change request
0x20 VK_SPACE SPACEBAR
0x21 VK_PRIOR PAGE UP key
0x22 VK_NEXT PAGE DOWN key
0x23 VK_END END key
0x24 VK_HOME HOME key
0x25 VK_LEFT LEFT ARROW key
0x26 VK_UP UP ARROW key
0x27 VK_RIGHT RIGHT ARROW key
0x28 VK_DOWN DOWN ARROW key
0x29 VK_SELECT SELECT key
0x2A VK_PRINT PRINT key
0x2B VK_EXECUTE EXECUTE key
0x2C VK_SNAPSHOT PRINT SCREEN key
0x2D VK_INSERT INS key
0x2E VK_DELETE DEL key
0x2F VK_HELP HELP key
0x30 0 key
0x31 1 key
0x32 2 key
0x33 3 key
0x34 4 key
0x35 5 key
0x36 6 key
0x37 7 key
0x38 8 key
0x39 9 key
0x3A-40 - Undefined
0x41 A key
0x42 B key
0x43 C key
0x44 D key
0x45 E key
0x46 F key
0x47 G key
0x48 H key
0x49 I key
0x4A J key
0x4B K key
0x4C L key
0x4D M key
0x4E N key
0x4F O key
0x50 P key
0x51 Q key
0x52 R key
0x53 S key
0x54 T key
0x55 U key
0x56 V key
0x57 W key
0x58 X key
0x59 Y key
0x5A Z key
0x5B VK_LWIN Left Windows key (Natural keyboard)
0x5C VK_RWIN Right Windows key (Natural keyboard)
0x5D VK_APPS Applications key (Natural keyboard)
0x5E - Reserved
0x5F VK_SLEEP Computer Sleep key
0x60 VK_NUMPAD0 Numeric keypad 0 key
0x61 VK_NUMPAD1 Numeric keypad 1 key
0x62 VK_NUMPAD2 Numeric keypad 2 key
0x63 VK_NUMPAD3 Numeric keypad 3 key
0x64 VK_NUMPAD4 Numeric keypad 4 key
0x65 VK_NUMPAD5 Numeric keypad 5 key
0x66 VK_NUMPAD6 Numeric keypad 6 key
0x67 VK_NUMPAD7 Numeric keypad 7 key
0x68 VK_NUMPAD8 Numeric keypad 8 key
0x69 VK_NUMPAD9 Numeric keypad 9 key
0x6A VK_MULTIPLY Multiply key
0x6B VK_ADD Add key
0x6C VK_SEPARATOR Separator key
0x6D VK_SUBTRACT Subtract key
0x6E VK_DECIMAL Decimal key
0x6F VK_DIVIDE Divide key
0x70 VK_F1 F1 key
0x71 VK_F2 F2 key
0x72 VK_F3 F3 key
0x73 VK_F4 F4 key
0x74 VK_F5 F5 key
0x75 VK_F6 F6 key
0x76 VK_F7 F7 key
0x77 VK_F8 F8 key
0x78 VK_F9 F9 key
0x79 VK_F10 F10 key
0x7A VK_F11 F11 key
0x7B VK_F12 F12 key
0x7C VK_F13 F13 key
0x7D VK_F14 F14 key
0x7E VK_F15 F15 key
0x7F VK_F16 F16 key
0x80 VK_F17 F17 key
0x81 VK_F18 F18 key
0x82 VK_F19 F19 key
0x83 VK_F20 F20 key
0x84 VK_F21 F21 key
0x85 VK_F22 F22 key
0x86 VK_F23 F23 key
0x87 VK_F24 F24 key
0x88-8F - Unassigned
0x90 VK_NUMLOCK NUM LOCK key
0x91 VK_SCROLL SCROLL LOCK key
0x92-96 OEM specific
0x97-9F - Unassigned
0xA0 VK_LSHIFT Left SHIFT key
0xA1 VK_RSHIFT Right SHIFT key
0xA2 VK_LCONTROL Left CONTROL key
0xA3 VK_RCONTROL Right CONTROL key
0xA4 VK_LMENU Left MENU key
0xA5 VK_RMENU Right MENU key
0xA6 VK_BROWSER_BACK Browser Back key
0xA7 VK_BROWSER_FORWARD Browser Forward key
0xA8 VK_BROWSER_REFRESH Browser Refresh key
0xA9 VK_BROWSER_STOP Browser Stop key
0xAA VK_BROWSER_SEARCH Browser Search key
0xAB VK_BROWSER_FAVORITES Browser Favorites key
0xAC VK_BROWSER_HOME Browser Start and Home key
0xAD VK_VOLUME_MUTE Volume Mute key
0xAE VK_VOLUME_DOWN Volume Down key
0xAF VK_VOLUME_UP Volume Up key
0xB0 VK_MEDIA_NEXT_TRACK Next Track key
0xB1 VK_MEDIA_PREV_TRACK Previous Track key
0xB2 VK_MEDIA_STOP Stop Media key
0xB3 VK_MEDIA_PLAY_PAUSE Play/Pause Media key
0xB4 VK_LAUNCH_MAIL Start Mail key
0xB5 VK_LAUNCH_MEDIA_SELECT Select Media key
0xB6 VK_LAUNCH_APP1 Start Application 1 key
0xB7 VK_LAUNCH_APP2 Start Application 2 key
0xB8-B9 - Reserved
0xBA VK_OEM_1 Used for miscellaneous characters; it can vary by keyboard.  For the US standard keyboard, the ';:' key
0xBB VK_OEM_PLUS For any country/region, the '+' key
0xBC VK_OEM_COMMA For any country/region, the ',' key
0xBD VK_OEM_MINUS For any country/region, the '-' key
0xBE VK_OEM_PERIOD For any country/region, the '.' key
0xBF VK_OEM_2 Used for miscellaneous characters; it can vary by keyboard.
0xDB VK_OEM_4 Used for miscellaneous characters; it can vary by keyboard.  For the US standard keyboard, the '[{' key
0xDC VK_OEM_5 Used for miscellaneous characters; it can vary by keyboard.  For the US standard keyboard, the '\|' key
0xDD VK_OEM_6 Used for miscellaneous characters; it can vary by keyboard.  For the US standard keyboard, the ']}' key
0xDE VK_OEM_7 Used for miscellaneous characters; it can vary by keyboard.  For the US standard keyboard, the 'single-quote/double-quote' key
0xDF VK_OEM_8 Used for miscellaneous characters; it can vary by keyboard.
0xE6 IME PROCESS key OEM specific
0xE7 VK_PACKET Used to pass Unicode characters as if they were keystrokes. The VK_PACKET key is the low word of a 32-bit Virtual Key value used for non-keyboard input methods. For more information, see Remark in KEYBDINPUT, SendInput, WM_KEYDOWN, and WM_KEYUP
0xE9-F5 Unassigned OEM specific
0xF6 VK_ATTN Attn key
0xF7 VK_CRSEL CrSel key
0xF8 VK_EXSEL ExSel key
0xF9 VK_EREOF Erase EOF key
0xFA VK_PLAY Play key
0xFB VK_ZOOM Zoom key
0xFC VK_NONAME Reserved
0xFD VK_PA1 PA1 key
0xFE VK_OEM_CLEAR Clear key
--]]

-- local SCRIPT_NAME = "BabbageConversionTables.lua"

--
--C:\ProgramData\dolphin\SnovaSuite1405\defaults\scripts\keyboard.lua
--Scancode and Modifier definitions for script files.
-- Scancodes


--[[--------------------------------------------------------------------------------
--]]
function TranslateScancode( n) 
	local rc = tostring( n)
	if n then
		rc = scanCodeTable[n]
		if rc == nil then 
			OutputDebugInfo({" !!!! WARNING TranslateScancode(", tostring(n), ")return code is nil"}, OUT_HIGH)
			rc = "!!KEY_UNKNOWN!!:"..tostring(n) 
		end
	end
	return rc
end -- TranslateScancode

scanCodeTable = { --convert Virtual Keycode to name
	[001]	= "KEY_ESCAPE",							-- [0x001] 
	[002]	= "KEY_1",                               -- [0x002] 
	[003]	= "KEY_2",                               -- [0x003] 
	[004]	= "KEY_3",                               -- [0x004] 
	[005]	= "KEY_4",                               -- [0x005] 
	[006]	= "KEY_5",                               -- [0x006] 
	[007]	= "KEY_6",                               -- [0x007] 
	[008]	= "KEY_7",                               -- [0x008] 
	[009]	= "KEY_8",                               -- [0x009] 
	[010]	= "KEY_9",                               -- [0x00a] 
	[011]	= "KEY_0",                               -- [0x00b] 
	[012]	= "KEY_MINUS",                           -- [0x00c] 
	[013]	= "KEY_EQUALS",                          -- [0x00d] 
	[014]	= "KEY_BACKSPACE",                       -- [0x00e] 
	[015]	= "KEY_TAB",                             -- [0x00f] 
	[016]	= "KEY_Q",                               -- [0x010] 
	[017]	= "KEY_W",                               -- [0x011] 
	[018]	= "KEY_E",                               -- [0x012] 
	[019]	= "KEY_R",                               -- [0x013] 
	[020]	= "KEY_T",                               -- [0x014] 
	[021]	= "KEY_Y",                               -- [0x015] 
	[022]	= "KEY_U",                               -- [0x016] 
	[023]	= "KEY_I",                               -- [0x017] 
	[024]	= "KEY_O",                               -- [0x018] 
	[025]	= "KEY_P",                               -- [0x019] 
	[026]	= "KEY_LEFTBRACKET",                     -- [0x01a] 
	[027]	= "KEY_RIGHTBRACKET",                    -- [0x01b] 
	[028]	= "KEY_ENTER",                           -- [0x01c] 
	[030]	= "KEY_A",                               -- [0x01e] 
	[031]	= "KEY_S",                               -- [0x01f] 
	[032]	= "KEY_D",                               -- [0x020] 
	[033]	= "KEY_F",                               -- [0x021] 
	[034]	= "KEY_G",                               -- [0x022] 
	[035]	= "KEY_H",                               -- [0x023] 
	[036]	= "KEY_J",                               -- [0x024] 
	[037]	= "KEY_K",                               -- [0x025] 
	[038]	= "KEY_L",                               -- [0x026] 
	[039]	= "KEY_SEMICOLON",                       -- [0x027] 
	[040]	= "KEY_QUOTE",                           -- [0x028] 
	[041]	= "KEY_GRAVE",                           -- [0x029] 
	[043]	= "KEY_HASH",                            -- [0x02B] 
	[044]	= "KEY_Z",                               -- [0x02C] 
	[045]	= "KEY_X",                               -- [0x02D] 
	[046]	= "KEY_C",                               -- [0x02E] 
	[047]	= "KEY_V",                               -- [0x02F] 
	[048]	= "KEY_B",                               -- [0x030] 
	[049]	= "KEY_N",                               -- [0x031] 
	[050]	= "KEY_M",                               -- [0x032] 
	[051]	= "KEY_COMMA",                           -- [0x033] 
	[052]	= "KEY_PERIOD",                          -- [0x034] 
	[053]	= "KEY_SLASH",                           -- [0x035] 
	[055]	= "KEY_NUMPAD_ASTERISK",                 -- [0x037] 
	[057]	= "KEY_SPACE",                           -- [0x039] 
	[058]	= "KEY_CAPSLOCK_OFF",                    -- [0x03a] 
	[059]	= "KEY_F1",                              -- [0x03b] 
	[060]	= "KEY_F2",                              -- [0x03c] 
	[061]	= "KEY_F3",                              -- [0x03D] 
	[062]	= "KEY_F4",                              -- [0x03E] 
	[063]	= "KEY_F5",                              -- [0x03F] 
	[064]	= "KEY_F6",                              -- [0x040] 
	[065]	= "KEY_F7",                              -- [0x041] 
	[066]	= "KEY_F8",                              -- [0x042] 
	[067]	= "KEY_F9",                              -- [0x043] 
	[068]	= "KEY_F10",                             -- [0x044] 
	[069]	= "KEY_PAUSE",                           -- [0x045] 
	[070]	= "KEY_SCROLLLOCK_OFF",                  -- [0x046] 
	[071]	= "KEY_NUMPAD_7",                        -- [0x047] 
	[072]	= "KEY_NUMPAD_8",                        -- [0x048] 
	[073]	= "KEY_NUMPAD_9",                        -- [0x049] 
	[074]	= "KEY_NUMPAD_MINUS",                    -- [0x04a] 
	[075]	= "KEY_NUMPAD_4",                        -- [0x04b] 
	[076]	= "KEY_NUMPAD_5",                        -- [0x04c] 
	[077]	= "KEY_NUMPAD_6",                        -- [0x04d] 
	[078]	= "KEY_NUMPAD_PLUS",                     -- [0x04e] 
	[079]	= "KEY_NUMPAD_1",                        -- [0x04f] 
	[080]	= "KEY_NUMPAD_2",                        -- [0x050] 
	[081]	= "KEY_NUMPAD_3",                        -- [0x051] 
	[082]	= "KEY_NUMPAD_0",                        -- [0x052] 
	[083]	= "KEY_NUMPAD_PERIOD",                   -- [0x053] 
	[086]	= "KEY_BACKSLASH",                       -- [0x056] 
	[087]	= "KEY_F11",                             -- [0x057] 
	[088]	= "KEY_F12",                             -- [0x058] 
	[089]	= "KEY_CAPSLOCK_ON",                     -- [0x059] 
	[090]	= "KEY_NUMLOCK_ON",                      -- [0x05a] 
	[091]	= "KEY_SCROLLLOCK_ON",                   -- [0x05b] 
	[092]	= "KEY_LEFT_MOUSE",                      -- [0x05c] 
	[093]	= "KEY_RIGHT_MOUSE",                     -- [0x05d] 
	[094]	= "KEY_MIDDLE_MOUSE",                    -- [0x05e] 
	[095]	= "KEY_WHEEL_UP",                        -- [0x05f] 
	[096]	= "KEY_WHEEL_DOWN",                      -- [0x060] 
	[128]	= "KEY_CTRL",                            -- [0x080] 
	[129]	= "KEY_SHIFT",                           -- [0x081] 
	[130]	= "KEY_ALT",                             -- [0x082] 
	[156]	= "KEY_NUMPAD_ENTER",                    -- [0x09C] 
	[157]	= "KEY_PAUSE_OLD",                       -- [0x09D] 
	[181]	= "KEY_NUMPAD_SLASH",                    -- [0x0B5] 
	[183]	= "KEY_PRINTSCREEN",                     -- [0x0b7] 
	[197]	= "KEY_NUMLOCK_OFF",                     -- [0x0C5] 
	[198]	= "KEY_BREAK",                           -- [0x0C6] 
	[199]	= "KEY_HOME",                            -- [0x0C7] 
	[200]	= "KEY_CURSOR_UP",                       -- [0x0C8] 
	[201]	= "KEY_PAGE_UP",                         -- [0x0C9] 
	[203]	= "KEY_CURSOR_LEFT",                     -- [0x0CB] 
	[205]	= "KEY_CURSOR_RIGHT",                    -- [0x0CD] 
	[207]	= "KEY_END",                             -- [0x0D0] 
	[208]	= "KEY_CURSOR_DOWN",                     -- [0x0D1] 
	[209]	= "KEY_PAGE_DOWN",                       -- [0x0D2] 
	[210]	= "KEY_INSERT",                          -- [0x0D3] 
	[211]	= "KEY_DELETE",                          -- [0x0D4] 
	[216]	= "KEY_DOUBLE_LEFT_MOUSE",               -- [0x0D8] 
	[217]	= "KEY_DOUBLE_RIGHT_MOUSE",              -- [0x0D9] 
	[218]	= "KEY_DOUBLE_MIDDLE_MOUSE",             -- [0x0DA] 
                                        
	[219]	= "KEY_LEFT_WINDOWS",                    -- [0x0DB] 
	[220]	= "KEY_RIGHT_WINDOWS",                   -- [0x0DC] 
	[221]	= "KEY_APPLICATION",                     -- [0x0DD] 
                                        
	[225]	= "KEY_POCKET_PC_1",                     -- [0x0E1] 
	[226]	= "KEY_POCKET_PC_2",                     -- [0x0E2] 
	[227]	= "KEY_POCKET_PC_3",                     -- [0x0E3] 
	[228]	= "KEY_POCKET_PC_4",                     -- [0x0E4] 
	[229]	= "KEY_POCKET_PC_5",                     -- [0x0E5] 
	[230]	= "KEY_POCKET_PC_6",                     -- [0x0E6] 
	[239]	= "KEY_POCKET_PC_ENTER"                 -- [0x0EF] 
} -- scanCodeTable


--[[

KEY_SMART_SOFT_LEFT = KEY_F1
KEY_SMART_HOME = KEY_LEFT_WINDOWS
KEY_SMART_BACK = KEY_ESCAPE
KEY_SMART_SOFT_RIGHT = KEY_F2
KEY_SMART_TALK = KEY_F3
KEY_SMART_END = KEY_F4
KEY_SMART_ASTERISK = KEY_F8
KEY_SMART_HASH = KEY_F9

-- Modifiers

000	MODIFIER_NONE
001	MODIFIER_LEFT_CONTROL
002	MODIFIER_RIGHT_CONTROL
004	MODIFIER_LEFT_SHIFT
008	MODIFIER_RIGHT_SHIFT
016	MODIFIER_LEFT_ALT
032	MODIFIER_RIGHT_ALT
064	MODIFIER_CUSTOM

-- RegisterScriptKey definitions and flags

128	MODIFIER_SHIFT

001	KEY_DISABLE_INTERACTIVE
002	KEY_DISABLE_VF
004	KEY_DISABLE_LIVE
--]]
--
-- local SCRIPT_NAME = "BabbageConversionTables.lua"

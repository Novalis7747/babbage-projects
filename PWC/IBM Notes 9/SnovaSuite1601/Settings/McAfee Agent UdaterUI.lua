-- Dolphin Script File for McAfee Agent UdaterUI

require "strict" -- Variables must be declared, use during debugging.
require "dolphin"

--[[ (Notes)
	UdaterUI.exe gets focus from SuperNova, even as it's an off-screen
	application. SuperNova does not revert back the focus to the previous
	application. This script file is as simple as it gets, but seems to
	resolve that issue, by simulating the keypress ALT + TAB during the
	close down of this script.
--]]

function EventScriptStartup()
	System.OutputDebugString(L"UdaterUI.exe - EventScriptStartup")
end

function EventScriptCloseDown()
	System.SimulateKeyPress(KEY_TAB, MODIFIER_LEFT_ALT)
	System.OutputDebugString(L"UdaterUI.exe - EventScriptCloseDown")
end

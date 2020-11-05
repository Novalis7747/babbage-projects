-- accessibility_test.exe.lua 2015/05/13 15:50
-- Dolphin Script File for accessibility_test.exe
-- intercept the magick-key alt-1.
-- accessibility_test.exe uses this key to activate tabblad-1, where the user can enter data in the Edit5 box
-- This script extend that to inform the user what the contents of the Edit1 box is
-- This information is (supposed) to happen via both Speech and Braille
-- Up till now the Speech path seems very unreliable and the Braille a little unreliable

require "strict" -- Variables must be declared, use during debugging.
require "windows_functions"
require "dolphin"

-- Constants 
DEBUGLEVEL = 9

SCRIPT_NAME = "accessibility_test"
count = 0           --counter to track how often we recognized the situation under test


-- Event handlers, remember to return either EVENT_PASS_ON or EVENT_HANDLED
function EventScriptStartup ()
	System.OutputDebugString( L"SOD 8:47" )
	--[[
		registring Alt-1 as key did not seem too work.
		In retrospect it may possibly work but not reliable
		This path is not further pursued
		System.RegisterScriptKey (KEY_1, MODIFIER_LEFT_ALT, "MyFunction_1", "Description of MyFunction") 
	]]--
	--[[
		experiment conducted when registring Alt-1 did not (seem to) work
		Alt-M seems to work reliable (but in my current state of mind, I/m not sure about anything concerning SN
	]]--
	System.RegisterScriptKey (KEY_M, MODIFIER_LEFT_ALT, "MyFunction_M", "Description of MyFunction")
end

--[[
	alternative to registering Alt-1, is to process each and every keystroke and act only on Alt-1
--]]
function EventApplicationKeyPress (scancode, modifier)
	if scancode == KEY_1 and modifier == MODIFIER_LEFT_ALT then
		--tally and log the detection of Alt-1
		count = count + 1
				local msg = SCRIPT_NAME..":EventApplicationKeyPress "..count
		Speak.Text(msg)
		System.OutputDebugString(msg)

		--retrieve the info we are after
		--first get a handle to the active window, i.e. the application
		--then processes each of the childwindows till the Edit1 box is found
		--Note that this does not really add any valuer to this script, it is merely illustrative for the
		--evolutionaire way the script is developed
		local window_handle = Win.GetForegroundWindow()
		local class_name = System.GetClassName(window_handle)
		System.OutputDebugString(L"GetForegroundWindow: "..class_name)
		local child_window_handles = System.EnumerateChildWindows(window_handle)
		for index, child_window_handle in ipairs(child_window_handles) do
			class_name = System.GetClassName(child_window_handle)
			local title = System.GetWindowText(child_window_handle)
			System.OutputDebugString(L"class_name: "..title)
			if title == L"Edit1" then
				System.OutputDebugString("Found window with title 'Edit1'")
				--we found the Edit1 box we were looking for
				--we can't get the contents of Edit1 box via the windowhandle but
				--we can retrieve it by means of MSAA
				local info = System.GetInfo(child_window_handle)
				--System.OutputDebugString( info )
				local msaa_handle = MSAA.ObjectFromWindow (child_window_handle)
				if msaa_handle then
					-- Get the name of the first item in the tray
					local text = MSAA.GetInfo(msaa_handle, MSAA_VALUE)
					if text == nil then
						text = "NILL"
					end
					-- add the tracking counter for easy on-the-fly recognition in the log window
					text = text..L" "..count
					--report the contents to the user by Speech
					--since this does not work reliable, lets also report the return status
					--this status turns out to be (always?) succesful, i.e. 1
					local rc = Speak.Text( text )
					if rc == nil then rc = -12345 end
					System.OutputDebugString( "rc = "..rc )
					--report the contents to the user by Braille
					Braille.Text( text )
					System.OutputDebugString (text)
					--an exercise in area useage, also an historical part of the trial&error approach
					local area = Area.GetCurrentWindow()
					for child in Area.Children (area) do
						local label = Area.GetLabel(child)
						if label == nil then label = L"NIL-label" end
						--System.OutputDebugString( L"child label = "..label)
					end
					MSAA.DeleteObject(msaa_handle)
					--System.Sleep(1000)        --remnant of some tests to see whether sleeping would improve the System.Speak behaviour
					return EVENT_HANDLED        --I (nv) still "think" this is the wrong return value
				end
			end
		end
		return EVENT_HANDLED    
	end
	return EVENT_PASS_ON
end

function MyFunction_M()
	System.OutputDebugString( "M" )
	Speak.Text( "M")
end

function MyFunction_1()
	System.OutputDebugString(SCRIPT_NAME.."2015/05/13     ")
	Speak.Text( "een")
	Speak.Text(SCRIPT_NAME)
	local window_handle = Win.GetForegroundWindow()
	local class_name = System.GetClassName(window_handle)
	System.OutputDebugString(L"GetForegroundWindow: "..class_name)
end 

function MyFunction_RegKey()
	System.OutputDebugString( "RegKey" )
	Speak.Text( "RegKey")
end

function MyFunction3doesnmotexist()
--
--
	System.OutputDebugString( "mijn tekst #3" )
	Speak.Text( "mijn tekst nogmaals")

--
end


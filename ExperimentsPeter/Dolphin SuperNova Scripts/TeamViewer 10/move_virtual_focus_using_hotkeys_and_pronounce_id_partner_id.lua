-- Dolphin Script File for TeamViewer V10
-- Event handlers, remember to return either EVENT_PASS_ON or EVENT_HANDLED

require "strict" -- Variables must be declared, use during debugging
require "dolphin"

-- Hotkeys assigned during startup
function EventScriptStartup()
	System.RegisterScriptKey(KEY_M, MODIFIER_RIGHT_CONTROL, "ReadPartnerID", "Read Partner-ID")
	System.RegisterScriptKey(KEY_N, MODIFIER_RIGHT_CONTROL, "ReadOwnID", "Read ID")
end

-- Move virtual focus to Partner-ID input and pronounce it if applicable
function ReadPartnerID()
	VF.ChooseFocus(FOCUS_AUTO_AREA_VF)
	local vf_marker = {tag = "TagPartnerID"}
	local result = VF.MoveToMarker(vf_marker, 0)
		if result == nil then
			System.OutputDebugString("Not found")
			Speak.Text(L"Couldn't find Partner-ID")
		else
			System.OutputDebugString("Enter your partner's ID")
			Speak.FromScreen(SCREEN_FOCUS)
	Mag.Auto()
	end
end

-- Move virtual focus to your own ID and pronounce it
function ReadOwnID()
	VF.ChooseFocus(FOCUS_AUTO_AREA_VF)
	local vf_marker = {tag = "TagOwnID"}
	local result = VF.MoveToMarker(vf_marker, 0)
		if result == nil then
			System.OutputDebugString("Not found")
			Speak.Text(L"Couldn't find ID")
		else
			System.OutputDebugString("Found your own ID")
			Speak.FromScreen(SCREEN_FOCUS)
	Mag.Auto()
	end
end

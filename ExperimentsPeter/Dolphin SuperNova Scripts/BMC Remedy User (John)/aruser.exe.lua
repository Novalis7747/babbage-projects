-- Script for KPN BMC Remedy User (ASTRID) Support, aruser.exe
-- 0.1 Initial Version 
-- 0.1.1 Updated due to different screen layout

require "strict" -- Variables must be declared, use during debugging.
require "dolphin"

-- Hotkey Definitions
function EventScriptStartup ()
	System.RegisterScriptKey (KEY_F1, MODIFIER_LEFT_ALT+MODIFIER_LEFT_SHIFT,
		"BmcTabIncident", "Move to incident tab")
	System.RegisterScriptKey (KEY_F2, MODIFIER_LEFT_ALT+MODIFIER_LEFT_SHIFT,
		"BmcTabTaakDetails", "Move to taak details tab")
	System.RegisterScriptKey (KEY_F6, MODIFIER_LEFT_ALT+MODIFIER_LEFT_SHIFT,
		"BmcTabTicketInformatie", "Move to ticket informatie tab")
	System.RegisterScriptKey (KEY_K, MODIFIER_LEFT_CONTROL,
		"BmcTextKlantorder", "Move to klantorder")		
end

-- focus Tab Incident and move to Verantw result list
function BmcTabIncident ()
	VF.ChooseFocus(FOCUS_VF)
	local vf_marker = { tag="BmcTabIncident"}
	if not VF.MoveToMarker(vf_marker,1) then return nil end
	System.OutputDebugString("Moved")
	
	if not VF.Action(ACTIVATE_PRESS) then	return nil end
	System.OutputDebugString("pressed")	
	local sys_wait = {minimum=250, maximum = 1000, object = 0}
	local sys_marker = {}
	System.Wait(sys_wait, sys_marker)

	if not VF.MoveToXY(298,762) then return nil end
	System.OutputDebugString("moved to verantw")
	
	Mag.Auto()
	Speak.Auto()
	Braille.Auto()
end

-- focus Tab Taak Details and copy monteur omschrijving
function BmcTabTaakDetails ()
	VF.ChooseFocus(FOCUS_VF)
	local vf_marker = {tag="BmcTabTaakDetails"}
	if not VF.MoveToMarker(vf_marker,1) then return nil	end
	System.OutputDebugString("Moved")
	
	if not VF.Action(ACTIVATE_PRESS) then	return nil end
	System.OutputDebugString("pressed")
	local sys_wait = {minimum=250, maximum = 10000, object = 1}
--! 	local sys_marker = {}
 	local sys_marker = {scope=SCOPE_CURRENT_WINDOW, area_type=AREA_TEXT, name=L"Werkelijk einde"}
	System.Wait(sys_wait, sys_marker)
	
 	if not VF.MoveToXY(298,713) then return nil end
 	System.OutputDebugString("moved to afsluiting omschrijving")

	VF.Action(CLICK_LEFT) 
	VF.Action (CLICK_RIGHT)
	System.SimulateKeyPress(KEY_A, MODIFIER_NONE)
	System.SimulateKeyPress(KEY_C, MODIFIER_LEFT_CONTROL)
	VF.ChooseFocus(FOCUS_INTERACTIVE)
	System.SimulateKeyPress(KEY_HOME, MODIFIER_NONE)
	Speak.Mute()

	VF.ChooseFocus(FOCUS_VF)
 	if not VF.MoveToXY(298,713) then return nil end
 	System.OutputDebugString("moved to afsluiting omschrijving")

	Mag.Auto()
	Speak.Auto()
	Braille.Auto()
end

-- focus Tab Ticket  Informatie and move vf to result window
function BmcTabTicketInformatie ()
	VF.ChooseFocus(FOCUS_VF)
	local vf_marker={tag="BmcTabTicketInformatie"}
	if not VF.MoveToMarker(vf_marker,1) then return nil end
	System.OutputDebugString("Moved")
	
	if not VF.Action(ACTIVATE_PRESS) then	return nil end
	System.OutputDebugString("pressed")
	
	local sys_wait = {minimum=250, maximum = 1000, object = 0}
	local sys_marker = {}
	System.Wait(sys_wait, sys_marker)

	if not VF.MoveToXY(200,513) then return nil end
	System.OutputDebugString("moved to status")

	Speak.Auto()
	Braille.Auto()
	Mag.Auto()
end

-- move to klantorder#
function BmcTextKlantorder ()
	Speak.Mute()
	VF.ChooseFocus(FOCUS_VF)
	if not VF.MoveToXY(194,438) then return nil end
	System.OutputDebugString("moved to klantord")
	Mag.Auto()
	Speak.Auto()
	Braille.Auto()
end
	

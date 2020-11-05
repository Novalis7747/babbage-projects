require "strict"
require "dolphin"


-- Global constants
ADDPL_SCRIPT = "addPlacemarker"
ADDPL_DOMAIN = L"www.babbage.com"
ADDPL_URL = L"http://www.babbage.com/public/placemarkers/index.html"
local SETTINGS_FILE


-- Event handlers during script start
addplacemarkers_function_eventscriptstartup = System.GetFunction("EventScriptStartup")
function EventScriptStartup()
	OutputDebugInfo({ADDPL_SCRIPT, "EventScriptStartup"}, 1)
	local folder = System.GetInfo(INFO_SCRIPT_DATA_PATH)
	local name = System.GetInfo(INFO_SCRIPT_NAME)
	name = wstring.gsub(name, L"\.lu.$", L".ini")
	SETTINGS_FILE = wstring.format(L"%s\\%s", folder, name)
	LoadSettingsFile()
	if addplacemarkers_function_eventscriptstartup then
		addplacemarkers_function_eventscriptstartup()
	end
	return EVENT_PASS_ON
end


-- Load (or create if one doesn't exist) the settings file
function LoadSettingsFile()
	Config.Create(SETTINGS_FILE)
end


-- At focus change in Internet Explorer
addplacemarkers_function_eventapplicationfocuschange = System.GetFunction("EventApplicationFocusChange")
function EventApplicationFocusChange(focus_type, focus_area)
	OutputDebugInfo({ADDPL_SCRIPT,"EventApplicationFocusChange:", "<type>", focus_type},1)
	local oDoc = GetHtmlDoc(ADDPL_DOMAIN)
	if not oDoc then 
		if addplacemarkers_function_eventapplicationfocuschange then 
			addplacemarkers_function_eventapplicationfocuschange(focus_type, focus_area) 
		end
		return EVENT_PASS_ON
	end
	if focus_type == FOCUS_AREA or focus_type == FOCUS_BEAM then
		AddPlacemarkers(oDoc)
	end
	return EVENT_PASS_ON
end


-- Function to update the HTML
function AddPlacemarkers(oDoc)
	if oDoc.URL == ADDPL_URL then
		AddLandmarkId (oDoc, "Contact01", "navigation")
		Config.WriteString(SETTINGS_FILE, L"Options", L"Waarde", ADDPL_URL)
	end
end

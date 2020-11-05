-- Dolphin Script File for Babbage Accessibility Test

-- Requirements
require "strict"
require "dolphin"
require "windows_functions"

-- Global environment
local application_title
local entrie_selection
local list_entries
local settings_file

-- Functions
function EventScriptStartup()
	System.RegisterScriptKey(KEY_F,MODIFIER_CUSTOM,"PerformFunctions","Register a new search hotkey")
	local folder=System.GetInfo(INFO_SCRIPT_DATA_PATH)
	local name=System.GetInfo(INFO_SCRIPT_NAME)
	name=wstring.gsub(name,L"\.lu.$",L".ini")
	settings_file=wstring.format(L"%s\\%s",folder,name)
end

function PerformFunctions()
	GetWindowTitle()
	System.Sleep(200)
	LoadSettingsFile()
	System.Sleep(200)
	ProvideListBox()
	System.Sleep(200)
	NoNameYet()
	System.Sleep(200)
	MoveMousePointer()
end

function GetWindowTitle()
	local window_handle=Win.GetForegroundWindow()
	local window_title=System.GetWindowText(window_handle)
	application_title=window_title
end

function LoadSettingsFile()
	Config.Create(settings_file)
	local read=Config.ReadString(settings_file,application_title,L"Value",L"")
	list_entries={read}
	System.OutputDebugString(read)
end

function ProvideListBox()
	local options={title="Lijst met opties",text="Maak een keus uit onderstaande lijst:",sort=1,selected=1}
	local entries=list_entries
	local result=Dialog.ListBox(options,entries)
	entrie_selection=list_entries[result]
end

function NoNameYet()
	System.OutputDebugString(application_title)
	VF.ChooseFocus(FOCUS_VF)
	VF.Move(MOVE_VF_AREA_TOP,SCOPE_CURRENT_WINDOW,1)
	local vf_search={direction=DIRECTION_VF_NEXT,scope=SCOPE_CURRENT_VF,scroll=1,text=entrie_selection}
	local result=VF.FindText(vf_search)
	if result==1 then
		result=VF.FindNext(DIRECTION_VF_NEXT_OCCURRENCE)
	else
		Speak.Text("Niets gevonden")
	end
	Braille.Auto()
	Mag.Auto()
	Speak.Auto()
end

function MoveMousePointer()
	VF.Action(CLICK_MOVE_ONLY)
end

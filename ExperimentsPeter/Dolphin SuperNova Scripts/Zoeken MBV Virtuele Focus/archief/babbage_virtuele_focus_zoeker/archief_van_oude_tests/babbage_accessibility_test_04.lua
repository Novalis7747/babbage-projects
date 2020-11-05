-- Dolphin Script File to perform a search using the Virtual Focus and a ListBox

-- Requirements
require "strict"
require "dolphin"
require "windows_functions"

-- Global environment
local application_title
local entrie_selection
local list_entries
local settings_file
local search_multiplier_separator
local string_separator

-- Functions
function EventScriptStartup()
	System.RegisterScriptKey(KEY_F,MODIFIER_CUSTOM,"PerformFunctions","Register a new search hotkey")
	local folder=System.GetInfo(INFO_SCRIPT_DATA_PATH)
	local name=System.GetInfo(INFO_SCRIPT_NAME)
	name=wstring.gsub(name,L"\.lu.$",L".ini")
	settings_file=wstring.format(L"%s\\%s",folder,name)
end

-- Execute the following functions in a particular order
function PerformFunctions()
	GetWindowTitle()
	System.Sleep(200)
	LoadSettingsFile()
	System.Sleep(200)
	StringToTable(list_entries)
	System.Sleep(200)
	ProvideListBox()
	System.Sleep(200)
	PerformSearch()
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
	local read=Config.ReadString(settings_file,application_title,L"Keywords",L"")
	local separator=Config.ReadString(settings_file,L"Separators",L"StringSeparator",L";;")
	local multiplier_separator=Config.ReadString(settings_file,L"Separators",L"MultiplierSeparator",L"--")
	list_entries=tostring(read)
	string_separator=tostring(separator)
	search_multiplier_separator=tostring(multiplier_separator)
end

function StringToTable(input)
	local separator=string_separator
	local table={}
	local index=1
	for string in string.gmatch(input,"([^"..separator.."]+)") do
		table[index]=string
		index=index+1
	end
	list_entries=table
end

function ProvideListBox()
	local options={title="Zoeken",text="Maak een keus uit onderstaande lijst en bevestig met ENTER:",sort=1,selected=1}
	local entries=list_entries
	local result=Dialog.ListBox(options,entries)
	entrie_selection=list_entries[result]
end

function PerformSearch()
	local separator=search_multiplier_separator
	local search_entrie
	local multiplier
	local split_result={}
	local index=1
	for part in string.gmatch(entrie_selection,"([^"..separator.."]+)") do
		split_result[index]=part
		index=index+1
	end
	local search_entrie=split_result[1]
	local multiplier=split_result[2]
	if multiplier==nil then
		multiplier=1
	end
	tostring(search_entrie)
	tonumber(multiplier)
	VF.ChooseFocus(FOCUS_VF)
	VF.Move(MOVE_VF_AREA_TOP,SCOPE_CURRENT_WINDOW,1)
	local search={direction=DIRECTION_VF_NEXT,scope=SCOPE_CURRENT_VF,scroll=1,text=search_entrie}
	for times=multiplier,1,-1 do
		local result=VF.FindText(search)
	end
	Braille.Auto()
	Mag.Auto()
	Speak.Auto()
end

function MoveMousePointer()
	VF.Action(CLICK_MOVE_ONLY)
end

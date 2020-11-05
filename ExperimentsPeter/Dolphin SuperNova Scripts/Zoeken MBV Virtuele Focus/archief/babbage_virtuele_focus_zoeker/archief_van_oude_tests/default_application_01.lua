-- Dolphin Script File to perform a search using the Virtual Focus and a ListBox

--[[
	20151124: Nog te doen:
	* CAPS-LOCK + ; zoeken door entrie_list[index], naar de volgende index navigeren, plaatsmarkering functie
	* Zoek en &Tab: moet nog verder uitgewerkt worden, een TAB toets simuleren geeft nog niet het gewenste resultaat
--]]

-- Requirements
require "strict"
require "dolphin"
require "windows_functions"

-- Global environment
local application_title
local entrie_selection
local list_entries
local selected_action
local settings_file
local search_multiplier_separator
local string_separator

-- Variables
KEYPRESS_NORMAL=1		-- Normale toetsaanslag, indrukken en loslaten
KEYPRESS_PRESS=2		-- Toets indrukken en vasthouden
KEYPRESS_RELEASE=3	-- Toets loslaten
INPUT_KEYBOARD=1
KEYEVENTF_UNICODE=4
KEYEVENTF_KEYUP=2

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
	local custom={"&Zoeken","Zoek en &Klik","Zoek en &Tab","&Annuleren"}
	local result,action=Dialog.ListBox(options,entries,custom)
	entrie_selection=list_entries[result]
	selected_action=action
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
	if selected_action==1 then
		VF.ChooseFocus(FOCUS_VF)
		VF.Move(MOVE_VF_AREA_TOP,SCOPE_CURRENT_WINDOW,0)
		local search={direction=DIRECTION_VF_NEXT,scope=SCOPE_CURRENT_VF,scroll=1,text=search_entrie}
		for times=multiplier,1,-1 do
			local result=VF.FindText(search)
		end
		VF.Action(CLICK_MOVE_ONLY)
	elseif selected_action==2 then
		VF.ChooseFocus(FOCUS_VF)
		VF.Move(MOVE_VF_AREA_TOP,SCOPE_CURRENT_WINDOW,0)
		local search={direction=DIRECTION_VF_NEXT,scope=SCOPE_CURRENT_VF,scroll=1,text=search_entrie}
		for times=multiplier,1,-1 do
			local result=VF.FindText(search)
		end
		VF.Action(CLICK_MOVE_ONLY)
		VF.Action(CLICK_LEFT)
		VF.ChooseFocus(FOCUS_BACK)
	elseif selected_action==3 then
		VF.ChooseFocus(FOCUS_VF)
		VF.Move(MOVE_VF_AREA_TOP,SCOPE_CURRENT_WINDOW,0)
		local search={direction=DIRECTION_VF_NEXT,scope=SCOPE_CURRENT_VF,scroll=1,text=search_entrie}
		for times=multiplier,1,-1 do
			local result=VF.FindText(search)
		end
		VF.Action(CLICK_MOVE_ONLY)
		VF.Action(CLICK_LEFT)
		VF.ChooseFocus(FOCUS_BACK)
		System.Sleep(200)
		DoKeyPress(9,0,KEYPRESS_NORMAL)
	elseif selected_action==4 then
		Speak.Text(L"Geannuleerd")
	end
	Braille.Auto()
	Mag.Auto()
	Speak.Auto()
end

function DoKeyPress(vkey,character,mode)
	local sizeof_input=28
	local dwFlags=0
	local wScan=0
	local wVk=0
	if character~=0 then
		wScan=character
		dwFlags=KEYEVENTF_UNICODE
	else
		wVk=vkey
	end
	local input_structure=System.AllocateUserData(sizeof_input)
	if mode==KEYPRESS_NORMAL or mode==KEYPRESS_PRESS then
		local s=string.pack("LHHLLL",INPUT_KEYBOARD,wVk,wScan,dwFlags,0,0)
		System.StringToUserData(input_structure,s,20)
		local dll_function={dll_name="user32.dll",function_name="SendInput",standard_call=1,parameters=3}
		local dll_params={1,input_structure,sizeof_input}
		System.CallDllFunction(dll_function,dll_params)
	end
	if mode==KEYPRESS_NORMAL or mode==KEYPRESS_RELEASE then
		dwFlags=dwFlags+KEYEVENTF_KEYUP
		local s=string.pack("LHHLLL",INPUT_KEYBOARD,wVk,wScan,dwFlags,0,0)
		System.StringToUserData(input_structure,s,20)
		local dll_function={dll_name="user32.dll",function_name="SendInput",standard_call=1,parameters=3}
		local dll_params={1,input_structure,sizeof_input}
		System.CallDllFunction(dll_function,dll_params)
	end
	input_structure=nil
end

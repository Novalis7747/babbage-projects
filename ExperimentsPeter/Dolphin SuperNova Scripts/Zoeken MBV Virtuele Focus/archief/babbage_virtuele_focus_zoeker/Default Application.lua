-- Dolphin Script: Virtuele Focus Zoeker (Babbage VF Zoeker)

--[[
	20160125: Nog te doen:
	* CAPS-LOCK + ; zoeken door entrie_list[index], naar de volgende index navigeren, moet nog in een tabel geplaatst worden? +1 na toets
	* Zoek en &Tab: alleen de focus nog naar de juiste positie brengen voordat de TAB geplaatst wordt, werkt nog niet altijd namelijk
	* Wildcard functionaliteit toevoegen... routine moet herschreven worden, XML functionaliteit? Lowercase functie gebruiken?
	* In het geval Internet Explorer actief is: FOCUS_ROUTE_TO_DOM_VF gebruiken?
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

--[[
	CAPS-LOCK + F = zoekvenster openen.
	CAPS-LOCK + N = zoeken naar volgende woord, soort plaatsmarkering. Deze functie werkt nog niet.
--]]
function EventScriptStartup()
	System.RegisterScriptKey(KEY_F,MODIFIER_CUSTOM,"VirtualSearch","Register a new search hotkey")
	System.RegisterScriptKey(KEY_N,MODIFIER_CUSTOM,"PerformPlaceMarkerFunctions","Search for the next 'marker'")
	--[[
		Bepalen van de locatie van het .INI bestand. Standaard: SuperNova Settings\script_data.
	--]]
	local folder=System.GetInfo(INFO_SCRIPT_DATA_PATH)
	local name=System.GetInfo(INFO_SCRIPT_NAME)
	name=wstring.gsub(name,L"\.lu.$",L".ini")
	settings_file=wstring.format(L"%s\\%s",folder,name)
end

--[[
	System.Sleep is als troubleshooter toegevoegd. Zonder System.Sleep worden de functies niet goed (of helemaal niet) uitgevoerd.
	Ik ben tot deze oplossing gekomen door naar een aantal scripts van John v.d. Gouw te kijken.
	Voer de volgende functies in een bepaalde volgorde uit:
--]]
function VirtualSearch()
	GetWindowTitle()
	System.Sleep(200)
	LoadSettingsFile()
	System.Sleep(200)
	StringToTable(list_entries)
	System.Sleep(200)
	ProvideListBox()
	System.Sleep(400)
	PerformSearch()
end

--[[
	System.Sleep is als troubleshooter toegevoegd. Zonder System.Sleep worden de functies niet goed (of helemaal niet) uitgevoerd.
	Ik ben tot deze oplossing gekomen door naar een aantal scripts van John v.d. Gouw te kijken.
	Voer de volgende functies in een bepaalde volgorde uit:
	Deze functie is een probeersel.
--]]
function PerformPlaceMarkerFunctions()
	GetWindowTitle()
	System.Sleep(200)
	LoadSettingsFile()
	System.Sleep(200)
	StringToTable(list_entries)
	System.Sleep(200)
	SearchNextEntrie()
end

function GetWindowTitle()
	local window_handle=Win.GetForegroundWindow()
	local window_title=System.GetWindowText(window_handle)
	application_title=window_title
end

function LoadSettingsFile()
	Config.Create(settings_file)
	--[[ *** Gedachte voor een wildcard functionaliteit, functie an sich werkt. Nu nog implementeren?
		title_from_xml = "Internet Explorer" -- Een gedeelte van een window-title opgeven in een INI of XML
		window_title = "Gmail - Internet Explorer [8] - Test pagina van het grote boze web" -- Verkregen door SuperNova
		if string.match(window_title, title_from_xml) == nil then print("Niet gevonden")
			else print("Komt overeen")
		end
	--]]
	local read=Config.ReadString(settings_file,application_title,L"Keywords",L"")
	local separator=Config.ReadString(settings_file,L"Separators",L"StringSeparator",L";;")
	local multiplier_separator=Config.ReadString(settings_file,L"Separators",L"MultiplierSeparator",L"--")
	--[[
		"tostring" wordt hieronder gebruikt om foutmeldingen omtrent strings en wstrings af te vangen.
	--]]
	list_entries=tostring(read)
	string_separator=tostring(separator)
	search_multiplier_separator=tostring(multiplier_separator)
end

function StringToTable(input)
	local table={}
	local index=1
	for string in string.gmatch(input,"([^"..string_separator.."]+)") do
		table[index]=string
		index=index+1
	end
	list_entries=table
end

function ProvideListBox()
	local options={title="Zoeken",text="Maak een keus uit onderstaande lijst:",sort=1,selected=1}
	local custom={"&Zoeken","Zoek en &Klik","Zoek en &Tab","&Annuleren"}
	local result,action=Dialog.ListBox(options,list_entries,custom)
	entrie_selection=list_entries[result]
	selected_action=action
end

--[[
	De volgende functie is een probeersel.
	Poging om een plaatsmarkering functie toe te voegen.
--]]
function SearchNextEntrie()
	local index=1
	index=index+4
	entrie_selection=list_entries[index]
	if entrie_selection==nil then
		Braille.Text(L"Geen items om naar te zoeken")
		Speak.Text(L"Geen items om naar te zoeken")
	elseif entrie_selection~=nil then
		System.OutputDebugString(entrie_selection)
		for index,value in ipairs(list_entries) do
			System.OutputDebugString(index,value)
		end
	end
end

function PerformSearch()
	local search_entrie
	local multiplier
	local split_result={}
	local index=1
	--[[
		Hier moet nog een IF-statement komen om te controleren of de functie gmatch NIL is. Indien ja, afbreken?
		Dit om de ESCAPE-toets af te vangen. Als je de ListBox afsluit met de ESCAPE-toets, dan krijg je een error in de Output van de editor.
	--]]
	for part in string.gmatch(entrie_selection,"([^"..search_multiplier_separator.."]+)") do
		split_result[index]=part
		index=index+1
	end
	local search_entrie=split_result[1]
	local multiplier=split_result[2]
	--[[
		Als er wel een zoekwoord is opgegeven, maar geen multiplier, dan is 1 de standaardwaarde.
		Er wordt dus altijd 1x gezocht op een zoekwoord.
	--]]
	if multiplier==nil then
		multiplier=1
	end
	--[[
		"tostring" wordt hieronder gebruikt om foutmeldingen omtrent strings en wstrings af te vangen.
	--]]
	tostring(search_entrie)
	tonumber(multiplier)
	local window_handle=Win.GetForegroundWindow()
	local window_title=System.GetWindowText(window_handle)
		--[[ *** Test om te controleren of de titel van het venster nog overeenkomt of niet
			System.OutputDebugString(L"Venstertitel komt niet overeen")
		--]]
	if application_title~=window_title then
		Braille.Text(L"Geannuleerd")
		Speak.Text(L"Geannuleerd")
	elseif selected_action<=3 then
		VF.ChooseFocus(FOCUS_VF)
		VF.Move(MOVE_VF_AREA_TOP,1)
		local search={direction=DIRECTION_VF_NEXT,scope=SCOPE_CURRENT_VF,scroll=1,text=search_entrie}
		for times=multiplier,1,-1 do
			local result=VF.FindText(search)
		end
		if selected_action==1 then
			VF.Action(CLICK_MOVE_ONLY)
		elseif selected_action==2 then
			VF.Action(CLICK_LEFT)
			local mouse_x,mouse_y=System.GetMousePosition()
			VF.MoveToXY(mouse_x,mouse_y)
		elseif selected_action==3 then
			VF.Action(CLICK_LEFT)
			local mouse_x,mouse_y=System.GetMousePosition()
			VF.MoveToXY(mouse_x,mouse_y)
			System.Sleep(400)
			--[[ *** Probeersel om na te gaan of de TAB toets ander gedrag vertoond na deze toevoeging:
				VF.Action(ACTIVATE_PRESS)
				System.Sleep(400)
			--]]
			DoKeyPress(9,0,KEYPRESS_NORMAL) -- Dolphin functie DoKeyPress. Code: 9 is de Virtual Keyboard Code voor de TAB-toets. (Van MDN: KeyCode: 0x09 (9)).
			System.Sleep(400)
			VF.ChooseFocus(FOCUS_BACK)
		end
	else
		Braille.Text(L"Geannuleerd")
		Speak.Text(L"Geannuleerd")
	return true
	end
	Braille.Auto()
	Mag.Auto()
	Speak.Auto()
end

--[[
	De volgende functie is door Dolphin aangeleverd.
	De code is "netter" gemaakt: spaties verwijderd en de indentation omgezet naar TABS I.P.V. spaties.
	Deze functie gebruikt "user32.dll" van Windows om een toets te simuleren I.P.V. de SimulateKeyPress functie van Dolphin.
--]]
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

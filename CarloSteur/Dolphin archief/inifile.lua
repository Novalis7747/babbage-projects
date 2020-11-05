local SCRIPT_NAME = "inifile.lua"
local SCRIPT_TIMESTAMP = "5/11/2017 11:00:43 AM"

-- Copyright (C) 2016-2017 Babbage. All rights reserved.
-- Copyright 2011 Bart van Strien. All rights reserved.
-- 
-- Redistribution and use in source and binary forms, with or without modification, are
-- permitted provided that the following conditions are met:
-- 
--    1. Redistributions of source code must retain the above copyright notice, this list of
--       conditions and the following disclaimer.
-- 
--    2. Redistributions in binary form must reproduce the above copyright notice, this list
--       of conditions and the following disclaimer in the documentation and/or other materials
--       provided with the distribution.
-- 
-- THIS SOFTWARE IS PROVIDED BY BART VAN STRIEN ''AS IS'' AND ANY EXPRESS OR IMPLIED
-- WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
-- FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL BART VAN STRIEN OR
-- CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
-- CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
-- SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
-- ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
-- NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
-- ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
-- 
-- The views and conclusions contained in the software and documentation are those of the
-- authors and should not be interpreted as representing official policies, either expressed
-- or implied, of Bart van Strien.
--
-- The above license is known as the Simplified BSD license.

require "BabbageSupport"		--get OutputDebugInfo and associated constants

inifile = {}

--local lines
--local write

-- if love then
-- 	lines = love.filesystem.lines
-- 	write = love.filesystem.write
-- else
-- -- 	lines = function(name) return assert(io.open(name)):lines() end
-- -- 	write = function(name, contents) return assert(io.open(name, "w")):write(contents) end
-- end

--[[------------------------------------------------------------------------------
	inifile.parse(filename, debug_level)
	returns:	nil if file not succesfully opened
				table (which may be empty)
--]]
function inifile.parse(filename, debug_level)
	if debug_level == nil then debug_level = OUT_LOW end
	local t = nil									-- preset return table
	local name = tostring(filename)					-- cope with Unicode versus ANSI
	OutputDebugInfo({SCRIPT_NAME, "dated(", SCRIPT_TIMESTAMP, "parsing:", name}, debug_level)
	local file = io.open(name, "r")					-- open the file and set it as the default input file
	if file == nil then
		OutputDebugInfo({SCRIPT_NAME, "::parse()", name .. " not found"}, OUT_HIGH)
	else
		OutputDebugInfo({SCRIPT_NAME, "::parse() using ", name }, OUT_HIGH)
		t = {}
		io.input(file)
		
		local index = 0
		local section = false
		for l in io.lines() do  
			local line = tostring(l)
			OutputDebugInfo({"in line(ascii)::", line}, OUT_VERY_LOW )
			if string.match(line, "^%s*;") then line = "" end		--reduce any comment line to empty line
				local start = string.find(line, ";;")				--remove trailing comment, may cause new trailing white space
				if start then
					line = string.sub(line, 1, start-1)
				end
			line = Trim(line)										--discard leading and trailing white space

			local s = string.match(line, "^%[([^%]]+)%]$")			--match anything between [ and ]
			if s then												--if section
				OutputDebugInfo({"section::", s}, OUT_LOW )
				section = s
				t[section] = t[section] or {}						--continue existing section or create new one
				index = #t[section]									--let's hope for the best in tables which are partly array, partly contain keys
				line = ""											--suppress processing as key
			end
			if not section then line = "" end						--reduce any line preceeding the first section to empty line
			local key, value = string.match(line, "^([%w_]+)%s-=%s-(.+)$")	--ToDo de laatste - zou + moeten zijn denk ik
			if not key then value = line end							--handle the 2 formats "key=value" and "value without a key"
			if value and value ~= "" then	
--					if tonumber(value) then value = tonumber(value) end		ToDo I don't think this is a wise conversion for VF_Zoeken
--					if value == "true" then value = true end
--					if value == "false" then value = false end
				index = index + 1
				t[section][index] = value							--store value in array part of section-specific sub-table 
				if not key then										--handle the format "value without a key"
					OutputDebugInfo({"value without key:: section:", section, "index:", index,  "value:", line}, OUT_LOW )
				else												--handle the format "key=value" 
					s = string.upper( string.sub(key, 1, 1))
					if t[section][s] then
						OutputDebugInfo({"!! duplicate key-value pair:: section:", section, "key:", s, "-", key,  "value:", value, "is ignored"}, OUT_MEDIUM )
					else
						t[section][s] = index						--QBM friendly  			ToDo document this 
						t[section][key] = index						--future feature friendly  	ToDo document this 
						OutputDebugInfo({"key-value pair:: section:", section, "  key:", s, "-", key,  "value:", value}, OUT_LOW )
					end
				end
			end 
		end 
		for section, table in pairs(t) do
			for key, value in pairs(table) do
				OutputDebugInfo({"table:"..tostring(table).." section:"..section.." key::"..tostring(key).." value::"..value}, debug_level )
			end
		end
	end
	return t
end -- inifile.parse

-- --------------------------------------------------------------------------------
function inifile.save(name, t)
	OutputDebugInfo({"inifile.save::"..name}, OUT_LOW )
	local contents = ""
	for section, s in pairs(t) do
		OutputDebugInfo({"uit section::"..sectio}, OUT_LOW )
		contents = contents .. ("[%s]\n"):format(section)
		for key, value in pairs(s) do
			OutputDebugInfo({"uit key::"..key}, OUT_LOW )
			OutputDebugInfo({"uit value::"..value}, OUT_LOW )
			contents = contents .. ("%s=%s\n"):format(key, tostring(value))
		end
		contents = contents .. "\n"
	end
	OutputDebugInfo({"uit contents::"..contents}, OUT_LOW )
	local file = io.open( name, "w")
	file:write(contents)
	file:close( )
end -- inifile.save

return inifile




-- --------------------------------------------------------------------------------
-- --------------------------------------------------------------------------------
-- sample notepad.lua to use inifile.lua
-- --------------------------------------------------------------------------------
-- 
-- -- Dolphin Script File for Notepad
-- local SCRIPT_NAME = "Notepad.lua"
-- local SCRIPT_TIMESTAMP = "2016/06/22 16:35"
-- local iniFileName = "h:\\SnovaSuite\\Settings\\script_data\\example.ini"
-- 
-- require "strict" -- Variables must be declared, use during debugging.
-- require "dolphin"
-- require "BabbageSupport"
-- require 'inifile'
-- 
-- 
-- -- Event handlers, remember to return either EVENT_PASS_ON or EVENT_HANDLED
-- -- Uncomment the following if needed.
-- 
-- function EventScriptStartup ()
-- 		
-- 	local msg = string.format( "SOD_"..SCRIPT_NAME, string.format( "---------------- %s ----------------", os.date()))
-- 	OutputDebugInfo( msg )	
-- 	OutputDebugInfo( SCRIPT_NAME.."::"..SCRIPT_TIMESTAMP )
-- 
-- 
-- 	local iniTable = inifile.parse(iniFileName)
-- 	OutputDebugInfo( tostring(iniTable) )	
-- 	if iniTable == nil then iniTable = {} end
-- 	if iniTable.Section_001 == nil then iniTable.Section_001 = {} end
-- 	iniTable.Section_001.key_11 = "aa"
-- 	iniTable.Section_001.name = SCRIPT_NAME
-- 	iniTable.Section_001.time = SCRIPT_TIMESTAMP
-- 	inifile.save(iniFileName, iniTable)
-- 
-- end
-- 
-- 
-- --------------------------------------------------------------------------------
-- --------------------------------------------------------------------------------
-- sample ini file
-- --------------------------------------------------------------------------------
-- 
-- [Section_001]
-- time=2016/06/22 16:35
-- name=Notepad.lua
-- key_11=aa
-- 
-- 
-- 


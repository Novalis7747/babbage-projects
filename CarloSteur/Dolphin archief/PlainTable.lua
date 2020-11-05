local SCRIPT_NAME = "PlainTable.lua/EncTable.lua"
local SCRIPT_TIMESTAMP = "1/5/2017 2:24:19 PM"

-- Copyright (C) 2016-2017 Babbage. All rights reserved.


--[[ serial numbers against supported Babbage packages
--]]


-- license validation flag values
serialUnlicensed = -1 -- SN is licensed but Babbage package is not licensed for the SN Serial number
serialTrial		 =  0 -- SN is unlicensed (i.e. Babbage package is not licensed either but may run in crippled mode)
serialLicensed	 =  1 -- SN is licensed and Babbage package is licensed for the SN Serial number


local serialTable = {
  [0]="no serial number",
	[185437]="VF_Zoeken",
	[242205]="VF_Zoeken",
	[242210]="VF_Zoeken"
	--!! do not forget the colon, if you add a line to the table
	}

--[[validateSerial
	return:
	 -1 if SN is licensed but Babbage package is not licensed for the SN Serial number
	  0 if SN is unlicensed (i.e. Babbage package is not licensed either but may run in crippled mode)
	 +1 if SN is licensed and Babbage package is licensed for the SN Serial number


--]]
	
function validateSerial(scriptName)
	local rc = serialTrial 					--preset at "unlicensed trial"
 	local product_serial = System.GetInfo(INFO_PRODUCT_SERIAL, 0)

--  for key, value in pairs(serialTable) do
-- 		OutputDebugInfo( {"	key::"..tostring(key).." value::"..tostring(value)}, OUT_HIGH )
-- 	end
	
	if product_serial ~= 0 then				--if serial number available
		rc = serialTable[product_serial]	--check the license 	
		if rc == scriptName then rc = serialLicensed else rc = serialUnlicensed end
	end
 	OutputDebugInfo( {"validateSerial: ", rc}, OUT_HIGH)
	
	return rc
end -- validate


vstr="te783457834578fHst--16"

local multi
local stringtest

function mysplit(inputstr, sep)
        if sep == nil then
                sep = "--"
        end
        local t={}
        local i=1
        for str in string.gmatch(inputstr, "([^"..sep.."]+)") do
                t[i] = str
                i = i + 1
        end
        stringtest = t[1]
        multi = t[2]
end

-- index 1 is string to search for, index 2 is multiple times to search for index 1

mysplit(vstr)
multiplier=tonumber(multi)
search=tostring(stringtest)
print(multiplier)
print(search)

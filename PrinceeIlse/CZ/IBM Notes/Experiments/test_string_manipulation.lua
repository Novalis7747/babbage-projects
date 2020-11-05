--[[
  Kun je een kortere string ook slicen vanaf een hoger karakter?
  Test voor CZ Debiteurenbeheer. Onderscheid maken tussen lijst
  met brieven en de brief zelf.
--]]
testString="Korte naam"
testString=string.sub(testString,1,20)
print(testString)
--[[
  https://www.lua.org/pil/1.3.html .
  https://www.lua.org/pil/14.html .
  http://lua-users.org/wiki/TrailingNilParameters .
--]]

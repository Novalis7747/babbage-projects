-- s = "*hello world*"
-- i, j = string.find(s, "*")
-- %*
-- print(i, j)
-- print(string.match("*one |two| three |four|* five", "%*.*%*"))
-- print(string.sub(s, i, j))
-- print(string.sub("Hello Lua user", 7, 9))


-- Gewoon een test om wildcard mogelijkheid toe te voegen aan het VF_Zoeker script
title_from_xml = "Internet Explorer" -- Een gedeelte van een window-title opgeven in een INI of XML
window_title = "Gmail - Internet Explorer [8] - Test pagina van het grote boze web" -- Verkregen door SuperNova

print(string.match(window_title, title_from_xml))

if string.match(window_title, title_from_xml) == nil then print("lol")
  else print("way to go")
end

-- Maar of dat op deze manier gaat werken?

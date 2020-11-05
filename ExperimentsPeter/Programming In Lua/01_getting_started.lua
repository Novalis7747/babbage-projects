-- http://www.lua.org/pil/1.html
-- chapter 01: getting started
print("Hello World")

-- given example which defines a factorial function
function fact(n)
  if n == 0 then
    return 1
  else
    return n*fact(n-1)
  end
end

print("Enter a number:")
a = io.read("*number") -- read a number
print(fact(a))

--[[
  multiple comment lines
--]]

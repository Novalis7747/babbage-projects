-- http://www.lua.org/pil/2.html
-- chapter 02: types and values
print(type("Hello world"))
print(type(10.4*3))
print(type(print))
print(type(type))
print(type(true))
print(type(nil))
print(type(type(X)))

-- examples of valid numeric constants
print(4)
print(0.4)
print(4.57e-3)
print(0.3e12)

--[[
  \a	bell
  \b	back space
  \f	form feed
  \n	newline
  \r	carriage return
  \t	horizontal tab
  \v	vertical tab
  \\	backslash
  \"	double quote
  \'	single quote
  \[	left square bracket
  \]	right square bracket
--]]

print(10 .. 20)

-- create a table and store its reference in 'a'
a = {}
k = "x"
a[k] = 10
a[20] = "great"
print(a["x"])
k = 20
print(a[k])
a["x"] = a["x"]+1
print(a["x"])

-- tables are like dictionaries in python

print("one line\nnext line\n\"in quotes\", 'in quotes'")
print('a backslash inside quotes: \'\\\'')
print("a simpler way: '\\'")

page = [[
<HTML>
<HEAD>
<TITLE>An HTML Page</TITLE>
</HEAD>
<BODY>
<A HREF="http://www.lua.org">Lua</A>
</BODY>
</HTML>
]]
print(page)

print(tostring(10) == "10")
print(10 .. "" == "10")

-- create a table and store its reference in 'a'
a = {}
k = "x"
a[k] = 10 -- new entry, with key="x" and value=10
a[20] = "great" -- new entry, with key=20 and value="great"
print(a["x"]) --> 10
k = 20
print(a[k]) --> "great"
a["x"] = a["x"] + 1 -- increments entry "x"
print(a["x"]) --> 11

-- a table is always anonymous, there is no fixed relationship between a variable that holds a table and the table itself
a = {}
a["x"] = 10
b = a -- 'b' refers to the same table as 'a'
print(b["x"]) --> 10
print(a)
b["x"] = 20
print(a["x"]) --> 20
a = nil -- now only 'b' still refers to the table
b = nil -- now there are no references left to the table
print(a)

a = {} -- create an empty table
-- create 1000 new entries
for i=1,1000 do a[i] = i*2 end
print(a[9]) --> 18
a["x"] = 10
print(a["x"]) --> 10
print(a["y"]) --> nil

a.x = 10 -- same as a["x"] = 10
print(a.x) -- same as print(a["x"])
print(a.y) -- same as print(a["y"])

i = 10
j = "10"
k = "+10"
a = {}
a[i] = "one value"
a[j] = "another value"
a[k] = "yet another value"
print(a[j]) --> another value
print(a[k]) --> yet another value
print(a[tonumber(j)]) --> one value
print(a[tonumber(k)]) --> one value

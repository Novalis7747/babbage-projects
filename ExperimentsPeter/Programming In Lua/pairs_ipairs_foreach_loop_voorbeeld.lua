local array = {5, 2, 6, 3, 6}

for index, value in pairs(array) do
  print(index .. ": " .. value + 1)
end

print("---") -- visually seperate the loops

for index, value in ipairs(array) do
  print(index .. ": " .. value + 1)
end

print("---") -- visually seperate the loops

local t = {"a", "b", [123]="foo", "c", name="bar", "d", "e"}

for k,v in pairs(t) do
  print(k,v)
end

print("---") -- visually seperate the loops

for k,v in ipairs(t) do
  print(k,v)
end

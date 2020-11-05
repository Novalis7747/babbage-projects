-- Dolphin Script File for Accessibility Test Application

require "strict" -- Variables must be declared, use during debugging.
require "dolphin"

-- Event handlers, remember to return either EVENT_PASS_ON or EVENT_HANDLED

--[[
	De volgende functie kijkt of de toets combinatie ALT + 1 wordt ingedrukt.
	Voert daarna de IF-statement uit en stuurt de toets combinatie door naar de applicatie zelf.
--]]

function EventApplicationKeyPress (scancode, modifier)
	if scancode == KEY_1 and modifier == MODIFIER_LEFT_ALT
		then Speak.Text (L"Dit is een voorbeeld tekst"); Braille.Text (L"Braille voorbeeld")
		return EVENT_HANDLED
	end
	return EVENT_PASS_ON
end

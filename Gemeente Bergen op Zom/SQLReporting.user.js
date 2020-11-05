// ==UserScript==
// @name		SQL Reporting Service
// @namespace   http://www.babbage.com/
// @description Toegankelijk maken van Microsoft SQL Reporting Service
// @include	 *://boz-mibi-v01/ReportServer/pages/*
// @version	 2018.09.03
// @grant	   none
// ==/UserScript==

// --- [ MUTATIE OBSERVER CONTAINER EN CONFIGURATIE ] ---
var container = document;
var config = {
	childList: true,
	subtree: true
};

var localDebug = 1;
var scriptName = "SQLReporting";

// --- [ DEBUG FUNCTIE ] ---
function debugConsoleMessage(level, message) {
	// Geeft een DEBUG MESSAGE al dan wel of niet weer.
	// Dit is afhankelijk van de VARIABELE localDebug:
	try {
		// Alleen een melding geven als LOCALDEBUG waar is:
		if (localDebug) {
			// LEVEL 1 geeft alleen de boodschap weer:
			if (level === 1) {
				window.console.log("	   ", message);
			}
			// LEVEL 2 geeft de boodschap inclusief
			// het aantal milliseconden weer:
			if (level === 2) {
				var newDate = new Date();
				var sec = newDate.getSeconds();
				var ms = newDate.getMilliseconds();
				window.console.log(message, sec, ms, "ss:ms.");
			}
		}
	} catch (err) {
		 window.console.log("Babbage debugConsoleMessage: " + err.message);
	}
}

// --- [ FUNCTIES ] ---
function setAttributeForSelector(selector, attribute, value) {
	// Stel een attribuut in voor een specifiek ELEMENT:
	try {
		var elements = document.querySelectorAll(selector);
		for (var element of elements) {
			// Controleer de lengte van ARGUMENT attribute:
			if (attribute.length > 0) {
				// Bestaat het attribuut al en is deze hetzelfde als
				// wat je gaat toewijzen? Dan overslaan:
				if (element.getAttribute(attribute) !== value) {
					element.setAttribute(attribute, value);
				}
			}
		}
	} catch (err) {
		debugConsoleMessage(1, "setAttributeForSelector: " + err.message);
	}
}

function removeAttributeForSelector(selector, attribute) {
	try {
		var elements = document.querySelectorAll(selector);
		for (var element of elements) {
			element.removeAttribute(attribute);
		}
	} catch (err) {
		debugConsoleMessage(1, "setAttributeForSelector: " + err.message);
	}
}

function handleDropDowns() {
	try {
		var dropDownButtons = document.querySelectorAll("input[id$=dDropDownButton]");
		for (var dropDownButton of dropDownButtons) {
			var parent = dropDownButton.parentElement.parentElement;
			parent.setAttribute("aria-owns", parent.getAttribute("id") + "_divDropDown")
		}
	} catch (err) {
		debugConsoleMessage(1, "handleDropDowns: " + err.message);
	}
}


function handleTables() {
	try {
		var emptyRows = document.querySelectorAll("tr[height='0']");
		for (var emptyRow of emptyRows) {
			emptyRow.setAttribute("aria-hidden", "true");
			var temp = emptyRow;
			for (var i = 0; i < 2; i++) {
				var headers = temp.nextSibling.querySelectorAll("td");
				for (header of headers) {
					let headerStyle = window.getComputedStyle(header);
					if (headerStyle.getPropertyValue("background-color") == "rgb(176, 196, 222)") {
						header.setAttribute("role", "columnheader");
					}
				}
				temp = temp.nextSibling;
			}
		}
	} catch (err) {
		debugConsoleMessage(1, "handleTables: " + err.message);
	}
}

function onMutation(mutation) {
	removeAttributeForSelector("div[role=navigation]", "role");
	// Drop downs
	handleDropDowns();
	// Tables
	handleTables();
}

// --- [ MUTATIE OBSERVER TOEVOEGEN ] ---
var domObserver = new MutationObserver(function (mutations) {
	// FUNCTIES die aangeroepen moeten worden nadat er een
	// mutatie binnen de CONTAINER heeft plaatsgevonden:
	try {
		var i = 0;
		while (mutations[i]) {
			onMutation(mutations[i]);
			i += 1;
		}
	} catch (err) {
		debugConsoleMessage(1, "domObserver: " + err.message);
	}
});

// --- [ MUTATIE OBSERVER STARTEN ] ---
// Daadwerkelijke start van de MUTATIE OBSERVER.
// CONTAINER en CONFIG worden aan het begin van
// dit script gedefinieerd:
domObserver.observe(container, config);

// --- [ EINDE SCRIPT ] ---
// Als de volgende melding in de CONSOLE wordt
// getoond, dan kan het script in ieder geval
// tot het eind foutloos uitgevoerd worden:
if (localDebug) {
	debugConsoleMessage(2, "Einde script voor " + scriptName + ":");
}

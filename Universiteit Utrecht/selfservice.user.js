// ==UserScript==
// @name		Selfservice HR
// @namespace   http://www.babbage.com/
// @description Toegankelijk maken van SelfService HR SAP Portal
// @include	 *://*.portal.uu.nl/*
// @version	 0.96
// @grant	   none
// ==/UserScript==

// --- [ MUTATIE OBSERVER CONTAINER EN CONFIGURATIE ] ---
var container = document;
var config = {
	attributes: true,
	childList: true,
	subtree: true,
	attributeFilter: ["class"]
};

var localDebug = 1;
var scriptName = "SelfService";

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
function setAttributeForClassName(className, attribute, value) {
	// Stel een attribuut in voor een specifiek ELEMENT:
	try {
		var elements = document.getElementsByClassName(className);
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
		debugConsoleMessage(1, "setAttributeForClassName: " + err.message);
	}
}

function setRoleForClassName(className, role) {
	setAttributeForClassName(className, "role", role);
}

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

function handleTables() {
	try {
		var elements = document.querySelectorAll("td[lsdata]");
		for (var element of elements) {
			if (element.getAttribute("lsdata").includes("EMPTYROW")) {
				element.setAttribute("aria-hidden", "true");
			}
		}
	} catch (err) {
		debugConsoleMessage(1, "handleTables: " + err.message);
	}
}

function handleTabs() {
	try {
		var elements = document.querySelectorAll(".lsTbsOvfl>div, .lsPnstEndMore, .lsPnstEndMoreSel");
		for (var element of elements) {
			element.setAttribute("role", "tab")
			isSelected = element.className.includes("Sel");
			element.setAttribute("aria-selected", isSelected ? "true" : "false");
		}
	} catch (err) {
		debugConsoleMessage(1, "handleTables: " + err.message);
	}
}

function handleRadios() {
	try {
		var elements = document.querySelectorAll("input[accesspoint=RADIO]");
		for (var element of elements) {
			element.parentElement.setAttribute("role", "radio");
			isChecked = element.hasAttribute("checked");
			element.parentElement.setAttribute("aria-checked", isChecked ? "true" : "false");
			element.parentElement.parentElement.setAttribute("role", "radiogroup");
		}
	} catch (err) {
		debugConsoleMessage(1, "handleTables: " + err.message);
	}
}

function onMutation(mutation) {
	var i = 0;
	// Stel alle rollen en labels in voor ELEMENTEN met een specifieke KLASSE naam:
	// IFrame dialogs 
	setRoleForClassName("lsPWDropShadow", "dialog");
	setAttributeForClassName("lsPWDropShadow", "aria-modal", "true");
	// Buttons en links
	setRoleForClassName("lsButton", "button");
	setAttributeForClassName("lsButton--disabled", "aria-disabled", "true");
	setRoleForClassName("lsLink", "link");
	// Tabbladen
	handleTabs();
	// Comboboxes
	setAttributeForSelector(".lsField__input[ct=CB]", "role", "combobox");
	// Radio buttons
	handleRadios();
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

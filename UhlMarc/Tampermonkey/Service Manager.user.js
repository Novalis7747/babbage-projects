// ==UserScript==
// @name         Service Manager
// @version      20190524-1354 (Beta)
// @author       PD, Babbage Automation, Roosendaal
// @namespace    https://www.babbage.com/
// @description  De toegankelijkheid van "Service Manager" verbeteren
// @include      *://itsm.rabobank.nl/*
// @grant        none
// ==/UserScript==

// --- [ USERSCRIPT NOTITIES ] ---
// ==Developer==
// @browser      Google Chrome (Versie 73.0.3683.86) (x86) - Portable
// @extension    Tampermonkey (Versie 4.8.41)
// ==/Developer==

// ==Validator==
// @validator    JSLint (Edition 2019.01.31)
// @url          https://www.jslint.com/
// @help         https://www.jslint.com/help.html
// @settings     Assume: "a browser"
// ==/Validator==

// --- [ VALIDATOR SETTINGS ] ---
// Automatisch instellen van bovenstaande @SETTINGS voor JSLINT:
/*jslint
    browser, long
*/

// --- [ GLOBALE VARIABELEN ] ---
var localDebug = false;
var extraDebug = false;
var scriptName = "Service Manager";

// --- [ MUTATIE OBSERVER CONTAINER EN CONFIGURATIE ] ---
var container = document;
var config = {
    childList: true,
    subtree: true
};

// --- [ DEBUG FUNCTIE ] ---
function debugConsoleMessage(level, message) {
    // Geeft een DEBUG MESSAGE al dan wel of niet weer.
    // Dit is afhankelijk van de VARIABELE localDebug:
    try {
        if (localDebug) {
            // LEVEL 1 geeft alleen de boodschap weer:
            if (level === 1) {
                window.console.log("   ", message);
            }
            // LEVEL 2 geeft de boodschap inclusief het huidig
            // aantal seconden en milliseconden weer:
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
function properTreePruning(id) {
    // Verwijder de ARIA-PRESENTATION en alle rollen van alle kinderen
    // van een generiek ELEMENT. Deze FUNCTIE is specifiek geschreven voor
    // de boomstructuur die gebruikt wordt voor het maken van tabbladen:
    try {
        var element = document.getElementById(id);
        var elementen;
        var label;
        var ele;
        var i = 0;
        // Controleer of de VARIABELE tenminste een ELEMENT kent:
        if (element !== null && element !== undefined) {
            // Verkrijg alle KIND ELEMENTEN:
            elementen = element.getElementsByTagName("*");
            // Controleer of de VARIABELE een ELEMENT kent:
            if (elementen !== null && elementen !== undefined) {
                while (elementen[i]) {
                    // Verwijder het ATTRIBUUT ROLE indien aanwezig
                    // en het de waarde NONE PRESENTATION kent:
                    if (elementen[i].getAttribute("role") === "none presentation") {
                        elementen[i].removeAttribute("role");
                    }
                    // Verkrijg de TAGNAME van een ELEMENT en als
                    // het een TD betreft, ken dat ELEMENT een ROLE
                    // toe en plaats een ARIA-LABEL ter herkenning:
                    if (elementen[i].tagName === "TD") {
                        ele = elementen[i].firstChild;
                        if (ele.tagName === "A") {
                            label = ele.textContent;
                            ele.setAttribute("aria-label", "tabblad " + label);
                        }
                    }
                    i += 1;
                }
            }
        }
    } catch (err) {
        debugConsoleMessage(1, "properTreePruning: " + err.message);
    }
}

function getIdFromElementsWithRoleTablist() {
    // Verkrijg het ID van alle DIV ELEMENTEN die als ROLE
    // TABLIST kennen en geef die ELEMENTEN door aan een
    // andere functie:
    "use strict";
    try {
        var elementen = document.getElementsByTagName("DIV");
        var ele;
        var i = 0;
        // Controleer of de VARIABELE tenminste een ELEMENT kent:
        if (elementen !== null && elementen !== undefined) {
            while (elementen[i]) {
                // Controleer of de ROLE van het type TABLIST is:
                if (elementen[i].getAttribute("role") === "tablist") {
                    elementen[i].setAttribute("role", "navigation");
                    // Verkrijg het ID en geef het door:
                    ele = elementen[i].getAttribute("id");
                    properTreePruning(ele);
                    if (extraDebug) {
                        debugConsoleMessage(1, ele);
                    }
                }
                i += 1;
            }
        }
    } catch (err) {
        debugConsoleMessage(1, "getIdFromElementsWithRoleTablist: " + err.message);
    }
}

function accessibilityChanges() {
    // Alle FUNCTIE aanroepen in een bepaalde volgorde om de toegankelijkheid
    // van "Service Manager" te verbeteren.
    getIdFromElementsWithRoleTablist();
}

// --- [ MUTATIE OBSERVER TOEVOEGEN ] ---
var domObserver = new MutationObserver(function (mutations) {
    // FUNCTIES die aangeroepen moeten worden nadat er een mutatie binnen de
    // CONTAINER heeft plaatsgevonden:
    try {
        var i = 0;
        if (extraDebug) {
            // Extra debug informatie die afzonderlijk aan of uit te zetten is.
            // Voor test doeleinden ten koste van performance:
            while (mutations[i]) {
                debugConsoleMessage(1, mutations[i]);
                accessibilityChanges();
                i += 1;
            }
        } else {
            // Geen test nodig en alleen triggeren op DOM veranderingen:
            accessibilityChanges();
        }
    } catch (err) {
        debugConsoleMessage(1, "domObserver: " + err.message);
    }
});

// --- [ MUTATIE OBSERVER STARTEN ] ---
// Daadwerkelijke start van de MUTATIE OBSERVER. CONTAINER en CONFIG worden aan
// het begin van dit script gedefinieerd:
domObserver.observe(container, config);

// --- [ EINDE SCRIPT ] ---
// Als de volgende melding in de CONSOLE wordt getoond, dan kan het script in
// ieder geval tot het eind foutloos uitgevoerd worden:
debugConsoleMessage(2, "Einde script voor " + scriptName + ":");

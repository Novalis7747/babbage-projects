// ==UserScript==
// @name         Armor 2.0
// @version      20190409-1233 (Beta)
// @author       PD, Babbage Automation, Roosendaal
// @namespace    https://www.babbage.com/
// @description  De toegankelijkheid van "Armor 2.0" verbeteren
// @include      *://kpnarmor.nl/*
// @grant        none
// ==/UserScript==

// --- [ USERSCRIPT NOTITIES ] ---
// ==Developer==
// @browser      Google Chrome (Versie 73.0.3683.86) (x64)
// @extension    Tampermonkey (Versie 4.8)
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
    browser
*/

// --- [ GLOBALE VARIABELEN ] ---
var localDebug = false;
var extraDebug = false;
var scriptName = "Armor 2.0";

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
                window.console.log("       ", message);
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
function setRoleLabelForClassName(className, role, label) {
    // Stel een ARIA-ROL en ARIA-LABEL in voor een generiek ELEMENT:
    try {
        var element = document.getElementsByClassName(className);
        var i = 0;
        // Controleer of de VARIABELE een ELEMENT kent:
        if (element !== null) {
            while (element[i]) {
                // Controleer de lengte van ARGUMENT ROLE:
                if (role.length > 0) {
                    // Bestaat de ROLE al en is deze hetzelfde als
                    // wat je gaat toewijzen? Dan overslaan:
                    if (element[i].getAttribute("role") !== role) {
                        element[i].setAttribute("role", role);
                    }
                }
                // Controleer de lengte van ARGUMENT LABEL:
                if (label.length > 0) {
                    // Bestaat het LABEL al en is deze hetzelfde als
                    // wat je gaat toewijzen? Dan overslaan:
                    if (element[i].getAttribute("aria-label") !== label) {
                        element[i].setAttribute("aria-label", label);
                    }
                }
                i += 1;
            }
        }
    } catch (err) {
        debugConsoleMessage(1, "setRoleLabelForClassName: " + err.message);
    }
}

function setCheckedStatus(className) {
    // Stel een ARIA-CHECKED in voor een generiek ELEMENT:
    try {
        var element = document.getElementsByClassName(className);
        var child = null;
        var i = 0;
        // Controleer of de VARIABELE een ELEMENT kent:
        if (element !== null) {
            while (element[i]) {
                // Controleer of het eerste KIND ELEMENT van het type INPUT is:
                if (element[i].firstElementChild.tagName === "INPUT") {
                    child = element[i].firstElementChild;
                    // Verkrijg de CHECKED status van het KIND ELEMENT:
                    if (child.hasAttribute("checked")) {
                        // Gebruik de CHECKED status om ARIA-CHECKED te zetten:
                        element[i].setAttribute("aria-checked", "true");
                    }
                }
                i += 1;
            }
        }
    } catch (err) {
        debugConsoleMessage(1, "setCheckedStatus: " + err.message);
    }
}

function accessibilityChanges() {
    // Alle FUNCTIE aanroepen in een bepaalde volgorde om de toegankelijkheid
    // van "Armor 2.0" te verbeteren.
    // Keuzerondjes voorzien van de juiste ROL:
    setRoleLabelForClassName("radio-item", "radio", "");
    // Voorzie de keuzerondjes van de juiste ARIA-CHECKED ATTRIBUUT:
    setCheckedStatus("radio-item");
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

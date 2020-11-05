// ==UserScript==
// @name         Topdesk Servatius
// @version      20191101-1458
// @author       PD, Babbage Automation, Roosendaal
// @namespace    https://www.babbage.com/
// @supportURL   https://www.babbage.com/contact/
// @description  De toegankelijkheid van "Topdesk Servatius" verbeteren.
// @match        *://servatius.topdesk.net/*
// @grant        none
// ==/UserScript==

// --- [ USERSCRIPT NOTITIES ] ---
// ==Developer==
// @browser      Google Chrome (Versie 78.0.3904.70) (x64)
// @extension    Tampermonkey (Versie 4.8.41)
// @screenreader NVDA (Versie 2019.2beta3)
// ==/Developer==

// ==Validator==
// @validator    JSLint (Edition 2019.09.17)
// @url          https://www.jslint.com/
// @help         https://www.jslint.com/help.html
// @settings     Assume: "a browser"
// @global       Global variables: "performance"
// ==/Validator==

// --- [ INSTELLINGEN VOOR JSLINT ] ---
// Automatisch instellen van bovenstaande @SETTINGS voor JSLINT:
/*jslint
    browser
*/
/*global
    performance
*/

// --- [ GLOBALE VARIABELEN ] ---
let DOMDEBUG = true;
let GLOBALDEBUG = true;
let OBSERVERDEBUG = false;
let PERFORMANCETIMER = false;
let SCRIPTNAME = "Topdesk Servatius";

// Controleer of de BROWSER PERFORMANCE.NOW ondersteunt:
if (performance.now()) {
    PERFORMANCETIMER = performance.now();
}

// --- [ MUTATIE OBSERVER CONTAINER EN CONFIGURATIE ] ---
let OBSERVERCONTAINER = document;
let OBSERVERCONFIG = {
    // Filteren op veranderingen van ATTRIBUTEN, gefilterd of niet, zorgt voor
    // een grote impact op de snelheid en vastlopers bij grote TABELLEN:
    childList: true,
    subtree: true
};

// --- [ DEBUG FUNCTIE: BERICHT NAAR DE CONSOLE STUREN ] ---
function debugConsoleMessage(level, indent, message) {
    "use strict";
    // Geeft een DEBUG MESSAGE al dan wel of niet weer. Dit is afhankelijk van
    // de VARIABELE GLOBALDEBUG:
    try {
        let ms;
        let newDate;
        let sec;
        let curr;
        if (GLOBALDEBUG) {
            // LEVEL 1 geeft alleen de boodschap weer, inspringing is optioneel:
            if (level === 1) {
                if (indent === 0) {
                    window.console.log(message);
                } else if (indent === 1) {
                    window.console.log("   ", message);
                }
            }
            // LEVEL 2 geeft de boodschap inclusief het huidig aantal seconden
            // en milliseconden weer:
            if (level === 2) {
                newDate = new Date();
                sec = newDate.getSeconds();
                ms = newDate.getMilliseconds();
                window.console.log(message, sec, ms, "ss:ms.");
            }
            // LEVEL 3 geeft de boodschap inclusief het aantal milliseconden
            // voor een indicatie van de performance van het script:
            if (level === 3) {
                // Alleen doorgaan als PERFORMANCE.NOW mogelijk is:
                if (PERFORMANCETIMER) {
                    curr = performance.now();
                    window.console.log(message, curr - PERFORMANCETIMER, "ms.");
                } else {
                    // Geef een melding als de BROWSER niet compatible is:
                    window.console.log("Performance meting is niet mogelijk.");
                }
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        window.console.log("Babbage debugConsoleMessage: " + err.message);
    }
}

// --- [ DEBUG FUNCTIE: RAPPORTEER ALLE ROLLEN UIT DE DOM ] ---
function reportRolesFromChildren(element) {
    "use strict";
    // Verkrijg alle ARIA-ROLLEN uit de DOM en rapporteer deze naar de CONSOLE:
    try {
        let elementen = element.getElementsByTagName("*");
        let roles = [];
        let i = 0;
        // Controleer of de VARIABELE een ELEMENT kent:
        if (elementen !== null && elementen !== undefined) {
            while (elementen[i]) {
                // Controleer eerst of een ELEMENT wel een ARIA-ROL heeft:
                if (elementen[i].hasAttribute("role")) {
                    // Plaats de ARIA-ROL in een ARRAY, zodoende blijft de
                    // CONSOLE uitvoer binnen de perken:
                    roles.push(elementen[i].getAttribute("role"));
                }
                i += 1;
            }
            debugConsoleMessage(1, 1, roles);
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, "reportRolesFromChildren: " + err.message);
    }
}

// --- [ FUNCTIES ] ---
function setRoleLabelForClassName(className, role, label) {
    "use strict";
    // Stel een ARIA-ROL en ARIA-LABEL in voor een generiek ELEMENT:
    try {
        let elementen = document.getElementsByClassName(className);
        let i = 0;
        // Controleer of de VARIABELE een ELEMENT kent:
        if (elementen !== null && elementen !== undefined) {
            while (elementen[i]) {
                // Controleer de lengte van ARGUMENT ROLE:
                if (role.length > 0) {
                    // Bestaat de ROLE al en is deze hetzelfde als wat je gaat
                    // toewijzen? Dan overslaan:
                    if (elementen[i].getAttribute("role") !== role) {
                        elementen[i].setAttribute("role", role);
                    }
                }
                // Controleer de lengte van ARGUMENT LABEL:
                if (label.length > 0) {
                    // Bestaat het LABEL al en is deze hetzelfde als wat je
                    // gaat toewijzen? Dan overslaan:
                    if (elementen[i].getAttribute("aria-label") !== label) {
                        elementen[i].setAttribute("aria-label", label);
                    }
                }
                i += 1;
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, "setRoleLabelForClassName: " + err.message);
    }
}

function removeRoleFromClassName(className, role) {
    "use strict";
    // Verwijder een ARIA-ROL van een generiek ELEMENT:
    try {
        let elementen = document.getElementsByClassName(className);
        let i = 0;
        // Controleer of de VARIABELE een ELEMENT kent:
        if (elementen !== null && elementen !== undefined) {
            while (elementen[i]) {
                // Controleer de lengte van ARGUMENT ROLE:
                if (role.length > 0) {
                    // Bestaat de ROLE en is deze hetzelfde als wat je wenst te
                    // verwijderen? Dan pas verwijderen:
                    if (elementen[i].getAttribute("role") === role) {
                        elementen[i].removeAttribute("role");
                    }
                }
                i += 1;
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, "removeRoleFromClassName: " + err.message);
    }
}

function changeAttrForClassName(className, attr, newValue) {
    "use strict";
    // Verander een ATTRIBUUT van generieke ELEMENTEN:
    try {
        let elementen = document.getElementsByClassName(className);
        let i = 0;
        // Controleer of de VARIABELE een ELEMENT kent:
        if (elementen !== null && elementen !== undefined) {
            while (elementen[i]) {
                // Controleer de lengte van beiden ARGUMENTEN:
                if (attr.length > 0 && newValue.length > 0) {
                    // Bestaat het ATTRIBUUT al en is deze hetzelfde als wat je
                    // wenst te verwijderen? Dan pas verwijderen:
                    if (elementen[i].getAttribute(attr) !== newValue) {
                        elementen[i].setAttribute(attr, newValue);
                    }
                }
                i += 1;
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, "changeAttrForClassName: " + err.message);
    }
}

// --- [ "BLOCK" MET ALLE FUNCTIE AANROEPEN ] ---
function accessibilityChanges() {
    "use strict";
    // Alle FUNCTIE aanroepen in een bepaalde volgorde om de toegankelijkheid
    // van "Topdesk Servatius" te verbeteren.
    window.console.log("empty block");
}

// --- [ MUTATIE OBSERVER TOEVOEGEN ] ---
let domObserver = new MutationObserver(function (mutations) {
    "use strict";
    // FUNCTIES die aangeroepen moeten worden nadat er een mutatie binnen de
    // CONTAINER heeft plaatsgevonden:
    try {
        let i = 0;
        while (mutations[i]) {
            if (OBSERVERDEBUG && GLOBALDEBUG) {
                // Extra debug informatie die afzonderlijk aan of uit te zetten
                // is voor test doeleinden ten koste van performance:
                debugConsoleMessage(1, 1, mutations[i]);
            }
            i += 1;
        }
        if (DOMDEBUG && GLOBALDEBUG) {
            // Extra informatie verkrijgen omtrent de DOM. De volgende functie
            // verkrijgt alle ROLLEN binnen de huidige DOM:
            reportRolesFromChildren(document);
        }
        // Roep nu de algemene functie per mutatie aan. Bovenstaande WHILE LOOP
        // kan gebruikt worden als er specifiek op bepaalde MUTATIES getriggerd
        // moet gaan worden:
        accessibilityChanges();
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, "domObserver: " + err.message);
    }
});

// --- [ MUTATIE OBSERVER STARTEN ] ---
// Daadwerkelijke start van de MUTATIE OBSERVER. CONTAINER en CONFIG worden aan
// het begin van dit script gedefinieerd:
domObserver.observe(OBSERVERCONTAINER, OBSERVERCONFIG);

// --- [ EINDE SCRIPT ] ---
// Als de volgende melding in de CONSOLE wordt getoond, dan kan het script in
// ieder geval tot het eind foutloos uitgevoerd worden:
debugConsoleMessage(1, 0, "Einde script voor " + SCRIPTNAME + ".");
debugConsoleMessage(3, 0, "Uitvoering duurde:");

// --- [ ARCHIEF ] ---
/*
function setAccessKeyForId(id, key) {
    "use strict";
    // Stel een ACCESS KEY in voor een specifiek ELEMENT:
    try {
        let element = document.getElementById(id);
        // Controleer of de VARIABELE een ELEMENT kent:
        if (element !== null && element !== undefined) {
            // Controleer de lengte van de KEY en het juiste ATTRIBUTE:
            if (key.length > 0 && element.getAttribute("accesskey") !== key) {
                element.setAttribute("accesskey", key);
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, "setAccessKeyForId: " + err.message);
    }
}

function setLabelForId(id, label) {
    "use strict";
    // Stel een LABEL in voor een specifiek ELEMENT:
    try {
        let element = document.getElementById(id);
        // Controleer of de VARIABELE een ELEMENT kent:
        if (element !== null && element !== undefined) {
            // Controleer de lengte van het LABEL en het juiste ATTRIBUTE:
            if (label.length > 0) {
                if (element.getAttribute("aria-label") !== label) {
                    element.setAttribute("aria-label", label);
                }
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, "setLabelForId: " + err.message);
    }
}
*/

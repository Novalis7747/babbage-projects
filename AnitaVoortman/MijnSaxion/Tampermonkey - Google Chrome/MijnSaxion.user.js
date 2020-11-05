// ==UserScript==
// @name         MijnSaxion
// @version      20200331-1616
// @author       PD, Babbage Automation, Roosendaal
// @namespace    https://www.babbage.com/
// @supportURL   https://www.babbage.com/contact/
// @description  De toegankelijkheid van "MijnSaxion" verbeteren.
// @match        *://mijn.saxion.nl/*
// @match        *://shortnamefinder.saxion.nl/*
// @grant        none
// ==/UserScript==

// --- [ USERSCRIPT NOTITIES ] ---
// ==Developer==
// @browser      Google Chrome (Versie 80.0.3987.149) (x64)
// @extension    Tampermonkey (Versie 4.9)
// @screenreader NVDA (Versie 2019.2.1)
// ==/Developer==

// ==Validator==
// @validator    JSLint (Edition 2020.03.28)
// @url          https://www.jslint.com/
// @help         https://www.jslint.com/help.html
// @settings     Assume: "a browser"
// @global       Global variables: "performance"
// ==/Validator==

// --- [ INSTELLINGEN VOOR JSLINT ] ---
// Automatisch instellen van bovenstaande @SETTINGS onder VALIDATOR:
/*jslint
    browser
*/
/*global
    performance
*/

// --- [ GLOBALE VARIABELEN ] ---
const DOMDEBUG = false;
const GLOBALDEBUG = false;
const OBSERVERDEBUG = false;
const SCRIPTNAME = "MijnSaxion";
let PERFORMANCETIMER = false;

// Controleer of de BROWSER PERFORMANCE.NOW ondersteunt:
if (performance.now()) {
    PERFORMANCETIMER = performance.now();
}

// --- [ MUTATIE OBSERVER CONTAINER EN CONFIGURATIE ] ---
const OBSERVERCONTAINER = document;
const OBSERVERCONFIG = {
    // attributeOldValue: true,
    // attributeFilter: ["class"],
    // characterData: true,
    // characterDataOldValue: true,
    // Filteren op veranderingen van ATTRIBUTEN, gefilterd of niet, zorgt voor
    // een grote impact op de snelheid en vastlopers bij grote TABELLEN:
    attributes: true,
    childList: true,
    subtree: true
};

// --- [ DEBUG FUNCTIE ] ---
function debugConsoleMessage(level, indent, message) {
    "use strict";
    // Geeft een DEBUG MESSAGE al dan wel of niet weer. Dit is afhankelijk van
    // de CONSTANT GLOBALDEBUG:
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

// --- [ GENERIEKE FUNCTIES ] ---
function check(object) {
    "use strict";
    // Controleer of een OBJECT de waarde NULL of UNDEFINED kent:
    try {
        if (object !== null && object !== undefined) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, "check: " + err.message);
    }
}

function reportRolesFromChildren(element) {
    "use strict";
    // Verkrijg alle ARIA-ROLLEN van alle KIND elementen en rapporteer deze
    // in een ARRAY naar de CONSOLE:
    try {
        const elementen = element.getElementsByTagName("*");
        let roles = [];
        let i = 0;
        // Controleer of de VARIABELE een ELEMENT kent:
        if (check(elementen)) {
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

function setAriaLabel(target, label) {
    "use strict";
    // Plaats een ARIA-LABEL op een gegeven ELEMENT:
    try {
        // Maak alle LABELS uniform, kleine letters en geen spaties aan het
        // begin of het eind van de STRING:
        const ariaLabel = label.trim().toLowerCase();
        // Bestaat het ARIA-LABEL al en is deze hetzelfde als wat je wenst te
        // plaatsen? Dan overslaan:
        if (target.getAttribute("aria-label") !== ariaLabel) {
            target.setAttribute("aria-label", ariaLabel);
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, "setAriaLabel: " + err.message);
    }
}

function setAttribute(target, attr, value) {
    "use strict";
    // Plaats een ATTRIBUUT op een gegeven ELEMENT:
    try {
        // Bestaat het ATTRIBUUT al en is deze hetzelfde als wat je wenst te
        // plaatsen? Dan overslaan:
        if (target.getAttribute(attr) !== value) {
            target.setAttribute(attr, value);
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, "setAttribute: " + err.message);
    }
}

// --- [ FUNCTIES ] ---
function setAttrForClass(className, attr, value) {
    "use strict";
    // Stel een enkel ATTRIBUUT in voor generieke ELEMENTEN:
    try {
        const elementen = document.getElementsByClassName(className);
        let i = 0;
        // Controleer of de VARIABELE een ELEMENT kent:
        if (check(elementen)) {
            while (elementen[i]) {
                // Controleer de lengte van beiden ARGUMENTEN:
                if (attr.length > 0 && value.length > 0) {
                    setAttribute(elementen[i], attr, value);
                }
                i += 1;
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, "setAttrForClass: " + err.message);
    }
}

function setRoleLabelForClass(className, role, label) {
    "use strict";
    // Stel een ROLE en LABEL in voor generieke ELEMENTEN:
    try {
        const elementen = document.getElementsByClassName(className);
        let i = 0;
        // Controleer of de VARIABELE een ELEMENT kent:
        if (check(elementen)) {
            while (elementen[i]) {
                // Controleer de lengte van beiden ARGUMENTEN:
                if (role.length > 0) {
                    setAttribute(elementen[i], "role", role);
                }
                if (label.length > 0) {
                    setAriaLabel(elementen[i], label);
                }
                i += 1;
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, "setRoleLabelForClass: " + err.message);
    }
}

function setAttrForId(id, attr, value) {
    "use strict";
    // Stel een enkel ATTRIBUUT in voor een uniek ELEMENT:
    try {
        const element = document.getElementById(id);
        // Controleer of de VARIABELE een ELEMENT kent:
        if (check(element)) {
            // Controleer de lengte van beiden ARGUMENTEN:
            if (attr.length > 0 && value.length > 0) {
                setAttribute(element, attr, value);
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, "setAttrForId: " + err.message);
    }
}

function setRoleLabelForId(id, role, label) {
    "use strict";
    // Stel een ROLE en LABEL in voor unieke ELEMENTEN:
    try {
        const element = document.getElementById(id);
        // Controleer of de VARIABELE een ELEMENT kent:
        if (check(element)) {
            // Controleer de lengte van beiden ARGUMENTEN:
            if (role.length > 0) {
                setAttribute(element, "role", role);
            }
            if (label.length > 0) {
                setAriaLabel(element, label);
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, "setRoleLabelForId: " + err.message);
    }
}

// --- [ "BLOCKS" MET ALLE FUNCTIE AANROEPEN ] ---
function mijnSaxion() {
    "use strict";
    // Alle FUNCTIE aanroepen in een bepaalde volgorde om de toegankelijkheid
    // van "MijnSaxion" te verbeteren.
    // Algemene verbeteringen, begonnen bij de HOOFDPAGINA:
    setAttrForClass("card-header", "role", "heading");
    setAttrForClass("col tile", "role", "button");
    setRoleLabelForClass("dropdown", "navigation", "keuzemenu openen");
    // Geef AFBEELDINGEN een logisch LABEL:
    setAttrForClass("sn-avatar", "aria-label", "persoonlijk menu");
    setAttrForClass("ms-Icon--Help", "aria-label", "help menu");
    setAttrForId("sn-logo", "aria-label", "hoofdpagina");
    // Maak van de namen binnen PEOPLE DIRECTORY een HEADING:
    setAttrForClass("sn-card-title", "role", "heading");
}

function shortNameFinderPage() {
    "use strict";
    // Om de toegankelijkheid van het volgende onderdeel
    // "MijnSaxion - (Short) Name Finder" te verbeteren:
    setAttrForClass("mat-card-title", "role", "heading");
    setAttrForClass("logo", "aria-label", "hoofdpagina");
}

// --- [ MUTATIE OBSERVER TOEVOEGEN ] ---
const domObserver = new MutationObserver(function (mutations) {
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
        // Roep nu de algemene functies per mutatie aan. Bovenstaande WHILE LOOP
        // kan gebruikt worden als er specifiek op bepaalde MUTATIES getriggerd
        // moet gaan worden. Filter eerst nog op de HOST:
        if (window.location.host === "mijn.saxion.nl") {
            mijnSaxion();
        } else if (window.location.host === "shortnamefinder.saxion.nl") {
            shortNameFinderPage();
        }
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

// ==UserScript==
// @name         Zermelo
// @version      20201015-1558
// @author       PD, Babbage Automation, Roosendaal
// @namespace    https://www.babbage.com/
// @supportURL   https://www.babbage.com/contact/
// @description  De toegankelijkheid van "Zermelo" verbeteren.
// @match        *://rlo.zportal.nl/*
// @grant        none
// ==/UserScript==

// --- [ USERSCRIPT NOTITIES ] ---
// ==Developed using==
// @browser      Google Chrome (Versie 86.0.4240.75) (x86)
// @extension    Tampermonkey (Versie 4.10)
// ==/Developed using==

// ==Validator==
// @validator    JSLint (Edition 2020.09.09)
// @url          https://www.jslint.com/
// @help         https://www.jslint.com/help.html
// ==/Validator==

// ==Validator settings==
// @description  Om JSLint handmatig in te stellen, indien nodig.
// @settings     Assume: "a browser"
// @settings     Tolerate: "long lines"
// @global       Global variables: "performance"
// ==/Validator settings==

// --- [ INSTELLINGEN VOOR JSLINT ] ---
// Automatisch instellen van bovenstaande VALIDATOR SETTINGS:
/*jslint
    browser, long
*/
/*global
    performance
*/

// --- [ GLOBALE CONSTANTEN ] ---
const DOMDEBUG = false;
const GLOBALDEBUG = false;
const OBSERVERDEBUG = false;
const SCRIPTNAME = "Zermelo";

// --- [ GLOBALE VARIABELEN ] ---
let PERFORMANCETIMER = false;

// Controleer of de BROWSER PERFORMANCE.NOW ondersteunt:
if (performance.now()) {
    PERFORMANCETIMER = performance.now();
}

// --- [ MUTATIE OBSERVER CONTAINER EN CONFIGURATIE ] ---
const OBSERVERCONTAINER = document;
const OBSERVERCONFIG = {
    // attributes: true,
    // attributeOldValue: true,
    // attributeFilter: ["class"],
    // characterData: true,
    // characterDataOldValue: true,
    // Filteren op veranderingen van ATTRIBUTEN, gefilterd of niet, zorgt voor
    // een grote impact op de snelheid en vastlopers bij grote TABELLEN:
    childList: true,
    subtree: true
};

// --- [ DEBUG FUNCTIES ] ---
function debugConsoleMessage(level, indent, message) {
    "use strict";
    // Geeft een DEBUG MESSAGE al dan wel of niet weer. Dit is afhankelijk van
    // de CONSTANT GLOBALDEBUG:
    try {
        let ms = null;
        let newDate = null;
        let sec = null;
        let curr = null;
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
        window.console.log(`Babbage debugConsoleMessage: ${err.message}`);
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
        debugConsoleMessage(1, 1, `check: ${err.message}`);
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
        debugConsoleMessage(1, 1, `setAriaLabel: ${err.message}`);
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
        debugConsoleMessage(1, 1, `setAttribute: ${err.message}`);
    }
}

function removeAttribute(target, attr) {
    "use strict";
    // Verwijder een ATTRIBUUT van een gegeven ELEMENT:
    try {
        // Verwijder een ATTRIBUUT alleen als het aanwezig is:
        if (target.hasAttribute(attr)) {
            target.removeAttribute(attr);
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, `removeAttribute: ${err.message}`);
    }
}

function reportRolesFromChildren(element) {
    "use strict";
    // Verkrijg alle ARIA-ROLLEN van alle KIND elementen en rapporteer deze
    // in een ARRAY naar de CONSOLE:
    try {
        const elements = element.getElementsByTagName("*");
        let roles = [];
        let i = 0;
        // Controleer of de CONSTANT een ELEMENT kent:
        if (check(elements)) {
            while (elements[i]) {
                // Controleer eerst of een ELEMENT wel een ARIA-ROL heeft:
                if (elements[i].hasAttribute("role")) {
                    // Plaats de ARIA-ROL in een ARRAY, zodoende blijft de
                    // CONSOLE uitvoer binnen de perken:
                    roles.push(elements[i].getAttribute("role"));
                }
                i += 1;
            }
            debugConsoleMessage(1, 1, roles);
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, `reportRolesFromChildren: ${err.message}`);
    }
}

// --- [ FUNCTIES ] ---
function setAttrForClass(className, attr, value) {
    "use strict";
    // Stel een enkel ATTRIBUUT in voor generieke ELEMENTEN:
    try {
        const elements = document.getElementsByClassName(className);
        let i = 0;
        // Controleer of de CONSTANT een ELEMENT kent:
        if (check(elements)) {
            while (elements[i]) {
                // Controleer de lengte van beiden ARGUMENTEN:
                if (attr.length > 0 && value.length > 0) {
                    setAttribute(elements[i], attr, value);
                }
                i += 1;
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, `setAttrForClass: ${err.message}`);
    }
}

function setRoleLabelForClass(className, role, label) {
    "use strict";
    // Stel een ROLE en LABEL in voor generieke ELEMENTEN:
    try {
        const elements = document.getElementsByClassName(className);
        let i = 0;
        // Controleer of de CONSTANT een ELEMENT kent:
        if (check(elements)) {
            while (elements[i]) {
                // Controleer de lengte van beiden ARGUMENTEN:
                if (role.length > 0) {
                    setAttribute(elements[i], "role", role);
                }
                if (label.length > 0) {
                    setAriaLabel(elements[i], label);
                }
                i += 1;
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, `setRoleLabelForClass: ${err.message}`);
    }
}

function setAttrForId(id, attr, value) {
    "use strict";
    // Stel een enkel ATTRIBUUT in voor een uniek ELEMENT:
    try {
        const element = document.getElementById(id);
        // Controleer of de CONSTANT een ELEMENT kent:
        if (check(element)) {
            // Controleer de lengte van beiden ARGUMENTEN:
            if (attr.length > 0 && value.length > 0) {
                setAttribute(element, attr, value);
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, `setAttrForId: ${err.message}`);
    }
}

function setRoleLabelForId(id, role, label) {
    "use strict";
    // Stel een ROLE en LABEL in voor unieke ELEMENTEN:
    try {
        const element = document.getElementById(id);
        // Controleer of de CONSTANT een ELEMENT kent:
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
        debugConsoleMessage(1, 1, `setRoleLabelForId: ${err.message}`);
    }
}

function removeAccesskeysSelects() {
    "use strict";
    // Zermelo ruimt oude elementen niet op na het openen van een nieuw
    // tabblad. Om dubbelingen of problemen te voorkomen met het toewijzen
    // van ACCESSKEYS worden deze eerst verwijderd voor het opnieuw toewijzen:
    try {
        const elements = document.getElementsByTagName("DIV");
        let ec = null;
        let i = 0;
        let counter = 0;
        // Controleer of de CONSTANT een ELEMENT kent:
        if (check(elements)) {
            while (elements[i]) {
                ec = elements[i].className;
                // Dit zijn alle KLASSENAMEN die een KEUZEMENU kan hebben,
                // hierop dient gefilterd te worden omdat je alleen van de
                // KEUZEMENU'S de ACCESSKEY wilt verwijderen:
                if (ec === "selectItemTextHint" || ec === "selectItemText" || ec === "selectItemTextFocused") {
                    if (elements[i].hasAttribute("accesskey")) {
                        elements[i].removeAttribute("accesskey");
                        counter += 1;
                    }
                }
                i += 1;
            }
            // Om bij te houden OF er ACCESSKEYS verwijderd worden en hoeveel:
            debugConsoleMessage(1, 1, `removeAccesskeysSelects: ${counter} verwijderd.`);
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, `removeAccesskeysSelects: ${err.message}`);
    }
}

function setAccesskeysTag(tagName, role, label, key) {
    "use strict";
    // Stel een ACCESSKEY in voor een bepaald ELEMENT met een bepaalde
    // ROLE en LABEL. Dit is zo gekozen omdat je niet op KLASSENAAM of
    // ID kunt zoeken:
    try {
        const elements = document.getElementsByTagName(tagName);
        let i = 0;
        // Controleer of de CONSTANT een ELEMENT kent:
        if (check(elements)) {
            while (elements[i]) {
                if (elements[i].getAttribute("role") === role) {
                    if (elements[i].getAttribute("aria-label") === label) {
                        setAttribute(elements[i], "accesskey", key);
                    }
                }
                i += 1;
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, `setAccesskeysTag: ${err.message}`);
    }
}

function setAccesskeysSelectsTabPanel(tabPanel) {
    "use strict";
    // Geef de KEUZEMENU'S binnen een TABPANEEL ACCESSKEYS mee.
    // Dit is de SET functie die aangeroepen wordt door een filter
    // binnen de GET functie, de functie hieronder:
    try {
        const elements = tabPanel.getElementsByTagName("DIV");
        let ec = null;
        let i = 0;
        let j = 1;
        // Controleer of de CONSTANT een VALIDE WAARDE kent:
        if (check(elements)) {
            while (elements[i]) {
                ec = elements[i].className;
                // Dit zijn alle KLASSENAMEN die een KEUZEMENU kan hebben:
                if (ec === "selectItemTextHint" || ec === "selectItemText" || ec === "selectItemTextFocused") {
                    setAttribute(elements[i], "accesskey", j);
                    j += 1;
                }
                i += 1;
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, `setAccesskeysSelectsTabPanel: ${err.message}`);
    }
}

function getAccesskeysSelectsTabPanel(tabPanel) {
    "use strict";
    // Een TABPANEEL kan op twee manieren opgebouwd zijn, met of zonder
    // KIND ELEMENTEN die ARIA-HIDDEN gebruiken. Alleen als er helemaal
    // geen ARIA-HIDDEN aanwezig is of als deze FALSE is dien je de
    // ACCESSKEYS toe te voegen:
    try {
        const childElements = tabPanel.children;
        let i = 0;
        // Controleer of de CONSTANT een VALIDE WAARDE kent:
        if (check(childElements)) {
            while (childElements[i]) {
                if (childElements[i].getAttribute("aria-hidden") === "false" || !childElements[i].hasAttribute("aria-hidden")) {
                    debugConsoleMessage(1, 1, "getAccesskeysSelectsTabPanel: IF statement bereikt.");
                    setAccesskeysSelectsTabPanel(childElements[i]);
                }
                i += 1;
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, `getAccesskeysSelectsTabPanel: ${err.message}`);
    }
}

function setAccesskeysSelects() {
    "use strict";
    // Ieder gevonden KEUZEMENU krijgt een opeenvolgend ACCESSKEY mee,
    // eerste KEUZEMENU is ALT + 1, tweede KEUZEMENU is ALT + 2, et cetera:
    try {
        const elements = document.getElementsByTagName("DIV");
        let ec = null;
        let found = null;
        let i = 0;
        let j = 1;
        // Controleer of de CONSTANT een ELEMENT kent:
        if (check(elements)) {
            while (elements[i]) {
                ec = elements[i].className;
                // Als de KEUZEMENU'S binnen een TABPANEEL staan, dan dien je ze anders te behandelen:
                if (elements[i].getAttribute("role") === "tabpanel" && elements[i].childElementCount > 0) {
                    debugConsoleMessage(1, 1, "Een tabpaneel met kindelementen is gevonden.");
                    removeAccesskeysSelects();
                    getAccesskeysSelectsTabPanel(elements[i]);
                    found = true;
                // Dit zijn alle KLASSENAMEN die een KEUZEMENU kan hebben:
                } else if (ec === "selectItemTextHint" || ec === "selectItemText" || ec === "selectItemTextFocused") {
                    setAttribute(elements[i], "accesskey", j);
                    j += 1;
                }
                // Als het TABPANEEL is gevonden, stop dan met de WHILE LOOP:
                if (found) {
                    break;
                }
                i += 1;
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, `setAccesskeysSelects: ${err.message}`);
    }
}

// --- [ "BLOCK" MET ALLE FUNCTIE AANROEPEN ] ---
function accessibilityChanges() {
    "use strict";
    // Alle FUNCTIE aanroepen in een bepaalde volgorde om de toegankelijkheid
    // van "Zermelo" te verbeteren.
    try {
        // Geef bepaalde TABBLADEN een ACCESSKEY voor snelle navigatie:
        setAccesskeysTag("DIV", "tab", "Geplande groepen", "g");
        setAccesskeysTag("DIV", "tab", "Geplande groepen (details)", "h");
        setAccesskeysTag("DIV", "tab", "Standaardprognoses", "q");
        setAccesskeysTag("DIV", "tab", "Prognoses", "w");
        setAccesskeysTag("DIV", "tab", "Prognoses (details)", "e");
        setAccesskeysTag("DIV", "tab", "Instroom", "r");
        // Geef bepaalde KNOPPEN een ACCESSKEY voor snelle navigatie:
        setAccesskeysTag("DIV", "button", "Bewerken", "y");
        setAccesskeysTag("DIV", "button", "Bewerken staat standaard uit. Dit is bedoeld om u te beschermen tegen het per ongeluk veranderen van data.", "y");
        setAccesskeysTag("DIV", "button", "U hebt geen schrijfrechten voor de gekozen pagina en selectie. Als u denkt dat dit onterecht is, kunt u de applicatiebeheerder vragen de instellingen voor dit project aan te passen.", "y");
        setAccesskeysTag("DIV", "button", "CSV/Excel-export", "u");
        setAccesskeysTag("DIV", "button", "Afdrukken", "i");
        setAccesskeysTag("DIV", "button", "Tabel verversen", "o");
        // Geef KEUZEMENU's een ACCESSKEY voor snelle navigatie:
        removeAccesskeysSelects();
        setAccesskeysSelects();
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, `accessibilityChanges: ${err.message}`);
    }
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
        // Roep nu de algemene functie per mutatie aan. Bovenstaande WHILE LOOP
        // kan gebruikt worden als er specifiek op bepaalde MUTATIES getriggerd
        // moet gaan worden:
        accessibilityChanges();
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, `domObserver: ${err.message}`);
    }
});

// --- [ MUTATIE OBSERVER STARTEN ] ---
// Daadwerkelijke start van de MUTATIE OBSERVER. CONTAINER en CONFIG worden aan
// het begin van dit script gedefinieerd:
domObserver.observe(OBSERVERCONTAINER, OBSERVERCONFIG);

// --- [ EINDE SCRIPT ] ---
// Als de volgende melding in de CONSOLE wordt getoond, dan kan het script in
// ieder geval tot het eind foutloos uitgevoerd worden:
debugConsoleMessage(1, 0, `Einde script voor ${SCRIPTNAME}.`);
debugConsoleMessage(3, 0, "Uitvoering duurde:");

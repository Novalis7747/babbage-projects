// ==UserScript==
// @name         Microsoft Dynamics - CE
// @version      20200514-1336
// @author       PD, Babbage Automation, Roosendaal
// @namespace    https://www.babbage.com/
// @supportURL   https://www.babbage.com/contact/
// @description  De toegankelijkheid van "Microsoft Dynamics - CE" verbeteren.
// @match        *://ker-acc.crm4.dynamics.com/*
// @grant        none
// ==/UserScript==

// --- [ USERSCRIPT NOTITIES ] ---
// ==Developer==
// @browser      Google Chrome (Versie 81.0.4044.138) (x64)
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

// --- [ GLOBALE CONSTANTEN ] ---
const DOMDEBUG = false;
const GLOBALDEBUG = false;
const OBSERVERDEBUG = false;
const SCRIPTNAME = "Microsoft Dynamics - CE";

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

function reportRolesFromChildren(element) {
    "use strict";
    // Verkrijg alle ARIA-ROLLEN van alle KIND elementen en rapporteer deze
    // in een ARRAY naar de CONSOLE:
    try {
        const elements = element.getElementsByTagName("*");
        let roles = [];
        let i = 0;
        // Controleer of de VARIABELE een ELEMENT kent:
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
function changeTabIndexNavMenu(id) {
    "use strict";
    // Verander van alle LISTITEMS binnen het NAVIGATIEMENU de TABINDEX van
    // -1 naar 0. Daarmee wordt het mogelijk om door de LISTITEMS te navigeren
    // met behulp van de TABTOETS in combinatie met NVDA:
    try {
        const menu = document.getElementById(id);
        let i = 0;
        let li = null;
        // Controleer of het MENU met het opgegeven ID gevonden is:
        if (check(menu)) {
            li = menu.getElementsByTagName("LI");
            // Controleer of de VARIABELE LI een ELEMENT kent:
            if (check(li)) {
                while (li[i]) {
                    // Controleer of LI een TABINDEX kent. Indien dit het
                    // geval is, dan doorsturen waar de waarde van de TABINDEX
                    // wordt gecontroleerd en indien nodig op 0 wordt gezet:
                    if (li[i].hasAttribute("tabindex")) {
                        setAttribute(li[i], "tabindex", 0);
                    }
                    i += 1;
                }
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, `changeTabIndexNavMenu: ${err.message}`);
    }
}

function resolveDoubleSpeech(tagName) {
    "use strict";
    // Bij een aantal INVOERVELDEN is er een PLACEHOLDER aanwezig alsmede een
    // ARIA-LABEL met dezelfde tekst. Dit zorgt voor dubbele spraakuitvoer en
    // kan als hinderlijk ervaren worden. Oplossing: verwijder het ARIA-LABEL:
    try {
        const inputs = document.getElementsByTagName(tagName);
        let i = 0;
        let label = null;
        let placeholder = null;
        // Controleer of INPUTS een ELEMENT kent:
        if (check(inputs)) {
            while (inputs[i]) {
                // Controleer of de INPUT een PLACEHOLDER kent:
                if (inputs[i].hasAttribute("placeholder")) {
                    placeholder = inputs[i].getAttribute("placeholder");
                    // Controleer dan pas of er een ARIA-LABEL aanwezig is:
                    if (inputs[i].hasAttribute("aria-label")) {
                        label = inputs[i].getAttribute("aria-label");
                        // Vergelijk de PLACEHOLDER met het ARIA-LABEL. Indien
                        // exact gelijk: verwijder het ARIA-LABEL. Dit omdat de
                        // PLACEHOLDER al voldoende informatie geeft:
                        if (placeholder === label) {
                            inputs[i].removeAttribute("aria-label");
                        }
                    }
                }
                i += 1;
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, `resolveDoubleSpeech: ${err.message}`);
    }
}

function resolveDisabledFields(tagName) {
    "use strict";
    // Een aantal VELDEN is uitgeschakeld door middel van ATTRIBUUT DISABLED.
    // NVDA kan de inhoud van deze velden niet standaard lezen en zo kan er
    // informatie verloren raken voor de eindgebruiker. Deze functie past deze
    // VELDEN aan zodat NVDA de inhoud ervan wel kan voorlezen:
    try {
        const fields = document.getElementsByTagName(tagName);
        let i = 0;
        // Controleer of FIELDS een ELEMENT kent:
        if (check(fields)) {
            while (fields[i]) {
                // Controleer of het om een DISABLED FIELD gaat:
                if (fields[i].hasAttribute("disabled")) {
                    // Verwijder het ATTRIBUUT DISABLED en voeg een aantal
                    // ATTRIBUTEN toe om de toegankelijkheid te verbeteren:
                    fields[i].removeAttribute("disabled");
                    setAttribute(fields[i], "readonly", "");
                    setAttribute(fields[i], "aria-readonly", "true");
                    setAttribute(fields[i], "aria-disabled", "true");
                }
                i += 1;
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, `resolveDisabledFields: ${err.message}`);
    }
}

function getSetAriaLabelNotesField(className) {
    "use strict";
    // Als je een middel opent binnen CE, dan krijg je een overzicht met alle
    // details over dat middel te zien. Daar kunnen ook notities gemaakt worden.
    // Dit invoerveld is toegankelijk, maar mistte een correct ARIA-LABEL. Deze
    // functie lost dat probleem op:
    try {
        const elements = document.getElementsByClassName(className);
        let body = null;
        let frame = null;
        let i = 0;
        let label = "een notitie invoeren";
        // Controleer of ELEMENTS een ELEMENT kent:
        if (check(elements)) {
            while (elements[i]) {
                // Het ELEMENT betreft een FRAME met daarbinnen nog een FRAME.
                // Haal de content op van het gevonden FRAME. Ga dan binnen de
                // gevonden content op zoek naar het tweede FRAME:
                body = elements[i].contentWindow.document.body;
                frame = body.getElementsByTagName("IFRAME");
                // Controleer of het FRAME binnen het FRAME gevonden is. Omdat
                // het zoekresultaat een NODELIST oplevert, vragen wij hier
                // alleen de eerste NODE op (er is altijd maar 1 FRAME):
                if (check(frame[0])) {
                    setAriaLabel(frame[0].contentWindow.document.body, label);
                }
                i += 1;
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, `getSetAriaLabelNotesField: ${err.message}`);
    }
}

// --- [ "BLOCK" MET ALLE FUNCTIE AANROEPEN ] ---
function accessibilityChanges() {
    "use strict";
    // Alle FUNCTIE aanroepen in een bepaalde volgorde om de toegankelijkheid
    // van "Microsoft Dynamics - CE" te verbeteren.
    try {
        // Verbetering aan het NAVIGATIEMENU doorvoeren:
        changeTabIndexNavMenu("siteMapPanelBodyDiv");
        // Dubbele spraakuitvoer bij INVOERVELDEN oplossen:
        resolveDoubleSpeech("INPUT");
        // Uitgeschakelde VELDEN in ieder geval READONLY maken:
        resolveDisabledFields("INPUT");
        resolveDisabledFields("SELECT");
        // Plaats een LABEL op de TEXTAREA waar je nieuwe notities maakt:
        getSetAriaLabelNotesField("fullPageContentEditorFrame");
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

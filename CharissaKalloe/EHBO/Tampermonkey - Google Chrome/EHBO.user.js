// ==UserScript==
// @name         EHBO
// @version      20200721-1619 (Beta)
// @author       PD, Babbage Automation, Roosendaal
// @namespace    https://www.babbage.com/
// @supportURL   https://www.babbage.com/contact/
// @description  De toegankelijkheid van "EHBO" verbeteren.
// @match        *://ehbo.kpn.org/*
// @grant        none
// ==/UserScript==

// --- [ USERSCRIPT NOTITIES ] ---
// ==Developed using==
// @browser      Google Chrome (Versie 83.0.4103.116) (x64)
// @extension    Tampermonkey (Versie 4.10)
// @screenreader NVDA (Versie 2019.2.1)
// ==/Developed using==

// ==Validator==
// @validator    JSLint (Edition 2020.07.02)
// @url          https://www.jslint.com/
// @help         https://www.jslint.com/help.html
// ==/Validator==

// ==Validator settings==
// @description  Om JSLint handmatig in te stellen, indien nodig.
// @settings     Assume: "a browser"
// @global       Global variables: "performance"
// ==/Validator settings==

// --- [ INSTELLINGEN VOOR JSLINT ] ---
// Automatisch instellen van bovenstaande VALIDATOR SETTINGS:
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
const SCRIPTNAME = "EHBO";

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

function setLabelTableEditAndSelect(elements) {
    "use strict";
    // Geef alle INVOERVELDEN en KEUZEMENU'S binnen de TH een correct LABEL:
    try {
        const ele = elements;
        let i = 0;
        let label = null;
        // Controleer of de CONSTANT een ELEMENT kent:
        if (check(ele)) {
            while (ele[i]) {
                // Controleer of het INVOERVELD een NAAM kent:
                if (ele[i].hasAttribute("name")) {
                    // "jqgh_NAAM" is het ID van het ELEMENT met het LABEL:
                    label = "jqgh_" + ele[i].getAttribute("name");
                    setAttribute(ele[i], "aria-labelledby", label);
                }
                i += 1;
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, `setLabelTableEditAndSelect: ${err.message}`);
    }
}

function getTableEditAndSelect(className) {
    "use strict";
    // Verkrijg alle INVOERVELDEN en KEUZEMENU'S binnen de TABLE HEADER:
    try {
        const elements = document.getElementsByClassName(className);
        let fields = null;
        let i = 0;
        let selects = null;
        // Controleer of de CONSTANT een ELEMENT kent:
        if (check(elements)) {
            while (elements[i]) {
                // Stuur alle gevonden INVOERVELDEN door:
                fields = elements[i].getElementsByTagName("INPUT");
                selects = elements[i].getElementsByTagName("SELECT");
                setLabelTableEditAndSelect(fields);
                setLabelTableEditAndSelect(selects);
                i += 1;
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, `getTableEditAndSelect: ${err.message}`);
    }
}

function pageSearchButtons(className) {
    "use strict";
    // Stel een ROLE, LABEL en STATE in voor de knoppen om naar de
    // volgende of vorige pagina van een tabel te navigeren:
    try {
        const elements = document.getElementsByClassName(className);
        let classes = null;
        let child = null;
        let i = 0;
        // Controleer of de CONSTANT een ELEMENT kent:
        if (check(elements)) {
            while (elements[i]) {
                // Maak overal een BUTTON van:
                setAttribute(elements[i], "role", "button");
                // Controleer of de BUTTON is uitgeschakeld en indien ja,
                // plaats deze status dan ook op de BUTTON:
                if (elements[i].classList.contains("ui-state-disabled")) {
                    setAttribute(elements[i], "aria-disabled", "true");
                } else {
                    removeAttribute(elements[i], "aria-disabled");
                }
                // Verkrijg het soort BUTTON en plaats een juist LABEL:
                child = elements[i].firstChild;
                if (child.tagName === "SPAN") {
                    classes = child.classList;
                    if (classes.contains("ui-icon-seek-first")) {
                        setAttribute(
                            elements[i],
                            "aria-label",
                            "naar het begin"
                        );
                    } else if (classes.contains("ui-icon-seek-prev")) {
                        setAttribute(
                            elements[i],
                            "aria-label",
                            "vorige pagina"
                        );
                    } else if (classes.contains("ui-icon-seek-next")) {
                        setAttribute(
                            elements[i],
                            "aria-label",
                            "volgende pagina"
                        );
                    } else if (classes.contains("ui-icon-seek-end")) {
                        setAttribute(
                            elements[i],
                            "aria-label",
                            "naar het eind"
                        );
                    }
                }
                i += 1;
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, `pageSearchButtons: ${err.message}`);
    }
}

function markLockedTicket() {
    "use strict";
    try {
        const img = document.getElementsByTagName("IMG");
        let i = 0;
        let source = null;
        while (img[i]) {
            source = img[i].src;
            if (check(source)) {
                if (source.length > 60) {
                    source = source.slice(51);
                }
                if (source === "lock_green.gif") {
                    setAttribute(img[i], "role", "navigation");
                }
            }
            i += 1;
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, `markLockedTicket: ${err.message}`);
    }
}

// --- [ "BLOCK" MET ALLE FUNCTIE AANROEPEN ] ---
function accessibilityChanges() {
    "use strict";
    // Alle FUNCTIE aanroepen in een bepaalde volgorde om de toegankelijkheid
    // van "EHBO" te verbeteren.
    try {
        // Geef deelvensters een HEADING ROLE mee voor snelle navigatie:
        setAttrForClass("x-panel-header x-unselectable", "role", "heading");
        setAttrForClass("x-panel-header x-unselectable", "aria-level", "2");
        // Geef bepaalde ELEMENTEN de ROLE van BUTTON en diens STATUS mee:
        pageSearchButtons("ui-pg-button ui-corner-all");
        // Verkrijg de LABELS en plaats deze binnen de ZOEK-FILTER-BALK:
        getTableEditAndSelect("ui-search-toolbar");
        // Maak van de MESSAGEBOX een DIALOOGVENSTER:
        setAttrForClass("x-window-dlg", "role", "dialog");
        setAttrForClass("EHBOMsgBox", "role", "dialog");
        // Geef het INVOERVELD om een pagina te zoeken een LABEL:
        setAttrForClass("ui-pg-input", "aria-label", "paginanummer");
        // Verberg de eerste RIJ binnen de TABEL, deze bevat geen informatie:
        setAttrForClass("jqgfirstrow", "role", "presentation");
        //
        setAttrForId("dialogDossier", "role", "dialog");
        //
        setAttrForClass("ext-mb-textarea", "aria-label", "opmerking");
        setAttrForClass("x-window-header-text", "role", "navigation");
        setAttrForClass("x-combo-list-inner", "role", "navigation");
        //
        markLockedTicket();
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

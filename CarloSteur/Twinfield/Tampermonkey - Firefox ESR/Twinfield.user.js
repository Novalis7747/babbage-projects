// ==UserScript==
// @name         Twinfield
// @version      20201029-1520-Beta
// @author       PD, Babbage Automation, Roosendaal
// @namespace    https://www.babbage.com/
// @supportURL   https://www.babbage.com/contact/
// @description  De toegankelijkheid van "Twinfield" verbeteren.
// @include      /^https?:\/\/accounting\d*\.twinfield\.com\/.*$/
// @grant        none
// ==/UserScript==

// --- [ USERSCRIPT NOTITIES ] ---
// ==Developed using==
// @browser      Mozilla Firefox ESR (Versie 78.4.0) (x64)
// @extension    Tampermonkey (Versie 4.11.6117)
// @screenreader NVDA (Versie 2020.2)
// ==/Developed using==

// ==Validator==
// @validator    JSLint (Edition 2020.10.21)
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

/*firefox
    Mozilla Firefox gebruikt 'contentDocument' om de dom van een iframe te benaderen.
    Google Chrome (bijvoorbeeld) gebruikt 'contentWindow'. Houdt hier rekening mee.
    Dit script is specifiek geschreven voor Mozilla Firefox ESR. Zie USERSCRIPT NOTITIES.
*/

// --- [ GLOBALE CONSTANTEN ] ---
const GLOBALDEBUG = true;
// In combinatie met GLOBALDEBUG toont dit iedere ARIA-ROLE binnen de DOM:
const DOMDEBUG = false;
// In combinatie met GLOBALDEBUG toont dit iedere MUTATIE in de CONSOLE:
const OBSERVERDEBUG = false;
const APPNAME = "Twinfield";

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

function getItemsFromFinderMenu(className) {
    "use strict";
    // Gebruik een zelfgeplaatste DIV als ALERT om veranderingen binnen het
    // FINDER MENU te laten uitspreken. Een andere optie was momenteel niet
    // mogelijk:
    try {
        // Een querySelector om alleen het juiste KEUZEMENU te krijgen:
        const element = document.querySelector(`body div[class="${className}"]`);
        let message = null;
        let selected = null;
        // Controleer of de CONSTANT een ELEMENT kent:
        if (check(element)) {
            // Controleer of het MENU geopend is aan de hand van het feit of
            // er een TR element de KLASSENAAM SELECTED heeft:
            selected = element.querySelector("tr.selected");
            if (check(selected)) {
                // Verkrijg de zelfgeplaatste DIV uit het FRAME:
                message = document.getElementById("babbage");
                if (message.textContent !== selected.textContent) {
                    message.textContent = selected.textContent;
                }
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, `getItemsFromFinderMenu: ${err.message}`);
    }
}

function rolesForTableHeaders(element) {
    "use strict";
    // Stel ROLLEN in om de KOLOMKOPPEN uit te laten spreken door NVDA, een
    // vervolg FUNCTIE van "setRolesByTagNameForTableHeaders":
    try {
        // Verkrijg alle HEADERS binnen de THEAD:
        const headers = element.getElementsByTagName("TD");
        let i = 0;
        // Controleer of de CONSTANT een ELEMENT kent:
        if (check(headers)) {
            while (headers[i]) {
                setAttribute(headers[i], "role", "columnheader");
                i += 1;
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, `rolesForTableHeaders: ${err.message}`);
    }
}

function setRolesByTagNameForTableHeaders(classNameFrame, frameIndex) {
    "use strict";
    // Stel ROLLEN in om de KOLOMKOPPEN uit te laten spreken door NVDA,
    // ditmaal gebaseerd op TAGNAAM:
    try {
        // Er is vooralsnog maar een FRAME waar het om gaat:
        const frame = document.getElementsByClassName(classNameFrame)[frameIndex - 1];
        let headerTags = null;
        let i = 0;
        let tables = null;
        // Controleer of de CONSTANT een ELEMENT kent:
        if (check(frame)) {
            // Verkrijg alle TABELLEN binnen het FRAME:
            tables = frame.contentDocument.getElementsByTagName("TABLE");
            if (check(tables)) {
                // Verkrijg alle TABELKOPPEN binnen een TABEL:
                headerTags = frame.contentDocument.getElementsByTagName("THEAD");
                while (headerTags[i]) {
                    rolesForTableHeaders(headerTags[i]);
                    i += 1;
                }
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, `setRolesByTagNameForTableHeaders: ${err.message}`);
    }
}

function setRolesByClassNameForTableHeaders(classNameFrame, className, frameIndex) {
    "use strict";
    // Stel ROLLEN in om de KOLOMKOPPEN uit te laten spreken door NVDA,
    // ditmaal gebaseerd op KLASSENAAM:
    try {
        // Er is vooralsnog maar een FRAME waar het om gaat:
        const frame = document.getElementsByClassName(classNameFrame)[frameIndex - 1];
        let headers = null;
        let i = 0;
        // Controleer of de CONSTANT een ELEMENT kent:
        if (check(frame)) {
            // Verkrijg alle TABEL HEADERS binnen het FRAME:
            headers = frame.contentDocument.getElementsByClassName(className);
            if (check(headers)) {
                while (headers[i]) {
                    setAttribute(headers[i], "role", "columnheader");
                    i += 1;
                }
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, `setRolesByClassNameForTableHeaders: ${err.message}`);
    }
}

function setRolesForTablesAndRows(classNameFrame, classNameTable, classNameRow, frameIndex) {
    "use strict";
    // Stel ROLLEN in voor specifieke TABELLEN en diens RIJEN,
    // zodat NVDA correct de naam van de rij uitspreekt:
    try {
        // Er is vooralsnog maar een FRAME waar het om gaat:
        const frame = document.getElementsByClassName(classNameFrame)[frameIndex - 1];
        let i = 0;
        let j = 0;
        let rows = null;
        let tables = null;
        // Controleer of de CONSTANT een ELEMENT kent:
        if (check(frame)) {
            // Verkrijg alle TABELLEN binnen het FRAME:
            tables = frame.contentDocument.getElementsByClassName(classNameTable);
            if (check(tables)) {
                // Verkrijg alle RIJEN die het LABEL van die RIJ bezitten:
                rows = frame.contentDocument.getElementsByClassName(classNameRow);
                while (tables[i]) {
                    // Iedere TABEL moet een ROLE GRID toegekend krijgen
                    // om de ROLE ROWHEADER te laten werken:
                    setAttribute(tables[i], "role", "grid");
                    i += 1;
                }
                if (check(rows)) {
                    while (rows[j]) {
                        // Nadat iedere TABEL een ROLE GRID heeft kan
                        // iedere juiste RIJ een ROWHEADER krijgen:
                        setAttribute(rows[j], "role", "rowheader");
                        j += 1;
                    }
                }
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, `setRolesForTablesAndRows: ${err.message}`);
    }
}

function setFrameHeaders(classNameFrame, className, headingLevel, frameIndex) {
    "use strict";
    // Geef de HEADERS binnen een FRAME een juiste ROLE en LEVEL mee,
    // HEADERS worden gevonden binnen het FRAME op KLASSENAAM:
    try {
        // Er is vooralsnog maar een FRAME waar het om gaat:
        const frame = document.getElementsByClassName(classNameFrame)[frameIndex - 1];
        let headers = null;
        let i = 0;
        // Controleer of de CONSTANT een ELEMENT kent:
        if (check(frame)) {
            // Verkrijg alle HEADERS binnen het FRAME met een bepaalde KLASSENAAM:
            headers = frame.contentDocument.getElementsByClassName(className);
            if (check(headers)) {
                while (headers[i]) {
                    // Iedere HEADER moet een ROLE HEADING toegekend krijgen
                    // en een correct ARIA-LEVEL:
                    setAttribute(headers[i], "role", "heading");
                    setAttribute(headers[i], "aria-level", headingLevel);
                    i += 1;
                }
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, `setFrameHeaders: ${err.message}`);
    }
}

function setRoleIncorrectInput(classNameFrame, className, frameIndex) {
    "use strict";
    // Wanneer je iets foutiefs invoert in een INVOERVELD, dan wordt dit INVOERVELD
    // visueel rood gemarkeerd zonder verdere uitleg. Deze functie geeft ieder INVOERVELD
    // met foutieve invoer een ROLE NAVIGATION en LABEL om van fout naar fout te navigeren:
    try {
        // Er is vooralsnog maar een FRAME waar het om gaat:
        const frame = document.getElementsByClassName(classNameFrame)[frameIndex - 1];
        let errors = null;
        let i = 0;
        // Controleer of de CONSTANT een ELEMENT kent:
        if (check(frame)) {
            // Verkrijg alle INVOERVELDEN met foutieve INVOER binnen
            // het FRAME aan de hand van de KLASSENAAM:
            errors = frame.contentDocument.getElementsByClassName(className);
            if (check(errors)) {
                while (errors[i]) {
                    // Ieder INVOERVELD dat foutieve INVOER bevat dient een ROLE
                    // NAVIGATION mee te krijgen om snel naar de fouten te kunnen navigeren:
                    setAttribute(errors[i], "role", "navigation");
                    setAriaLabel(errors[i], "controleer de invoer");
                    // Hier kan nog een ARIA-INVALID experiment aan besteed worden.
                    i += 1;
                }
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, `setRoleIncorrectInput: ${err.message}`);
    }
}

function setRoleLabelForMainMenuItems(className) {
    "use strict";
    // Maak van iedere keus binnen het LINKER HOOFDMENU een MENUITEM
    // inclusief een juist LABEL:
    try {
        const elements = document.getElementsByClassName(className);
        let i = 0;
        let label = null;
        // Controleer of de CONSTANT een ELEMENT kent:
        if (check(elements)) {
            while (elements[i]) {
                // Controleer of het ATTRIBUUT bestaat waar het LABEL
                // uit te halen is. Indien ja, pas het dan toe:
                if (elements[i].hasAttribute("uib-tooltip")) {
                    label = elements[i].getAttribute("uib-tooltip");
                    setAriaLabel(elements[i], label);
                }
                // Maak van iedere keus sowieso een MENUITEM, ongeacht
                // of er een LABEL gevonden kan worden of niet:
                setAttribute(elements[i], "role", "menuitem");
                i += 1;
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, `setRoleLabelForMainMenuItems: ${err.message}`);
    }
}

function setRoleLabelForTopMenuItems(className) {
    "use strict";
    // Voorzie iedere keus binnen het TOPMENU van een juist LABEL:
    try {
        const elements = document.getElementsByClassName(className);
        let i = 0;
        let node = null;
        // Controleer of de CONSTANT een ELEMENT kent:
        if (check(elements)) {
            while (elements[i]) {
                // :
                node = elements[i].firstElementChild;
                if (check(node) && node.tagName === "I") {
                    if (node.className === "fa fa-refresh") {
                        setAriaLabel(elements[i], "vernieuwen");
                    } else if (node.className === "fa fa-folder-open") {
                        setAriaLabel(elements[i], "bestandsbeheer");
                    } else if (node.className === "fa fa-plus") {
                        setAriaLabel(elements[i], "nieuw tab openen");
                    } else if (node.className === "fa fa-question-circle") {
                        setAriaLabel(elements[i], "support pagina");
                    } else if (node.className === "fa fa-user") {
                        setAriaLabel(elements[i], "actieve gebruiker");
                    } else if (node.className === "twf-icomoon-checklist") {
                        setAriaLabel(elements[i], "portfolio openen");
                    }
                }
                i += 1;
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, `setRoleLabelForTopMenuItems: ${err.message}`);
    }
}

// --- [ FINDER MENU SPECIFIEK ] ---
function placeAlert() {
    "use strict";
    // Pas een element plaatsen als je in het FRAME bent:
    try {
        const babbage = document.getElementById("babbage");
        let message = null;
        // Alleen een ELEMENT en diens ATTRIBUTEN maken als het ELEMENT nog
        // niet bestaat:
        if (!check(babbage)) {
            message = document.createElement("DIV");
            message.setAttribute("id", "babbage");
            message.setAttribute("role", "alert");
            message.setAttribute("aria-live", "assertive");
            message.setAttribute("aria-atomic", "true");
            document.body.appendChild(message);
        }
    } catch (err) {
        // Foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, `placeAlert: ${err.message}`);
    }
}

// Pas de volgende functie herhaaldelijk uitvoeren als je in het FRAME bent:
if (window.location !== window.parent.location) {
    setInterval(function () {
        placeAlert();
        getItemsFromFinderMenu("finder");
    }, 3000);
}

// --- [ "BLOCK" MET ALLE FUNCTIE AANROEPEN ] ---
function accessibilityChanges() {
    "use strict";
    // Alle FUNCTIE aanroepen in een bepaalde volgorde om de toegankelijkheid
    // te verbeteren:
    try {
        // Maak van het LINKER HOOFDMENU daadwerkelijk een MENU inclusief MENUITEMS:
        setAttrForClass("main-menu", "role", "menu");
        setRoleLabelForClass("main-menu-container", "navigation", "hoofdmenu");
        setRoleLabelForMainMenuItems("main-menu-item");
        // Voorzie de knoppen en het LOGO in het TOPMENU van een goed LABEL:
        setRoleLabelForTopMenuItems("top-menu-icon");
        setRoleLabelForClass("brand-icon", "navigation", "home");
        // Geef TABELLEN en RIJEN een juiste ROLE, zodat RIJNAMEN worden uitgesproken:
        setRolesForTablesAndRows("classic ng-scope", "main", "rowlbl", 1);
        // Geef KOLOMKOPPEN binnen een TABEL een juiste ROLE mee:
        setRolesByTagNameForTableHeaders("classic ng-scope", 1);
        setRolesByClassNameForTableHeaders("classic ng-scope", "collbl", 1);
        // Geef HEADERS binnen een FRAME een juiste ROLE en LEVEL mee:
        setFrameHeaders("classic ng-scope", "xldropdown", "3", 1);
        setFrameHeaders("classic ng-scope", "subtitle", "3", 1);
        // Zorg ervoor dat belangrijke MELDINGEN meteen uitgesproken worden:
        setAttrForClass("alert notification-message", "role", "alert");
        setAttrForClass("alert notification-message", "aria-live", "assertive");
        // Deze functie geeft ieder INVOERVELD met foutieve invoer een ROLE NAVIGATION en LABEL:
        setRoleIncorrectInput("classic ng-scope", "texterror", 1);
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

// --- [ SNELTOETS TOEVOEGEN ] ---
// Voer het script handmatig uit na het invoeren van: CTRL + ALT + J:
document.addEventListener("keydown", function (keyEvent) {
    "use strict";
    if (keyEvent.ctrlKey && keyEvent.altKey && keyEvent.code === "KeyJ") {
        try {
            if (GLOBALDEBUG) {
                window.alert("Handmatige uitvoering " + APPNAME + " script.");
            }
            accessibilityChanges();
            getItemsFromFinderMenu("finder");
            debugConsoleMessage(1, 0, "Handmatige uitvoering " + APPNAME + " script.");
        } catch (err) {
            // Foutmelding naar de CONSOLE sturen:
            debugConsoleMessage(1, 1, `manualExecution: ${err.message}`);
        }
    }
});

// --- [ EINDE SCRIPT ] ---
// Als de volgende melding in de CONSOLE wordt getoond, dan kan het script in
// ieder geval tot het eind foutloos uitgevoerd worden:
debugConsoleMessage(1, 0, `Einde script voor ${APPNAME}.`);
debugConsoleMessage(3, 0, "Uitvoering duurde:");

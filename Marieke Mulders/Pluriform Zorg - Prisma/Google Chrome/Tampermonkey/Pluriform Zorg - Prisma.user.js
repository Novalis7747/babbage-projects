// ==UserScript==
// @name         Pluriform Zorg - Prisma
// @version      20200526-1214
// @author       PD, Babbage Automation, Roosendaal
// @namespace    https://www.babbage.com/
// @supportURL   https://www.babbage.com/contact/
// @description  De toegankelijkheid van "Pluriform Zorg - Prisma" verbeteren.
// @match        *://prisma-pr.pluriformzorg.nl/*
// @match        *://prisma.pluriformzorg.nl/*
// @grant        none
// ==/UserScript==

// --- [ USERSCRIPT NOTITIES ] ---
// ==Developed using==
// @browser      Google Chrome (Versie 83.0.4103.61) (x64)
// @extension    Tampermonkey (Versie 4.9)
// @screenreader NVDA (Versie 2019.2.1)
// ==/Developed using==

// ==Validator==
// @validator    JSLint (Edition 2020.03.28)
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
const SCRIPTNAME = "Pluriform Zorg - Prisma";

// --- [ GLOBALE VARIABELEN ] ---
let PERFORMANCETIMER = false;

// Controleer of de BROWSER PERFORMANCE.NOW ondersteunt:
if (performance.now()) {
    PERFORMANCETIMER = performance.now();
}

// --- [ MUTATIE OBSERVER CONTAINER EN CONFIGURATIE ] ---
const OBSERVERCONTAINER = document;
// Filteren op veranderingen van ATTRIBUTEN, gefilterd of niet, zorgt voor een
// impact op de snelheid en soms vastlopers bij grote TABELLEN, let hier op:
const OBSERVERCONFIG = {
    // attributeOldValue: true,
    // characterData: true,
    // characterDataOldValue: true,
    attributes: true,
    attributeFilter: ["class"],
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

function setLabelIdDialog(dialog) {
    "use strict";
    // Binnen een DIALOOGVENSTER is een titel aanwezig. Geef deze titel een ID
    // mee zodat het gebruikt kan worden met ARIA-LABELLEDBY:
    try {
        // Verkrijg alle TITLE elementen binnen het DIALOOGVENSTER:
        const titles = dialog.getElementsByClassName("title");
        // Controleer of de CONSTANT een ELEMENT kent:
        if (check(titles) && titles.length > 0) {
            // Stel een ID in om naar dit label te kunnen verwijzen:
            setAttribute(titles[0], "id", "dialog-title");
            // Status teruggeven of bovenstaande is gelukt of niet:
            return true;
        } else {
            return false;
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, `setLabelIdDialog: ${err.message}`);
    }
}

function placeLabelAndFocusOnDialog(className) {
    "use strict";
    // Controleer of er een DIALOOGVENSTER is geopend. Indien het geval, plaats
    // dan de focus binnen dat DIALOOGVENSTER op de eerste knop. Er is altijd
    // een OK-knop of een ANNULEREN-knop aanwezig:
    try {
        const elements = document.getElementsByClassName(className);
        let buttons = null;
        let i = 0;
        // Controleer of de CONSTANT een ELEMENT kent:
        if (check(elements)) {
            while (elements[i]) {
                // Controleer of het om een DIALOOGVENSTER gaat:
                if (elements[i].hasAttribute("role")) {
                    if (elements[i].getAttribute("role") === "dialog") {
                        // Stuur de verwijzing naar het DIALOOGVENSTER door
                        // om er een label aan toe te wijzen, maar alleen
                        // als er een label gevonden kan worden:
                        if (setLabelIdDialog(elements[i])) {
                            setAttribute(
                                elements[i],
                                "aria-labelledby",
                                "dialog-title"
                            );
                        }
                        // Haal alle BUTTONS op binnen het DIALOOGVENSTER:
                        buttons = elements[i].getElementsByTagName("BUTTON");
                        // Controleer of er BUTTONS gevonden zijn:
                        if (check(buttons) && buttons.length > 0) {
                            // Haal de laatste BUTTON op, meestal is dat de
                            // ANNULEREN-knop, en geef die de focus:
                            buttons[buttons.length - 1].focus();
                        }
                    }
                }
                i += 1;
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, `placeLabelAndFocusOnDialog: ${err.message}`);
    }
}

function removeStyleDisplay(tagName) {
    "use strict";
    // RADIOBUTTONS en CHECKBOXES kennen een CSS style "display". Die staat op
    // "none". De oorspronkelijke inputs worden daardoor niet getoond aan de
    // schermlezer. Het ongedaan maken van deze style property zorgt ervoor dat
    // NVDA de betreffende elementen weer goed voorleest, met alle statussen:
    try {
        const inputs = document.getElementsByTagName(tagName);
        let i = 0;
        // Controleer of de CONSTANT een ELEMENT kent:
        if (check(inputs)) {
            while (inputs[i]) {
                // Controleer of de INPUTS het attribuut "type" kennen:
                if (inputs[i].hasAttribute("type")) {
                    // Als een INPUT van het type "radio" of "checkbox" is, dan
                    // de style voor "display" toekennen. Dit krijgt voorrang
                    // op de style uit de CSS en maakt het daarmee onklaar:
                    if (
                        inputs[i].getAttribute("type") === "radio" ||
                        inputs[i].getAttribute("type") === "checkbox"
                    ) {
                        setAttribute(inputs[i], "style", "display:inline");
                    }
                }
                i += 1;
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, `removeStyleDisplay: ${err.message}`);
    }
}

function setStatusToggleButtons(mutation) {
    "use strict";
    // Actieve TOGGLE BUTTONS worden blauw gemarkeerd. Zo is in een oogopslag
    // duidelijk welke knop actief is. NVDA spreekt dit niet uit en dat wordt
    // opgelost door tijdelijk een ARIA-LABEL mee te geven aan actieve knoppen:
    try {
        let label = null;
        // Indien een TOGGLE BUTTON actief is, dan krijgt die een CLASS mee
        // met de naam ACTIVE. Controleer hierop en geef de knop dan een LABEL
        // met de titel van de knop en het woord actief:
        if (mutation.classList.contains("active")) {
            label = `${mutation.innerText} actief`;
            setAriaLabel(mutation, label);
        } else {
            // Standaard zijn er geen LABELS aanwezig op de TOGGLE BUTTONS.
            // Als er wel een aanwezig is en de knop is niet actief, dan is
            // het LABEL geplaatst door dit script en dient dat LABEL weer
            // opgeruimd te worden van de knop:
            removeAttribute(mutation, "aria-label");
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, `setStatusToggleButtons: ${err.message}`);
    }
}

// --- [ "BLOCK" MET ALLE FUNCTIE AANROEPEN ] ---
function accessibilityChanges() {
    "use strict";
    // Alle FUNCTIE aanroepen in een bepaalde volgorde om de toegankelijkheid
    // van "Pluriform Zorg - Prisma" te verbeteren.
    try {
        // Maak van DASHBOARD TITLES koppen met niveau 2:
        setAttrForClass("dashboard-title", "role", "heading");
        setAttrForClass("dashboard-title", "aria-level", "2");
        // Maak van TILES koppen met niveau 3:
        setAttrForClass(
            "webcontent-webselection-header-left",
            "role",
            "heading"
        );
        setAttrForClass(
            "webcontent-webselection-header-left",
            "aria-level",
            "3"
        );
        // Maak van de HEADERS in een dialoogvenster daadwerkelijk koppen,
        // ditmaal met een niveau van 3:
        setAttrForClass("webcontent-container-header-title", "role", "heading");
        setAttrForClass("webcontent-container-header-title", "aria-level", "3");
        // Maak van de PAGINATITEL een navigatiepunt om snel naar de content te
        // kunnen navigeren:
        setAttrForClass(
            "breadcrumbs-title-container-links",
            "role",
            "navigation"
        );
        // Menu's worden aan de onderkant van de DOM geplaatst. Prima naar toe
        // te navigeren met CTRL + END. Maar niet alle menu's lijken consistent.
        // Om die reden een navigatiepunt toegevoegd, voor snelle navigatie:
        setAttrForClass(
            "widgets-popupmenu menubutton-popupmenu",
            "role",
            "navigation"
        );
        setAttrForClass("wf-cmditem-container", "role", "navigation");
        // Maak van de popup een DIALOOGVENSTER zodat NVDA dat terugkoppelt
        // en plaats de focus binnen dat DIALOOGVENSTER:
        setAttrForClass(
            "wfi-window wf-window wf-placeholder-scope",
            "role",
            "dialog"
        );
        placeLabelAndFocusOnDialog("wfi-window wf-window wf-placeholder-scope");
        // Geef alle CLOSE LINKS een herkenbaar label:
        setAttrForClass("close", "aria-label", "sluiten");
        // Plaats een NAVIGATIEPUNT op opmerkingen binnen dialoogvensters.
        // Het betreft hier opmerkingen en / of notities van collega's:
        setAttrForClass("message-item-content-inner", "role", "navigation");
        // Zorg dat NVDA de RADIOBUTTONS en CHECKBOXES weer kan bedienen en
        // de status ervan kan voorlezen:
        removeStyleDisplay("INPUT");
        // Geef generieke knoppen een juist LABEL:
        setRoleLabelForClass("fontawesomeregular-icon-search", "", "zoeken");
        setRoleLabelForClass("fontawesomeregular-icon-print", "", "afdrukken");
        setRoleLabelForClass(
            "fontawesomeregular-icon-cogs",
            "",
            "instellingen wijzigen"
        );
        setRoleLabelForClass(
            "fontawesomeregular-icon-ellipsis-horizontal",
            "",
            "selecteer item"
        );
        setRoleLabelForClass(
            "fontawesomeregular-icon-th",
            "",
            "selecteer items"
        );
        setRoleLabelForClass(
            "fontawesomeregular-icon-calendar",
            "",
            "kies datum"
        );
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
        let classes = null;
        let i = 0;
        while (mutations[i]) {
            if (OBSERVERDEBUG && GLOBALDEBUG) {
                // Extra debug informatie die afzonderlijk aan of uit te zetten
                // is voor test doeleinden ten koste van performance:
                debugConsoleMessage(1, 1, mutations[i]);
            }
            if (mutations[i].type === "attributes") {
                // Controleer of het een MUTATIE van een ATTRIBUUT betreft en
                // specifiek van het type CLASS:
                if (mutations[i].attributeName === "class") {
                    // Vraag de CLASSLIST op en controleer specifiek op de
                    // TOGGLE BUTTONS class. Indien gevonden, stuur dan de
                    // MUTATIE door om een status mee te geven aan de knoppen:
                    classes = mutations[i].target.classList;
                    if (classes.contains("wf-togglebutton")) {
                        setStatusToggleButtons(mutations[i].target);
                    }
                }
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
        // moet gaan worden, zoals hier op TOGGLE BUTTONS:
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

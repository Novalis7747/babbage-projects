// ==UserScript==
// @name         EduArte
// @version      20200327-1604
// @author       PD, Babbage Automation, Roosendaal
// @namespace    https://www.babbage.com/
// @supportURL   https://www.babbage.com/contact/
// @description  De toegankelijkheid van "EduArte" verbeteren.
// @match        *://rocmn-test.educus.nl/*
// @match        *://rocmn.educus.nl/*
// @grant        none
// ==/UserScript==

// --- [ USERSCRIPT NOTITIES ] ---
// ==Developer==
// @browser      Google Chrome (Versie 80.0.3987.132) (x64)
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
const SCRIPTNAME = "EduArte";
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

// --- [ DEBUG FUNCTIES ] ---
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

// --- [ FUNCTIES ] ---
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

function setAttrForClass(className, attr, value) {
    "use strict";
    // Stel een ATTRIBUUT in voor generieke ELEMENTEN:
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

function getSetLabelForInputs() {
    "use strict";
    // Verkrijg de WAARDEN van de NAME en TYPE attribuut van invoervelden.
    // Gebruik deze om een correct ARIA-LABEL te maken en te plaatsen:
    try {
        const elementen = document.getElementsByTagName("INPUT");
        let i = 0;
        let label;
        // Controleer of de VARIABELE een ELEMENT kent:
        if (check(elementen)) {
            while (elementen[i]) {
                if (elementen[i].hasAttribute("name")) {
                    // Filter ELEMENTEN met een ONCLICK:
                    if (!elementen[i].getAttribute("onclick")) {
                        if (!elementen[i].className === "inpText") {
                            label = elementen[i].getAttribute("name");
                        }
                    }
                }
                if (elementen[i].hasAttribute("type")) {
                    // Alleen het LABEL ophalen voor het type AFBEELDINGEN:
                    if (elementen[i].getAttribute("type") === "image") {
                        // Probeer eerst TITLE en gebruik anders de ALT:
                        if (elementen[i].hasAttribute("title")) {
                            label = elementen[i].getAttribute("title");
                        } else if (elementen[i].hasAttribute("alt")) {
                            label = elementen[i].getAttribute("alt");
                        }
                    }
                }
                // Eerst het LABEL controleren en dan doorsturen:
                if (check(label) && label.length > 0) {
                    setAriaLabel(elementen[i], label);
                }
                // Reset de VARIABELE LABEL:
                label = undefined;
                i += 1;
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, "getSetLabelForInputs: " + err.message);
    }
}

function getSetLabelForSelects() {
    "use strict";
    // Verkrijg het LABEL van een bovenliggend SPAN ELEMENT.
    // Gebruik deze om een correct ARIA-LABEL te maken en te plaatsen:
    try {
        const elementen = document.getElementsByClassName("inpSelect");
        let i = 0;
        let label;
        let sibling;
        // Controleer of de VARIABELE een ELEMENT kent:
        if (check(elementen)) {
            while (elementen[i]) {
                // Bestaat er een VORIG KIND ELEMENT:
                if (elementen[i].previousElementSibling) {
                    sibling = elementen[i].previousElementSibling;
                    // Als het een SPAN ELEMENT betreft, dan mag je er vanuit
                    // gaan dat je goed zit. Weinig andere aanknopingspunten:
                    if (sibling.tagName === "SPAN") {
                        label = sibling.textContent;
                    }
                }
                // Eerst het LABEL controleren en dan doorsturen:
                if (check(label) && label.length > 0) {
                    setAriaLabel(elementen[i], label);
                }
                // Reset de VARIABELE LABEL:
                label = undefined;
                i += 1;
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, "getSetLabelForSelects: " + err.message);
    }
}

function getSetLabelForMostInputs(className) {
    "use strict";
    // Verkrijg de TEKST van het LABEL uit de KINDEREN van OUDER ELEMENTEN.
    // Gebruik deze om een correct ARIA-LABEL te maken en te plaatsen:
    try {
        const elementen = document.getElementsByClassName(className);
        let i = 0;
        let label;
        let parent;
        // Controleer of de VARIABELE een ELEMENT kent:
        if (check(elementen)) {
            while (elementen[i]) {
                parent = elementen[i].parentNode;
                if (parent.className === "nowrap inline") {
                    label = parent.childNodes[0].textContent.trim();
                } else if (parent.parentNode.className === "nowrap inline") {
                    label = parent.parentNode.childNodes[0].textContent.trim();
                // Een uitzondering voor bepaalde DATUM INVOERVELDEN:
                } else if (parent.tagName === "SPAN") {
                    label = parent.childNodes[0].textContent.trim();
                }
                // Eerst het LABEL controleren en dan doorsturen:
                if (check(label) && label.length > 0) {
                    setAriaLabel(elementen[i], label);
                }
                // Reset de VARIABELE LABEL:
                label = undefined;
                i += 1;
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, "getSetLabelForMostInputs: " + err.message);
    }
}

function hideHiddenInputs() {
    "use strict";
    // Een aantal INPUTS hebben als TYPE HIDDEN. Deze worden nog steeds door
    // de schermlezer gevonden en meegenomen in de TAB volgorde. Deze functie
    // voorkomt dat en maakt deze INPUTS onzichtbaar voor de schermlezer:
    try {
        const elementen = document.getElementsByTagName("INPUT");
        let i = 0;
        // Controleer of de VARIABELE een ELEMENT kent:
        if (check(elementen)) {
            while (elementen[i]) {
                if (elementen[i].hasAttribute("type")) {
                    // Alleen INPUTS behandelen waarvan het TYPE HIDDEN is:
                    if (elementen[i].getAttribute("type") === "hidden") {
                        setAttribute(elementen[i], "role", "presentation");
                    }
                }
                i += 1;
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, "hideHiddenInputs: " + err.message);
    }
}

function getSetLabelMenuItems(className) {
    "use strict";
    // Stel een LABEL in voor MENUITEMS die opgemaakt zijn als een LINK maar
    // in feite een KEUZEMENU bevatten als je er met de muis overheen beweegt:
    try {
        const elementen = document.getElementsByClassName(className);
        let child;
        let i = 0;
        let label;
        // Controleer of de VARIABELE een ELEMENT kent:
        if (check(elementen)) {
            while (elementen[i]) {
                // Controleer of er een KIND ELEMENT aanwezig is:
                if (elementen[i].firstElementChild) {
                    child = elementen[i].firstElementChild;
                    if (child.tagName === "A") {
                        // Verkrijg de naam van de LINK:
                        label = child.textContent;
                        // Voeg het woord SUBMENU toe om het onderscheid in het
                        // menu duidelijk te maken:
                        setAriaLabel(child, label + " submenu");
                    }
                }
                i += 1;
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, "getSetLabelMenuItems: " + err.message);
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
                if (role.length > 0 && label.length > 0) {
                    setAttribute(elementen[i], "role", role);
                    setAttribute(elementen[i], "aria-label", label);
                }
                i += 1;
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, "setRoleLabelForClass: " + err.message);
    }
}

function setLabelForImages() {
    "use strict";
    // Verkrijg de SRC van alle afbeeldingen en gebruik dat om te bepalen om wat
    // voor afbeelding het gaat. Maak aan de hand daarvan een correct LABEL:
    try {
        const elementen = document.getElementsByTagName("IMG");
        let c;
        let i = 0;
        let icon;
        let src;
        // Controleer of de VARIABELE een ELEMENT kent:
        if (check(elementen)) {
            while (elementen[i]) {
                // Controleer of een IMAGE een SRC heeft:
                if (elementen[i].getAttribute("SRC")) {
                    // Haal de SRC op van iedere IMAGE:
                    src = elementen[i].getAttribute("SRC");
                    // Zoek naar ICONS en achterhaal de locatie:
                    if (src.search(/icons/i) !== -1) {
                        c = src.search(/icons/i);
                        // Slice de STRING op de plek van het woord ICONS:
                        icon = src.slice(c);
                        if (icon === "icons/printPDF.png") {
                            setAttribute(
                                elementen[i],
                                "aria-label",
                                "pdf bestand downloaden"
                            );
                        } else if (icon === "icons/word2.gif") {
                            setAttribute(
                                elementen[i],
                                "aria-label",
                                "word bestand downloaden"
                            );
                        }
                    }
                }
                i += 1;
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, "setLabelForImages: " + err.message);
    }
}

function setAttrForAlert(className) {
    "use strict";
    // Stel een ALERT ROLE in voor een generiek ELEMENT:
    try {
        const elementen = document.getElementsByClassName(className);
        let ele;
        let i = 0;
        // Controleer of de VARIABELE een ELEMENT kent:
        if (check(elementen)) {
            while (elementen[i]) {
                // Controleer het eerste KIND ELEMENT:
                if (elementen[i].firstElementChild) {
                    ele = elementen[i].firstElementChild;
                    // Controleer dan of het een SPAN betreft:
                    if (ele.tagName === "SPAN") {
                        setAttribute(ele, "role", "alert");
                        setAttribute(ele, "aria-live", "assertive");
                    }
                }
                i += 1;
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, "setAttrForAlert: " + err.message);
    }
}

function showHideMenuFields() {
    "use strict";
    // Verberg het GA NAAR MENU afhankelijk van het gegeven of het menu geopend
    // is door de gebruiker of niet. Toon het MENU pas aan de schermlezer als
    // de gebruiker het GA NAAR MENU ook daadwerkelijk heeft geopend:
    try {
        const element = document.getElementById("scrollBox");
        let menu;
        // Controleer of de VARIABELE een ELEMENT kent:
        if (check(element)) {
            menu = element.getElementsByClassName("menuBox");
            // Controleer of het MENU gevonden is:
            if (check(menu)) {
                // Controleer de DISPLAY van het MENU. Als dat NONE is, dan
                // het gehele menu verbergen voor de schermlezer. Als het NIET
                // NONE is, dan pas weer tonen voor de schermlezer:
                if (menu[0].getAttribute("style") === "display: none;") {
                    setAttrForClass("menu-fields", "style", "display: none;");
                } else {
                    setAttrForClass("menu-fields", "style", "display: block;");
                }
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, "showHideMenuFields: " + err.message);
    }
}

// --- [ "BLOCK" MET ALLE FUNCTIE AANROEPEN ] ---
function accessibilityChanges() {
    "use strict";
    // Alle FUNCTIE aanroepen in een bepaalde volgorde om de toegankelijkheid
    // van "EduArte" te verbeteren.
    getSetLabelForMostInputs("inpCheck");
    getSetLabelForMostInputs("inpText");
    getSetLabelForMostInputs("ui-multiselect");
    getSetLabelForInputs();
    getSetLabelForSelects();
    getSetLabelMenuItems("widget-menu-dropdown");
    hideHiddenInputs();
    setAttrForAlert("feedbackPanelERROR");
    setAttrForAlert("feedbackPanelINFO");
    setLabelForImages();
    // Verberg ELEMENTEN voor de schermlezer die anders ook niet zichtbaar zijn:
    setAttrForClass("hidden-fields", "aria-hidden", "true");
    showHideMenuFields();
    // Maak een aantal NAVIGATIEPUNTEN aan:
    setAttrForClass("layTitlebarTitle", "role", "navigation");
    setRoleLabelForClass("content", "navigation", "hoofdinhoud");
    setRoleLabelForClass("laySide", "navigation", "balk aan de rechterkant");
    // Maak de DIALOOGVENSTERS MODAL:
    setAttrForClass("wicket-modal", "aria-modal", "true");
    // AFBEELDINGEN die gebruikt worden voor KNOPPEN ook KNOPPEN maken:
    setAttrForClass("ui-icon-search", "role", "button");
    setRoleLabelForClass("ui-datepicker-trigger", "button", "datumkiezer");
    // Maak van bepaalde ELEMENTEN een KNOP:
    setAttrForClass("menu-vinden", "role", "button");
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
        debugConsoleMessage(1, 1, "domObserver: " + err.message);
    }
});

// --- [ MUTATIE OBSERVER STARTEN ] ---
// Daadwerkelijke start van de MUTATIE OBSERVER. CONTAINER en CONFIG worden aan
// het begin van dit script gedefinieerd:
domObserver.observe(OBSERVERCONTAINER, OBSERVERCONFIG);

// --- [ AANROEP FUNCTIES ] ---
// Als de pagina geladen wordt, vinden er geen mutaties plaats. Vandaar een
// eenmalige aanroep van de volgende functie om wijzigingen door te voeren:
window.onload = accessibilityChanges();

// --- [ EINDE SCRIPT ] ---
// Als de volgende melding in de CONSOLE wordt getoond, dan kan het script in
// ieder geval tot het eind foutloos uitgevoerd worden:
debugConsoleMessage(1, 0, "Einde script voor " + SCRIPTNAME + ".");
debugConsoleMessage(3, 0, "Uitvoering duurde:");

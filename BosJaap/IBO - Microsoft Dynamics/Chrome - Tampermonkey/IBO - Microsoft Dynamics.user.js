// ==UserScript==
// @name         IBO - Microsoft Dynamics
// @version      20191210-1026
// @author       PD, Babbage Automation, Roosendaal
// @namespace    https://www.babbage.com/
// @supportURL   https://www.babbage.com/contact/
// @description  De toegankelijkheid van "IBO - Microsoft Dynamics" verbeteren.
// @match        *://*.operations.dynamics.com/*
// @grant        none
// ==/UserScript==

// --- [ USERSCRIPT NOTITIES ] ---
// ==Developer==
// @browser      Google Chrome (Versie 78.0.3904.108) (x64)
// @extension    Tampermonkey (Versie 4.9)
// @screenreader NVDA (Versie 2019.2beta3)
// ==/Developer==

// ==Validator==
// @validator    JSLint (Edition 2019.09.17)
// @url          https://www.jslint.com/
// @help         https://www.jslint.com/help.html
// @settings     Assume: "a browser"
// @settings     Tolerate: "long lines"
// @global       Global variables: "performance"
// ==/Validator==

// --- [ VALIDATOR SETTINGS ] ---
// Automatisch instellen van bovenstaande @SETTINGS voor JSLINT:
/*jslint
    browser, long
*/
/*global
    performance
*/

// --- [ NOTITIES OMTRENT MS DYNAMICS ] ---
// Schakel de optie "Verbeterde tabbladreeks" onder "Voorkeuren" uit.

// URL's van beiden omgevingen worden afgevangen door een @MATCH:
// @acceptatie   *://oasen-accept.sandbox.operations.dynamics.com/*
// @productie    *://oasen-prod.operations.dynamics.com/*

// --- [ GLOBALE VARIABELEN ] ---
let DOMDEBUG = false;
let GLOBALDEBUG = false;
let OBSERVERDEBUG = false;
let PERFORMANCETIMER = false;
let SCRIPTNAME = "IBO - Microsoft Dynamics";

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

// --- [ DEBUG FUNCTIES ] ---
function debugConsoleMessage(level, indent, message) {
    "use strict";
    // Geeft een DEBUG MESSAGE al dan wel of niet weer. Dit is afhankelijk van
    // de VARIABELE GLOBALDEBUG:
    try {
        let ms;
        let newDate;
        let sec;
        let timer;
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
                    timer = performance.now();
                    window.console.log(message, timer - PERFORMANCETIMER, "ms.");
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

function createAccessibleDialog(className) {
    "use strict";
    // Verbeter de toegankelijkheid van diversen DIALOOGVENSTERS:
    try {
        let elementen = document.getElementsByClassName(className);
        let ele;
        let i = 0;
        let index = 0;
        let len;
        let localDebug = false;
        // Controleer of de VARIABELE een ELEMENT kent:
        if (elementen !== null && elementen !== undefined) {
            // Verkrijg het aantal ELEMENTEN:
            len = elementen.length;
            // Plaats altijd de focus op het laatste ELEMENT, dit omdat KLASSE
            // namen meerdere keren gebruikt worden en je wilt alleen de laatst
            // toegevoegde aanspreken:
            if (len > 1) {
                index = len - 1;
            }
            // Voeg alleen ROLE DIALOG toe als er helemaal geen ROL aanwezig is:
            if (!elementen[index].hasAttribute("role")) {
                elementen[index].setAttribute("role", "dialog");
            }
            // Stel ARIA-MODAL in op TRUE als de ROLE overeenkomt:
            if (elementen[index].getAttribute("role") === "dialog") {
                elementen[index].setAttribute("aria-modal", "true");
            }
            if (className === "segmentedEntry-flyoutContainer highlightActive") {
                // Verander de ROLE voor alleen dit DIALOOGVENSTER:
                if (elementen[index].getAttribute("role") === "listbox") {
                    elementen[index].setAttribute("role", "dialog");
                }
                // Verkrijg alle onderliggende ELEMENTEN:
                ele = elementen[index].getElementsByTagName("*");
                // Controleer of de VARIABELE een ELEMENT kent:
                if (ele !== null && ele !== undefined) {
                    // Verwijder het ATTRIBUUT ROLE val alle ELEMENTEN:
                    while (ele[i]) {
                        if (ele[i].hasAttribute("role")) {
                            ele[i].removeAttribute("role");
                        }
                        i += 1;
                    }
                }
            }
            // Rapporteer alle onderliggende ROLLEN van het DIALOOGVENSTER:
            if (localDebug) {
                reportRolesFromChildren(elementen[index]);
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, "createAccessibleDialog: " + err.message);
    }
}

function setFocusOnMenu(className) {
    "use strict";
    // Verbeter de toegankelijkheid van diversen MENU'S. Behalve het KEUZEMENU
    // in het scherm ALLE INKOOPORDERS onder het invoerveld FILTEREN:
    try {
        // Toegevoegd na troubleshooting van 20190930:
        let dn = "display: none;";
        let dni = "display: none !important;";
        let elementen = document.getElementsByClassName(className);
        let ele;
        let i = 0;
        // Controleer of de VARIABELE een ELEMENT kent:
        if (elementen !== null && elementen !== undefined) {
            // TIMEOUT tot het MENU daadwerkelijk in beeld staat:
            setTimeout(function () {
                while (elementen[i]) {
                    if (elementen[i].hasAttribute("style")) {
                        // Controleer of het MENU zichtbaar is, aangepast na 20190928 update:
                        if (elementen[i].getAttribute("style") !== dn && elementen[i].getAttribute("style") !== dni) {
                            // Verkrijg alle onderliggende ELEMENTEN:
                            ele = elementen[i].getElementsByTagName("button");
                            // Controleer of de VARIABELE een ELEMENT kent:
                            if (ele !== null && ele !== undefined) {
                                // Plaats de FOCUS alleen als er BUTTONS zijn
                                // in het MENU en alleen als de naam van de
                                // eerste BUTTON niet gelijk is aan INKOOPORDER:
                                if (ele[0].firstElementChild.innerHTML !== "Inkooporder") {
                                    ele[0].focus();
                                }
                            }
                        }
                    }
                    i += 1;
                }
            }, 2000);
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, "setFocusOnMenu: " + err.message);
    }
}

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

function accessibilityChanges() {
    "use strict";
    // Alle FUNCTIE aanroepen in een bepaalde volgorde om de toegankelijkheid
    // van "IBO - Microsoft Dynamics" te verbeteren.
    // Voeg een ACCESSKEY en LABEL toe aan de zoekbalk voor snel zoeken:
    setAccessKeyForId("NavigationSearchBox_searchBoxInput_input", "z");
    setLabelForId("NavigationSearchBox_searchBoxInput_input", "zoeken");
    // Verander ATTRIBUTEN van bepaalde ELEMENTEN:
    changeAttrForClassName("pivot-item", "tabindex", "0");
    changeAttrForClassName("lookupButton", "tabindex", "0");
    changeAttrForClassName("treeView hideCheckBox fill-width", "aria-atomic", "false");
    // Voeg een TABINDEX toe aan bepaalde ELEMENTEN:
    changeAttrForClassName("listItemCard", "tabindex", "0");
    // Verwijder de ROLLEN van ELEMENTEN om de navigatie met NVDA te herstellen:
    removeRoleFromClassName("panoramaContainer", "tablist");
    removeRoleFromClassName("panoramaItem", "tab");
    // Bewerk de DROPDOWN MENU'S voor betere toegankelijkheid:
    createAccessibleDialog("popupShadow sysPopup layout-root-scope lookup-popup active-form");
    createAccessibleDialog("ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all datepicker-popup binding-focusRegion");
    createAccessibleDialog("segmentedEntry-flyoutContainer highlightActive");
    // Plaats de FOCUS in specifieke KEUZEMENU'S:
    // setFocusOnMenu("sysPopup flyoutButton-flyOut layout-root-scope");
    // Geef headers in de werkbalk de juiste ROL voor snelle navigatie:
    setRoleLabelForClassName("group_header", "heading", "");
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

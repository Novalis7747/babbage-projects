// ==UserScript==
// @name         Aysist7
// @version      20200303-1430
// @author       PD, Babbage Automation, Roosendaal
// @namespace    https://www.babbage.com/
// @supportURL   https://www.babbage.com/contact/
// @description  De toegankelijkheid van "Aysist7" verbeteren.
// @match        *://kentalis.aysist7.nl/*
// @grant        none
// ==/UserScript==

// --- [ USERSCRIPT NOTITIES ] ---
// ==Developer==
// @browser      Google Chrome (Versie 78.0.3904.97) (x64)
// @extension    Tampermonkey (Versie 4.9)
// @screenreader NVDA (Versie 2019.2.1)
// ==/Developer==

// ==Validator==
// @validator    JSLint (Edition 2020.01.17)
// @url          https://www.jslint.com/
// @help         https://www.jslint.com/help.html
// @settings     Assume: "a browser"
// @settings     Tolerate: "long lines"
// @global       Global variables: "performance"
// ==/Validator==

// --- [ INSTELLINGEN VOOR JSLINT ] ---
// Automatisch instellen van bovenstaande @SETTINGS onder VALIDATOR:
/*jslint
    browser, long
*/
/*global
    performance
*/

// --- [ GLOBALE VARIABELEN ] ---
let DOMDEBUG = false;
let GLOBALDEBUG = false;
let OBSERVERDEBUG = false;
let PERFORMANCETIMER = false;
let SCRIPTNAME = "Aysist7";

// Controleer of de BROWSER PERFORMANCE.NOW ondersteunt:
if (performance.now()) {
    PERFORMANCETIMER = performance.now();
}

// --- [ MUTATIE OBSERVER CONTAINER EN CONFIGURATIE ] ---
let OBSERVERCONTAINER = document;
let OBSERVERCONFIG = {
    // attributes: true,
    // attributeFilter: ["class"],
    // attributeOldValue: true,
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

function reportRolesFromChildren(element) {
    "use strict";
    // Verkrijg alle ARIA-ROLLEN van alle KIND elementen en rapporteer deze
    // in een ARRAY naar de CONSOLE:
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

function setLabelGenericButtons(className, label, level) {
    "use strict";
    // Stel een ARIA-LABEL in voor een aantal generieke KNOPPEN:
    try {
        let elementen = document.getElementsByClassName(className);
        let i = 0;
        // Controleer of de VARIABELE een ELEMENT kent:
        if (elementen !== null && elementen !== undefined) {
            while (elementen[i]) {
                // Controleer de lengte van ARGUMENT LABEL:
                if (label.length > 0) {
                    if (level === 1) {
                        // Bestaat het LABEL al en is deze hetzelfde als wat je
                        // gaat toewijzen? Dan overslaan:
                        if (elementen[i].parentNode.getAttribute("aria-label") !== label) {
                            elementen[i].parentNode.setAttribute("aria-label", label);
                        }
                    }
                    if (level === 2) {
                        // Alleen een label plaatsen als het DOEL ELEMENT de ROLE BUTTON kent:
                        if (elementen[i].firstElementChild.firstElementChild.getAttribute("role") === "button") {
                            // Bestaat het LABEL al en is deze hetzelfde als wat je
                            // gaat toewijzen? Dan overslaan:
                            if (elementen[i].firstElementChild.firstElementChild.getAttribute("aria-label") !== label) {
                                elementen[i].firstElementChild.firstElementChild.setAttribute("aria-label", label);
                            }
                        }
                    }
                }
                i += 1;
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, "setLabelGenericButtons: " + err.message);
    }
}

function removeAttrFromClassName(className, attr) {
    "use strict";
    // Verwijder een ATTRIBUUT van een generiek ELEMENT:
    try {
        let elementen = document.getElementsByClassName(className);
        let i = 0;
        // Controleer of de VARIABELE een ELEMENT kent:
        if (elementen !== null && elementen !== undefined) {
            while (elementen[i]) {
                // Controleer de lengte van ARGUMENT ROLE:
                if (attr.length > 0) {
                    // Bestaat het ATTRIBUUT? Zo ja, dan pas verwijderen:
                    if (elementen[i].getAttribute(attr)) {
                        elementen[i].removeAttribute(attr);
                    }
                }
                i += 1;
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, "removeAttrFromClassName: " + err.message);
    }
}

function setCorrectMenuLabel(className) {
    "use strict";
    // Plaats een correct ARIA-LABEL op de KNOPPEN rechtsboven in het scherm:
    try {
        let elementen = document.getElementsByClassName(className);
        let i = 0;
        let newValue = "";
        // Controleer of de VARIABELE een ELEMENT kent:
        if (elementen !== null && elementen !== undefined) {
            while (elementen[i]) {
                // Controleer of er wel een TITLE ATTRIBUUT aanwezig is:
                if (elementen[i].getAttribute("title") !== null) {
                    // Verkrijg de TITEL en geef die aan VARIABELE NEWVALUE mee:
                    newValue = elementen[i].getAttribute("title");
                } else if (!elementen[i].getAttribute("title") && className === "userNameMenuItem") {
                    // Uitzondering voor het gebruikersmenu omdat dit geen TITLE kent:
                    newValue = "gebruikersmenu";
                }
                if (newValue.length > 0) {
                    newValue = newValue.toLowerCase();
                    // Bestaat het ATTRIBUUT al en is deze hetzelfde als wat je
                    // wenst te veranderen? Dan overslaan:
                    if (elementen[i].getAttribute("aria-label") !== newValue) {
                        elementen[i].setAttribute("aria-label", newValue);
                    }
                }
                i += 1;
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, "setCorrectMenuLabel: " + err.message);
    }
}

function setLabelForCertainButtons(className, attr, value, label) {
    "use strict";
    // Functie specifiek geschreven voor de REFRESH BUTTON vanwege diens
    // afwijkende code ten opzichte van andere KNOPPEN:
    try {
        let elementen = document.getElementsByClassName(className);
        let i = 0;
        // Controleer of de VARIABELE een ELEMENT kent:
        if (elementen !== null && elementen !== undefined) {
            while (elementen[i]) {
                // Controleer de lengte van het ARGUMENT ATTR:
                if (attr.length > 0) {
                    // Controleer of je het juiste ELEMENT hebt en plaats dan pas het LABEL:
                    if (elementen[i].getAttribute(attr) === value) {
                        // Bestaat het LABEL al? Dan dit ELEMENT overslaan:
                        if (elementen[i].getAttribute("aria-label") !== label) {
                            elementen[i].setAttribute("aria-label", label);
                        }
                    }
                }
                i += 1;
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, "setLabelForCertainButtons: " + err.message);
    }
}

function setAttrForClassName(className, attr, value) {
    "use strict";
    // Verander of plaats een ATTRIBUUT van generieke ELEMENTEN:
    try {
        let elementen = document.getElementsByClassName(className);
        let i = 0;
        // Controleer of de VARIABELE een ELEMENT kent:
        if (elementen !== null && elementen !== undefined) {
            while (elementen[i]) {
                // Controleer de lengte van beiden ARGUMENTEN:
                if (attr.length > 0 && value.length > 0) {
                    // Bestaat het ATTRIBUUT al en is deze hetzelfde als wat je
                    // wenst te veranderen? Dan pas veranderen:
                    if (elementen[i].getAttribute(attr) !== value) {
                        elementen[i].setAttribute(attr, value);
                    }
                }
                i += 1;
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, "setAttrForClassName: " + err.message);
    }
}

function repairWorkAgreementHoursTable() {
    "use strict";
    // Maak het mogelijk om door de TABEL bij DIENSTVERBANDEN te navigeren met de TABEL NAVIGATIE van NVDA:
    try {
        let ele;
        let elementen = document.getElementsByClassName("workagreementsHoursGrid");
        let i = 0;
        let tri = 0;
        // Controleer of de VARIABELE een ELEMENT kent:
        if (elementen !== null && elementen !== undefined) {
            while (elementen[i]) {
                // Zoek binnen de ELEMENTEN NODELIST naar alle TR:
                ele = elementen[i].getElementsByTagName("TR");
                // Controleer de LENGTE van ELE omdat er DRIE TR worden verwacht:
                if (ele !== null && ele !== undefined && ele.length === 3) {
                    // ELE[0] en ELE[1] moeten een ARIA-HIDDEN meekrijgen en de rest niet:
                    while (ele[tri]) {
                        if (ele[tri].getAttribute("aria-hidden") !== "true") {
                            ele[tri].setAttribute("aria-hidden", "true");
                        }
                        // Stop na de TWEEDE TR in de ELEMENTEN NODELIST:
                        if (tri === 1) {
                            break;
                        }
                        tri += 1;
                    }
                    // Reset de teller voor de eventueel volgende NODELIST:
                    tri = 0;
                }
                i += 1;
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, "repairWorkAgreementHoursTable: " + err.message);
    }
}

function repairSelectionMenuTable() {
    "use strict";
    // Maak het mogelijk om een keus te maken met het toetsenbord tussen ROOSTERPLAN en MEDEWERKERPORTAAL:
    try {
        let ele;
        let elementen = document.getElementsByClassName("dijitPopup dijitMenuPopup"); // dijit dijitReset dijitMenuTable ay-bar-menu dijitMenu
        let i = 0;
        let tri = 0;
        // Controleer of de VARIABELE een ELEMENT kent:
        if (elementen !== null && elementen !== undefined) {
            while (elementen[i]) {
                // Zoek binnen de ELEMENTEN NODELIST naar alle TR:
                ele = elementen[i].getElementsByTagName("TR");
                // Controleer of ELE niet null of undefined is:
                if (ele !== null && ele !== undefined) {
                    window.console.log(ele);
                    // Verberg het TR ELEMENT voor NVDA zodat de onderliggende LINK overblijft.
                    // Daardoor kun je een menuitem met een ENTER activeren:
                    while (ele[tri]) {
                        if (ele[tri].getAttribute("role") === "menuitem") {
                            ele[tri].setAttribute("role", "presentation");
                        }
                        tri += 1;
                    }
                    // Reset de teller voor de eventueel volgende NODELIST:
                    tri = 0;
                }
                i += 1;
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, "repairSelectionMenuTable: " + err.message);
    }
}

function setLabelForListBox(className) {
    "use strict";
    // Stel een ARIA-LABEL in voor alle KEUZEMENU'S opgemaakt als een TABEL:
    try {
        let elementen = document.getElementsByClassName(className);
        let i = 0;
        let label;
        // Controleer of de VARIABELE een ELEMENT kent:
        if (elementen !== null && elementen !== undefined) {
            while (elementen[i]) {
                // Controleer eerst of je het LABEL hebt:
                if (elementen[i].previousElementSibling !== null) {
                    if (elementen[i].previousElementSibling.tagName === "LABEL") {
                        // Verkrijg de inhoud van het LABEL en converteer het naar kleine letters:
                        label = elementen[i].previousElementSibling.innerHTML.toLowerCase();
                        // Bestaat het ATTRIBUUT al en is deze hetzelfde als wat je
                        // wenst in te stellen? Dan pas veranderen:
                        if (elementen[i].getAttribute("aria-label") !== label) {
                            elementen[i].setAttribute("aria-label", label);
                        }
                    }
                } else if (elementen[i].parentNode !== null && elementen[i].parentNode.previousElementSibling !== null && elementen[i].parentNode.previousElementSibling.firstElementChild !== null) {
                    if (elementen[i].parentNode.previousElementSibling.firstElementChild.tagName === "LABEL") {
                        // Verkrijg de inhoud van het LABEL en converteer het naar kleine letters:
                        label = elementen[i].parentNode.previousElementSibling.firstElementChild.innerHTML.toLowerCase();
                        // Bestaat het ATTRIBUUT al en is deze hetzelfde als wat je
                        // wenst in te stellen? Dan pas veranderen:
                        if (elementen[i].getAttribute("aria-label") !== label) {
                            elementen[i].setAttribute("aria-label", label);
                        }
                    }
                }
                i += 1;
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, "setLabelForListBox: " + err.message);
    }
}

function setLabelForComboBox(className) {
    "use strict";
    // Stel een ARIA-LABEL in voor alle KEUZEMENU'S opgemaakt als een COMBOBOX:
    try {
        let elementen = document.getElementsByClassName(className);
        let i = 0;
        let label;
        // Controleer of de VARIABELE een ELEMENT kent:
        if (elementen !== null && elementen !== undefined) {
            while (elementen[i]) {
                // Controleer eerst of er een ELEMENT op de plaats zit:
                if (elementen[i].parentNode !== null && elementen[i].parentNode.parentNode !== null && elementen[i].parentNode.parentNode.firstElementChild !== null) {
                    // Controleer daarna of je het LABEL hebt:
                    if (elementen[i].parentNode.parentNode.firstElementChild.tagName === "LABEL") {
                        // Verkrijg de inhoud van het LABEL en converteer het naar kleine letters:
                        label = elementen[i].parentNode.parentNode.firstElementChild.innerHTML.toLowerCase();
                    }
                }
                if (elementen[i].parentNode !== null && elementen[i].parentNode.parentNode !== null && elementen[i].parentNode.parentNode.previousElementSibling !== null && elementen[i].parentNode.parentNode.previousElementSibling.firstElementChild !== null) {
                    // Controleer daarna of je het LABEL hebt:
                    if (elementen[i].parentNode.parentNode.firstElementChild !== null && elementen[i].parentNode.parentNode.firstElementChild.tagName === "LABEL") {
                        // Verkrijg de inhoud van het LABEL en converteer het naar kleine letters:
                        label = elementen[i].parentNode.parentNode.firstElementChild.innerHTML.toLowerCase();
                    } else if (elementen[i].parentNode.parentNode.previousElementSibling.firstElementChild.tagName === "LABEL") {
                        // Verkrijg de inhoud van het LABEL en converteer het naar kleine letters:
                        label = elementen[i].parentNode.parentNode.previousElementSibling.firstElementChild.innerHTML.toLowerCase();
                    }
                }
                // Uitzondering voor invoervelden in het DIALOOGVENSTER verlof aanvragen:
                if (elementen[i].parentNode !== null && elementen[i].parentNode.previousElementSibling !== null && elementen[i].parentNode.previousElementSibling.firstElementChild !== null) {
                    // Niet zo nette oplossing om te filteren:
                    if (window.location.href === "https://kentalis.aysist7.nl/#employee,hours") {
                        // Controleer daarna of je het LABEL hebt:
                        if (elementen[i].parentNode.previousElementSibling.firstElementChild.tagName === "LABEL") {
                            // Verkrijg de inhoud van het LABEL en converteer het naar kleine letters:
                            label = elementen[i].parentNode.previousElementSibling.firstElementChild.innerHTML.toLowerCase();
                        }
                    }
                }
                // Controleer eerst of er een ELEMENT op de plaats zit:
                if (elementen[i].previousElementSibling !== null) {
                    // Controleer daarna of je het LABEL hebt:
                    if (elementen[i].previousElementSibling.tagName === "LABEL") {
                        // Verkrijg de inhoud van het LABEL en converteer het naar kleine letters:
                        label = elementen[i].previousElementSibling.innerHTML.trim().toLowerCase();
                    }
                }
                // Bestaat het ATTRIBUUT al en is deze hetzelfde als wat je
                // wenst in te stellen? Dan pas veranderen:
                if (elementen[i].getAttribute("aria-label") !== label) {
                    elementen[i].setAttribute("aria-label", label);
                }
                // Uitzondering voor invoervelden binnen DIALOOGVENSTERS:
                if (elementen[i].childNodes !== null && elementen[i].childNodes !== undefined) {
                    if (elementen[i].childNodes.length >= 3) {
                        if (elementen[i].childNodes[2].firstElementChild !== null) {
                            // Bestaat het ATTRIBUUT al en is deze hetzelfde als wat je
                            // wenst in te stellen? Dan pas veranderen:
                            if (elementen[i].childNodes[2].firstElementChild.getAttribute("aria-label") !== label) {
                                elementen[i].childNodes[2].firstElementChild.setAttribute("aria-label", label);
                            }
                        }
                    }
                }
                i += 1;
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, "setLabelForComboBox: " + err.message);
    }
}

function setRoleLabelForId(id, role, label) {
    "use strict";
    // Stel een ARIA-ROLE en ARIA-LABEL in voor een uniek ELEMENT:
    try {
        let element = document.getElementById(id);
        // Controleer of de VARIABELE een ELEMENT kent:
        if (element !== null && element !== undefined) {
            // Controleer de lengte van ARGUMENT LABEL:
            if (label.length > 0) {
                // Bestaat het LABEL al en is deze hetzelfde als wat je gaat
                // toewijzen? Dan overslaan:
                if (element.getAttribute("aria-label") !== label) {
                    element.setAttribute("aria-label", label);
                }
            }
            // Controleer de lengte van ARGUMENT ROLE:
            if (role.length > 0) {
                // Bestaat de ROLE al en is deze hetzelfde als wat je gaat
                // toewijzen? Dan overslaan:
                if (element.getAttribute("role") !== role) {
                    element.setAttribute("role", role);
                }
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, "setRoleLabelForId: " + err.message);
    }
}

function setAttrForId(id, attr, value) {
    "use strict";
    // Verander een ATTRIBUUT van een uniek ELEMENT:
    try {
        let element = document.getElementById(id);
        // Controleer of de VARIABELE een ELEMENT kent:
        if (element !== null && element !== undefined) {
            // Controleer de lengte van beiden ARGUMENTEN:
            if (attr.length > 0 && value.length > 0) {
                // Bestaat het ATTRIBUUT al en is deze hetzelfde als wat je
                // wenst te veranderen? Dan pas veranderen:
                if (!element.hasAttribute(attr)) {
                    element.setAttribute(attr, value);
                }
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, "setAttrForId: " + err.message);
    }
}

// --- [ "BLOCK" MET ALLE FUNCTIE AANROEPEN ] ---
function accessibilityChanges() {
    "use strict";
    // Alle FUNCTIE aanroepen in een bepaalde volgorde om de toegankelijkheid van "Aysist7" te verbeteren.
    // Geef niet gelabelde KNOPPEN een duidelijk label:
    removeAttrFromClassName("dijitReset dijitStretch dijitButtonContents", "aria-labelledby");
    setLabelGenericButtons("dijitReset dijitInline dijitIcon icon-chevron-left", "vorige", 1);
    setLabelGenericButtons("dijitReset dijitInline dijitIcon icon-chevron-right", "volgende", 1);
    setLabelGenericButtons("fullScreenButton", "scherm maximaliseren", 2);
    setLabelGenericButtons("showHideHeaderButton", "verbergen of tonen van tabbladen", 2);
    setLabelForCertainButtons("narrowButton", "data-dojo-attach-point", "refreshButton", "vernieuwen");
    setLabelForCertainButtons("remove", "data-dojo-attach-point", "removeFilter", "verwijderen");
    setLabelForCertainButtons("remove", "data-dojo-attach-point", "removeEmployee", "verwijderen");
    setLabelForCertainButtons("costCenterFilterBarWidget__addFilterButton", "data-dojo-attach-point", "addFilterButton", "toevoegen");
    setRoleLabelForClassName("narrowButton pull-right addRowButton", "", "toevoegen");
    setRoleLabelForClassName("icon-plus periods-icon", "button", "");
    setRoleLabelForClassName("icon-code-fork periods-icon", "button", "");
    // Geef niet gelabelde keuzemenu's een duidelijk LABEL:
    setLabelForListBox("dijitSelect");
    setLabelForComboBox("dijitComboBox");
    // Verwijder de TABINDEX van de de volgende ELEMENTEN:
    setAttrForClassName("userSettingsMenuItem", "tabindex", "0");
    setAttrForClassName("userNameMenuItem", "tabindex", "0");
    setAttrForClassName("helpMenuItem", "tabindex", "0");
    setAttrForClassName("logoutMenuItem", "tabindex", "0");
    // Plaats de juiste LABELS op de MENUITEMS rechtsboven in het scherm:
    setCorrectMenuLabel("userSettingsMenuItem");
    setCorrectMenuLabel("userNameMenuItem");
    setCorrectMenuLabel("helpMenuItem");
    setCorrectMenuLabel("logoutMenuItem");
    // Zorg ervoor dat BERICHTEN en ERRORS worden uitgesproken:
    setRoleLabelForId("messagebox_text", "alert", "");
    setAttrForId("messagebox_text", "aria-live", "assertive");
    // Maak agenda items binnen de medewerkersportaal NAVIGEERBAAR:
    setRoleLabelForClassName("dojoxCalendarEvent dojoxCalendarVertical", "navigation", "");
    // Maak de TABEL van WORKAGREEMENTHOURS toegankelijk op het TABBLAD DIENSTVERBANDEN:
    repairWorkAgreementHoursTable();
    // Maak het selecteren van ROOSTERPLAN of MEDEWERKERPORTAAL mogelijk met de ENTER-toets in plaats van een muisklik:
    repairSelectionMenuTable();
}

// --- [ MUTATIE OBSERVER TOEVOEGEN ] ---
let domObserver = new MutationObserver(function (mutations) {
    "use strict";
    // FUNCTIES die aangeroepen moeten worden nadat er een mutatie binnen de CONTAINER heeft plaatsgevonden:
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

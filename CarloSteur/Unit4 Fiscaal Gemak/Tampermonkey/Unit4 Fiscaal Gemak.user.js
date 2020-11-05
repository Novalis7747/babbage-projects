// ==UserScript==
// @name         Unit4 Fiscaal Gemak
// @version      20200911-1323 Beta
// @namespace    https://www.babbage.com/
// @description  De toegankelijkheid van "Fiscaal Gemak" verbeteren
// @author       PD, Babbage Automation, Roosendaal
// @match        *://*.fiscaalgemak.nl/*
// @grant        none
// ==/UserScript==

// --- [ USERSCRIPT NOTITIES ] ---
// ==Developer==
// @browser      Firefox (Versie 68.12.0esr (x64))
// @extension    TamperMonkey (Versie 4.11.6117)
// ==/Developer==

// ==Validator==
// @validator    JSLint (Edition 2020.09.09)
// @url          https://jslint.com/
// @help         https://www.jslint.com/help.html
// @settings     Assume: "a browser"
// @settings     Tolerate: "long lines"
// ==/Validator==

// --- [ VALIDATOR SETTINGS ] ---
// Automatisch instellen van bovenstaande @SETTINGS voor JSLINT:
/*jslint
    browser, long
*/

// --- [ GLOBALE VARIABELEN ] ---
var checkPath = window.location.pathname;
var firstRun = 1;
var localDebug = false;
var scriptName = "Fiscaal Gemak";

// --- [ MUTATIE OBSERVER CONTAINER EN CONFIGURATIE ] ---
var container = document.body;
var config = {
    attributes: true,
    childList: true,
    characterData: true
};

// --- [ DEBUG FUNCTIE ] ---
function debugConsoleMessage(level, message) {
    // Geeft een DEBUG MESSAGE al dan wel of niet weer.
    // Dit is afhankelijk van de VARIABELE localDebug:
    try {
        if (localDebug) {
            // LEVEL 1 geeft alleen de boodschap weer:
            if (level === 1) {
                window.console.log("   ", message);
            }
            // LEVEL 2 geeft de boodschap inclusief het huidig
            // aantal seconden en milliseconden weer:
            if (level === 2) {
                var newDate = new Date();
                var sec = newDate.getSeconds();
                var ms = newDate.getMilliseconds();
                window.console.log(message, sec, ms, "ss:ms.");
            }
        }
    } catch (err) {
        window.console.log("Babbage debugConsoleMessage: " + err.message);
    }
}

// --- [ AANPASSINGEN SPECIFIEK VOOR FISCAAL GEMAK ] ---
function changeCssColorByClassName(level, classname, color) {
    // Verandert de KLEUR van ELEMENTEN met een bepaalde KLASSE. "Level 1" is
    // het ELEMENT zelf, "Level 2" is de achtergrondkleur:
    "use strict";
    try {
        var elements = document.getElementsByClassName(classname);
        var i = 0;
        while (elements[i]) {
            if (level === 1) {
                if (elements[i].style.color !== color) {
                    elements[i].style.color = color;
                }
            }
            if (level === 2) {
                if (elements[i].style.background !== color) {
                    elements[i].style.background = color;
                }
                if (classname === "inError") {
                    // Plaats een BORDER om de vindbaarheid te vergroten:
                    if (elements[i].style.border !== "2px solid black") {
                        elements[i].style.border = "2px solid black";
                    }
                }
            }
            i += 1;
        }
    } catch (err) {
        debugConsoleMessage(1, "changeCssColorByClassName: " + err.message);
    }
}

function changeCssColorByTagName(tagname, color) {
    // Verandert de KLEUR van opgegeven ELEMENTEN:
    "use strict";
    try {
        var elements = document.getElementsByTagName(tagname);
        var i = 0;
        while (elements[i]) {
            if (elements[i].style.color !== color) {
                elements[i].style.color = color;
            }
            i += 1;
        }
    } catch (err) {
        debugConsoleMessage(1, "changeCssColorByTagName: " + err.message);
    }
}

function changeCssColorBody(color) {
    // Verandert de KLEUR van het BODY ELEMENT:
    "use strict";
    try {
        if (document.body.style.color !== color) {
            document.body.style.color = color;
        }
    } catch (err) {
        debugConsoleMessage(1, "changeCssColorBody: " + err.message);
    }
}

function setFocusOnElementId(id, milliseconds) {
    // Plaats de FOCUS op een ELEMENT met een bepaald ID na een opgegeven
    // aantal MILLISECONDEN:
    "use strict";
    try {
        var element = document.getElementById(id);
        if (element !== null && element !== undefined) {
            setTimeout(function () {
                element.focus();
            }, milliseconds);
        }
    } catch (err) {
        debugConsoleMessage(1, "setFocusOnElementId: " + err.message);
    }
}

function setRoleAndLabelForId(id, role, label) {
    // Stel een ARIA-ROL en ARIA-LABEL in voor een specifiek ELEMENT:
    "use strict";
    try {
        var element = document.getElementById(id);
        if (element !== null && element !== undefined) {
            if (role.length > 0) {
                if (element.getAttribute("role") !== role) {
                    element.setAttribute("role", role);
                }
            }
            if (label.length > 0) {
                if (element.getAttribute("aria-label") !== label) {
                    element.setAttribute("aria-label", label);
                }
            }
        }
    } catch (err) {
        debugConsoleMessage(1, "setRoleAndLabelForId: " + err.message);
    }
}

function setAttributeForId(id, attribute, value) {
    // Stel een ATTRIBUUT in voor een ELEMENT met een bepaald ID:
    "use strict";
    try {
        var element = document.getElementById(id);
        if (element !== null && element !== undefined) {
            if (element.hasAttribute(attribute)) {
                if (element.getAttribute(attribute) !== value) {
                    element.setAttribute(attribute, value);
                }
            } else {
                element.setAttribute(attribute, value);
            }
        }
    } catch (err) {
        debugConsoleMessage(1, "setAttributeForId: " + err.message);
    }
}

function setAttributeForClassName(classname, attribute, value) {
    // Stel een ATTRIBUUT in voor een ELEMENT met een bepaalde KLASSE:
    "use strict";
    try {
        var elements = document.getElementsByClassName(classname);
        var i = 0;
        while (elements[i]) {
            if (elements[i].hasAttribute(attribute)) {
                if (elements[i].getAttribute(attribute) !== value) {
                    elements[i].setAttribute(attribute, value);
                }
            } else {
                elements[i].setAttribute(attribute, value);
            }
            i += 1;
        }
    } catch (err) {
        debugConsoleMessage(1, "setRoleForClassName: " + err.message);
    }
}

function getSetLabelForCheckboxFront(classname) {
    // Zoekt de LABELS en plaatst deze op de juiste plaats in de DOM zodat de
    // checkboxes voorzien worden van de correcte LABELS. Dit geldt voor
    // checkboxes die voor de tekst staan:
    "use strict";
    try {
        var elements = document.getElementsByClassName(classname);
        var i = 0;
        var label;
        var type = null;
        while (elements[i]) {
            type = elements[i].parentNode.nextElementSibling;
            if (type !== null && type.nodeName === "LABEL") {
                label = type.textContent;
                if (label.length > 0) {
                    if (elements[i].previousElementSibling.getAttribute("aria-label") !== label) {
                        elements[i].previousElementSibling.setAttribute("aria-label", label);
                    }
                }
            } else {
                type = elements[i].parentNode.previousElementSibling;
                if (type !== null && type.firstChild.nodeName === "LABEL") {
                    label = type.firstChild.textContent;
                    if (label.length > 0) {
                        if (elements[i].previousElementSibling.getAttribute("aria-label") !== label) {
                            elements[i].previousElementSibling.setAttribute("aria-label", label);
                        }
                    }
                }
            }
            i += 1;
        }
    } catch (err) {
        debugConsoleMessage(1, "getSetLabelForCheckboxFront: " + err.message);
    }
}

function getSetLabelForCheckboxBack(classname) {
    // Zoekt de LABELS en plaatst deze op de juiste plaats in de DOM zodat de
    // checkboxes voorzien worden van de correcte LABELS. Dit geldt voor
    // checkboxes die achter de tekst staan:
    "use strict";
    try {
        var elements = document.getElementsByClassName(classname);
        var i = 0;
        var label;
        var type = null;
        while (elements[i]) {
            label = elements[i].textContent;
            type = elements[i].nextElementSibling.nextElementSibling;
            if (type !== null && type.firstChild.nodeName === "INPUT") {
                if (label.length > 0) {
                    if (type.firstChild.getAttribute("aria-label") !== label) {
                        type.firstChild.setAttribute("aria-label", label);
                    }
                }
            } else {
                type = elements[i].nextElementSibling.firstChild;
                if (type !== null && type.nodeName === "INPUT") {
                    if (label.length > 0) {
                        if (type.getAttribute("aria-label") !== label) {
                            type.setAttribute("aria-label", label);
                        }
                    }
                }
            }
            i += 1;
        }
    } catch (err) {
        debugConsoleMessage(1, "getSetLabelForCheckboxBack: " + err.message);
    }
}

function getSetLabelForCheckboxBackVennoot(classname) {
    // Zoekt de LABELS en plaatst deze op de juiste plaats in de DOM zodat de
    // checkboxes voorzien worden van de correcte LABELS. Dit geldt voor
    // checkboxes die achter de tekst staan en in het bijzonder voor de
    // pagina's VENNOOTSCHAPSBELASTING:
    "use strict";
    try {
        var elements = document.getElementsByClassName(classname);
        var i = 0;
        var label;
        var type = null;
        while (elements[i]) {
            type = elements[i].firstChild;
            if (type !== null && type.nodeName === "LABEL") {
                label = elements[i].firstChild.textContent;
                type = elements[i].firstChild.nextSibling.firstChild;
                if (type !== null && type.nodeName === "INPUT") {
                    if (label.length > 0) {
                        if (type.getAttribute("aria-label") !== label) {
                            type.setAttribute("aria-label", label);
                        }
                    }
                }
            }
            i += 1;
        }
    } catch (err) {
        debugConsoleMessage(1, "getSetLabelForCheckboxBackVennoot: " + err.message);
    }
}

function getSetLabelForBooleanTextFront(classname) {
    // Zoekt de LABELS en plaatst deze op de juiste plaats in de DOM zodat de
    // radio buttons voorzien worden van de correcte LABELS. Dit geldt voor
    // LABELS die voor de RADIO BUTTONS staan:
    "use strict";
    try {
        var elements = document.getElementsByClassName(classname);
        var i = 0;
        var label;
        var firstType = null;
        var secondType = null;
        while (elements[i]) {
            firstType = elements[i].nextElementSibling;
            if (firstType !== null && firstType.nodeName === "LABEL") {
                label = firstType.textContent;
                secondType = elements[i].parentNode.parentNode.previousElementSibling;
                if (secondType !== null && secondType.nodeName === "LABEL") {
                    label = label + ", " + secondType.textContent;
                    if (elements[i].getAttribute("aria-label") !== label) {
                        elements[i].setAttribute("aria-label", label);
                    }
                }
            }
            i += 1;
        }
    } catch (err) {
        debugConsoleMessage(1, "getSetLabelForBooleanTextFront: " + err.message);
    }
}

function getSetLabelForInputTextFront(classname) {
    // Zoekt de LABELS en plaatst deze op de juiste plaats in de DOM zodat de
    // invoervelden en radio buttons voorzien worden van de correcte LABELS. Dit
    // geldt voor labels die voor de invoervelden of radio buttons staan:
    "use strict";
    try {
        var elements = document.getElementsByClassName(classname);
        var i = 0;
        var label;
        var type = null;
        while (elements[i]) {
            type = elements[i].parentNode.previousElementSibling;
            if (type !== null && type.nodeName === "LABEL") {
                label = type.textContent;
                if (label.length === 0) {
                    type = elements[i].parentNode.parentNode.previousElementSibling.firstChild;
                    if (type !== null && type.nodeName === "LABEL") {
                        label = type.textContent;
                        if (label.length > 0) {
                            if (elements[i].getAttribute("aria-label") !== label) {
                                elements[i].setAttribute("aria-label", label);
                            }
                        }
                    }
                } else {
                    if (label.length > 0) {
                        if (elements[i].getAttribute("aria-label") !== label) {
                            elements[i].setAttribute("aria-label", label);
                        }
                    }
                }
            } else {
                type = elements[i].previousElementSibling;
                if (type !== null && type.nodeName === "LABEL") {
                    label = type.textContent;
                    if (label.length > 0) {
                        if (elements[i].getAttribute("aria-label") !== label) {
                            elements[i].setAttribute("aria-label", label);
                        }
                    }
                } else if (elements[i].nodeName === "INPUT") {
                    type = elements[i].parentNode.parentNode.previousElementSibling;
                    if (type !== null && type.nodeName === "LABEL") {
                        label = type.textContent;
                        if (label.length > 0) {
                            if (elements[i].getAttribute("aria-label") !== label) {
                                elements[i].setAttribute("aria-label", label);
                            }
                        }
                    }
                }
            }
            i += 1;
        }
    } catch (err) {
        debugConsoleMessage(1, "getSetLabelForInputTextFront: " + err.message);
    }
}

function getSetLabelForInputAmountFront(classname) {
    // Zoekt de LABELS en plaatst deze op de juiste plaats in de DOM zodat
    // specifieke invoervelden voorzien worden van de correcte LABELS. Dit geldt
    // voor labels die voor de invoervelden staan:
    "use strict";
    try {
        var elements = document.getElementsByClassName(classname);
        var i = 0;
        var label;
        var type = null;
        while (elements[i]) {
            type = elements[i].parentNode.parentNode.parentNode.previousElementSibling;
            if (type !== null && type.nodeName === "LABEL") {
                label = type.textContent;
                if (label.length > 0) {
                    if (elements[i].getAttribute("aria-label") !== label) {
                        elements[i].setAttribute("aria-label", label);
                    }
                }
            }
            i += 1;
        }
    } catch (err) {
        debugConsoleMessage(1, "getSetLabelForInputAmountFront: " + err.message);
    }
}

function getSetLabelForDropdownMenuNewDeclaration(classname) {
    // Zoekt de LABELS en plaatst deze op de juiste plaats in de DOM zodat
    // specifieke keuzemenus voorzien worden van de correcte LABELS. Dit geldt
    // voor labels die voor de keuzemenus staan:
    "use strict";
    try {
        var elements = document.getElementsByClassName(classname);
        var i = 0;
        var label;
        var type = null;
        while (elements[i]) {
            type = elements[i].previousElementSibling;
            if (type !== null && type.nodeName === "SPAN") {
                label = type.textContent;
                if (label.length > 0) {
                    if (elements[i].getAttribute("aria-label") !== label) {
                        elements[i].setAttribute("aria-label", label);
                    }
                }
            }
            i += 1;
        }
    } catch (err) {
        debugConsoleMessage(1, "getSetLabelForDropdownMenuNewDeclaration: " + err.message);
    }
}

function getSetLabelForCalculatorButtonBack(classname) {
    // Zoekt de LABELS en plaatst deze op de juiste plaats in de DOM zodat de
    // calculator knoppen voorzien worden van de correcte LABELS. Dit geldt
    // voor de calculators die achter de tekst staan:
    "use strict";
    try {
        var elements = document.getElementsByClassName(classname);
        var i = 0;
        var label;
        var type = null;
        while (elements[i]) {
            type = elements[i].parentNode.previousElementSibling;
            if (type !== null && type.nodeName === "LABEL") {
                label = type.textContent;
                if (label.length > 0) {
                    if (elements[i].getAttribute("aria-label") !== label) {
                        elements[i].setAttribute("aria-label", label);
                    }
                }
            }
            i += 1;
        }
    } catch (err) {
        debugConsoleMessage(1, "getSetLabelForCalculatorButtonBack: " + err.message);
    }
}

function getSetLabelForHelpButtonFront(classname) {
    // Zoekt de LABELS en plaatst deze op de juiste plaats in de DOM zodat de
    // help knoppen voorzien worden van de correcte LABELS. Dit geldt voor de
    // vraagtekens die voor de tekst staan:
    "use strict";
    try {
        var elements = document.getElementsByClassName(classname);
        var i = 0;
        var label;
        var type = null;
        while (elements[i]) {
            type = elements[i].previousElementSibling.previousElementSibling;
            if (type !== null && (type.nodeName === "LABEL" || type.nodeName === "H3")) {
                label = type.textContent;
                if (label.length > 0) {
                    if (elements[i].getAttribute("aria-label") !== label) {
                        elements[i].setAttribute("aria-label", label);
                    }
                }
            } else {
                type = elements[i].previousElementSibling;
                if (type !== null && type.nodeName === "LABEL") {
                    label = type.textContent;
                    if (label.length > 0) {
                        if (elements[i].getAttribute("aria-label") !== label) {
                            elements[i].setAttribute("aria-label", label);
                        }
                    }
                }
            }
            i += 1;
        }
    } catch (err) {
        debugConsoleMessage(1, "getSetLabelForHelpButtonFront: " + err.message);
    }
}

function changeSpanButtonsBehaviour(classname, tag) {
    // Zoek de KNOPPEN die als een ander SPAN TAG zijn gedefinieerd en plaats
    // daarin een BUTTON:
    "use strict";
    try {
        var elements = document.getElementsByClassName(classname);
        var i = 0;
        while (elements[i]) {
            if (elements[i].nodeName === tag) {
                elements[i].innerHTML = "<button aria-label=\"Verwijderen\">#</button>";
            }
            i += 1;
        }
    } catch (err) {
        debugConsoleMessage(1, "changeSpanButtonsBehaviour: " + err.message);
    }
}

function setLabelForDisabledInputs(tagname) {
    // INVOERVELDEN die uitgeschakeld zijn voorzien van een correcte label:
    "use strict";
    try {
        var elements = document.getElementsByTagName(tagname);
        var i = 0;
        var label;
        var type = null;
        while (elements[i]) {
            if (elements[i].getAttribute("disabled") === "disabled") {
                type = elements[i].previousElementSibling;
                if (type !== null && type.nodeName === "LABEL") {
                    label = type.textContent;
                    if (label.length > 0) {
                        if (elements[i].getAttribute("aria-label") !== label) {
                            elements[i].setAttribute("aria-label", label);
                        }
                    }
                }
            }
            i += 1;
        }
    } catch (err) {
        debugConsoleMessage(1, "setLabelForDisabledInputs: " + err.message);
    }
}

// --- [ LIJST MET FUNCTIE AANROEPEN ] ---
function accessibilityChanges() {
    "use strict";
    // Kleur van TEKST en LINKS zwart maken:
    changeCssColorBody("black");
    changeCssColorByTagName("a", "black");
    // Kleuren van ELEMENTEN aanpassen, gebaseerd op KLASSE:
    changeCssColorByClassName(1, "ng-isolate-scope", "black");
    changeCssColorByClassName(1, "alert-info", "black");
    changeCssColorByClassName(1, "btn-default", "black");
    changeCssColorByClassName(1, "btn-primary", "white");
    changeCssColorByClassName(1, "uppercase-head", "black");
    changeCssColorByClassName(1, "list-group-title", "black");
    changeCssColorByClassName(1, "list-group-item-title", "black");
    changeCssColorByClassName(1, "error-summary", "white");
    changeCssColorByClassName(1, "inError", "white");
    // Achtergrondkleuren van ELEMENTEN aanpassen, gebaseerd op KLASSE:
    changeCssColorByClassName(2, "error-summary", "red");
    changeCssColorByClassName(2, "inError", "red");
    changeCssColorByClassName(2, "alert-info", "white");
    changeCssColorByClassName(2, "is-coloured", "white");
    changeCssColorByClassName(2, "pane-app-header", "white");
    // ROL en LABEL instellen voor ELEMENTEN met een ID:
    setRoleAndLabelForId("linkNext", "button", "volgende pagina");
    setRoleAndLabelForId("linkPrevious", "button", "vorige pagina");
    setRoleAndLabelForId("powerTip", "alert", "");
    // ATTRIBUUT toevoegen aan een ELEMENT met een bepaald ID:
    setAttributeForId("powerTip", "aria-live", "polite");
    // ATTRIBUUT toevoegen aan een ELEMENT met een bepaalde KLASSE:
    setAttributeForClassName("btn", "role", "button");
    setAttributeForClassName("boxComment", "role", "alert");
    setAttributeForClassName("boxComment", "aria-live", "polite");
    setAttributeForClassName("error-summary", "role", "alert");
    setAttributeForClassName("error-summary", "aria-live", "polite");
    setAttributeForClassName("icon-calculate", "role", "button");
    setAttributeForClassName("group", "role", "navigation");
    setAttributeForClassName("delete-sequencerow-button", "role", "button");
    setAttributeForClassName("delete-sequencerow-button", "aria-label", "rijen verwijderen");
    setAttributeForClassName("icon-help", "role", "button");
    setAttributeForClassName("visible boxItem", "role", "navigation");
    setAttributeForClassName("icon-declaration-reference", "role", "button");
    setAttributeForClassName("icon-declaration-reference", "aria-label", "gegevens voorgaand jaar");
    // Specifieke aanpassingen voor alle TABELLEN:
    setAttributeForClassName("dc-type-text col-visible", "role", "columnheader");
    setAttributeForClassName("dc-type-amount col-visible", "role", "columnheader");
    setAttributeForClassName("dc-type-number col-visible", "role", "columnheader");
    setAttributeForClassName("dc-type-checkbox col-visible", "role", "columnheader");
    setAttributeForClassName("dc-type-select col-visible", "role", "columnheader");
    setAttributeForClassName("dc-type-date col-visible", "role", "columnheader");
    setAttributeForClassName("dc-type-button col-visible", "role", "columnheader");
    // De CHECKBOXES binnen een aangifte voorzien van de juiste LABELS:
    getSetLabelForCheckboxFront("label-checkbox");
    getSetLabelForCheckboxBack("boxItem-label");
    getSetLabelForCheckboxBackVennoot("boxTupleItem");
    // De INVOERVELDEN van een LABEL voorzien:
    getSetLabelForInputTextFront("dc-type-textarea");
    getSetLabelForInputTextFront("has-currency boxItemField");
    getSetLabelForInputTextFront("dc-answer-type-calculated readonly");
    getSetLabelForInputTextFront("dc-type-amount");
    getSetLabelForInputTextFront("dc-type-number");
    getSetLabelForInputTextFront("dc-type-text");
    getSetLabelForInputTextFront("dc-type-select");
    getSetLabelForInputTextFront("dc-type-daymonth");
    getSetLabelForInputTextFront("dc-type-date");
    getSetLabelForInputTextFront("dc-type-numberdigits");
    getSetLabelForInputAmountFront("dc-type-amount");
    getSetLabelForInputAmountFront("dc-type-text");
    // De JA-NEE KEUZERONDJES van een label voorzien:
    getSetLabelForBooleanTextFront("dc-type-boolean");
    // De KEUZEMENUS van een LABEL voorzien:
    getSetLabelForDropdownMenuNewDeclaration("filter-select");
    // De calculator KNOPPEN van een LABEL voorzien:
    getSetLabelForCalculatorButtonBack("dc-type-twocolumns icon-calculate showSpecification");
    // De help KNOPPEN van een LABEL voorzien:
    getSetLabelForHelpButtonFront("icon-help openComment");
    // De verwijder KNOPPEN van aandeelhouders toegankelijk maken:
    changeSpanButtonsBehaviour("btn btn-func-delete delete-party", "SPAN");
    // Plaats een label op uitgeschakelde invoervelden:
    setLabelForDisabledInputs("INPUT");
    // Verberg de altijd aanwezige HELP MIJ knop voor de schermlezer, op verzoek van de klant:
    setAttributeForId("walkme-player", "aria-hidden", "true");
}

// --- [ HOOFD FUNCTIE ] ---
setInterval(function () {
    // Controleer met een INTERVAL of de URL is gewijzigd of dat het script
    // voor de eerste keer uitgevoerd wordt. Beiden gevallen roepen de FUNCTIE
    // accessibilityChanges aan:
    "use strict";
    debugConsoleMessage(2, "Begin van het " + scriptName + " script.");
    if (checkPath !== window.location.pathname) {
        debugConsoleMessage(1, "Geen PATH overeenkomst. Script opnieuw uitvoeren.");
        accessibilityChanges();
        checkPath = window.location.pathname;
    } else if (firstRun === 1) {
        debugConsoleMessage(1, "Nieuwe uitvoering " + scriptName + " script.");
        accessibilityChanges();
        firstRun = 0;
    }
    debugConsoleMessage(2, "Einde van het " + scriptName + " script.");
}, 7000);

// --- [ MUTATIE OBSERVER TOEVOEGEN ] ---
var domObserver = new MutationObserver(function (mutation) {
    // Functies die uitgevoerd moeten worden nadat er een mutatie binnen de
    // container heeft plaatsgevonden. Eerst de functies declareren en laten
    // uitvoeren en daarna pas de OBSERVER starten:
    "use strict";
    try {
        var i = 0;
        var mutNode;
        while (mutation[i]) {
            if (mutation[i].addedNodes.length > 0) {
                debugConsoleMessage(1, mutation[i].addedNodes);
                mutNode = mutation[i].addedNodes[0];
                if (mutNode.classList.contains("fancybox-wrap")) {
                    mutNode.setAttribute("aria-label", "dialoogvenster");
                    // Korte timer om er zeker van te zijn dat het element op
                    // het scherm getekend is:
                    setFocusOnElementId("specification-close-button", 400);
                    setFocusOnElementId("btnConfirmWarningDialog", 400);
                }
                accessibilityChanges();
            }
            i = i + 1;
        }
    } catch (err) {
        debugConsoleMessage(1, "domObserver: " + err.message);
    }
});

// --- [ MUTATIE OBSERVER STARTEN ] ---
// Daadwerkelijke start van de MUTATIE OBSERVER. CONTAINER en CONFIG worden aan
// het begin van dit script gedefinieerd:
domObserver.observe(container, config);

// --- [ SNELTOETS TOEVOEGEN ] ---
// Voer het script handmatig uit na het invoeren van: CTRL + ALT + J:
document.addEventListener("keydown", function (keyEvent) {
    "use strict";
    if (keyEvent.ctrlKey && keyEvent.altKey && keyEvent.code === "KeyJ") {
        accessibilityChanges();
        debugConsoleMessage(1, "Handmatige uitvoering " + scriptName + " script.");
    }
});

// ==UserScript==
// @name         Dwars
// @version      20190409-1234 (Beta)
// @author       PD, Babbage Automation, Roosendaal
// @namespace    https://www.babbage.com/
// @description  De toegankelijkheid van "Dwars" verbeteren
// @include      *://dwars.kpnnl.local/*
// @grant        none
// ==/UserScript==

// --- [ USERSCRIPT NOTITIES ] ---
// ==Developer==
// @browser      Mozilla Firefox (Versie 60.6.1esr) (x64)
// @extension    Tampermonkey (Versie 4.9.5921)
// ==/Developer==

// ==Validator==
// @validator    JSLint (Edition 2019.01.31)
// @url          https://www.jslint.com/
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
var localDebug = false;
var scriptName = "Dwars";

// --- [ DEBUG FUNCTIE ] ---
function debugConsoleMessage(level, message) {
    // Geeft een DEBUG MESSAGE al dan wel of niet weer.
    // Dit is afhankelijk van de VARIABELE localDebug:
    try {
        if (localDebug) {
            // LEVEL 1 geeft alleen de boodschap weer:
            if (level === 1) {
                window.console.log("       ", message);
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

// --- [ FUNCTIES ] ---
function setRoleLabelForId(id, role, label) {
    // Stelt een ROLE en LABEL in voor een uniek ELEMENT:
    try {
        var element = document.getElementById(id);
        // Controleer of de VARIABELE een ELEMENT kent:
        if (element !== null) {
            // Controleer de lengte van ARGUMENT ROLE:
            if (role.length > 0) {
                // Bestaat de ROLE al en is deze hetzelfde
                // als wat je gaat toewijzen? Dan overslaan:
                if (element.getAttribute("role") !== role) {
                    element.setAttribute("role", role);
                }
            }
            // Controleer de lengte van ARGUMENT LABEL:
            if (label.length > 0) {
                // Bestaat het LABEL al en is deze hetzelfde
                // als wat je gaat toewijzen? Dan overslaan:
                if (element.getAttribute("aria-label") !== label) {
                    element.setAttribute("aria-label", label);
                }
            }
        }
    } catch (err) {
        debugConsoleMessage(1, "setRoleLabelForId: " + err.message);
    }
}

function setRoleLabelForClassName(className, role, label) {
    // Stelt een ROLE en LABEL in voor een generiek ELEMENT:
    try {
        var element = document.getElementsByClassName(className);
        var i = 0;
        // Controleer of de VARIABELE een ELEMENT kent:
        if (element !== null) {
            while (element[i]) {
                // Controleer de lengte van ARGUMENT ROLE:
                if (role.length > 0) {
                    // Bestaat de ROLE al en is deze hetzelfde
                    // als wat je gaat toewijzen? Dan overslaan:
                    if (element[i].getAttribute("role") !== role) {
                        element[i].setAttribute("role", role);
                    }
                }
                // Controleer de lengte van ARGUMENT LABEL:
                if (label.length > 0) {
                    // Bestaat het LABEL al en is deze hetzelfde
                    // als wat je gaat toewijzen? Dan overslaan:
                    if (element[i].getAttribute("aria-label") !== label) {
                        element[i].setAttribute("aria-label", label);
                    }
                }
                i += 1;
            }
        }
    } catch (err) {
        debugConsoleMessage(1, "setRoleLabelForClassName: " + err.message);
    }
}

function setLabelOnInputFont11(tagName, className) {
    // Deze functie voorziet INPUT ELEMENTEN of KEUZEMENU's van een label:
    try {
        // Zoek eerst specifiek naar INPUT of SELECT ELEMENTEN:
        var element = document.getElementsByTagName(tagName);
        var i = 0;
        var label = "";
        // Controleer of de VARIABELE een ELEMENT kent:
        if (element !== null) {
            while (element[i]) {
                // Filter op KLASSENAAM:
                if (element[i].className === className) {
                    // Probeer het bijbehorende LABEL te achterhalen:
                    label = element[i].parentNode.parentNode.firstChild.textContent;
                    if (label !== null && label.length > 0) {
                        element[i].setAttribute("aria-label", label);
                        debugConsoleMessage(1, label);
                    }
                }
                i += 1;
            }
        }
    } catch (err) {
        debugConsoleMessage(1, "setLabelOnInputFont11: " + err.message);
    }
}

function setLabelOnInputFont10(tagName, className) {
    // Deze functie voorziet alternatieve KEUZEMENU's van een label:
    try {
        // Zoek eerst specifiek naar SELECT ELEMENTEN:
        var element = document.getElementsByTagName(tagName);
        var i = 0;
        var label = "";
        // Controleer of de VARIABELE een ELEMENT kent:
        if (element !== null) {
            while (element[i]) {
                // Filter op KLASSENAAM:
                if (element[i].className === className) {
                    // Probeer het bijbehorende LABEL te achterhalen:
                    label = element[i].parentNode.firstChild.nodeValue;
                    if (label !== null && label.length > 0) {
                        element[i].setAttribute("aria-label", label);
                        debugConsoleMessage(1, label);
                    }
                }
                i += 1;
            }
        }
    } catch (err) {
        debugConsoleMessage(1, "setLabelOnInputFont10: " + err.message);
    }
}

function setTitleAltRoleForMap() {
    // Deze functie geeft AFBEELDINGEN met een kleur uit de kaartweergave een
    // uitgebreidere niet elegant hard gecodeerde TITLE en ALT attribuut mee:
    try {
        var addition = "";
        var description = "";
        var element = document.getElementsByTagName("img");
        var i = 0;
        var source = "";
        // Controleer of de VARIABELE een ELEMENT kent:
        if (element !== null) {
            while (element[i]) {
                source = element[i].getAttribute("src");
                if (source === "/dwars/geel11.png" || source === "/dwars/rood11.png" || source === "/dwars/geel11t2.png" || source === "/dwars/rood11t2.png") {
                    // Verkrijg de huidige TITLE en daarmee de plaatsnaam:
                    description = element[i].getAttribute("title");
                    // Achterhaal de kleur van de plaatsnaam middels de SRC:
                    addition = source.slice(7, 11);
                    if (description !== null && addition.length > 0) {
                        description += " " + addition;
                        element[i].setAttribute("title", description);
                        element[i].setAttribute("alt", description);
                        element[i].setAttribute("role", "navigation");
                    }
                }
                i += 1;
            }
        }
    } catch (err) {
        debugConsoleMessage(1, "setTitleAltRoleForMap: " + err.message);
    }
}

function accessibilityChanges() {
    // Alle FUNCTIE aanroepen in een bepaalde volgorde om de toegankelijkheid
    // van "Dwars" te verbeteren. Maak de kaartweergave toegankelijk door alleen
    // de geel en rood gemarkeerde gebieden aan te pakken:
    setTitleAltRoleForMap();
    // Voorzie elementen met een KLASSE van een ROLE of LABEL:
    setRoleLabelForClassName("box_page_head", "heading", "");
    // Voorzie INVOERVELDEN en KEUZELIJSTEN van een label:
    setLabelOnInputFont11("input", "fnt_11_normal");
    setLabelOnInputFont11("select", "fnt_11_normal");
    setLabelOnInputFont10("select", "fnt_10_normal");
}

// --- [ HANDMATIGE FUNCTIE AANROEP ] ---
// Voer het script handmatig uit na het ingeven van de toetsen: CTRL + ALT + B:
document.addEventListener("keydown", function (keyEvent) {
    if (keyEvent.ctrlKey && keyEvent.altKey && keyEvent.code === "KeyB") {
        accessibilityChanges();
        debugConsoleMessage(1, "Handmatige uitvoering " + scriptName + " script.");
    }
});

// --- [ AUTOMATISCHE FUNCTIE AANROEP ] ---
// Voer het script automatisch uit na het laden van de DOM:
window.onload = function () {
    setTimeout(function () {
        accessibilityChanges();
        debugConsoleMessage(2, "Automatische uitvoering " + scriptName + " script:");
    }, 600);
};

// --- [ EINDE SCRIPT ] ---
// Als de volgende melding in de CONSOLE wordt getoond, dan kan het
// script in ieder geval tot het eind foutloos uitgevoerd worden:
debugConsoleMessage(2, "Einde script voor " + scriptName + ":");

// ==UserScript==
// @name         Siebel
// @version      20200109-1402 (Beta)
// @author       PD, Babbage Automation, Roosendaal
// @namespace    https://www.babbage.com/
// @description  De toegankelijkheid van "Siebel" verbeteren
// @include      *://fiber-cm-prod-siebel.gen.local/*
// @grant        none
// ==/UserScript==

// --- [ USERSCRIPT NOTITIES ] ---
// ==Developer==
// @browser      Internet Explorer (Versie 11.590.17134.0) (x86)
// @info         Documentmodus 7 of 11; afhankelijk van de pagina
// @extension    Trixie/0.1 (Beta-Release 0.1.3.0) (x86)
// ==/Developer==

// ==Validator==
// @validator    JSLint (Edition 2019.12.11)
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
var extraDebug = false;
var scriptName = "Siebel";

// --- [ MUTATIE OBSERVER CONTAINER EN CONFIGURATIE ] ---
var container = document;
var config = {
    childList: true,
    subtree: true
};

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
function setRoleLabel(className, role, label) {
    // Stel een ARIA-ROL en ARIA-LABEL in voor een generiek ELEMENT:
    try {
        var element = document.getElementsByClassName(className);
        var i = 0;
        // Controleer of de VARIABELE tenminste een ELEMENT kent:
        if (element !== null && element !== undefined) {
            while (element[i]) {
                // Controleer de lengte van ARGUMENT ROLE:
                if (role.length > 0) {
                    // Bestaat de ROLE al en is deze hetzelfde als wat je gaat
                    // toewijzen? Dan overslaan:
                    if (element[i].getAttribute("role") !== role) {
                        element[i].setAttribute("role", role);
                    }
                }
                // Controleer de lengte van ARGUMENT LABEL:
                if (label.length > 0) {
                    // Bestaat het LABEL al en is deze hetzelfde als wat je
                    // gaat toewijzen? Dan overslaan:
                    if (element[i].getAttribute("aria-label") !== label) {
                        element[i].setAttribute("aria-label", label);
                    }
                }
                i += 1;
            }
        }
    } catch (err) {
        debugConsoleMessage(1, "setRoleLabel: " + err.message);
    }
}

function setRoleLabelAlt(className, role, label) {
    // Stel een ARIA-ROL en ARIA-LABEL in voor een specifiek ELEMENT:
    try {
        var element = document.getElementsByClassName(className);
        var i = 0;
        // Controleer of de VARIABELE tenminste een ELEMENT kent:
        if (element !== null && element !== undefined) {
            while (element[i]) {
                // Controleer de lengte van ARGUMENT ROLE:
                if (role.length > 0) {
                    // Bestaat de ROLE al en is deze hetzelfde als wat je gaat
                    // toewijzen? Dan overslaan:
                    if (element[i].firstElementChild.getAttribute("role") !== role) {
                        element[i].firstElementChild.setAttribute("role", role);
                    }
                }
                // Controleer de lengte van ARGUMENT LABEL:
                if (label.length > 0) {
                    // Bestaat het LABEL al en is deze hetzelfde als wat je
                    // gaat toewijzen? Dan overslaan:
                    if (element[i].firstElementChild.getAttribute("aria-label") !== label) {
                        element[i].firstElementChild.setAttribute("aria-label", label);
                    }
                }
                i += 1;
            }
        }
    } catch (err) {
        debugConsoleMessage(1, "setRoleLabelAlt: " + err.message);
    }
}

function properTreePruning(className) {
    // Verwijder de ARIA-HIDDEN attributen en alle rollen van alle kinderen
    // van een generiek ELEMENT. Deze FUNCTIE is specifiek geschreven voor
    // de boomstructuur die gebruikt wordt voor het toekennen van kortingen:
    try {
        var element = document.getElementsByClassName(className);
        var elementen;
        var i = 0;
        // Controleer of de VARIABELE tenminste een ELEMENT kent:
        if (element !== null && element !== undefined) {
            // Verkrijg alle KIND ELEMENTEN:
            elementen = element[0].getElementsByTagName("*");
            // Controleer of de VARIABELE een ELEMENT kent:
            if (elementen !== null && elementen !== undefined) {
                while (elementen[i]) {
                    // Verwijder het ATTRIBUUT ARIA-HIDDEN indien aanwezig:
                    if (elementen[i].hasAttribute("aria-hidden")) {
                        elementen[i].removeAttribute("aria-hidden");
                    }
                    // Verwijder het ATTRIBUUT ROLE indien aanwezig:
                    if (elementen[i].hasAttribute("role")) {
                        elementen[i].removeAttribute("role");
                    }
                    i += 1;
                }
            }
        }
    } catch (err) {
        debugConsoleMessage(1, "properTreePruning: " + err.message);
    }
}

function setTitleForTableHeaders() {
    // Voorzie alle TH ELEMENTEN van de juiste TITLE zodat de schermlezer dit
    // aan de eindgebruiker kan rapporteren:
    try {
        var element = document.getElementsByTagName("th");
        var title;
        var i = 0;
        // Controleer of de VARIABELE tenminste een ELEMENT kent:
        if (element !== null && element !== undefined) {
            while (element[i]) {
                // Verkrijg de TEXTCONTENT van het juiste ELEMENT:
                title = element[i].getElementsByTagName("div")[0].textContent;
                // Controleer of het verkrijgen van de TEXTCONTENT is gelukt:
                if (title !== undefined && title.length > 0) {
                    // Bestaat de TITLE al en is deze hetzelfde als wat je gaat
                    // toewijzen? Dan overslaan:
                    if (element[i].getAttribute("title") !== title) {
                        element[i].setAttribute("title", title);
                    }
                }
                i += 1;
            }
        }
    } catch (err) {
        debugConsoleMessage(1, "setTitleForTableHeaders: " + err.message);
    }
}

function accessibilityChanges() {
    // Alle FUNCTIE aanroepen in een bepaalde volgorde om de toegankelijkheid
    // van "Siebel" te verbeteren.
    // Knoppen onderaan bepaalde tabellen voorzien van de juiste ROLE en LABEL:
    setRoleLabel("ui-icon ui-icon-seek-first", "button", "vorige set records");
    setRoleLabel("ui-icon ui-icon-seek-prev", "button", "vorig record");
    setRoleLabel("ui-icon ui-icon-seek-next", "button", "volgend record");
    setRoleLabel("ui-icon ui-icon-seek-end", "button", "volgende set records");
    // Delen van het scherm voorzien van HEADERS voor eenvoudigere navigatie:
    setRoleLabel("siebui-applet-header", "heading", "");
    setRoleLabel("siebui-applet-title", "heading", "");
    // Verwijder ARIA-HIDDEN attributen en alle rollen van de boomstructuur
    // om uit coulance kortingen aan een order toe te voegen:
    properTreePruning("siebui-catalogview-col1-cell2");
    setRoleLabel("jstree-icon", "button", "in- en uitklappen list item");
    // Voorzie alle TH ELEMENTEN van de juiste titels:
    setTitleForTableHeaders();
    // Poging om KNOP in een CEL toegankelijk te maken:
    setRoleLabelAlt("tree-wrap tree-wrap-ltr", "button", "in- en uitklappen");
}

// --- [ MUTATIE OBSERVER TOEVOEGEN ] ---
var domObserver = new MutationObserver(function (mutations) {
    // FUNCTIES die aangeroepen moeten worden nadat er een mutatie binnen de
    // CONTAINER heeft plaatsgevonden:
    try {
        var i = 0;
        if (extraDebug) {
            // Extra debug informatie die afzonderlijk aan of uit te zetten is.
            // Voor test doeleinden en gaat ten koste van de performance:
            while (mutations[i]) {
                debugConsoleMessage(1, mutations[i]);
                accessibilityChanges();
                i += 1;
            }
        } else {
            // Geen test nodig en alleen triggeren op DOM veranderingen:
            accessibilityChanges();
        }
    } catch (err) {
        debugConsoleMessage(1, "domObserver: " + err.message);
    }
});

// --- [ MUTATIE OBSERVER STARTEN ] ---
// Daadwerkelijke start van de MUTATIE OBSERVER. CONTAINER en CONFIG worden aan
// het begin van dit script gedefinieerd:
domObserver.observe(container, config);

// --- [ EINDE SCRIPT ] ---
// Als de volgende melding in de CONSOLE wordt getoond, dan kan het script in
// ieder geval tot het eind foutloos uitgevoerd worden:
debugConsoleMessage(2, "Einde script voor " + scriptName + ":");

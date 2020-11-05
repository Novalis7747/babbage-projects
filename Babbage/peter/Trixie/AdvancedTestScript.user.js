// ==UserScript==
// @name         Google - Test.
// @namespace    http://www.babbage.com/
// @description  Test script voor Google.
// @include      *://*.google.*
// @version      20200313-1126
// @grant        none
// ==/UserScript==

// --- [ USERSCRIPT NOTITIES ] ---
// ==Developer==
// @browser      Internet Explorer (Versie 11.657.18362.0 (x86))
// @extension    Trixie (Versie 0.1.3.0 (Beta - x86))
// ==/Developer==

// ==Validator==
// @validator    JSLint (Edition 2020.01.17)
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
var localDebug = true;
var scriptName = "Google";

// --- [ MUTATIE OBSERVER CONTAINER EN CONFIGURATIE ] ---
var container = document;
var config = {
    attributes: true,
    childList: true,
    subtree: true
    // attributeFilter: ["class"]
};

// --- [ DEBUG FUNCTIE ] ---
function debugConsoleMessage(level, message) {
    // Geeft een DEBUG MESSAGE al dan wel of niet weer. Dit is afhankelijk van
    // de VARIABELE localDebug:
    "use strict";
    try {
        var ms;
        var newDate;
        var sec;
        // Alleen een melding geven als LOCALDEBUG waar is:
        if (localDebug) {
            // LEVEL 1 geeft alleen de boodschap weer:
            if (level === 1) {
                window.console.log("       ", message);
            }
            // LEVEL 2 geeft de boodschap inclusief het aantal milliseconden
            // weer:
            if (level === 2) {
                newDate = new Date();
                sec = newDate.getSeconds();
                ms = newDate.getMilliseconds();
                window.console.log(message, sec, ms, "ss:ms.");
            }
        }
    } catch (err) {
        window.console.log("Babbage debugConsoleMessage: " + err.message);
    }
}

// --- [ CONTROLEER OF JE TE MAKEN HEBT MET DE IE11-MODUS ] ---
if (window.MSInputMethodContext && document.documentMode) {
    debugConsoleMessage(1, "Internet Explorer 11");
} else {
    debugConsoleMessage(1, "Geen Internet Explorer 11");
}

// --- [ FUNCTIES ] ---
function setRoleLabelForClassName(className, role, label) {
    // Stel een ARIA-ROL en ARIA-LABEL in voor een specifiek ELEMENT:
    "use strict";
    try {
        var element = document.getElementsByClassName(className);
        var i = 0;
        // Controleer of de VARIABELE een ELEMENT kent:
        if (element !== null) {
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
        debugConsoleMessage(1, "setRoleLabelForClassName: " + err.message);
    }
}

function onMutation(mutation) {
    "use strict";
    var i = 0;
    // DEBUG loop om de toegevoegde NODES te inspecteren:
    while (mutation.addedNodes[i]) {
        window.console.log(mutation.addedNodes[i]);
        i += 1;
    }
    // Stel alle rollen en labels in voor ELEMENTEN met een bepaalde KLASSE:
    // Startpagina van Google:
    setRoleLabelForClassName("gLFyf gsfi", "", "Test");
}

// --- [ MUTATIE OBSERVER TOEVOEGEN ] ---
var domObserver = new MutationObserver(function (mutations) {
    // FUNCTIES die aangeroepen moeten worden nadat er een mutatie binnen de
    // CONTAINER heeft plaatsgevonden:
    "use strict";
    try {
        var i = 0;
        while (mutations[i]) {
            onMutation(mutations[i]);
            i += 1;
        }
    } catch (err) {
        debugConsoleMessage(1, "domObserver: " + err.message);
    }
});

// --- [ MUTATIE OBSERVER STARTEN ] ---
// Daadwerkelijke start van de MUTATIE OBSERVER. CONTAINER en CONFIG worden aan
// het begin van dit script gedefinieerd:
domObserver.observe(container, config);

// --- [ FUNCTIE AANROEP NA LADEN DOM ] ---
window.onload = function () {
    "use strict";
    debugConsoleMessage(2, "DOM geladen voor " + scriptName + ":");
};

// --- [ TESTEN VAN UITVOERING SCRIPT ] ---
// Eenvoudige test of het script geladen is op de juiste pagina. Druk op de
// LINKER CTRL + LINKER ALT + B om te testen of het script wel geladen is:
window.onkeydown = function (key) {
    if (key.ctrlKey && key.altKey && key.keyCode === 66) {
        window.alert("Script " + scriptName + " is actief.");
    }
};

// --- [ EINDE SCRIPT ] ---
// Als de volgende melding in de CONSOLE wordt getoond, dan kan het script in
// ieder geval tot het eind foutloos uitgevoerd worden:
debugConsoleMessage(2, "Einde script voor " + scriptName + ":");

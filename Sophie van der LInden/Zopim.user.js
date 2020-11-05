// ==UserScript==
// @name         Zopim
// @namespace    https://www.babbage.com/
// @supportURL   https://www.babbage.com/contact/
// @version      20191217-1540
// @description  Toegankelijkheid van de webapplicatie "Zopim" verbeteren
// @author       PD, Babbage Automation, Roosendaal
// @match        *://dashboard.zopim.com/*
// @grant        none
// ==/UserScript==

// --- [ USERSCRIPT NOTITIES ] ---
// ==Developer==
// @browser      Firefox ESR (Versie 68.3.0 (x64))
// @extension    TamperMonkey (Versie 4.9.6095)
// @notes        Gebaseerd op het script van "Basenet"
// ==/Developer==

// ==Validator==
// @validator    JSLint (Edition 2019.12.11)
// @url          https://www.jslint.com/
// @help         https://www.jslint.com/help.html
// @settings     Assume: "a browser"
// ==/Validator==

// --- [ VALIDATOR SETTINGS ] ---
// Automatisch instellen van bovenstaande @SETTINGS voor JSLINT:
/*jslint
    browser
*/

// --- [ GLOBALE VARIABELEN ] ---
let localDebug = false;
let mutationDebug = false;
let scriptName = "Zopim";

// --- [ MUTATIE OBSERVER CONTAINER EN CONFIGURATIE ] ---
let container = document;
let config = {
    attributes: true,
    childList: true,
    subtree: true,
    attributeFilter: ["class"]
};

// --- [ DEBUG FUNCTIE ] ---
function debugConsoleMessage(level, message) {
    "use strict";
    // Geeft een DEBUG MESSAGE al dan wel of niet weer.
    // Dit is afhankelijk van de VARIABELE localDebug:
    try {
        let newDate;
        let sec;
        let ms;
        // Alleen een melding geven als LOCALDEBUG waar is:
        if (localDebug) {
            // LEVEL 1 geeft alleen de boodschap weer:
            if (level === 1) {
                window.console.log("       ", message);
            }
            // LEVEL 2 geeft de boodschap inclusief
            // het aantal milliseconden weer:
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

// --- [ FUNCTIES ] ---
function setRoleLabelForClassName(className, role, label) {
    "use strict";
    // Stel een ARIA-ROL en ARIA-LABEL in voor een specifiek ELEMENT:
    try {
        let element = document.getElementsByClassName(className);
        let i = 0;
        // Controleer of de VARIABELE een ELEMENT kent:
        if (element !== null) {
            while (element[i]) {
                // Controleer de lengte van ARGUMENT ROLE:
                if (role.length > 0) {
                    // Bestaat de ROLE al en is deze hetzelfde als
                    // wat je gaat toewijzen? Dan overslaan:
                    if (element[i].getAttribute("role") !== role) {
                        element[i].setAttribute("role", role);
                    }
                }
                // Controleer de lengte van ARGUMENT LABEL:
                if (label.length > 0) {
                    // Bestaat het LABEL al en is deze hetzelfde als
                    // wat je gaat toewijzen? Dan overslaan:
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

function setLabelForChatButtons(className, label) {
    "use strict";
    // Stel een ARIA-LABEL in voor specifieke KNOPPEN in de chatvensters:
    try {
        let element = document.getElementsByClassName(className);
        let ele;
        let getParentName;
        let i = 0;
        // Controleer of de VARIABELE een ELEMENT kent:
        if (element !== null) {
            while (element[i]) {
                // Controleer de lengte van ARGUMENT LABEL:
                if (label.length > 0) {
                    getParentName = element[i].parentNode.parentNode.nodeName;
                    // Weet zeker dat je het LABEL op een KNOP plaatst:
                    if (getParentName === "BUTTON") {
                        ele = element[i].parentNode.parentNode;
                        // Bestaat het LABEL al en is deze hetzelfde als
                        // wat je gaat toewijzen? Dan overslaan:
                        if (ele.getAttribute("aria-label") !== label) {
                            ele.setAttribute("aria-label", label);
                        }
                    }
                }
                i += 1;
            }
        }
    } catch (err) {
        debugConsoleMessage(1, "setLabelForChatButtons: " + err.message);
    }
}

function onMutation() {
    "use strict";
    // Stel alle rollen en labels in voor ELEMENTEN met een specifieke KLASSE:
    // Navigatiemenu aan de linkerkant van het scherm:
    setRoleLabelForClassName(
        "react_meshim_dashboard_components_navBar_OldServeButton",
        "navigation",
        "aanvragen"
    );
    setRoleLabelForClassName(
        "react_meshim_dashboard_components_navBar_navMenu_StatusIndicator",
        "combobox",
        "status"
    );
    // Eenvoudig navigeerbaar maken van de openstaande chatvensters:
    setRoleLabelForClassName(
        "jx_ui_html_div name ellipsis active",
        "navigation",
        "chatvenster"
    );
    // Knoppen binnen de chat van een LABEL voorzien:
    setLabelForChatButtons(
        "meshim_dashboard_components_widgets_Sprite btn_round_minimize_dark",
        "minimaliseren chatvenster"
    );
    setLabelForChatButtons(
        "meshim_dashboard_components_widgets_Sprite btn_round_dismiss_dark",
        "sluiten chatvenster"
    );
}

function onMutationDebug(mutation) {
    "use strict";
    let i = 0;
    // DEBUG loop om de toegevoegde NODES te inspecteren:
    while (mutation.addedNodes[i]) {
        window.console.log(mutation.addedNodes[i]);
        i += 1;
    }
}

// --- [ MUTATIE OBSERVER TOEVOEGEN ] ---
let domObserver = new MutationObserver(function (mutations) {
    "use strict";
    // FUNCTIES die aangeroepen moeten worden nadat er een
    // mutatie binnen de CONTAINER heeft plaatsgevonden:
    try {
        let i = 0;
        while (mutations[i]) {
            onMutation();
            if (mutationDebug) {
                onMutationDebug(mutations[i]);
            }
            i += 1;
        }
    } catch (err) {
        debugConsoleMessage(1, "domObserver: " + err.message);
    }
});

// --- [ MUTATIE OBSERVER STARTEN ] ---
// Daadwerkelijke start van de MUTATIE OBSERVER.
// CONTAINER en CONFIG worden aan het begin van
// dit script gedefinieerd:
domObserver.observe(container, config);

// --- [ EINDE SCRIPT ] ---
// Als de volgende melding in de CONSOLE wordt
// getoond, dan kan het script in ieder geval
// tot het eind foutloos uitgevoerd worden:
if (localDebug) {
    debugConsoleMessage(2, "Einde script voor " + scriptName + ":");
}

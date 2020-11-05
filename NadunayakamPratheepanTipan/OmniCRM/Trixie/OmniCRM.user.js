// ==UserScript==
// @name         OmniCRM
// @version      20190430-1452 (Beta)
// @author       PD, Babbage Automation, Roosendaal
// @namespace    https://www.babbage.com/
// @description  De toegankelijkheid van "OmniCRM" verbeteren
// @include      *://omnicrm.kpnnl.local/*
// @grant        none
// ==/UserScript==

// --- [ USERSCRIPT NOTITIES ] ---
// ==Developer==
// @browser      Internet Explorer (Versie 11.590.17134.0) (x86)
// @info         Documentmodus 11
// @extension    Trixie/0.1 (Beta-Release 0.1.3.0) (x86)
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
var extraDebug = false;
var scriptName = "OmniCRM";

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
function setRoleLabelForClassName(className, role, label) {
    // Stel een ARIA-ROL en ARIA-LABEL in voor een generiek ELEMENT:
    try {
        var i = 0;
        var element = document.getElementsByClassName(className);
        // Controleer of de VARIABELE een ELEMENT kent:
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
        debugConsoleMessage(1, "setRoleLabelForClassName: " + err.message);
    }
}

function getSetLabelForClassName(className, role) {
    // Verkrijg de tekst van ATTRIBUUT UIB-TOOLTIP en stel daarmee
    // een ARIA-ROL en ARIA-LABEL in voor een specifiek ELEMENT:
    try {
        var i = 0;
        var element = document.getElementsByClassName(className);
        var description = "";
        // Controleer of de VARIABELE een ELEMENT kent:
        if (element !== null && element !== undefined) {
            while (element[i]) {
                // Controleer of er een ATTRIBUUT UIB-TOOLTIP aanwezig is:
                if (element[i].hasAttribute("uib-tooltip")) {
                    description = element[i].getAttribute("uib-tooltip");
                    // Controleer de lengte van VARIABELE DESCRIPTION:
                    if (description.length > 0) {
                        // Bestaat de ARIA-LABEL al en is deze hetzelfde als
                        // wat je gaat toewijzen? Dan overslaan:
                        if (element[i].getAttribute("aria-label") !== description) {
                            element[i].setAttribute("aria-label", description);
                        }
                    }
                    // Controleer de lengte van ARGUMENT ROLE:
                    if (role.length > 0) {
                        // Bestaat de ROLE al en is deze hetzelfde als wat je
                        // gaat toewijzen? Dan overslaan:
                        if (element[i].getAttribute("role") !== role) {
                            element[i].setAttribute("role", role);
                        }
                    }
                }
                i += 1;
            }
        }
    } catch (err) {
        debugConsoleMessage(1, "getSetLabelForClassName: " + err.message);
    }
}

function quickSearchByName() {
    // Stel een ORIENTATIEPUNT in per KLANTNAAM in het ZOEKRESULTAAT, hiermee
    // overschrijf je wel de standaard ROLE van BUTTON:
    try {
        var i = 0;
        var ni = 0;
        var element = document.getElementsByTagName("td");
        // Controleer of de VARIABELE een ELEMENT kent:
        if (element !== null && element !== undefined) {
            while (element[i]) {
                // Controleer of het ELEMENT een ID heeft:
                if (element[i].hasAttribute("id")) {
                    // Pas als het ID aan de naamgeving voldoet dien je een
                    // ROLE toe te kennen:
                    if (element[i].getAttribute("id") === "name" + ni) {
                        // Bestaat de ROLE al en is deze hetzelfde als wat je
                        // gaat toewijzen? Dan overslaan:
                        if (element[i].getAttribute("role") !== "navigation") {
                            element[i].setAttribute("role", "navigation");
                        }
                        ni += 1;
                    }
                }
                i += 1;
            }
        }
    } catch (err) {
        debugConsoleMessage(1, "quickSearchByName: " + err.message);
    }
}

function accessibilityChanges() {
    // Alle FUNCTIE aanroepen in een bepaalde volgorde om de toegankelijkheid
    // van "OmniCRM" te verbeteren.
    // Iconen voorzien van een ROLE en LABEL:
    getSetLabelForClassName("icon-kpn", "link");
    setRoleLabelForClassName("icon-chevron-down", "link", "uitklappen");
    setRoleLabelForClassName("icon-chevron-up", "link", "inklappen");
    // Foutmeldingen voorzien van een ORIENTATIEPUNT:
    setRoleLabelForClassName("inline-notification--panel-warning", "navigation", "");
    // De HEADER "consument product" voorzien van een ORIENTATIEPUNT:
    setRoleLabelForClassName("extra-margin-top header-green", "navigation", "");
    // Specifiek het "rekeningnummer" bij "klantbeeld" voorzien van een ORIENTATIEPUNT:
    setRoleLabelForClassName("bank-account-number", "navigation", "");
    // Voorzie "klantnamen" uit het "zoekresultaat" van een ORIENTATIEPUNT:
    quickSearchByName();
}

// --- [ MUTATIE OBSERVER TOEVOEGEN ] ---
var domObserver = new MutationObserver(function (mutations) {
    // FUNCTIES die aangeroepen moeten worden nadat er een mutatie binnen de
    // CONTAINER heeft plaatsgevonden:
    try {
        var i = 0;
        if (extraDebug) {
            // Extra debug informatie die afzonderlijk aan of uit te zetten is.
            // Voor test doeleinden ten koste van performance:
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

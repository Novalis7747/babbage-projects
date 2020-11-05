// ==UserScript==
// @name         Mika.
// @version      20190517-0922 (Beta)
// @author       PD, Babbage Automation, Roosendaal
// @namespace    https://www.babbage.com/
// @description  Toegankelijkheid van de webapplicatie "Mika" verbeteren
// @include      *://accp-czapps.infra.local/Klantbeeld/*
// @include      *://czapps.infra.local/Klantbeeld/*
// @grant        none
// ==/UserScript==

// --- [ USERSCRIPT NOTITIES ] ---
// ==Developer==
// @browser      Internet Explorer (Versie 11.0.9600.19326) (x86)
// @info         Documentmodus Edge
// @info         Geschikt voor zowel de acceptatie als productieomgeving
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
var scriptName = "Mika";

// --- [ MUTATIE OBSERVER CONTAINER EN CONFIGURATIE ] ---
var container = document;
var config = {
    attributes: true,
    childList: true,
    subtree: true,
    attributeFilter: ["class"]
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
function setAccessKeyForId(id, key) {
    // Stel een ACCESSKEY in voor een generiek ELEMENT:
    try {
        var element = document.getElementById(id);
        // Controleer of de VARIABELE een ELEMENT kent:
        if (element !== null && element !== undefined) {
            // Controleer de lengte van ARGUMENT KEY:
            if (key.length > 0) {
                // Bestaat de ACCESSKEY al en is deze hetzelfde als
                // wat je gaat toewijzen? Dan overslaan:
                if (element.getAttribute("accesskey") !== key) {
                    element.setAttribute("accesskey", key);
                }
            }
        }
    } catch (err) {
        debugConsoleMessage(1, "setAccessKeyForId: " + err.message);
    }
}

function selectAndCopyText(id) {
    // Selecteer en kopieer de tekst van artikelen bij klantvragen:
    try {
        var element = document.getElementById(id);
        // Controleer of de VARIABELE tenminste een ELEMENT kent:
        if (element !== null && element !== undefined) {
            // Selecteer de tekst van het element en alle kinderen:
            window.getSelection().selectAllChildren(element);
            // Kopieer de tekst naar het klembord:
            document.execCommand("copy");
        }
    } catch (err) {
        debugConsoleMessage(1, "selectAndCopyText: " + err.message);
    }
}

function accessibilityChanges() {
    // Alle FUNCTIE aanroepen in een bepaalde volgorde om de toegankelijkheid
    // van Mika te verbeteren:
    setAccessKeyForId("wt53_wtMainContent_wtZoekButton", "j");
    setAccessKeyForId("wt53_wtMainContent_wt75_wtZoekopdrachtInvoerBox", "k");
    setAccessKeyForId("wt53_wtMainContent_wtZoektekstInput", "z");
    setAccessKeyForId("wt15_wtMainContent_wt8_wt55_wtZoekopdrachtInvoerBox", "l");
    setAccessKeyForId("wt53_wtMainContent_wt75_wt29", "g");  // Zoekresultaat wissen.
    setAccessKeyForId("wt15_wtMainContent_wt8_wt57_wt29", "g");  // Zoekresultaat wissen.
    setAccessKeyForId("wt15_wtMainContent_wt8_wt57_wtZoekopdrachtInvoerBox", "k");
    setAccessKeyForId("wt15_wtMainContent_wt8_wt56_wtZoekopdrachtInvoerBox", "k");
    setAccessKeyForId("wt15_wtMainContent_wt8_wt114_wtZoekopdrachtInvoerBox", "k");
    setAccessKeyForId("wt15_wtMainContent_wt8_RichWidgets_wtMenuZorgkosten_block_wtMenuItem_wtLinkZorgkosten", "y");
    setAccessKeyForId("wt15_wtMainContent_wt8_RichWidgets_wtMenuLinks_block_wtMenuItem_wtLinks", "v");
    setAccessKeyForId("wt15_wtMainContent_wt17_wt332", "m");  // Open KRIS.
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
                i += 1;
            }
        }
        // Alleen triggeren op DOM veranderingen:
        accessibilityChanges();
    } catch (err) {
        debugConsoleMessage(1, "domObserver: " + err.message);
    }
});

// --- [ MUTATIE OBSERVER STARTEN ] ---
// Daadwerkelijke start van de MUTATIE OBSERVER. CONTAINER en CONFIG worden aan
// het begin van dit script gedefinieerd:
domObserver.observe(container, config);

// --- [ TOEVOEGEN SNELTOETSEN ] ---
// Sneltoets linker CTRL + linker ALT + s of rechter ALT + s om de tekst bij
// klantvragen te selecteren en te kopieren naar het klembord:
document.addEventListener("keypress", function (keyEvent) {
    if (keyEvent.keyCode === 223) {
        selectAndCopyText("wt15_wtMainContent_wt8_wt57_wt3_wtSnippet");
        selectAndCopyText("wt53_wtMainContent_wt75_wt3_wtSnippet");
    }
});

// --- [ VERTRAAGDE AANROEP ACCESSIBILITYCHANGES ] ---
setTimeout(function () {
    accessibilityChanges();
    if (localDebug) {
        debugConsoleMessage(2, "Vertraagde aanroep voor " + scriptName + ":");
    }
}, 500);

// --- [ EINDE SCRIPT ] ---
// Als de volgende melding in de CONSOLE wordt getoond, dan kan het script in
// ieder geval tot het eind foutloos uitgevoerd worden:
if (localDebug) {
    debugConsoleMessage(2, "Einde script voor " + scriptName + ":");
}

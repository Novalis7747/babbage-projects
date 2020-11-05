// ==UserScript==
// @name         User
// @version      20200128-1915
// @author       PD, Babbage Automation, Roosendaal
// @namespace    https://www.babbage.com/
// @supportURL   https://www.babbage.com/contact/
// @description  De toegankelijkheid van "User" verbeteren.
// @match        *://*.userepd.nl/*
// @grant        none
// ==/UserScript==

// --- [ USERSCRIPT NOTITIES ] ---
// ==Developer==
// @browser      Google Chrome (Versie 78.0.3904.97) (x64)
// @extension    Tampermonkey (Versie 4.9)
// @editor       PlayCode (https://playcode.io/empty)
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

// --- [ GLOBALE CONSTANTEN ] ---
const DOMDEBUG = false;
const GLOBALDEBUG = false;
const OBSERVERDEBUG = false;
const SCRIPTNAME = "User";

// --- [ GLOBALE VARIABELEN ] ---
let PERFORMANCETIMER = false;

// Controleer of de BROWSER PERFORMANCE.NOW ondersteunt:
if (performance.now()) {
    PERFORMANCETIMER = performance.now();
}

// --- [ MUTATIE OBSERVER CONTAINER EN CONFIGURATIE ] ---
const OBSERVERCONTAINER = document;
const OBSERVERCONFIG = {
    // attributes: true,
    // attributeOldValue: true,
    // attributeFilter: ["class"],
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
    // Controleer of een OBJECT de WAARDE NULL of UNDEFINED heeft:
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
function setRoleLabelForClassName(className, role, label) {
    "use strict";
    // Stel een ARIA-ROL en ARIA-LABEL in voor een generiek ELEMENT:
    try {
        const elementen = document.getElementsByClassName(className);
        let i = 0;
        // Controleer of de VARIABELE een ELEMENT kent:
        if (check(elementen)) {
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

function setAttrForClassName(className, attr, value) {
    "use strict";
    // Verander of plaats een ATTRIBUUT voor generieke ELEMENTEN:
    try {
        const elementen = document.getElementsByClassName(className);
        let i = 0;
        // Controleer of de VARIABELE een ELEMENT kent:
        if (check(elementen)) {
            while (elementen[i]) {
                // Controleer de lengte van beiden ARGUMENTEN:
                if (attr.length > 0 && value.length > 0) {
                    // Bestaat het ATTRIBUUT al en is deze hetzelfde als wat je
                    // wenst te veranderen? Dan overslaan:
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

function setLabelForImages() {
    "use strict";
    // Plaats een ARIA-LABEL op LINKS die een AFBEELDING als KIND ELEMENT hebben:
    try {
        const elementen = document.getElementsByTagName("IMG");
        let bron;
        let doorgaan = false;
        let i = 0;
        let label;
        // Controleer of de VARIABELE een ELEMENT kent:
        if (check(elementen)) {
            while (elementen[i]) {
                // Verkrijg eerst de SOURCE van de afbeelding:
                bron = elementen[i].getAttribute("src");
                // Betreft de TOEVOEGEN knop:
                if (bron === "/UserPortal/images/impulse/add.png") {
                    label = "toevoegen";
                    doorgaan = true;
                }
                // Betreft de SLUITEN knop:
                if (bron === "/UserPortal/images/impulse/cross.png" || bron === "/UserPortal/images/impulse/cross16.png") {
                    label = "sluiten";
                    doorgaan = true;
                }
                // Controleer van te voren het LABEL:
                if (check(label) && label.length > 0 && doorgaan === true) {
                    // Alleen als het OUDER ELEMENT een LINK is mag het LABEL geplaatst worden:
                    if (elementen[i].parentNode.tagName === "A" && check(elementen[i].parentNode)) {
                        // Controleer eerst of het ATTRIBUUT al bestaat en of het LABEL hetzelfde is als wat je gaat toewijzen:
                        if (elementen[i].parentNode.getAttribute("aria-label") !== label) {
                            elementen[i].parentNode.setAttribute("aria-label", label);
                        }
                    }
                    // Reset de CONTROLE alvorens door te gaan naar de volgende NODE:
                    doorgaan = false;
                }
                i += 1;
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, "setLabelForImages: " + err.message);
    }
}

function setLabelForTiles(className) {
    "use strict";
    // Plaats een LABEL voor de LINKS die gebruikt worden bij alle TEGELS:
    try {
        const elementen = document.getElementsByClassName(className);
        let i = 0;
        let label;
        let teller;
        let titel;
        // Controleer of de VARIABELE een ELEMENT kent:
        if (check(elementen)) {
            while (elementen[i]) {
                // Verklein het zoekgebied en zoek naar een ELEMENT met de volgende KLASSE:
                titel = elementen[i].parentNode.getElementsByClassName("x22j");
                teller = elementen[i].parentNode.getElementsByClassName("counterOutput");
                // Alternatieve zoekopdracht in het geval de KLASSENAAM toch weer anders is:
                if (!check(titel) || titel.length === 0) {
                    titel = elementen[i].parentNode.getElementsByClassName("fontMedium");
                }
                if (!check(titel) || titel.length === 0) {
                    titel = elementen[i].parentNode.getElementsByClassName("x22k");
                }
                if (!check(titel) || titel.length === 0) {
                    titel = elementen[i].parentNode.getElementsByClassName("x22l");
                }
                // Controleer of de VARIABELE TITEL een ELEMENT kent:
                if (check(titel) && titel.length > 0) {
                    // Van het eerste ELEMENT dat je vind de TEKST ophalen:
                    label = titel[0].textContent;
                    // Controleer of het LABEL te gebruiken is:
                    if (check(label) && label.length > 0) {
                        // Indien er een COUNTER op de tegel staat dan deze toevoegen aan het LABEL:
                        if (check(teller) && teller.length > 0) {
                            // Van het eerste ELEMENT dat je vind de TEKST ophalen en achter het LABEL plaatsen:
                            label = label + " " + teller[0].textContent;
                        }
                        // Converteer het LABEL naar kleine letters, vervang meerdere spaties door een enkele en verwijder spaties aan het eind en/of begin van het LABEL:
                        label = label.trim().toLowerCase().replace(/\s+(?=\s)/g, "");
                        // Controleer of het LABEL al bestaat en of het LABEL hetzelfde is als wat je wilt toepassen:
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
        debugConsoleMessage(1, 1, "setLabelForTiles: " + err.message);
    }
}

function setVisibleStyleForClassName(className, value) {
    "use strict";
    // Verander of plaats een STYLE ATTRIBUUT voor generieke ELEMENTEN:
    try {
        const elementen = document.getElementsByClassName(className);
        let i = 0;
        // Controleer of de VARIABELE een ELEMENT kent:
        if (check(elementen)) {
            while (elementen[i]) {
                // Controleer de lengte van beiden ARGUMENTEN:
                if (value.length > 0) {
                    // Stel de VISIBILITY PROPERTY in met de opgegeven WAARDE:
                    elementen[i].style.visibility = value;
                }
                i += 1;
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, "setVisibleStyleForClassName: " + err.message);
    }
}

function setRoleLabelForId(id, role, label) {
    "use strict";
    // Stel een ARIA-LABEL in voor een specifiek ELEMENT:
    try {
        const element = document.getElementById(id);
        // Controleer of de VARIABELE een ELEMENT kent:
        if (check(element)) {
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

// --- [ "BLOCK" MET ALLE FUNCTIE AANROEPEN ] ---
function accessibilityChanges() {
    "use strict";
    // Alle FUNCTIE aanroepen in een bepaalde volgorde om de toegankelijkheid
    // van "User" te verbeteren.
    // Plaatsen van NAVIGATIE punten:
    setRoleLabelForClassName("scrollToTop noprint", "navigation", "scroll naar boven");
    setRoleLabelForClassName("floatingMenu noprint", "navigation", "snelmenu onderaan");
    setRoleLabelForClassName("mainDashboardSelectionTitle", "navigation", "");
    setRoleLabelForClassName("openSearch", "navigation", "open het zoekvenster");
    setRoleLabelForClassName("p_AFTrailing", "navigation", "");
    // Maak van bepaalde ELEMENTEN een HEADER voor snelle navigatie:
    setRoleLabelForClassName("dashboardContentTitle", "heading", "");
    setAttrForClassName("dashboardContentTitle", "aria-level", "2");
    // Voorzie bepaalde AFBEELDINGEN zonder LABEL van een LABEL:
    setRoleLabelForId("openNotificaties", "", "open notificaties");
    setLabelForImages();
    // Voorzie de gebruikte TEGELS van een LABEL:
    setLabelForTiles("tileLink");
    // Maak van de MENU ITEMS in het LINKERMENU KNOPPEN:
    setRoleLabelForClassName("x1ar", "button", "");
    // Maak van een type MELDINGENVENSTER een DIALOOG zodat je er niet uit kunt navigeren:
    setRoleLabelForId("mainDocument_msgDlg", "dialog", "bericht");
    // Maak van MEDEWERKERS binnen de PLANNER een LINK zodat hun namen worden voorgelezen:
    setRoleLabelForClassName("x26c x1a", "link", "");
    // Maak LINKS die standaard verborgen zijn meteen zichtbaar na het laden van de pagina:
    setVisibleStyleForClassName("x258 x1a", "visible");
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

// --- [ EINDE SCRIPT ] ---
// Als de volgende melding in de CONSOLE wordt getoond, dan kan het script in
// ieder geval tot het eind foutloos uitgevoerd worden:
debugConsoleMessage(1, 0, "Einde script voor " + SCRIPTNAME + ".");
debugConsoleMessage(3, 0, "Uitvoering duurde:");

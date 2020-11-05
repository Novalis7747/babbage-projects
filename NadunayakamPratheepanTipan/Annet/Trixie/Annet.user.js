// ==UserScript==
// @name         Annet
// @version      20200608-1114 (Beta)
// @author       PD, Babbage Automation, Roosendaal
// @namespace    https://www.babbage.com/
// @description  De toegankelijkheid van "Annet" verbeteren
// @include      *://annet.kpn.org/*
// @include      *://annetprd.kpn.org/*
// @grant        none
// ==/UserScript==

// --- [ USERSCRIPT NOTITIES ] ---
// ==Developer==
// @browser      Internet Explorer (Versie 11.590.17134.0) (x86)
// @info         Documentmodus 7
// @attention    Werkt alleen goed op de laptop van Tipan; beveiligingsopties?
// @attention    Sluiten van de F12-ontwikkelhulpprogramma's doet Annet hangen
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
// Houdt er rekening mee dat als LOCALDEBUG op TRUE staat dat je
// dan de ontwikkeltools van Internet Explorer geopend moet hebben:
var localDebug = false;
var extraDebug = false;
var scriptName = "Annet";

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
function setRoleLabelForTagName(tagName, className, role, label) {
    // Deze wat omslachtigere manier is nodig omdat je binnen Internet
    // Explorer 7 geen gebruik kunt maken van getElementsByClassName.
    // Binnen deze functie zoeken we eerst de elementen van een bepaald
    // type en dan gaan we per element kijken of de CLASS overeenkomt:
    try {
        var element = document.getElementsByTagName(tagName);
        var i = 0;
        // Controleer of de VARIABELE minimaal een ELEMENT kent:
        if (element !== null) {
            while (element[i]) {
                if (element[i].className === className) {
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
                }
                i += 1;
            }
        }
    } catch (err) {
        debugConsoleMessage(1, "setRoleLabelForTagName: " + err.message);
    }
}

function setCertainTitleAltForImage(className) {
    // Deze functie geeft AFBEELDINGEN met een bepaalde KLASSENAAM een
    // uitgebreidere niet elegant hard gecodeerde TITLE en ALT attribuut mee:
    try {
        var element = document.getElementsByTagName("img");
        var i = 0;
        var description = "";
        // Controleer of de VARIABELE een ELEMENT kent:
        if (element !== null) {
            while (element[i]) {
                if (element[i].className === className) {
                    // Controleer de waarde van TITLE en pas deze
                    // tegelijkertijd met de ALT attribuut aan:
                    if (element[i].getAttribute("title") === "Arcadyan VRV9517 V10A") {
                        description = "Arcadyan VRV9517 V10A. Volledig wit met gestreepte helft en 2 lampjes op de voorkant. In het midden Experiabox V10A logo.";
                        element[i].setAttribute("title", description);
                        element[i].setAttribute("alt", description);
                    }
                    if (element[i].getAttribute("title") === "ZTE H369A High-End V10") {
                        description = "ZTE H369A High-End V10. Volledig wit met 5 lampjes en een herstelknop op de voorkant. Boven de lampjes staat de vermelding Experia Box V10.";
                        element[i].setAttribute("title", description);
                        element[i].setAttribute("alt", description);
                    }
                    if (element[i].getAttribute("title") === "ZTE H368N High-End V9") {
                        description = "ZTE H368N High-End V9. Volledig wit met ronde hoeken en 9 lampjes op de bovenkant. Linksonderin staat de vermelding V9.";
                        element[i].setAttribute("title", description);
                        element[i].setAttribute("alt", description);
                    }
                    if (element[i].getAttribute("title") === "Arcadyan VGV7519 High-End V8") {
                        description = "Arcadyan VGV7519 High-End V8. Volledig wit en heeft 9 lampjes op de bovenkant. Linksonderin staat de vermelding V8.";
                        element[i].setAttribute("title", description);
                        element[i].setAttribute("alt", description);
                    }
                    if (element[i].getAttribute("title") === "ZTE H220N") {
                        description = "ZTE H220N. Volledig wit met een rood knopje aan de zijkant. Er zijn geen antennes zichtbaar.";
                        element[i].setAttribute("title", description);
                        element[i].setAttribute("alt", description);
                    }
                    if (element[i].getAttribute("title") === "Thomson TG789") {
                        description = "Thomson TG789. Zwart van voren en wit van achteren. Geen antennes zichtbaar.";
                        element[i].setAttribute("title", description);
                        element[i].setAttribute("alt", description);
                    }
                    if (element[i].getAttribute("title") === "Thomson TG787") {
                        description = "Thomson TG787. Volledig zwart en heeft 6 lampjes aan de voorkant. 1 antenne zichtbaar aan de linkerkant.";
                        element[i].setAttribute("title", description);
                        element[i].setAttribute("alt", description);
                    }
                    if (element[i].getAttribute("title") === "[ ]") {
                        if (element[i].getAttribute("src") === "http://annet.kpn.org/scriptingimage/cm.scripts.service/divers/check_nietafgevinkt.gif") {
                            description = "ja, niet aangevinkt";
                            element[i].setAttribute("title", description);
                            element[i].setAttribute("alt", description);
                        }
                        if (element[i].getAttribute("src") === "http://annet.kpn.org/scriptingimage/cm.scripts.service/divers/check_nietafgevinkt_kruis.gif") {
                            description = "nee, niet aangevinkt";
                            element[i].setAttribute("title", description);
                            element[i].setAttribute("alt", description);
                        }
                    }
                    if (element[i].getAttribute("src") === "http://annet.kpn.org/scriptingimage/cm.scripts.service/kalender/header/navlinks.gif") {
                        description = "vorig tijdsblok";
                        element[i].setAttribute("title", description);
                        element[i].setAttribute("alt", description);
                    }
                    if (element[i].getAttribute("src") === "http://annet.kpn.org/scriptingimage/cm.scripts.service/kalender/header/navrechts.gif") {
                        description = "volgend tijdsblok";
                        element[i].setAttribute("title", description);
                        element[i].setAttribute("alt", description);
                    }
                    // Uitzonderingsregel om ROLE attributen te verwijderen
                    // uit het overzicht netwerk map van een klant, om de
                    // grote hoeveelheid loze orientatiepunten tegen te gaan:
                    if (element[i].getAttribute("src") === "http://annet.kpn.org/scriptingimage/cm.scripts.service/netwerkmap/blanc.png" || element[i].getAttribute("src") === "http://annet.kpn.org/scriptingimage/cm.scripts.service/netwerkmap/dashed_leaf_with_branch.png" || element[i].getAttribute("src") === "http://annet.kpn.org/scriptingimage/cm.scripts.service/netwerkmap/dashed_leaf_no_branch.png" || element[i].getAttribute("src") === "http://annet.kpn.org/scriptingimage/cm.scripts.service/netwerkmap/leaf_with_dashed_branch.png") {
                        element[i].removeAttribute("role");
                    }
                }
                i += 1;
            }
        }
    } catch (err) {
        debugConsoleMessage(1, "setCertainTitleAltForImage: " + err.message);
    }
}

function setCalendarTitleAltForImage(className, toSearchFor, begin, end, extra) {
    // Deze functie is specifiek voor de kalender aangepast en geeft
    // AFBEELDINGEN met een bepaalde KLASSENAAM een uitgebreidere niet
    // elegant hard gecodeerde TITLE en ALT attribuut mee:
    try {
        var element = document.getElementsByTagName("img");
        var i = 0;
        var description = "";
        var imgSrc = "";
        var index = 0;
        // Controleer of de VARIABELE een ELEMENT kent:
        if (element !== null) {
            while (element[i]) {
                if (element[i].className === className) {
                    // Zoek binnen SRC naar een deel van de string en als
                    // dat overeenkomt wijzig je de ALT en TITLE attribuut:
                    imgSrc = element[i].getAttribute("src");
                    if (imgSrc !== null) {
                        // indexOf is kennelijk sneller dan search en
                        // we hebben geen reguliere expressie nodig:
                        index = imgSrc.lastIndexOf(toSearchFor);
                        if (index !== -1) {
                            description = imgSrc.slice(begin, end) + " " + extra.toLowerCase();
                            // Bestaat de TITLE of ALT al en is deze hetzelfde
                            // als wat je gaat toewijzen? Dan overslaan:
                            if (element[i].getAttribute("title") !== description) {
                                element[i].setAttribute("title", description);
                            }
                            if (element[i].getAttribute("alt") !== description) {
                                element[i].setAttribute("alt", description);
                            }
                        }
                    }
                }
                i += 1;
            }
        }
    } catch (err) {
        debugConsoleMessage(1, "setCalendarTitleAltForImage: " + err.message);
    }
}

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

function setTitleForId(id, title) {
    // Stelt een TITEL in voor een uniek ELEMENT:
    try {
        var element = document.getElementById(id);
        // Controleer of de VARIABELE een ELEMENT kent:
        if (element !== null) {
            // Controleer de lengte van ARGUMENT TITEL:
            if (title.length > 0) {
                // Bestaat de TITLE al en is deze hetzelfde
                // als wat je gaat toewijzen? Dan overslaan:
                if (element.getAttribute("title") !== title) {
                    element.setAttribute("title", title);
                }
            }
        }
    } catch (err) {
        debugConsoleMessage(1, "setTitleForId: " + err.message);
    }
}

function accessibilityChanges() {
    // Alle FUNCTIE aanroepen in een bepaalde volgorde
    // om de toegankelijkheid van "Annet" te verbeteren.
    // Invoervoervelden voorzien van een label:
    setTitleForId("loginForm:userName", "gebruikersnaam");
    setTitleForId("loginForm:organization", "organisatie");
    setTitleForId("loginForm:password", "wachtwoord");
    setTitleForId("s_zipcode", "postcode");
    setTitleForId("s_housenr", "huisnummer");
    setTitleForId("s_customername", "klantnaam");
    setTitleForId("s_phonenumber", "telefoonnummer");
    setTitleForId("s_ckr", "c k r nummer");
    setTitleForId("pstn_s_housenr_ext", "toevoeging");
    setTitleForId("telforts_telfortid", "telfort id");
    setTitleForId("fiber_oss3s_fiberaccount", "fiber account");
    setTitleForId("customername", "klantnaam");
    // Links die ogen als knoppen voorzien van de juiste rol:
    setRoleLabelForId("anchorsubmitbutton", "button", "");
    setRoleLabelForTagName("a", "searchbutton", "button", "");
    // Elementen voorzien van orientatiepunten:
    setRoleLabelForId("generalErrorMessage", "navigation", "");
    // Sessie timer waarschuwing voorzien van een alert rol:
    setRoleLabelForId("sessionTimeOut", "alert", "");
    // Links die ogen als knoppen voorzien van titels:
    setTitleForId("adminuitklapknop", "in en uitklappen rechtermenu");
    // Keuzes binnen het stappenplan voorzien van orientatiepunten:
    setRoleLabelForTagName("img", "scripting-image", "navigation", "");
    // Afbeeldingen binnen het stappenplan voorzien van alt-tekst en titels:
    setCertainTitleAltForImage("scripting-image");
    // Afbeeldingen binnen de kalender voorzien van alt-tekst en titels:
    setCalendarTitleAltForImage("scripting-image", "kalender/dag", 64, -4, "");
    setCalendarTitleAltForImage("scripting-image", "kalender/tijdsblokken", 77, -4, "uur");
}

// --- [ HANDMATIGE FUNCTIE AANROEP ] ---
// Voer het script handmatig uit na het ingeven van de toetsen: CTRL + ALT + S:
document.attachEvent("onkeydown", function (keyPressed) {
    if (keyPressed.ctrlKey && keyPressed.altKey && keyPressed.keyCode === 83) {
        accessibilityChanges();
        debugConsoleMessage(1, "Handmatige uitvoering " + scriptName + " script.");
    }
});

// --- [ AUTOMATISCHE FUNCTIE AANROEP ] ---
// Voer het script automatisch uit na het laden van de DOM:
window.onload = function () {
    accessibilityChanges();
    debugConsoleMessage(2, "Automatische uitvoering " + scriptName + " script:");
};

// Een manier om veranderingen in de DOM op te vangen. Met name binnen
// het stappenplan is dat een probleem. Het uitvoeren van de code heeft
// een impact van < 4ms en is daarmee enigszins acceptabel te noemen:
setInterval(function () {
    accessibilityChanges();
    if (extraDebug) {
        debugConsoleMessage(2, "Automatische uitvoering " + scriptName + " script:");
    }
}, 3000);

// --- [ EINDE SCRIPT ] ---
// Als de volgende melding in de CONSOLE wordt getoond, dan kan het
// script in ieder geval tot het eind foutloos uitgevoerd worden:
debugConsoleMessage(2, "Einde script voor " + scriptName + ":");

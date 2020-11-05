// ==UserScript==
// @name         Steam
// @namespace    https://www.babbage.com/
// @version      20190624-1340 (Beta)
// @description  Toegankelijkheid van de webapplicatie "Steam" verbeteren
// @author       PD, Babbage Automation, Roosendaal
// @match        *://sociaalplus.steam.eu.com/tm/*
// @grant        none
// ==/UserScript==

// --- [ USERSCRIPT NOTITIES ] ---
// ==Developer==
// @browser      Firefox ESR (Versie 60.7.0esr (x64))
// @extension    TamperMonkey (Versie 4.9.5941)
// ==Validator==
// @name         JSLint (Edition 2019.01.31)
// @url          https://jslint.com/
// @settings     Assume: "a browser"

// --- [ VALIDATOR SETTINGS ] ---
// Automatisch instellen van bovenstaande @SETTINGS voor JSLINT:
/*jslint
    browser
*/

// --- [ SNELTOETSEN ] ---
// Handmatige uitvoering van het script: CTRL + ALT + B
// Open het memo venster: CTRL + ALT + M
// Specifiek voor het memo venster om dat te sluiten: CTRL + ALT + X
// Zet de microfoon op stil: CTRL + ALT + K
// Plaats de beller in de wacht: CTRL + ALT + H
// Iemand bellen: CTRL + ALT + O
// Gesprek beeindigen: CTRL + ALT + I
// Afronden en opslaan: CTRL + ALT + V
// Agenda openen voor een terugbelafspraak: CTRL + ALT + C
// Open het standaard agentscherm: CTRL + ALT + F1
// Open de pagina met het script dat men kan voorlezen: CTRL + ALT + F2
// Ga naar de vorige pagina van het agentscherm: CTRL + ALT + Page Up
// Ga naar de volgende pagina van het agentscherm: CTRL + ALT + Page Down

// --- [ GLOBALE VARIABELEN ] ---
var localDebug = false;
var scriptName = "Steam";

// --- [ MUTATIE OBSERVER CONTAINER EN CONFIGURATIE ] ---
var container = document;
var config = {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true,
    attributeFilter: ["style"]
};

// --- [ DEBUG FUNCTIE ] ---
function debugConsoleMessage(level, message) {
    "use strict";
    // Geeft een DEBUG MESSAGE al dan wel of niet weer.
    // Dit is afhankelijk van de VARIABELE localDebug:
    try {
        if (localDebug) {
            if (level === 1) {
                window.console.log("    ", message);
            }
            if (level === 2) {
                var newDate = new Date();
                var now = newDate.getMilliseconds();
                window.console.log(message, now, "ms.");
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        window.console.log("Babbage debugConsoleMessage: " + err.message);
    }
}

// --- [ AANPASSINGEN SPECIFIEK VOOR STEAM ] ---
function triggerShortcutKey(level, classname, property) {
    "use strict";
    // Voer een door de sneltoets gedefinieerde actie uit op een element met
    // een bepaalde KLASSE:
    try {
        var elements = document.getElementsByClassName(classname);
        var i = 0;
        var once = false;
        var title;
        var source;
        var elementText;
        if (level === 0) {
            // Klik op een element als de titel van dat element overeenkomt met
            // de PROPERTY:
            while (elements[i]) {
                title = elements[i].getAttribute("title");
                if (title === property) {
                    elements[i].click();
                }
                i += 1;
            }
        }
        if (level === 1) {
            // Klik op een element als de TEXTCONTENT van dat element
            // overeenkomt met de PROPERTY:
            while (elements[i]) {
                elementText = elements[i].textContent;
                if (elementText === property) {
                    elements[i].click();
                }
                i += 1;
            }
        }
        if (level === 2) {
            // Klik op een element als dat een AFBEELDING als kind heeft
            // zonder titel en overeenkomt met de PROPERTY:
            while (elements[i]) {
                if (elements[i].firstChild.nodeName === "IMG") {
                    source = elements[i].firstChild.getAttribute("src");
                    if (source === property) {
                        elements[i].click();
                    }
                }
                i += 1;
            }
        }
        if (level === 3) {
            // Klik eenmaal op een element als de titel van dat element
            // overeenkomt met de PROPERTY en negeer de overige elementen:
            while (elements[i]) {
                title = elements[i].getAttribute("title");
                if (title === property && !once) {
                    once = true;
                    elements[i].click();
                }
                i += 1;
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, "triggerShortcutKey: " + err.message);
    }
}

function setRoleForId(id, role) {
    "use strict";
    // Stel een LABEL in voor een specifiek ELEMENT:
    try {
        var element = document.getElementById(id);
        if (element !== null && element !== undefined) {
            // Controleer de lengte van de ROLE en het juiste ATTRIBUTE:
            if (role.length > 0 && element.getAttribute("role") !== role) {
                element.setAttribute("role", role);
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, "setRoleForId: " + err.message);
    }
}

function setFocusOnElement(classname) {
    "use strict";
    // Zet de focus op een element met een bepaalde KLASSE:
    try {
        var elements = document.getElementsByClassName(classname);
        if (elements.length > 0) {
            elements[0].focus();
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, "setFocusOnElement: " + err.message);
    }
}

function setAttrForClass(level, classname, attribute, property) {
    "use strict";
    // Ken een attribuut toe aan een element met een bepaalde KLASSE:
    try {
        var elements = document.getElementsByClassName(classname);
        var i = 0;
        var type;
        var source;
        if (level === 0) {
            while (elements[i]) {
                elements[i].setAttribute(attribute, property);
                i += 1;
            }
        }
        if (level === 1) {
            while (elements[i]) {
                type = elements[i].previousElementSibling;
                if (type.className === "boxCaption") {
                    property = type.textContent;
                    if (property.length > 0) {
                        elements[i].setAttribute("aria-label", property);
                    }
                }
                i += 1;
            }
        }
        if (level === 2) {
            while (elements[i]) {
                if (elements[i].firstChild.nodeName === "IMG") {
                    source = elements[i].firstChild.getAttribute("src");
                    if (source === "/tm/images/script_back.png") {
                        elements[i].setAttribute("aria-label", "vorige");
                    }
                    if (source === "/tm/images/script_next.png") {
                        elements[i].setAttribute("aria-label", "volgende");
                    }
                    if (source === "/tm/images/icon_hold.png") {
                        elements[i].setAttribute("aria-label", "on hold");
                    }
                }
                i += 1;
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, "setAttrForClass: " + err.message);
    }
}

function setLabelForCombobox(classname) {
    "use strict";
    // Geef de COMBOBOX een herkenbare naam opgehaald uit de DOM:
    try {
        var elements = document.getElementsByClassName(classname);
        var i = 0;
        var type;
        var label;
        while (elements[i]) {
            type = elements[i].nextElementSibling;
            if (type.classList.contains("selectGroupTitleCaption")) {
                label = type.textContent;
                if (label.length > 0) {
                    elements[i].setAttribute("aria-label", label);
                }
            }
            i += 1;
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, "setLabelForCombobox: " + err.message);
    }
}

function showProjectNameAsAlert(classname) {
    "use strict";
    // Geef een message weer met de naam van het project:
    try {
        var elements = document.getElementsByClassName(classname);
        var i = 0;
        var end;
        var type;
        var text;
        var sent;
        var begin;
        var powertip;
        var message = null;
        while (elements[i]) {
            if (elements[i].childNodes[1].className === "boxLabel") {
                type = elements[i].childNodes[1].firstChild;
                if (type !== null && type.nodeName === "H2") {
                    text = type.textContent;
                    if (text.length > 0) {
                        message = type.innerHTML;
                    }
                }
            }
            i += 1;
        }
        if (message !== null && typeof message === "string") {
            message = message.match(/<u>(.*?)<\/u>/g).map(function (val) {
                return val.replace(/<\/?u>/g, "");
            });
            powertip = document.getElementsByClassName("divUserMessages");
            if (powertip.length > 0) {
                begin = "<div class=\"usermessage\" style=\"\">";
                end = "<div class=\"usermessageClose\"></div>";
                sent = begin + end;
                powertip[0].innerHTML = sent + message[0] + "</div>";
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, "showProjectNameAsAlert: " + err.message);
    }
}

// --- [ LIJST MET FUNCTIE AANROEPEN ] ---
function accessibilityChanges() {
    "use strict";
    // ATTRIBUUT toevoegen aan een ELEMENT met een bepaald ID:
    setRoleForId("live", "navigation");
    // ATTRIBUUT toevoegen aan een ELEMENT met een bepaalde KLASSE:
    setAttrForClass(0, "divUserMessages", "role", "alert");
    setAttrForClass(0, "tooltip", "role", "alert");
    setAttrForClass(0, "campagneTitle", "role", "alert");
    setAttrForClass(0, "dialogButton dialogButton_5", "aria-label", "sluiten");
    setAttrForClass(0, "stat-data", "role", "button");
    setAttrForClass(0, "resultcode", "role", "button");
    setAttrForClass(0, "option optioncaption", "role", "button");
    setAttrForClass(0, "history", "role", "navigation");
    setAttrForClass(0, "historyList", "role", "navigation");
    setAttrForClass(0, "activeTelephone", "role", "navigation");
    setAttrForClass(0, "activeTelephone", "aria-label", "telefoonnummer");
    setAttrForClass(0, "queueHoldCount", "role", "navigation");
    setAttrForClass(0, "queueHoldCount", "aria-label", "wachtrij");
    setAttrForClass(0, "chosen-container-single", "role", "combobox");
    setAttrForClass(0, "selectGroupImgArrow", "role", "combobox");
    setAttrForClass(0, "iconActiveTask", "role", "navigation");
    setAttrForClass(0, "boxLabel", "role", "heading");
    setAttrForClass(0, "divTransfer", "role", "dialog");
    setAttrForClass(0, "chosen-drop", "role", "dialog");
    setAttrForClass(0, "divTransfer", "aria-modal", "true");
    setAttrForClass(0, "chosen-drop", "aria-modal", "true");
    setAttrForClass(0, "callbackMessage", "aria-label", "callback menu");
    setAttrForClass(1, "boxInput", "role", "");
    setAttrForClass(2, "dialogButtonTiny dialogButton_6", "aria-label", "");
    showProjectNameAsAlert("box");
    setLabelForCombobox("selectGroupImgArrow");
}

// --- [ VERTRAGING VOOR DE LIJST MET FUNCTIE AANROEPEN ] ---
function delayAccessibilityChanges(timer) {
    "use strict";
    // Specifiek geschreven voor de TOOLTIPS onderaan de pagina:
    setTimeout(function () {
        accessibilityChanges();
        debugConsoleMessage(1, "Script belscherm " + scriptName + " geladen.");
    }, timer);
}

// --- [ TOEGANKELIJK MAKEN VAN SPECIFIEKE ELEMENTEN ] ---
function onStyleModified(target) {
    "use strict";
    // Ongedaan maken van DISPLAY: NONE op de tabel met doorschakelingen:
    try {
        var classes = target.classList;
        var element;
        if (classes.length > 0) {
            if (target.classList.contains("crossTableSearchResult")) {
                target.removeAttribute("style");
            }
            if (target.classList.contains("divTransferTel")) {
                // Zorg voor een lijnlengte van maximaal 80 karakters:
                element = document.getElementsByClassName(
                    "divTransferSearchInput"
                );
                // Plaats de focus op het ZOEKVELD binnen het DIALOOGVENSTER:
                element[1].focus();
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, "onStyleModified: " + err.message);
    }
}

// --- [ SNELTOETSEN TOEVOEGEN ] ---
// Voeg sneltoetsen toe, bijvoorbeeld het script handmatig uitvoeren na ingeven
// van de volgende sneltoets: CTRL + ATL + B, en nog meer:
document.addEventListener("keydown", function (keyEvent) {
    "use strict";
    // Roep het script handmatig aan:
    if (keyEvent.ctrlKey && keyEvent.altKey && keyEvent.code === "KeyB") {
        accessibilityChanges();
        debugConsoleMessage(1, "Handmatig: " + scriptName + " script.");
    }
    // Open het memo venster:
    if (keyEvent.ctrlKey && keyEvent.altKey && keyEvent.code === "KeyM") {
        triggerShortcutKey(0, "dialogButton_6", "Memo");
    }
    // Specifiek voor het memo venster om dat te sluiten:
    if (keyEvent.ctrlKey && keyEvent.altKey && keyEvent.code === "KeyX") {
        triggerShortcutKey(1, "dialogButton_5", "Sluiten");
    }
    // Zet de microfoon op stil:
    if (keyEvent.ctrlKey && keyEvent.altKey && keyEvent.code === "KeyK") {
        triggerShortcutKey(3, "dialogButton_6", "Stil");
    }
    // Plaats de beller in de wacht:
    if (keyEvent.ctrlKey && keyEvent.altKey && keyEvent.code === "KeyH") {
        triggerShortcutKey(0, "dialogButton_6", "Hold");
    }
    // Iemand bellen:
    if (keyEvent.ctrlKey && keyEvent.altKey && keyEvent.code === "KeyO") {
        triggerShortcutKey(3, "dialogButtonTiny dialogButton_6", "Bel");
    }
    // Gesprek beeindigen:
    if (keyEvent.ctrlKey && keyEvent.altKey && keyEvent.code === "KeyI") {
        triggerShortcutKey(3, "dialogButtonTiny dialogButton_2", "Bel");
    }
    // Afronden en opslaan:
    if (keyEvent.ctrlKey && keyEvent.altKey && keyEvent.code === "KeyV") {
        triggerShortcutKey(0, "dialogButton_3", "Save");
    }
    // Agenda openen voor een terugbelafspraak:
    if (keyEvent.ctrlKey && keyEvent.altKey && keyEvent.code === "KeyC") {
        // Zorg voor een lijnlengte van maximaal 80 karakters:
        triggerShortcutKey(
            2,
            "btnMenubarCallback",
            "/tm/images/icon_callback.png"
        );
    }
    // Open het standaard agentscherm:
    if (keyEvent.ctrlKey && keyEvent.altKey && keyEvent.code === "F1") {
        triggerShortcutKey(1, "dialogButton_6", "Standaard");
    }
    // Open de pagina met het script dat men kan voorlezen:
    if (keyEvent.ctrlKey && keyEvent.altKey && keyEvent.code === "F2") {
        triggerShortcutKey(1, "dialogButton_6", "Script");
        setFocusOnElement("boxLabel");
    }
    // Ga naar de vorige pagina van het agentscherm:
    if (keyEvent.ctrlKey && keyEvent.altKey && keyEvent.code === "PageUp") {
        triggerShortcutKey(2, "dialogButton_6", "/tm/images/script_back.png");
    }
    // Ga naar de volgende pagina van het agentscherm:
    if (keyEvent.ctrlKey && keyEvent.altKey && keyEvent.code === "PageDown") {
        triggerShortcutKey(2, "dialogButton_6", "/tm/images/script_next.png");
    }
});

// --- [ MUTATIE OBSERVER TOEVOEGEN ] ---
var domObserver = new MutationObserver(function (mutations) {
    "use strict";
    // FUNCTIES die uitgevoerd moeten worden nadat er een mutatie binnen de
    // CONTAINER heeft plaatsgevonden:
    try {
        var i = 0;
        var label;
        var header;
        var mutNode;
        var blueBtn;
        var orangeBtn;
        while (mutations[i]) {
            if (mutations[i].addedNodes.length > 0) {
                mutNode = mutations[i].addedNodes[0];
                if (mutNode.id === "mainModal") {
                    mutNode.setAttribute("role", "dialog");
                    blueBtn = mutNode.getElementsByClassName("blueButton");
                    orangeBtn = mutNode.getElementsByClassName("orangeButton");
                    header = mutNode.getElementsByClassName("modal-header");
                    if (header[0].firstChild.nodeName === "H3") {
                        label = header[0].firstChild.textContent;
                        if (label.length > 0) {
                            mutNode.setAttribute("aria-label", label);
                        }
                    }
                    if (blueBtn.length > 0) {
                        blueBtn[0].focus();
                    }
                    if (orangeBtn.length > 0) {
                        orangeBtn[0].focus();
                    }
                }
                // De volgende NODE wordt als laatst toegevoegd voordat het
                // belscherm wordt getoond:
                if (mutNode.className === "tooltip") {
                    delayAccessibilityChanges(8000);
                }
            }
            if (mutations[i].type === "attributes") {
                onStyleModified(mutations[i].target);
            }
            i += 1;
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, "domObserver: " + err.message);
    }
});

// --- [ MUTATIE OBSERVER STARTEN ] ---
// Daadwerkelijke start van de MUTATIE OBSERVER.
// CONTAINER en CONFIG worden aan het begin gedefinieerd:
domObserver.observe(container, config);

// --- [ FUNCTIE AANROEP NA LADEN DOM ] ---
if (document.readyState === "complete") {
    accessibilityChanges();
    debugConsoleMessage(1, "Einde van " + scriptName + " script.");
}

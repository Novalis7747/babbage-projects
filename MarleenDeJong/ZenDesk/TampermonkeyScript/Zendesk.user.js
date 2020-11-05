// ==UserScript==
// @name         Zendesk.
// @namespace    https://www.babbage.com/
// @version      20180223. RC.
// @description  Toegankelijkheid van de webapplicatie Zendesk verbeteren.
// @author       Peter Dackers. (Babbage Automation, Roosendaal).
// @match        *://ditzo.zendesk.com/*
// @grant        none
// ==/UserScript==

/* --- [ NOTITIES ] ---
   @browser      Google Chrome (Versie 64+ (x86)).
   @extension    TamperMonkey (Versie 4.5). (https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo).
   @ecmascript   ECMAScript 5. (Gedefinieerd in Versie 4.4).
   @localDebug   Toont meldingen in de CONSOLE.LOG die kunnen helpen gedurende het debuggen:
                 -   0: Schakelt alle meldingen uit.
                 -   1: Toon de naam van de functie die wordt aangeroepen en het starten en eindigen van het gehele script.
                 -   2: Toont hetzelfde als 1, met meer detailering en de huidige URL.
                 -   3: Toont alleen de huidige URL.
*/

// --- [ VARIABELEN ] ---
var localDebug = 0;
var checkPath = window.location.pathname;

/* --- [ AANPASSINGEN SPECIFIEK VOOR ZENDESK ] ---
   Plaats een ARIA-LABEL en NAVIGATION ROLE bij alle openbare en interne (WEB, E-MAIL, WHATSAPP of FACEBOOK) berichten:
*/
function distinguishInternalExternalNotes() {
    if (localDebug === 1 || localDebug === 2) {
        console.log("  Functie distinguishInternalExternalNotes.");
    }
    var isPublicEmail = document.querySelectorAll(".ember-view.event.is-public.email.regular");
    var isPublicWeb = document.querySelectorAll(".ember-view.event.is-public.web.regular");
    var isPublicAPI = document.querySelectorAll(".ember-view.event.is-public.api.regular");
    var isPublicChat = document.querySelectorAll(".ember-view.event.is-public.chat.regular");
    var isPublicFacebook = document.querySelectorAll(".ember-view.event.is-public.facebook.regular");
    var isInternalChat = document.querySelectorAll(".ember-view.event.chat.regular:not(.is-public)");
    var isInternalWeb = document.querySelectorAll(".ember-view.event.web.regular:not(.is-public)");
    for (var iE = 0; iE < isPublicEmail.length; ++iE) {
        if (localDebug === 2) {
            console.log("Publiekelijk E-MAIL bericht gevonden.");
            console.log(isPublicEmail[iE]);
        }
        var publicMessageEmail = isPublicEmail[iE].querySelector(".header.clearfix");
        if (publicMessageEmail !== null) {
            publicMessageEmail.setAttribute("role", "navigation");
            publicMessageEmail.setAttribute("aria-label", "Publiekelijk e-mail bericht:");
        }
        if (localDebug === 2) {
            console.log(publicMessageEmail);
        }
    }
    for (var iW = 0; iW < isPublicWeb.length; ++iW) {
        if (localDebug === 2) {
            console.log("Publiekelijk WEB bericht gevonden.");
            console.log(isPublicWeb[iW]);
        }
        var publicMessageWeb = isPublicWeb[iW].querySelector(".header.clearfix");
        if (publicMessageWeb !== null) {
            publicMessageWeb.setAttribute("role", "navigation");
            publicMessageWeb.setAttribute("aria-label", "Publiekelijk web bericht:");
        }
        if (localDebug === 2) {
            console.log(publicMessageWeb);
        }
    }
    for (var iA = 0; iA < isPublicAPI.length; ++iA) {
        if (localDebug === 2) {
            console.log("Publiekelijk API bericht gevonden.");
            console.log(isPublicAPI[iA]);
        }
        var publicMessageAPI = isPublicAPI[iA].querySelector(".header.clearfix");
        if (publicMessageAPI !== null) {
            publicMessageAPI.setAttribute("role", "navigation");
            publicMessageAPI.setAttribute("aria-label", "Publiekelijk api bericht:");
        }
        if (localDebug === 2) {
            console.log(publicMessageAPI);
        }
    }
    for (var iC = 0; iC < isPublicChat.length; ++iC) {
        if (localDebug === 2) {
            console.log("Publiekelijk CHAT bericht gevonden.");
            console.log(isPublicChat[iC]);
        }
        var publicMessageChat = isPublicChat[iC].querySelector(".header.clearfix");
        if (publicMessageChat !== null) {
            publicMessageChat.setAttribute("role", "navigation");
            publicMessageChat.setAttribute("aria-label", "Publiekelijk chat bericht:");
        }
        if (localDebug === 2) {
            console.log(publicMessageChat);
        }
    }
    for (var iFC = 0; iFC < isPublicFacebook.length; ++iFC) {
        if (localDebug === 2) {
            console.log("Publiekelijk FACEBOOK bericht gevonden.");
            console.log(isPublicFacebook[iFC]);
        }
        var publicFacebookChat = isPublicFacebook[iFC].querySelector(".header.clearfix");
        if (publicFacebookChat !== null) {
            publicFacebookChat.setAttribute("role", "navigation");
            publicFacebookChat.setAttribute("aria-label", "Publiekelijk facebook bericht:");
        }
        if (localDebug === 2) {
            console.log(isPublicFacebook);
        }
    }
    for (var inC = 0; inC < isInternalChat.length; ++inC) {
        if (localDebug === 2) {
            console.log("Intern CHAT bericht gevonden.");
            console.log(isInternalChat[inC]);
        }
        var internalMessageChat = isInternalChat[inC].querySelector(".header.clearfix");
        if (internalMessageChat !== null) {
            internalMessageChat.setAttribute("role", "navigation");
            internalMessageChat.setAttribute("aria-label", "Intern chat bericht:");
        }
        if (localDebug === 2) {
            console.log(internalMessageChat);
        }
    }
    for (var inW = 0; inW < isInternalWeb.length; ++inW) {
        if (localDebug === 2) {
            console.log("Intern WEB bericht gevonden.");
            console.log(isInternalWeb[inW]);
        }
        var internalMessageWeb = isInternalWeb[inW].querySelector(".header.clearfix");
        if (internalMessageWeb !== null) {
            internalMessageWeb.setAttribute("role", "navigation");
            internalMessageWeb.setAttribute("aria-label", "Intern web bericht:");
        }
        if (localDebug === 2) {
            console.log(internalMessageWeb);
        }
    }
}

// De link om een ticket op te pakken voorzien van een NAVIGATION ROLE:
function assignAgentButton() {
    if (localDebug === 1 || localDebug === 2) {
        console.log("  Functie assignAgentButton.");
    }
    var iGotThisButton = document.querySelectorAll(".ember-view.link_light.for_save.info");
    if (iGotThisButton !== null) {
        for (var i = 0; i < iGotThisButton.length; ++i) {
            iGotThisButton[i].setAttribute("role", "navigation");
        }
    }
}

// De BUTTON om een ticket te printen voorzien van een LABEL:
function assignLabelOptionsButton() {
    if (localDebug === 1 || localDebug === 2) {
        console.log("  Functie assignLabelOptionsButton.");
    }
    var optionsButton = document.querySelectorAll(".btn.dropdown-toggle.object_options_btn");
    if (optionsButton !== null) {
        for (var i = 0; i < optionsButton.length; ++i) {
            optionsButton[i].setAttribute("aria-label", "Opties menu");
        }
    }
}

// De tabbladen om een keus tussen een openbare of interne notitie te schrijven voorzien van een LABEL:
function internalExternalNoteButtons() {
    if (localDebug === 1 || localDebug === 2) {
        console.log("  Functie internalExternalNoteButtons.");
    }
    var publicComment = document.querySelectorAll(".ember-view.btn.track-id-publicComment");
    var privateComment = document.querySelectorAll(".ember-view.btn.track-id-privateComment");
    var publicCommentActive = document.querySelectorAll(".ember-view.btn.track-id-publicComment.active");
    var privateCommentActive = document.querySelectorAll(".ember-view.btn.private_note.active.track-id-privateComment");
    if (publicComment !== null) {
        for (var pU = 0; pU < publicComment.length; ++pU) {
            publicComment[pU].setAttribute("aria-label", "Openbare opmerking schrijven:");
        }
    }
    if (privateComment !== null) {
        for (var pR = 0; pR < privateComment.length; ++pR) {
            privateComment[pR].setAttribute("aria-label", "Interne opmerking schrijven:");
        }
    }
    if (publicCommentActive !== null) {
        for (var pUA = 0; pUA < publicCommentActive.length; ++pUA) {
            publicCommentActive[pUA].setAttribute("aria-label", "Actief, openbare opmerking schrijven:");
        }
    }
    if (privateCommentActive !== null) {
        for (var pRA = 0; pRA < privateCommentActive.length; ++pRA) {
            privateCommentActive[pRA].setAttribute("aria-label", "Actief, interne opmerking schrijven:");
        }
    }
}

// De knop om een keus te kunnen maken hoe je een ticket verzend voorzien van een LABEL:
function sentDropdownMenuButton() {
    if (localDebug === 1 || localDebug === 2) {
        console.log("  Functie sentDropdownMenuButton.");
    }
    var sentDropdownButton = document.querySelectorAll(".btn.btn-inverse.dropdown-toggle");
    if (sentDropdownButton !== null) {
        for (var sDB = 0; sDB < sentDropdownButton.length; ++sDB) {
            sentDropdownButton[sDB].setAttribute("aria-label", "Verzenden als:, keuze menu");
        }
    }
}

// Geef ieder element op de pagina met de CLASS btn de ROLE van een BUTTON:
function genericButtons() {
    if (localDebug === 1 || localDebug === 2) {
        console.log("  Functie genericButtons.");
    }
    var buttons = document.querySelectorAll(".btn");
    if (buttons !== null) {
        for (var i = 0; i < buttons.length; ++i) {
            buttons[i].setAttribute("role", "button");
        }
    }
}

// Maak H4 clickable, H4 heeft veelal een LINK ELEMENT in zich, dat niet gezien wordt door NVDA:
function makeHeadersClickable() {
    if (localDebug === 1 || localDebug === 2) {
        console.log("  Functie makeHeadersClickable.");
    }
    var headers = document.querySelectorAll(".navigation-item");
    if (headers !== null) {
        for (var i = 0; i < headers.length; ++i) {
            headers[i].setAttribute("role", "navigation");
        }
    }
}

// Geef elementen die tot de TABEL horen de juiste ROLE:
function repairTables() {
    if (localDebug === 1 || localDebug === 2) {
        console.log("  Functie repairTables.");
    }
    var setTableRole = document.querySelectorAll(".scroll_content");
    var tableElement = document.querySelectorAll("table");
    var tableRows = document.querySelectorAll("tr");
    var tableData = document.querySelectorAll("td");
    if (setTableRole !== null) {
        for (var i = 0; i < setTableRole.length; ++i) {
            setTableRole[i].setAttribute("role", "presentation");
        }
    }
    if (tableElement !== null) {
        for (var iT = 0; iT < tableElement.length; ++iT) {
            tableElement[iT].setAttribute("role", "grid");
        }
    }
    if (tableRows !== null) {
        for (var iTR = 0; iTR < tableRows.length; ++iTR) {
            tableRows[iTR].setAttribute("role", "row");
        }
    }
    if (tableData !== null) {
        for (var iTD = 0; iTD < tableData.length; ++iTD) {
            tableData[iTD].setAttribute("role", "gridcell");
        }
    }
}

// Voer functies uit afhankelijk van op welke pagina dat je aan het werken bent:
setInterval(function () {
    if (localDebug === 1 || localDebug === 2) {
        console.log("Begin van het ZENDESK script.");
    }
    var checkCurrentHref = window.location.href.toLocaleLowerCase();
    if (checkPath != window.location.pathname) {
        setTimeout(function () {
            console.log("tester!");
            // Aanpassingen uitvoeren die gelden voor alle pagina's:
            genericButtons();
            repairTables();
            makeHeadersClickable();
            // Aanpassingen die specifiek gelden voor de AGENT TICKET pagina's:
            if (checkCurrentHref.slice(0, 39) === "https://ditzo.zendesk.com/agent/tickets") {
                distinguishInternalExternalNotes();
                internalExternalNoteButtons();
                sentDropdownMenuButton();
                assignAgentButton();
                assignLabelOptionsButton();
            }
        checkPath = window.location.pathname;
        }, 2000);
    }
    if (localDebug === 2 || localDebug === 3) {
        console.log("Huidige URL:" + " " + checkCurrentHref);
    }
    if (localDebug === 1 || localDebug === 2) {
        console.log("Einde van het ZENDESK script.");
    }
}, 7000);

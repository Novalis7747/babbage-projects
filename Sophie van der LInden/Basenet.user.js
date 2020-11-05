// ==UserScript==
// @name         Basenet
// @version      20200717-1250
// @author       LdR & PD, Babbage Automation, Roosendaal
// @namespace    https://www.babbage.com/
// @supportURL   https://www.babbage.com/contact/
// @description  Toegankelijkheid van de webapplicatie "Basenet" verbeteren
// @match        *://crm.basenet.nl/*
// @grant        none
// ==/UserScript==

// --- [ USERSCRIPT NOTITIES ] ---
// ==Developer==
// @browser      Firefox ESR (Versie 68.5.0 (x64))
// @extension    TamperMonkey (Versie 4.11.6114)
// @screenreader NVDA (Versie 2019.2.1)
// ==/Developer==

// ==Validator==
// @validator    JSLint (Edition 2020.07.02)
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
let localDebug = false;
let scriptName = "Basenet";

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
    // Geeft een DEBUG MESSAGE al dan wel of niet weer. Dit is afhankelijk van de VARIABELE localDebug:
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
            // LEVEL 2 geeft de boodschap inclusief het aantal milliseconden weer:
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
        let elem = null;
        let i = 0;
        // Controleer of de VARIABELE een ELEMENT kent:
        if (element !== null) {
            while (element[i]) {
                // Controleer de lengte van ARGUMENT ROLE:
                if (role.length > 0) {
                    // Bestaat de ROLE al en is deze hetzelfde als wat je gaat toewijzen? Dan overslaan:
                    if (element[i].getAttribute("role") !== role) {
                        element[i].setAttribute("role", role);
                    }
                }
                // Controleer de lengte van ARGUMENT LABEL:
                if (label.length > 0) {
                    // Bestaat het LABEL al en is deze hetzelfde als wat je gaat toewijzen? Dan overslaan:
                    if (element[i].getAttribute("aria-label") !== label) {
                        element[i].setAttribute("aria-label", label);
                    }
                }
                // ACCESSKEY toevoegen specifiek voor de ZOEK knop:
                if (className === "searchbutton") {
                    // Bestaat de KLASSE al en is de waarde ervan hetzelfde als wat je gaat toewijzen? Dan overslaan:
                    if (element[i].getAttribute("accesskey") !== "z") {
                        element[i].setAttribute("accesskey", "z");
                    }
                }
                // ACCESSKEY toevoegen specifiek voor de knoppen om een BIJLAGE te downloaden:
                if (className === "gwt-HTML archiveButton gridMenuButton expectedAction") {
                    // Bestaat de KLASSE al en is de waarde ervan hetzelfde als wat je gaat toewijzen? Dan overslaan:
                    if (element[i].getAttribute("accesskey") !== "b") {
                        element[i].setAttribute("accesskey", "b");
                    }
                }
                if (className === "gwt-HTML downloadButton gridMenuButton expectedAction") {
                    // Bestaat de KLASSE al en is de waarde ervan hetzelfde als wat je gaat toewijzen? Dan overslaan:
                    if (element[i].getAttribute("accesskey") !== "d") {
                        element[i].setAttribute("accesskey", "d");
                    }
                }
                // ROL toevoegen specifiek voor een aantal knoppen:
                if (className === "gridMenuButton") {
                    // Achterhaal een ATTRIBUUT en als de waarde overeenkomt dan pas een ROL toekennen:
                    if (element[i].getAttribute("data-crm-event-tracking-id") === "Overzetten") {
                        element[i].setAttribute("role", "button");
                    }
                    if (element[i].getAttribute("data-crm-event-tracking-id") === "Download") {
                        element[i].setAttribute("role", "button");
                    }
                    if (element[i].getAttribute("data-crm-event-tracking-id") === "Upload") {
                        element[i].setAttribute("role", "button");
                    }
                }
                // Voorzie de rij van een ROLOMSCHRIJVING indien een e-mail ongelezen is:
                if (className === "emailinfo unread") {
                    elem = element[i].parentNode.parentNode;
                    // Controleer of de VARIABELE niet leeg is en of je de TABLE ROW te pakken hebt:
                    if (elem !== null && elem.nodeName === "TR") {
                        elem.setAttribute("aria-roledescription", "ongelezen e-mail");
                    }
                }
                i += 1;
            }
        }
    } catch (err) {
        debugConsoleMessage(1, "setRoleLabelForClassName: " + err.message);
    }
}

function setRoleLabelForId(id, role, label) {
    "use strict";
    // Stel een ARIA-ROL en ARIA-LABEL in voor een specifiek ELEMENT:
    try {
        let element = document.getElementById(id);
        let elementen;
        let i = 0;
        if (element !== null && element !== undefined) {
            // Maak een uitzondering voor het SNELMENU: (20200218 toegevoegd)
            if (id === "quickMenu_container") {
                // Verkrijg alle KIND ELEMENTEN van het type ITALIC:
                elementen = element.getElementsByTagName("I");
                if (elementen !== null && elementen !== undefined) {
                    while (elementen[i]) {
                        // Bewerk alleen het juiste ELEMENT:
                        if (elementen[i].className === "fa fa-th-list") {
                            // Controleer de lengte van ARGUMENT ROLE:
                            if (role.length > 0) {
                                elementen[i].setAttribute("role", role);
                            }
                            // Controleer de lengte van ARGUMENT LABEL:
                            if (label.length > 0) {
                                elementen[i].setAttribute("aria-label", label);
                            }
                        }
                        i += 1;
                    }
                }
            } else {
                // Controleer de lengte van ARGUMENT ROLE:
                if (role.length > 0) {
                    element.setAttribute("role", role);
                }
                // Controleer de lengte van ARGUMENT LABEL:
                if (label.length > 0) {
                    element.setAttribute("aria-label", label);
                }
            }
        }
    } catch (err) {
        debugConsoleMessage(1, "setRoleLabelForId: " + err.message);
    }
}

function changeAttributeForId(id, attribute, value) {
    "use strict";
    // Stel een ARIA-ROL en ARIA-LABEL in voor een specifiek ELEMENT:
    try {
        let element = document.getElementById(id);
        if (element !== null) {
            // Controleer de lengte van ATTRIBUTE en VALUE:
            if (attribute.length > 0 && value.length > 0) {
                element.setAttribute(attribute, value);
            }
        }
    } catch (err) {
        debugConsoleMessage(1, "changeAttributeForId: " + err.message);
    }
}

function setLabelOnEditField(className) {
    "use strict";
    // Plaats een juiste LABEL op de INPUT ELEMENTEN:
    try {
        let debug = false;
        let element = document.getElementsByClassName(className);
        let i = 0;
        let label;
        // Controleer of de VARIABELE een ELEMENT kent:
        if (element !== null) {
            while (element[i]) {
                // Controleer of het ELEMENT dat je zoekt wel bestaat:
                if (element[i].parentNode.childNodes[1] !== undefined && element[i].parentNode.childNodes[1] !== null && element[i].parentNode.childNodes[1].firstElementChild !== undefined && element[i].parentNode.childNodes[1].firstElementChild !== null) {
                    // Controleer of de PARENT, daarvan het KIND en daarvan ook het KIND van het type LABEL is, zo ja, doorgaan:
                    if (element[i].parentNode.childNodes[1].firstElementChild.nodeName === "LABEL") {
                        label = element[i].parentNode.childNodes[1].firstElementChild.textContent.toLowerCase();
                        // Controleer de lengte van VARIABELE LABEL:
                        if (label.length > 0) {
                            // Betreft het geen DATUM INVOERVELD:
                            if (element[i].className !== "dateinput") {
                                // Bestaat het LABEL al en is deze hetzelfde als wat je gaat toewijzen? Dan overslaan:
                                if (element[i].getAttribute("aria-label") !== label) {
                                    element[i].setAttribute("aria-label", label);
                                }
                                // Geef het LABEL in de CONSOLE weer ter verificatie, let op performance:
                                if (debug) {
                                    debugConsoleMessage(1, label);
                                }
                            }
                            // Betreft het wel een DATUM INVOERVELD:
                            if (element[i].className === "dateinput") {
                                if (element[i].firstElementChild.nodeName === "INPUT") {
                                    // Bestaat het LABEL al en is deze hetzelfde als wat je gaat toewijzen? Dan overslaan:
                                    if (element[i].firstElementChild.getAttribute("aria-label") !== label) {
                                        element[i].firstElementChild.setAttribute("aria-label", label);
                                    }
                                    // Geef het LABEL in de CONSOLE weer ter verificatie, let op de perfomance:
                                    if (debug) {
                                        debugConsoleMessage(1, label);
                                    }
                                }
                            }
                        }
                    }
                }
                i += 1;
            }
        }
    } catch (err) {
        debugConsoleMessage(1, "setLabelOnEditField: " + err.message);
    }
}

function onClassMutation(mutation) {
    "use strict";
    // MUTATIES gefilterd op ATTRIBUTE soort KLASSE:
    let classes = mutation.classList;
    if (!classes) {
        return;
    }
    // Wanneer een tabblad geselecteerd is:
    if (mutation.classList.contains("tabheaderitem_select")) {
        mutation.setAttribute("aria-selected", "true");
    // Wanneer een tabblad niet geselecteerd is:
    } else if (mutation.classList.contains("tabheaderitem_lo")) {
        mutation.setAttribute("aria-selected", "false");
    }
}

function onChildMutation() {
    "use strict";
    // MUTATTIES gefilterd op de soort CHILDLIST:
    let i = 0;
    // Verkrijg alle ELEMENTEN met het ATTRIBUUT TOOLTIP:
    let tooltips = document.querySelectorAll("[tooltip]");
    let tooltip = null;
    let mouseOver = "this.setAttribute('aria-describedby', 'tooltip');";
    let mouseOut = "this.removeAttribute('aria-describedby');";
    while (tooltips[i]) {
        tooltip = tooltips[i].getAttribute("tooltip");
        // Een groot aantal ELEMENTEN heeft wel een ATTRIBUUT TOOLTIP maar deze is leeg. Behandel alleen ELEMENTEN waarvan de ATTRIBUUT TOOLTIP ook werkelijk een tooltip bevat:
        if (tooltip.length > 0) {
            // Bestaat ONMOUSEOVER al en is deze hetzelfde als wat je gaat toewijzen? Dan overslaan:
            if (tooltips[i].getAttribute("onmouseover") !== mouseOver) {
                tooltips[i].setAttribute("onmouseover", mouseOver);
            }
            // Bestaat ONMOUSEOUT al en is deze hetzelfde als wat je gaat toewijzen? Dan overslaan:
            if (tooltips[i].getAttribute("onmouseout") !== mouseOut) {
                tooltips[i].setAttribute("onmouseout", mouseOut);
            }
            // Bestaat de ROLE al en is deze hetzelfde als wat je gaat toewijzen? Dan overslaan:
            if (tooltips[i].getAttribute("role") !== "link") {
                tooltips[i].setAttribute("role", "link");
            }
        }
        i += 1;
    }
    // Stel ROLLEN, LABELS en dergelijke in om de toegankelijkheid van Basenet te verbeteren:
    // ------------------------------------------------------------------------------------------------------------------------------------
    // Hoofdpagina:
    setRoleLabelForClassName("dragbox-head-title", "heading", "");
    setRoleLabelForClassName("header", "heading", "");
    setRoleLabelForId("noflashheader", "navigation", "");
    setRoleLabelForId("userMenuImage", "button", "gebruikersmenu");
    setRoleLabelForId("administrationDepartmentMenu", "button", "menu afdeling selecteren");
    setRoleLabelForId("notificationIcon", "button", "notificaties");
    setRoleLabelForId("notifications", "navigation", "notificaties");
    setRoleLabelForId("quicklaunch_fullscreen", "button", "maximaliseren");
    setRoleLabelForId("menuCreateNew", "button", "nieuw");
    setRoleLabelForId("foundResultsgrid_label", "navigation", "");
    // ------------------------------------------------------------------------------------------------------------------------------------
    // Algemene knoppen:
    setRoleLabelForClassName("fa-print", "button", "printen");
    setRoleLabelForClassName("tooltipster-content", "navigation", "menu geopend");
    setRoleLabelForClassName("gwt-PopupPanel savedQueryMenu", "navigation", "menu geopend");
    setRoleLabelForClassName("lettersetting isIcon tooltipster fas fa-cogs tooltipstered", "button", "instellingen");
    setRoleLabelForClassName("gridMenuButton expectedAction", "button", "");
    setRoleLabelForClassName("fas fa-question-circle", "button", "help menu");
    setRoleLabelForClassName("fas fa-th-list", "button", "opties menu");
    setRoleLabelForClassName("component actionMenu gridMenuButton help fas fa-plus tooltipstered", "button", "toevoegen");
    setRoleLabelForClassName("isIcon fas tooltipstered fa-compress", "button", "schakel tussen simpele of uitgebreide weergave");
    setRoleLabelForClassName("isIcon fas fa-plus-circle hideTooltipsterOnTouch tooltipstered", "button", "toevoegen");
    setRoleLabelForClassName("close fas fa-times-circle", "button", "sluiten");
    setRoleLabelForClassName("close fas fa-times", "button", "sluiten");
    setRoleLabelForClassName("ui-button-icon ui-icon ui-icon-closethick", "button", "sluiten");
    setRoleLabelForId("cancelButton", "button", "");
    // ------------------------------------------------------------------------------------------------------------------------------------
    // Correspondentie / Documenten en E-mails:
    setRoleLabelForClassName("fas fa-edit help tooltipstered gridMenuButton", "button", "wijzigen");
    setRoleLabelForClassName("component actionMenu gridMenuButton help fas fa-plus tooltipstered", "button", "nieuw");
    setRoleLabelForClassName("fas fa-trash help tooltipstered gridMenuButton", "button", "verwijderen");
    setRoleLabelForClassName("component actionMenu gridMenuButton help fas fa-bars tooltipstered", "button", "acties");
    setRoleLabelForClassName("noResultsFound", "alert", "");
    setRoleLabelForId("foundResultslettergrid_label", "link", "");
    setRoleLabelForId("savedQueryMenuTitle", "button", "opgeslagen zoekopdrachten");
    setRoleLabelForId("lepcode_include_subprojects", "", "inclusief subprojecten");
    setRoleLabelForId("lercode_popup", "navigation", "menu geopend");
    setRoleLabelForId("lepcode_popup", "navigation", "menu geopend");
    setRoleLabelForId("lercode_image_delete", "button", "relatie verwijderen");
    setRoleLabelForId("lepcode_image_delete", "button", "project verwijderen");
    // ------------------------------------------------------------------------------------------------------------------------------------
    // Correspondentie / Documenten en E-mails / Document geopend (nieuw venster):
    setRoleLabelForId("largefontbutton fas fa-glasses-alt gridMenuButton", "button", "voorbeeld weergeven");
    // ------------------------------------------------------------------------------------------------------------------------------------
    // Correspondentie / E-mail boxes:
    setRoleLabelForClassName("gwt-PushButton needsclick gridMenuButton icon fas fa-plus tooltipster help image_with_button expectedAction tooltipstered gwt-PushButton-up", "button", "nieuw");
    setRoleLabelForClassName("gwt-PushButton needsclick gridMenuButton icon fas fa-floppy-o tooltipster help image_with_button tooltipstered gwt-PushButton-up", "button", "bewaren");
    setRoleLabelForClassName("gwt-PushButton needsclick gridMenuButton icon fas fa-reply tooltipster help image_with_button tooltipstered gwt-PushButton-up", "button", "antwoorden");
    setRoleLabelForClassName("gwt-PushButton needsclick gridMenuButton icon fas fa-reply-all tooltipster help image_with_button tooltipstered gwt-PushButton-up", "button", "allen antwoorden");
    setRoleLabelForClassName("gwt-PushButton needsclick gridMenuButton icon fas fa-arrow-right tooltipster help image_with_button tooltipstered gwt-PushButton-up", "button", "doorsturen");
    setRoleLabelForClassName("gwt-PushButton needsclick gridMenuButton icon fas fa-share-square tooltipster help image_with_button gwt-PushButton-up", "button", "verplaatsen");
    setRoleLabelForClassName("gwt-PushButton needsclick gridMenuButton isIcon fas fa-print tooltipster help image_with_button tooltipstered gwt-PushButton-up", "button", "printen");
    setRoleLabelForClassName("gwt-PushButton gridMenuButton icon fas tooltipster help image_with_button tooltipstered icon fas fa-link gwt-PushButton-up", "button", "gerelateerd");
    setRoleLabelForClassName("gwt-PushButton gridMenuButton icon fas fa-save tooltipster help image_with_button corres_button_save_one expectedAction tooltipstered gwt-PushButton-up", "button", "opslaan");
    setRoleLabelForClassName("gwt-HTML attachment fas fa-paperclip gridMenuButton tooltipstered", "button", "bijlagen");
    setRoleLabelForClassName("labelsearch-icon fas fa-search gridMenuButton", "button", "zoeken");
    setRoleLabelForClassName("gwt-HTML baseEmailLabel", "link", "");
    setRoleLabelForId("emailbodyiframe", "navigation", "e-mail");
    setRoleLabelForId("lercode_input", "", "relatie");
    setRoleLabelForClassName("emailinfo unread", "", "");
    // ------------------------------------------------------------------------------------------------------------------------------------
    // Correspondentie / E-mail boxes / Nieuwe e-mail (nieuw venster):
    setRoleLabelForClassName("cke_editable cke_editable_themed cke_contents_ltr cke_show_borders", "navigation", "");
    setRoleLabelForClassName("emailtemplatebutton fas fa-file-alt tooltipstered gridMenuButton", "button", "gebruik standaard template");
    setRoleLabelForId("sendButton", "button", "versturen");
    setRoleLabelForId("bijlagen_button", "button", "bijlagen");
    setRoleLabelForId("corres_button", "button", "bewaar");
    setRoleLabelForId("reply_button", "button", "antwoorden");
    setRoleLabelForId("replytoall_button", "button", "allen antwoorden");
    setRoleLabelForId("forward_button", "button", "doorsturen");
    setRoleLabelForId("source_button", "button", "download");
    changeAttributeForId("downloadList", "aria-hidden", "false");
    // ------------------------------------------------------------------------------------------------------------------------------------
    // Correspondentie / E-mail boxes / E-mail geopend (huidig venster):
    setRoleLabelForClassName("gwt-HTML archiveButton gridMenuButton expectedAction", "button", "bewaar alles");
    setRoleLabelForClassName("gwt-HTML downloadButton gridMenuButton expectedAction", "button", "download alles");
    setRoleLabelForClassName("gwt-HTML previewImage fas fa-glasses-alt tooltipstered", "button", "preview");
    setRoleLabelForClassName("gwt-HTML archiveImage fas fa-save tooltipstered", "button", "bijlage archiveren");
    setRoleLabelForClassName("gwt-HTML revisionImage fas fa-copy tooltipstered", "button", "opslaan met revisie");
    setRoleLabelForClassName("gwt-HTML downloadImage fas fa-file-pdf", "button", "pdf");
    // ------------------------------------------------------------------------------------------------------------------------------------
    // Correspondentie / E-mail boxes / E-mail / Bijlagen bewaren (nieuw venster):
    setRoleLabelForClassName("fas fa-upload help tooltipstered gridMenuButton", "button", "upload");
    setRoleLabelForClassName("fas fa-check help tooltipstered gridMenuButton", "button", "voeg toe");
    // ------------------------------------------------------------------------------------------------------------------------------------
    // Dossiers / Nieuwe e-mail / Versturen / Error-message:
    setRoleLabelForId("baseAlert", "alert", "");
    setRoleLabelForId("baseAlert__div_popup_header", "navigation", "");
    setRoleLabelForId("baseAlertHandlerToch versturen", "button", "");
    setRoleLabelForId("baseAlertHandlerAnnuleren", "button", "");
    setRoleLabelForId("emaildialog", "navigation", "");
    // ------------------------------------------------------------------------------------------------------------------------------------
    // Advocatuur / Dossiers:
    setRoleLabelForClassName("new fas fa-plus help tooltipstered gridMenuButton", "button", "nieuw");
    setRoleLabelForClassName("modify fas fa-pencil help tooltipstered gridMenuButton", "button", "wijzigen");
    setRoleLabelForClassName("fas fa-eye-slash help tooltipstered gridMenuButton", "button", "zet op (in)actief");
    setRoleLabelForClassName("component actionMenu gridMenuButton help fas fa-bars tooltipstered", "button", "acties");
    setRoleLabelForClassName("searchbutton", "button", "zoeken");
    setRoleLabelForClassName("component multiselectbox-GWT", "navigation", "menu geopend");
    setLabelOnEditField("formelement");
    setLabelOnEditField("dateinput");
    // ------------------------------------------------------------------------------------------------------------------------------------
    // Advocatuur / Dossiers / Dossier (nieuw venster):
    setRoleLabelForClassName("save far fa-save help tooltipstered gridMenuButton", "button", "bewaar");
    setRoleLabelForClassName("save close base base-save-close help tooltipstered gridMenuButton", "button", "bewaar en sluit");
    setRoleLabelForClassName("close far fa-times help tooltipstered gridMenuButton", "button", "sluiten");
    setRoleLabelForClassName("tabheaderitem_select", "link", "");
    setRoleLabelForClassName("tabheaderitem_lo", "link", "");
    setRoleLabelForClassName("fas fa-plus help tooltipstered gridMenuButton", "button", "nieuw");
    setRoleLabelForClassName("inactive_1 inactiveButton help fas fa-eye tooltipstered gridMenuButton", "button", "menu weergave aanpassen");
    setRoleLabelForClassName("fas fa-envelope help tooltipstered gridMenuButton", "button", "nieuwe mailing");
    setRoleLabelForClassName("fas fa-pencil help tooltipstered gridMenuButton", "button", "bekijk / wijzigen");
    setRoleLabelForClassName("fas fa-sync help tooltipstered gridMenuButton", "button", "vernieuwen");
    setRoleLabelForClassName("base base-documents-email help tooltipstered gridMenuButton", "button", "correspondentie");
    setRoleLabelForClassName("fas fa-history help tooltipstered gridMenuButton", "button", "relatiehistorie");
    setRoleLabelForClassName("base base-save-new help tooltipstered gridMenuButton", "button", "bewaar / nieuw");
    setRoleLabelForClassName("base base-save-copy help tooltipstered gridMenuButton", "button", "bewaar / kopieer");
    // ------------------------------------------------------------------------------------------------------------------------------------
    // Sales / Prospects:
    setRoleLabelForId("tooltip", "navigation", "");
    // ------------------------------------------------------------------------------------------------------------------------------------
    // Sales / Prospects / Prospectproject:
    setRoleLabelForClassName("component actionMenu gridMenuButton help fas fa-plus tooltipstered", "button", "plusteken");
    setRoleLabelForClassName("nextitem fas fa-chevron-right help tooltipstered gridMenuButton", "button", "volgende prospect");
    setRoleLabelForClassName("previousitem fas fa-chevron-left help tooltipstered gridMenuButton", "button", "vorige prospect");
    setRoleLabelForClassName("cke_wysiwyg_frame cke_reset", "navigation", "");
    setRoleLabelForClassName("labelsearch_result nonedit", "link", "");
    // ------------------------------------------------------------------------------------------------------------------------------------
    // Sales / Prospects / Prospectproject / Historie / E-mail:
    setRoleLabelForId("reply_to_mail_button", "button", "antwoorden");
    setRoleLabelForId("replytoall_mail_button", "button", "allen antwoorden");
    setRoleLabelForId("forward_mail_button", "button", "doorsturen");
    setRoleLabelForId("source_mail_button", "button", "downloaden");
    // ------------------------------------------------------------------------------------------------------------------------------------
    // Agenda / Taken / Agenda:
    setRoleLabelForClassName("fas fa-search help tooltipstered gridMenuButton", "button", "doorzoek agenda");
    setRoleLabelForClassName("fas fa-calendar help tooltipstered gridMenuButton", "button", "weergave aanpassen");
    setRoleLabelForClassName("fas fa-backward", "button", "jaar terug");
    setRoleLabelForClassName("fas fa-play", "button", "maand vooruit");
    setRoleLabelForClassName("fas fa-play fa-rotate-180", "button", "maand terug");
    setRoleLabelForClassName("fas fa-forward", "button", "jaar vooruit");
    // ------------------------------------------------------------------------------------------------------------------------------------
    // Telefonie / Call Registratie:
    setRoleLabelForClassName("plaintextarea textarea", "navigation", "");
    setRoleLabelForClassName("fas fa-stack-2x fa-money-bill", "navigation", "icoon factuur");
    setRoleLabelForId("Volgende gespreksregistratie", "button", "volgende gespreksregistratie");
    setRoleLabelForId("Vorige gespreksregistratie", "button", "vorige gespreksregistratie");
}

// --- [ MUTATIE OBSERVER TOEVOEGEN ] ---
let domObserver = new MutationObserver(function (mutations) {
    "use strict";
    // FUNCTIES die aangeroepen moeten worden nadat er een mutatie binnen de CONTAINER heeft plaatsgevonden:
    try {
        let i = 0;
        while (mutations[i]) {
            // Er vinden twee soorten mutaties plaats, een als CHILDLIST en de anders als ATTRIBUTE, stuur beiden naar aparte functies:
            if (mutations[i].type === "childList") {
                onChildMutation();
            }
            if (mutations[i].type === "attributes") {
                if (mutations[i].attributeName === "class") {
                    onClassMutation(mutations[i].target);
                }
            }
            i += 1;
        }
        // De volgende functie aanroep is nodig omdat zonder niet altijd alle veranderingen doorgevoerd worden nadat je van pagina bent gewisseld:
        onChildMutation();
    } catch (err) {
        debugConsoleMessage(1, "domObserver: " + err.message);
    }
});

// --- [ MUTATIE OBSERVER STARTEN ] ---
// Daadwerkelijke start van de MUTATIE OBSERVER. CONTAINER en CONFIG worden aan het begin van dit script gedefinieerd:
domObserver.observe(container, config);

// --- [ EINDE SCRIPT ] ---
// Als de volgende melding in de CONSOLE wordt getoond, dan kan het script in ieder geval tot het eind foutloos uitgevoerd worden:
if (localDebug) {
    debugConsoleMessage(2, "Einde script voor " + scriptName + ":");
}

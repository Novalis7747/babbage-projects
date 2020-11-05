// ==UserScript==
// @name        Realworks CRM.
// @namespace   http://www.babbage.com/
// @description Toegankelijkheid van Realworks CRM verbeteren.
// @include     *://crm.realworks.nl/*
// @require     http://www.babbage.com/library/Babbage_Javascript_Library.js
// @version     0.9.2
// @grant       none
// ==/UserScript==

function zoekOpdracht() {
  /*
    Elementen met de volgende classes worden later op de DOM geplaatst,
    bijvoorbeeld: na het voltooien van een zoekopdracht binnen "Eigen Woningen".
  */
  SetRoleAndLabelForClass("fa fa-bars hoverIcon","button","Menu: acties");
  SetRoleAndLabelForClass("fa fa-print printerIcon","button","Printen");
  /*
    [ Na-controle: uitgeschakeld ]
    console.log("****** Realworks CRM: eind. (onchange event) ******");
  */
}

window.onchange = function() {
  /*
    Als de inhoud van de pagina veranderd, dan de volgende functie uitvoeren na 5 seconden.
    5 seconden is ruim genomen. Een zoekopdracht duurt meestal niet zo lang.
  */
  setTimeout(zoekOpdracht, 5000);
};

window.onload = function() {
  SetRoleAndLabelForID("helpIcon","button","Bekijk de verbeteringen");
  SetRoleAndLabelForID("quicklaunch_fullscreen","button","Open dit scherm in een nieuw venster");
  SetRoleAndLabelForID("quicklaunch_add","button","voeg nieuwe widget toe");
  SetRoleAndLabelForID("helpMenu_container","button","Menu: help onderwerpen");
  SetRoleAndLabelForID("quickMenu_container","button","Menu: snelmenu");
  SetRoleAndLabelForID("reportMenu_container","button","Menu: exporteren");
  SetRoleAndLabelForID("notificationIcon","button","Berichten");
  SetRoleAndLabelForID("logo","button","Hoofdpagina");
  SetRoleAndLabelForID("searchbar_button","button","Zoeken");
  SetRoleAndLabelForID("buttonmenu_buttonmodify","button","Wijzigen");
  SetRoleAndLabelForID("toplevelActionmenu","button","Hoofdmenu: acties");
  SetRoleAndLabelForID("generated2_7","button","Menu: weergave instellingen");
  SetRoleAndLabelForID("generated2_9","button","Voeg bestanden toe vanuit correspondentie");
  SetRoleAndLabelForID("lercode_image_new","button","Nieuwe relatie");
  SetRoleAndLabelForID("lepcode_image_new","button","Nieuw project");
  SetRoleAndLabelForID("lepcode_image1","button","Project zoeken");
  SetRoleAndLabelForID("lercode_image1","button","Relatie zoeken");
  SetRoleAndLabelForID("lepcode_image2","button","Pop-up: waarschuwing");
  SetRoleAndLabelForID("lercode_image2","button","Pop-up: waarschuwing");
  SetRoleAndLabelForID("lepcode_image_delete","button","Verwijderen");
  SetRoleAndLabelForID("lepcode_image_options","button","Menu: opties");
  SetRoleAndLabelForID("lepcode_img_tooltip","button","Pop-up: informatie");
  SetRoleAndLabelForID("lercode_image_delete","button","Verwijderen");
  SetRoleAndLabelForID("lercode_image_options","button","Menu: opties");
  SetRoleAndLabelForID("lercode_img_tooltip","button","Pop-up: informatie");
  SetRoleAndLabelForID("pmcode_image_delete","button","Verwijderen");
  SetRoleAndLabelForID("pmcode_image_options","button","Menu: opties");
  SetRoleAndLabelForID("lismcode_image1","button","Accountmanager zoeken");
  SetRoleAndLabelForID("lismcode_image_options","button","Menu: opties");
  SetRoleAndLabelForID("lismcode_image_delete","button","Verwijderen");
  SetRoleAndLabelForID("tpcode_image_delete","button","Verwijderen");
  SetRoleAndLabelForID("tpcode_image_options","button","Menu: opties");
  SetRoleAndLabelForID("trcode_image_delete","button","Verwijderen");
  SetRoleAndLabelForID("trcode_image_options","button","Menu: opties");
  SetAttributeForClassname("aria-label","fa fa-print printerIcon","Printen");
  SetRoleAndLabelForClass("fa fa-bars hoverIcon","button","Acties");
  SetRoleAndLabelForClass("modify fa fa-pencil help tooltipstered gridMenuButton","button","Wijzigen");
  SetRoleAndLabelForClass("fa fa-pencil help tooltipstered gridMenuButton","button","Wijzigen");
  SetRoleAndLabelForClass("new fa fa-plus help tooltipstered gridMenuButton","button","Nieuw");
  SetRoleAndLabelForClass("fa fa-plus help tooltipstered gridMenuButton","button","Nieuw");
  SetRoleAndLabelForClass("markInactive fa fa-eye-slash help tooltipstered gridMenuButton","button","Op actief of inactief zetten");
  SetRoleAndLabelForClass("fa fa-eye-slash help tooltipstered gridMenuButton","button","Op actief of inactief zetten");
  SetRoleAndLabelForClass("inactive_1 inactiveButton help fa fa-eye tooltipstered gridMenuButton","button","Menu: alles, actief of inactief");
  SetRoleAndLabelForClass("base base-nwwi-versturen help tooltipstered gridMenuButton","button","NWWI opdrachten");
  SetRoleAndLabelForClass("component actionMenu gridMenuButton help fa fa-bars tooltipstered","button","Menu: diversen");
  SetRoleAndLabelForClass("searchbutton search expectedAction searchbutton fa fa-search gridMenuButton","button","Zoeken");
  SetRoleAndLabelForClass("labelsearch-icon fa fa-search gridMenuButton","button","Menu: zoeken");
  SetRoleAndLabelForClass("delete fa fa-trash-o help tooltipstered gridMenuButton","button","Verwijder");
  SetRoleAndLabelForClass("fa fa-times labelsearch gridMenuButton","button","Verwijder");
  SetRoleAndLabelForClass("fa fa-calendar gridMenuButton","button","Kalender: Datum kiezen");
  SetRoleAndLabelForClass("labelSearchPopUpImg fa fa-info-circle tooltipstered","button","Pop-up: informatie");
  SetRoleAndLabelForClass("gridMenuButton alert fa fa-exclamation-triangle tooltipstered","button","Melding: waarschuwing");
  SetRoleAndLabelForClass("fa fa-square-o help tooltipstered gridMenuButton","button","Bekijk");
  SetRoleAndLabelForClass("singlesearchbutton standalone searchbutton fa fa-search gridMenuButton","button","Zoeken");
  SetRoleAndLabelForClass("standalone searchbutton fa fa-search tooltipstered gridMenuButton","button","Zoeken");
  SetRoleAndLabelForClass("labelsearch-icon fa fa-bars tooltipstered gridMenuButton","button","Menu: diversen");
  SetRoleAndLabelForClass("fa fa-download help tooltipstered gridMenuButton","button","Open");
  SetRoleAndLabelForClass("fa fa-close help tooltipstered gridMenuButton","button","Sluit venster");
  SetRoleAndLabelForClass("fa fa-check help tooltipstered gridMenuButton","button","Voeg toe / selecteer");
  SetRoleAndLabelForClass("fa fa-edit help tooltipstered gridMenuButton","button","Wijzigen");
  SetRoleAndLabelForClass("fa fa-heart help tooltipstered gridMenuButton","button","Matchmaker");
  SetRoleAndLabelForClass("component actionMenu gridMenuButton help base base-funda tooltipstered","button","Menu: funda");
  SetRoleAndLabelForClass("base base-tiara help tooltipstered gridMenuButton","button","Doorsturen naar Tiara");
  SetRoleAndLabelForClass("component actionMenu gridMenuButton help fa fa-plus tooltipstered","button","Menu: nieuw");
  SetRoleAndLabelForClass("icon fa fa-arrow-down","button","Menu: keuze");
  SetRoleAndLabelForClass("selecticon fa fa-sort","button","Menu: opties");
  SetRoleAndLabelForClass("select formelement","button","Menu: opties");
  SetRoleAndLabelForClass("save fa fa-floppy-o help tooltipstered gridMenuButton","button","Bewaar");
  SetRoleAndLabelForClass("save close base base-bewaar-sluit help tooltipstered gridMenuButton","button","Bewaar en sluit");
  SetRoleAndLabelForClass("fa fa-print help tooltipstered gridMenuButton","button","Printen");
  SetRoleAndLabelForClass("close fa fa-times help tooltipstered gridMenuButton","button","Sluiten");
  SetRoleAndLabelForClass("gwt-HTML attachment fa fa-paperclip gridMenuButton tooltipstered","button","Bijlagen");
  SetRoleAndLabelForClass("emailReadonlyAttachmentsButton help fa-paperclip fa tooltipstered gridMenuButton","button","Bijlagen");
  SetRoleAndLabelForClass("base base-bewaar-nieuw help tooltipstered gridMenuButton","button","Bewaar / nieuw");
  SetRoleAndLabelForClass("base base-bewaar-kopieer help tooltipstered gridMenuButton","button","Bewaar / kopieer");
  SetRoleAndLabelForClass("fa help tooltipstered fa-send gridMenuButton","button","Actie");
  SetRoleAndLabelForClass("nextitem fa fa-chevron-right help tooltipstered gridMenuButton","button","Volgende taak");
  SetRoleAndLabelForClass("previousitem fa fa-chevron-left help tooltipstered gridMenuButton","button","Vorige taak");
  SetRoleAndLabelForClass("fa fa-refresh help tooltipstered gridMenuButton","button","Vernieuwen");
  SetRoleAndLabelForClass("fa fa-institution help tooltipstered gridMenuButton","button","Kadaster online");
  /*
    [ Specifiek voor: agenda ]
  */
  SetLabelForClassname("newAppointmentLink fa fa-plus-circle","Nieuwe afspraak");
  SetRoleAndLabelForID("generated2_6","button","Menu: agenda instellingen");
  SetRoleAndLabelForID("doorzoekAgenda","button","Doorzoek agenda");
  SetRoleAndLabelForID("weergaveSelection","button","Weergave overzicht");
  SetRoleAndLabelForID("deleteAgenda","button","Verwijder");
  SetRoleAndLabelForID("inactive___button","button","Weer te geven afspraken");
  SetRoleAndLabelForID("vernieuwAgenda","button","Vernieuwen");
  /*
    [ Specifiek voor: agenda - nieuwe afspraak ]
  */
  SetRoleAndLabelForID("agobjcode_image_new","button","Nieuw project");
  SetRoleAndLabelForID("agrcode_image_new","button","Nieuwe relatie");
  SetRoleAndLabelForID("agobjcode_image1","button","Project zoeken");
  SetRoleAndLabelForID("agrcode_image1","button","Relatie zoeken");
  SetRoleAndLabelForID("genodigden_image_new","button","Genodigden toevoegen");
  SetRoleAndLabelForID("genodigden_image1","button","Genodigden zoeken");
  SetRoleAndLabelForID("agendabuttonmenu_buttonsave","button","Bewaar");
  SetRoleAndLabelForID("agendabuttonmenu_buttonsaveclose","button","Bewaar en sluit venster");
  SetRoleAndLabelForID("generated2_14","button","Workflow");
  /*
    [ Specifiek voor: nieuwe e-mail ]
  */
  SetRoleAndLabelForID("sendButton","button","Versturen");
  SetRoleAndLabelForID("bijlagen_button","button","Bijlagen");
  SetRoleAndLabelForID("source_button","button","Download");
  SetRoleAndLabelForID("templateCombo","button","Menu: e-mail templates");
  SetRoleAndLabelForID("cancelButton","button","Annuleren");
  SetLabelForIDForID("newmail_button","Nieuwe e-mail opstellen");
  SetLabelForIDForID("corres_button","Bewaren");
  SetLabelForIDForID("reply_button","Beantwoorden");
  SetLabelForIDForID("replytoall_button","Allen beantwoorden");
  SetLabelForIDForID("forward_button","Doorsturen");
  SetLabelForIDForID("move_button","Menu: verplaatsen naar...");
  SetLabelForIDForID("print_button","Afdrukken");
  SetLabelForIDForID("trash_button","Verwijderen");
  /*
    [ Specifiek voor: eigen woningen ]
  */
  SetLabelForClassname("hitarea expandable-hitarea lastExpandable-hitarea","Uitklappen");
  SetRoleAndLabelForID("lisrcode_image1","button","Relatie zoeken");
  SetRoleAndLabelForID("lisrcode_image_options","button","Menu: opties");
  SetRoleAndLabelForID("lisrcode_image_delete","button","Verwijderen");
  SetRoleAndLabelForID("generated2_76","button","Ga door");
  /*
    [ Na-controle: uitgeschakeld ]
    console.log("****** Realworks CRM: eind. (onload event) ******");
  */
};

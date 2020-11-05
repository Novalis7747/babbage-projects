// ==UserScript==
// @name        Realworks CRM - Agenda
// @namespace   http://www.babbage.com/
// @description Realworks CRM - Agenda
// @include     *://crm.realworks.nl/servlets/objects/rela.agenda/*
// @require     http://www.babbage.com/library/Babbage_Javascript_Library.js
// @version     0.1.1
// @grant   		none
// ==/UserScript==
console.log('****** CRM Agenda: begin van script ******');
// Rol en labels instellen voor alle elementen die voorzien zijn van een ID.
SetRoleAndLabelForID('helpIcon', 'button', 'Bekijk de verbeteringen');
SetRoleAndLabelForID('generated2_6', 'button', 'Menu: agenda instellingen');
SetRoleAndLabelForID('helpMenu_container', 'button', 'Menu: help onderwerpen');
SetRoleAndLabelForID('reportMenu_container', 'button', 'Menu: exporteren');
SetRoleAndLabelForID('doorzoekAgenda', 'button', 'Doorzoek agenda');
SetRoleAndLabelForID('weergaveSelection', 'button', 'Weergave overzicht');
SetRoleAndLabelForID('deleteAgenda', 'button', 'Verwijder');
SetRoleAndLabelForID('inactive___button', 'button', 'Weer te geven afspraken');
SetRoleAndLabelForID('vernieuwAgenda', 'button', 'Vernieuwen');
console.log('****** CRM Agenda: eind van script ******');
/*
  SetRoleAndLabelForID('quicklaunch_fullscreen', 'button', 'Open dit scherm in een nieuw venster');
  SetRoleAndLabelForID('quicklaunch_add', 'button', 'Voeg nieuwe widget toe');
  SetRoleAndLabelForID('notificationIcon', 'button', 'Berichten');
*/
/*
  GreaseMonkey script wordt te snel uitgevoerd. Sommige elementen worden dan nog niet gevonden.
  Met een Java Bookmarklet worden ze wel gevonden. Zelfde code. Methode om GM met een sneltoets te starten?
*/

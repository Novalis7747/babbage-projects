// ==UserScript==
// @name        Realworks CRM - Agenda - Scratchpad
// @namespace   http://www.babbage.com/
// @description Realworks CRM - Agenda - Scratchpad
// @include     *://crm.realworks.nl/servlets/objects/rela.agenda/*
// @require     http://www.babbage.com/library/Babbage_Javascript_Library.js
// @version     0.1.1
// @grant   		none
// ==/UserScript==

console.log('****** CRM Agenda: begin van script ******');

// Logboek test. Vindt GM het element uberhaupt wel?
function logBook(Class_Name) {
  console.log('Functie logBook:');
  var x = document.getElementsByClassName(Class_Name);
  for (var i = 0; i < x.length; i++) {
    console.log(x);
  }
}

// Logboek test - deel 2. Vindt GM het element uberhaupt wel met een andere selector method?
function logBookPart2(dot_Class_Name) {
  console.log('Functie logBook Part 2:');
  var y = document.querySelectorAll(dot_Class_Name);
  for (var i = 0; i < y.length; i++) {
    console.log(y);
  }
}

// Logboek test - deel 3 inmiddels. In JSFiddle werkt dit. Source: http://jsfiddle.net/j1tpkfa5/
function logBookPart3(multiple_Class_Names) {
  console.log('Functie logBook Part 3:');
  var xy = document.getElementsByClassName(multiple_Class_Names);
  for(var i = 0; i<xy.length; i++) {
    xy[i].style['color'] = 'white';
    xy[i].style['background-color'] = 'red';
    xy[i].style['width'] = '50px';
    console.log(xy);
  }
}

// Roep de logboek functies aan om te zien of de volgende class names gevonden worden: (CTRL + SHIFT + j)
logBook('agenda');
logBook('.fa.fa-backward');
logBookPart2('.fa.fa-backward');
logBookPart3('calendar');

/*
  Plaatst alleen een knop. Knop is niet te gebruiken. Puur als test.
  Als de knop op het scherm zichtbaar is, dan is in ieder geval de vorige code uitgevoerd.
*/
var btn = document.createElement("BUTTON");
    document.body.appendChild(btn);
    btn.innerHTML=Date();
    btn.id="A2345";

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

// Test of het op deze manier wel wil werken. Andere manier van class namen noteren.
SetRoleAndLabelForClass('fa fa-backward', 'button', 'Navigeren');

// Deze functies worden wel uitgevoerd, maar hebben vooralsnog geen resultaat.
SetRoleAndLabelForClass('fa fa-backward', 'button', 'Navigeren');
SetRoleAndLabelForClass('newAppointmentLink fa fa-plus-circle', 'button', 'Nieuwe afspraak plannen');

// var el = document.getElementsByClassName('fa' + ' fa-refresh');
var el = document.getElementsByClassName('fa fa-phone');
console.log(el);

var testOpFa = document.getElementsByClassName('fa');
console.log(testOpFa);

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

/*
  Aantal JSFiddle testen, die naar eigen inzicht aan te passen zijn:
  - http://jsfiddle.net/etrvvacq/
  - http://jsfiddle.net/ramswaroop/br21uzk7/
*/

// ==UserScript==
// @name        SharePoint - Planning.
// @namespace   http://www.babbage.com/ .
// @description Toegankelijkheid van het rooster binnen SharePoint verbeteren.
// @include     *://samenwerking.cz.nl/sites/Debiteurenbeheer/*
// @version     20171024. Final. (IE 10 render modus).
// @grant       none
// ==/UserScript==

/* --- [ GLOBALE VARIABELEN ] ---
   De "console.log" regels zijn voor debugging doeleinden. Om de "console.log" meldingen uit
   te schakelen dient de volgende VARIABELE op 0 gezet te worden: */
var localDebug = 0;

/* --- [ AANPASSINGEN SPECIFIEK VOOR SHAREPOINT - PLANNING ] ---
   De "setInterval" is nodig omdat als je van WEEK naar DAG weergave schakelt er geen trigger
   is. Alles wordt over elkaar heen gerenderd. */
setInterval(function() {
  if (localDebug === 1) {
    console.log("Begin van het SHAREPOINT - PLANNING script");
  }
  if (window.document.getElementsByClassName("ms-acal-item") !== null) {
    var calItems = window.document.getElementsByClassName("ms-acal-item");
    for (var i = 0; i < calItems.length; i++) {
      var divTitel = calItems[i].getAttribute("title");
      calItems[i].setAttribute("aria-label", divTitel);
      calItems[i].setAttribute("role", "navigation");
    }
  }
  // Met de volgende "console.log" melding controleer of je het script tot het eind wordt uitgevoerd:
  if (localDebug === 1) {
    console.log("Eind van het SHAREPOINT - PLANNING script");
  }
}, 2500);

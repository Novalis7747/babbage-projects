// ==UserScript==
// @name        PZP - Zorgvinder.
// @namespace   http://www.babbage.com/
// @description Toegankelijkheid van de webapplicatie Zorgvinder verbeteren.
// @include     *://applicaties.cz.nl/*
// @version     20171024. Final. (IE EDGE render modus).
// @grant       none
// ==/UserScript==

/* --- [ GLOBALE VARIABELEN ] ---
   De "console.log" regels zijn voor debugging doeleinden. Om de "console.log" meldingen uit
   te schakelen dient de volgende VARIABELE op 0 gezet te worden: */
var localDebug = 0;

/*  --- [ AANPASSINGEN SPECIFIEK VOOR PZP ] ---
URL: "https://applicaties.cz.nl/externe%20modules/zorgvergelijker/index.html" */
setInterval(function() {
  if (localDebug === 1) {
    console.log("Begin van het PZP script");
  }
  if (document.getElementsByTagName("img") !== null) {
    var contractMarker = document.getElementsByTagName("img");
    for (var i = 0; i < contractMarker.length; ++i) {
      if (contractMarker[i].src === "https://applicaties.cz.nl/externe%20modules/zorgvergelijker/images/check/check-green.png") {
        contractMarker[i].parentElement.setAttribute("aria-label", "groen vinkje");
        contractMarker[i].setAttribute("alt", "groen vinkje");
      } else if (contractMarker[i].src === "https://applicaties.cz.nl/externe%20modules/zorgvergelijker/images/check/check-orange.png") {
        contractMarker[i].parentElement.setAttribute("aria-label", "oranje vinkje");
        contractMarker[i].setAttribute("alt", "oranje vinkje");
      } else if (contractMarker[i].src === "https://applicaties.cz.nl/externe%20modules/zorgvergelijker/images/check/check-blue.png") {
        contractMarker[i].parentElement.setAttribute("aria-label", "blauw vinkje");
        contractMarker[i].setAttribute("alt", "blauw vinkje");
      } else if (contractMarker[i].src === "https://applicaties.cz.nl/externe%20modules/zorgvergelijker/images/check/cross-red.png") {
        contractMarker[i].parentElement.setAttribute("aria-label", "rood kruisje");
        contractMarker[i].setAttribute("alt", "rood kruisje");
      } else if (contractMarker[i].src === "https://applicaties.cz.nl/externe%20modules/zorgvergelijker/images/contract_nee.png") {
        contractMarker[i].parentElement.setAttribute("aria-label", "rood kruisje");
        contractMarker[i].setAttribute("alt", "rood kruisje");
      } else {
        continue;
      }
    }
  }
  // Met de volgende "console.log" melding controleer of je het script tot het eind wordt uitgevoerd:
  if (localDebug === 1) {
    console.log("Eind van het PZP script");
  }
}, 5000);

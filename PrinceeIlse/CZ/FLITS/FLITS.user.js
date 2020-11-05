// ==UserScript==
// @name        FLITS.
// @namespace   http://www.babbage.com/ , http://jsbin.com/?html,js,output en http://esprima.org/demo/validate.html .
// @description Toegankelijkheid van de webapplicatie FLITS verbeteren.
// @include     *://flits/*
// @version     20171024. Final. (IE EDGE render modus).
// @grant       none
// ==/UserScript==

// --- [ GLOBALE VARIABELEN ] ---
// Voorkomt het meervoudig uitvoeren van dit script, wordt gereset na 3,5 seconden:
var runOnce;
/* De "console.log" regels zijn voor debugging doeleinden. Om de "console.log" meldingen uit
   te schakelen dient de volgende VARIABELE op 0 gezet te worden: */
var localDebug = 0;

// --- [ AANPASSINGEN SPECIFIEK VOOR FLITS ] ---
setTimeout(function() {
  if (localDebug === 1) {
    console.log("Begin van het FLITS script");
  }
  // Voorkomt het meervoudig uitvoeren van dit script, wordt gereset na 3,5 seconden:
  if (!runOnce) {
    runOnce = true;
    var menuFrame = window.frames["menu"];
    var mainFrame = window.frames["inhoud"];
    // Split de URL, alles na de "?" is voor het script niet van toepassing en kan verwijderd worden:
    var mainFrameUrl = mainFrame.location.href.split("?")[0].toLocaleLowerCase();
    // Zet een navigatie marker bovenaan het menuframe en hoofdframe en voorzie deze van een label:
    menuFrame.document.body.setAttribute("role", "navigation");
    menuFrame.document.body.setAttribute("aria-label", "Menu");
    mainFrame.document.body.setAttribute("role", "navigation");
    mainFrame.document.body.setAttribute("aria-label", "Hoofdvenster");
    // Log de URL van de huidige pagina in het hoofdframe:
    if (localDebug === 1) {
      console.log(mainFrameUrl);
    }
    if (mainFrameUrl === "http://flits/tdcrmweb/uc053/algemeenklantbeeld.do" || mainFrameUrl === "http://flits/tdcrmweb/uc053/selecteerincassopartner.do") {
      // Pagina: [ ALGEMEEN KLANTBEELD ]
      var dataFrame = mainFrame.frames["data"];
      var dataFrameImages = dataFrame.document.getElementsByTagName("img");
      var dataFrameInput = dataFrame.document.getElementsByTagName("input");
      var dataFrameHeaders = dataFrame.document.getElementsByClassName("clsKopBenadrukt");
      var dataFrameSubHeaders = dataFrame.document.getElementsByClassName("clsSubKop");
      var dataFrameSSubHeaders = dataFrame.document.getElementsByClassName("clsSubkop");
      // Plaats een markering op alle gebruikte frames, voor snelle navigatie van frame naar frame:
      mainFrame.frames["toolbarx"].document.getElementById("tabs").setAttribute("role", "navigation");
      mainFrame.frames["toolbarx"].document.getElementById("tabs").setAttribute("aria-label", "Tabbladen");
      mainFrame.frames["data"].document.body.setAttribute("role", "navigation");
      mainFrame.frames["data"].document.body.setAttribute("aria-label", "Data");
      // Plaats een markering op alle koppen en subkoppen:
      for (var i = 0; i < dataFrameHeaders.length; i++) {
        dataFrameHeaders[i].setAttribute("role", "navigation");
      }
      for (var i = 0; i < dataFrameSubHeaders.length; i++) {
        dataFrameSubHeaders[i].setAttribute("role", "navigation");
      }
      for (var i = 0; i < dataFrameSSubHeaders.length; i++) {
        dataFrameSSubHeaders[i].setAttribute("role", "navigation");
      }
      // Plaats labels op alle radio buttons, op basis van hun eigen value attribute:
      for (var i = 0; i < dataFrameInput.length; i++) {
        var getType = dataFrameInput[i].getAttribute("type").toLocaleLowerCase();
        if (getType === "radio") {
          var getValue = dataFrameInput[i].getAttribute("value").toLocaleLowerCase().replace(/_/g, " ");
          dataFrameInput[i].setAttribute("aria-label", getValue);
        }
      }
      // Zorg dat de links met een afbeelding als knop behandeld wordt met label, voor uniformiteit M.B.T. gebruik:
      for (var i = 0; i < dataFrameImages.length; i++) {
        dataFrameImages[i].setAttribute("role", "button");
        var dataFrameImagesSource = dataFrameImages[i].src.toLocaleLowerCase();
        if (dataFrameImagesSource === "http://flits/tdcrmweb/uiframework/images/refresh.gif") {
          dataFrameImages[i].setAttribute("aria-label", "Verversen");
        }
      }
    }
    if (mainFrameUrl === "http://flits/tdcrmweb/uc999/zoekdebiteurcrediteur.do") {
      // Pagina: [ ALGEMEEN ZOEKVENSTER BINNEN FLITS ]
      var dataFrameBirthday = mainFrame.document.getElementsByTagName("input");
      // Plaats labels op de invoervelden die betrekking hebben op de geboortedatum:
      for (var i = 0; i < dataFrameBirthday.length; i++) {
        var inputName = dataFrameBirthday[i].getAttribute("name");
        if (inputName === "geboortedatumDD") {
          dataFrameBirthday[i].setAttribute("aria-label", "Geboortedag");
        } else if (inputName === "geboortedatumMM") {
          dataFrameBirthday[i].setAttribute("aria-label", "Geboortemaand");
        } else if (inputName === "geboortedatumJJJJ") {
          dataFrameBirthday[i].setAttribute("aria-label", "Geboortejaar");
        }
      }
    }
    if (mainFrameUrl === "http://flits/tdcrmweb/uc112/zoekbetaling.do" || mainFrameUrl === "http://flits/tdcrmweb/uc069/zoekbetaling.do") {
      // Pagina: [ RAADPLEGEN BETALING & CORRIGEREN \ MATCHING BETALING ]
      var dataFrameBooking = mainFrame.document.getElementsByTagName("input");
      // Plaats labels op de invoervelden die betrekking hebben op de boekingsdata:
      for (var i = 0; i < dataFrameBooking.length; i++) {
        var inputName = dataFrameBooking[i].getAttribute("name");
        if (inputName === "boekdatumCDD" || inputName === "boekdatumDDD") {
          dataFrameBooking[i].setAttribute("aria-label", "Boekdag");
        } else if (inputName === "boekdatumCMM" || inputName === "boekdatumDMM") {
          dataFrameBooking[i].setAttribute("aria-label", "Boekmaand");
        } else if (inputName === "boekdatumCJJJJ" || inputName === "boekdatumDJJJJ") {
          dataFrameBooking[i].setAttribute("aria-label", "Boekjaar");
        }
      }
    }
    if (mainFrameUrl === "http://flits/tdcrmweb/uc113/selecterennotas.do") {
      // Pagina: [ BLOKMUTATIE NOTA'S ]
      var radioButtons = mainFrame.document.getElementsByTagName("input");
      for (var i = 0; i < radioButtons.length; ++i) {
        if (radioButtons[i].getAttribute("name") == "keuzeAsString") {
          if (radioButtons[i].getAttribute("value") == "DEBET") {
            radioButtons[i].setAttribute("aria-label", "Debet nota's");
          } else if (radioButtons[i].getAttribute("value") == "CREDIT") {
            radioButtons[i].setAttribute("aria-label", "Credit nota's");
          } else if (radioButtons[i].getAttribute("value") == "GBER") {
            radioButtons[i].setAttribute("aria-label", "Gespreid betalen ER");
          }
        } else if (radioButtons[i].getAttribute("name") == "statusSelectieAsString") {
          if (radioButtons[i].getAttribute("value") == "CREDIT_OPENNIEUW_INRESTITUTIE_BEVROREN") {
            radioButtons[i].setAttribute("aria-label", "Open-nieuw / in restitutie / bevroren");
          } else if (radioButtons[i].getAttribute("value") == "GBER") {
            radioButtons[i].setAttribute("aria-label", "Debet: gevorderd / bevroren / geparkeerd / incassopartner / afboeking oninbaar. Credit: open-nieuw / in restitutie / bevroren");
          } else if (radioButtons[i].getAttribute("value") == "DEBET_GEVORDERD_BEVROREN_GEPARKEERD") {
            radioButtons[i].setAttribute("aria-label", "Gevorderd / bevroren / geparkeerd");
          } else if (radioButtons[i].getAttribute("value") == "DEBET_BEVROREN_GEPARKEERD_INCASSOPARTNER") {
            radioButtons[i].setAttribute("aria-label", "Bevroren / geparkeerd gekoppeld aan dossier");
          } else if (radioButtons[i].getAttribute("value") == "DEBET_TE_VORDEREN") {
            radioButtons[i].setAttribute("aria-label", "(Opnieuw) te vorderen");
          } else if (radioButtons[i].getAttribute("value") == "DEBET_INCASSOPARTNER") {
            radioButtons[i].setAttribute("aria-label", "Incassopartner");
          } else if (radioButtons[i].getAttribute("value") == "DEBET_AFGEBOEKT_ONINBAAR") {
            radioButtons[i].setAttribute("aria-label", "Afboeking oninbaar");
          } else if (radioButtons[i].getAttribute("value") == "DEBET_SCHULDREGELING") {
            radioButtons[i].setAttribute("aria-label", "Schuldregeling");
          }
        }
      }
    }
    if (mainFrameUrl === "http://flits/tdcrmweb/uc250/mandaatlijst.do") {
      // Pagina: [ MANDAATBEHEER ]
      var dataFrameImages = mainFrame.document.getElementsByTagName("img");
      var dataFrameHeaders = mainFrame.document.getElementsByClassName("clsKop");
      var dataFrameSubHeaders = mainFrame.document.getElementsByClassName("clsSubKop");
      // Zorg dat de links met een afbeelding als knop behandeld wordt, voor uniformiteit M.B.T. gebruik:
      for (var i = 0; i < dataFrameImages.length; i++) {
        dataFrameImages[i].setAttribute("role", "button");
      }
      // Plaats een markering op alle koppen en subkoppen:
      for (var i = 0; i < dataFrameHeaders.length; i++) {
        dataFrameHeaders[i].setAttribute("role", "navigation");
      }
      for (var i = 0; i < dataFrameSubHeaders.length; i++) {
        dataFrameSubHeaders[i].setAttribute("role", "navigation");
      }
    }
    if (mainFrameUrl === "http://flits/werkbakweb/werkbakoverzicht.do" || mainFrameUrl === "http://flits/werkbakweb/werkopdrachtoverzicht.do") {
      // Pagina: [ HANDMATIG MATCHEN INKOMENDE BETALING ]
      var dataFrameImages = mainFrame.document.getElementsByTagName("img");
      // Zorg dat de links met een afbeelding als knop behandeld wordt met label, voor uniformiteit M.B.T. gebruik:
      for (var i = 0; i < dataFrameImages.length; i++) {
        var dataFrameImagesSource = dataFrameImages[i].src.toLocaleLowerCase();
        if (dataFrameImagesSource === "http://flits/werkbakweb/uiframework/images/yes.gif") {
          dataFrameImages[i].setAttribute("aria-label", "Uitroepteken match");
          dataFrameImages[i].setAttribute("role", "button");
        } else if (dataFrameImagesSource === "http://flits/werkbakweb/uiframework/images/tri.gif") {
          dataFrameImages[i].setAttribute("aria-label", "Rode pijl rechts");
          dataFrameImages[i].setAttribute("role", "button");
        }
      }
    }
    if (mainFrameUrl === "http://flits/tdcrmweb/uc008/wijzigdebcred.do" || mainFrameUrl === "http://flits/tdcrmweb/uc008/editmemo.do") {
      // Pagina: [ WIJZIG DEBITEUR / CREDITEUR ]
      var dataFrameImages = mainFrame.document.getElementsByTagName("img");
      var dataFrameExpire = mainFrame.document.getElementsByTagName("input");
      // Zorg dat de links met een afbeelding als knop behandeld wordt met label, voor uniformiteit M.B.T. gebruik:
      for (var i = 0; i < dataFrameImages.length; i++) {
        var dataFrameImagesSource = dataFrameImages[i].src.toLocaleLowerCase();
        if (dataFrameImagesSource === "http://flits/tdcrmweb/uiframework/images/edit.gif") {
          dataFrameImages[i].setAttribute("aria-label", "Wijzigen");
          dataFrameImages[i].setAttribute("role", "button");
        } else if (dataFrameImagesSource === "http://flits/tdcrmweb/uiframework/images/delete.gif") {
          dataFrameImages[i].setAttribute("aria-label", "Verwijderen");
          dataFrameImages[i].setAttribute("role", "button");
        }
      }
      // Plaats labels op de invoervelden die betrekking hebben op de vervaldata van de memo:
      for (var i = 0; i < dataFrameExpire.length; i++) {
        var inputName = dataFrameExpire[i].getAttribute("name");
        if (inputName === "memo_datumVervalDD") {
          dataFrameExpire[i].setAttribute("aria-label", "Vervaldag");
        } else if (inputName === "memo_datumVervalMM") {
          dataFrameExpire[i].setAttribute("aria-label", "Vervalmaand");
        } else if (inputName === "memo_datumVervalJJJJ") {
          dataFrameExpire[i].setAttribute("aria-label", "Vervaljaar");
        }
      }
    }
    if (mainFrameUrl === "http://flits/tdcrmweb/uc130/registreerstabilisatieovereenkomst.do" || mainFrameUrl === "http://flits/tdcrmweb/uc138/registreeruitsluitenvazacties.do" || mainFrameUrl === "http://flits/tdcrmweb/uc161/wsnp.do" || mainFrameUrl === "http://flits/tdcrmweb/uc160/faillissement.do" || mainFrameUrl === "http://flits/tdcrmweb/uc159/finalekwijting.do" || mainFrameUrl === "http://flits/tdcrmweb/uc158/onderbewindvoering.do") {
      // Pagina: [ REGISTREREN STABILISATIE OVEREENKOMST & UITSLUITEN DEBCRED VAN VAZ ACTIES & ALLE SUBPAGINA'S VAN SCHULDSANERING ]
      var dataFrameEntry = mainFrame.document.getElementsByTagName("input");
      // Plaats labels op de invoervelden die betrekking hebben op de ingangsdata van de memo:
      for (var i = 0; i < dataFrameEntry.length; i++) {
        var inputName = dataFrameEntry[i].getAttribute("name");
        if (inputName === "datumIngang.datumDD" || inputName === "datumIngangDD") {
          dataFrameEntry[i].setAttribute("aria-label", "Ingangsdag");
        } else if (inputName === "datumIngang.datumMM" || inputName === "datumIngangMM") {
          dataFrameEntry[i].setAttribute("aria-label", "Ingangsmaand");
        } else if (inputName === "datumIngang.datumJJJJ" || inputName === "datumIngangJJJJ") {
          dataFrameEntry[i].setAttribute("aria-label", "Ingangsjaar");
        } else if (inputName === "datumEindeDD") {
          dataFrameEntry[i].setAttribute("aria-label", "Einddag");
        } else if (inputName === "datumEindeMM") {
          dataFrameEntry[i].setAttribute("aria-label", "Eindmaand");
        } else if (inputName === "datumEindeJJJJ") {
          dataFrameEntry[i].setAttribute("aria-label", "Eindjaar");
        }
      }
    }
    if (mainFrameUrl === "http://flits/tdcrmweb/uc086/selecteerbetalingsoverzicht.do") {
      // Pagina: [ BETALINGSOVERZICHT ]
      var dataFrameEntry = mainFrame.document.getElementsByTagName("input");
      // Plaats labels op de invoervelden die betrekking hebben op de contactdata van de klant:
      for (var i = 0; i < dataFrameEntry.length; i++) {
        var inputName = dataFrameEntry[i].getAttribute("name");
        if (inputName === "datumKlantcontact.datumDD") {
          dataFrameEntry[i].setAttribute("aria-label", "Dag van contact");
        } else if (inputName === "datumKlantcontact.datumMM") {
          dataFrameEntry[i].setAttribute("aria-label", "Maand van contact");
        } else if (inputName === "datumKlantcontact.datumJJJJ") {
          dataFrameEntry[i].setAttribute("aria-label", "Jaar van contact");
        }
      }
    }
  }
  // Met de volgende "console.log" melding controleer of je het script tot het eind wordt uitgevoerd:
  if (localDebug === 1) {
    console.log("Eind van het FLITS script");
  }
/* Een ONLOAD functie werkt helaas niet vanwege de hoeveelheid frames in frames waardoor er niet altijd
   getriggerd wordt op nieuwe inhoud, daardoor de keus van een SETTIMEOUT functie.
   De VARIABELE "mainFrameUrl" toont dit gedrag ook in de CONSOLE, mits ingeschakeld. */
}, 2500);

/* Het script wordt meerdere malen aangeroepen en uitgevoerd, dit voorkomt dat gedrag.
   3,5 seconden na de initiele aanroep kan het script pas weer uitgevoerd worden door de browser.
   Effectief voer je hiermee het script eenmaal uit. */
setTimeout(function() {
  runOnce = false;
}, 3500);

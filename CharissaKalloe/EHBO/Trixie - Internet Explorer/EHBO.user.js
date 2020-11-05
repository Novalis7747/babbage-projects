// ==UserScript==
// @name        EHBO.
// @namespace   http://www.babbage.com/ en http://jsbin.com/?html,js,output
// @description Toegankelijkheid van de webapplicatie EHBO verbeteren.
// @include     *://url_ehbo/*
// @version     20200710. Alpha. (IE 7 render modus).
// @grant       none
// ==/UserScript==

//  --- [ VARIABELEN ] ---
var runOnce;
var dbg = {OutputDirection:"0000100", level:"0"};
/* De "console.log" regels zijn voor debugging doeleinden. Om de "console.log" meldingen uit
   te schakelen dient de volgende VARIABELE op 0 gezet te worden: */
var localDebug = 0;

//  --- [ BABBAGE JAVASCRIPT LIBRARY ] ---
function calleeWithArguments(Args) {
  return Args.callee.name+"("+Array.prototype.slice.call(Args).join(",")+")";
}

function debugout(dbg, level, msg) {
  var d = new Date();
  var h = d.getHours();
  var m = d.getMinutes();
  var s = d.getSeconds();
  var ms = d.getMilliseconds();
  var ts = h+":"+m+":"+s+":"+ms;
  var MsecSinceMidnight = ms+s*1000+m*60000+h*3600000;
  if (level<=dbg.level) {
    if (dbg.OutputDirection[0] == 1) {}
    if (dbg.OutputDirection[1] == 1) {
      alert(ts+" "+msg);
    }
    if (dbg.OutputDirection[2] == 1) {}
    if (dbg.OutputDirection[3] == 1) {
      GM_setClipboard(ts+" "+msg);
    }
    if (dbg.OutputDirection[4] == 1) {
      console.log(MsecSinceMidnight+"~"+msg);
    }
    if (dbg.OutputDirection[5] == 1) {}
    if (dbg.OutputDirection[6] == 1) {}
  }
}

function SetAttributeForElement(Attribute, Element, Value) {
  debugout(dbg, 350, calleeWithArguments(arguments)+">call>start");
  try {
    debugout(dbg, 400, calleeWithArguments(arguments)+">try>start");
    Element.setAttribute(Attribute, Value);
  } catch(ERR) {
    debugout(dbg, 150, calleeWithArguments(arguments)+">error>"+ERR);
  }
}

function SetAttributeForElements(Attribute, Elements, Value) {
  debugout(dbg, 350, calleeWithArguments(arguments)+">call>start");
  try {
    debugout(dbg, 400, calleeWithArguments(arguments)+">try>start");
    for (var i = 0; i < Elements.length; i++) {
      debugout(dbg, 450, calleeWithArguments(arguments)+">for>start "+i);
      Elements[i].setAttribute(Attribute, Value);
    }
  } catch(ERR) {
    debugout(dbg, 100, calleeWithArguments(arguments)+">error>"+ERR);
  }
}

function SetAttributeForClassname(Attribute, Classname, Value) {
  debugout(dbg, 350, calleeWithArguments(arguments)+">call>start");
  try {
    debugout(dbg, 400, calleeWithArguments(arguments)+">try>start");
    SetAttributeForElements(Attribute, document.getElementsByClassName(Classname), Value);
  } catch(ERR) {
    debugout(dbg, 50, calleeWithArguments(arguments)+">error>"+ERR);
  }
}

function SetAttributeForTagname(Attribute, Tagname, Value) {
  debugout(dbg, 350, calleeWithArguments(arguments)+">call>start");
  try {
    debugout(dbg, 400, calleeWithArguments(arguments)+">try>start");
    SetAttributeForElements(Attribute, document.getElementsByTagName(Tagname), Value);
  } catch(ERR) {
    debugout(dbg, 50, calleeWithArguments(arguments)+">error>"+ERR);
  }
}

function SetAttributeForID(Attribute, Id, Value) {
  debugout(dbg, 350, calleeWithArguments(arguments)+">call>start");
  try {
    debugout(dbg, 400, calleeWithArguments(arguments)+">try>start");
    SetAttributeForElement(document.getElementById(Id), Attribute, Value);
  } catch(ERR) {
    debugout(dbg, 50, calleeWithArguments(arguments)+">error>"+ERR);
  }
}

function SetAttributeForSelector(Attribute, Selector, Value) {
  debugout(dbg, 350, calleeWithArguments(arguments)+">call>start");
  try {
    debugout(dbg, 400, calleeWithArguments(arguments)+">try>start");
    SetAttributeForElements(Attribute, document.querySelectorAll(Selector), Value);
  } catch(ERR) {
    debugout(dbg, 50, calleeWithArguments(arguments)+">error>"+ERR);
  }
}

function SetRoleForElement(Element, Role) {
  debugout(dbg, 350, calleeWithArguments(arguments)+">call>start");
  try {
    debugout(dbg, 400, calleeWithArguments(arguments)+">try>start");
    SetAttributeForElement("role", Element, Role);
  } catch(ERR) {
    debugout(dbg, 150, calleeWithArguments(arguments)+">error>"+ERR);
  }
}

function SetRoleForElements(Elements, Role) {
  debugout(dbg, 350, calleeWithArguments(arguments)+">call>start");
  try {
    debugout(dbg, 400, calleeWithArguments(arguments)+">try>start");
    SetAttributeForElements("role", Elements, Role);
  } catch(ERR) {
    debugout(dbg, 100, calleeWithArguments(arguments)+">error>"+ERR);
  }
}

function SetRoleForClassname(Classname, Role) {
  debugout(dbg, 350, calleeWithArguments(arguments)+">call>start");
  try {
    debugout(dbg, 400, calleeWithArguments(arguments)+">try>start");
    SetAttributeForClassname("role", Classname, Role);
  } catch(ERR) {
    debugout(dbg, 50, calleeWithArguments(arguments)+">error>"+ERR);
  }
}

function SetRoleForTagname(Tagname, Role) {
  debugout(dbg, 350, calleeWithArguments(arguments)+">call>start");
  try {
    debugout(dbg, 400, calleeWithArguments(arguments)+">try>start");
    SetAttributeForTagname("role", tagname, Role);
  } catch(ERR) {
    debugout(dbg, 50, calleeWithArguments(arguments)+">error>"+ERR);
  }
}

function SetRoleForID(Id, Role) {
  debugout(dbg, 350, calleeWithArguments(arguments)+">call>start");
  try {
    debugout(dbg, 400, calleeWithArguments(arguments)+">try>start");
    SetAttributeForID("role", Id, Role);
  } catch(ERR) {
    debugout(dbg, 50, calleeWithArguments(arguments)+">error>"+ERR);
  }
}

function SetRoleForSelector(Selector, Role) {
  debugout(dbg, 350, calleeWithArguments(arguments)+">call>start");
  try {
    debugout(dbg, 400, calleeWithArguments(arguments)+">try>start");
    SetAttributeForSelector("role", Selector, Role);
  } catch(ERR) {
    debugout(dbg, 50, calleeWithArguments(arguments)+">error>"+ERR);
  }
}

function SetAccesskeyForElement(Element, Accesskey) {
  debugout(dbg, 350, calleeWithArguments(arguments)+">call>start");
  try {
    debugout(dbg, 400, calleeWithArguments(arguments)+">try>start");
    SetAttributeForElement("accesskey", Element, Accesskey);
  } catch(ERR) {
    debugout(dbg, 150, calleeWithArguments(arguments)+">error>"+ERR);
  }
}

function SetAccesskeyForID(Id, Accesskey) {
  debugout(dbg, 350, calleeWithArguments(arguments)+">call>start");
  try {
    debugout(dbg, 400, calleeWithArguments(arguments)+">try>start");
    SetAttributeForID("accesskey", Id, Accesskey);
  } catch(ERR) {
    debugout(dbg, 50, calleeWithArguments(arguments)+">error>"+ERR);
  }
}

function SetAccesskeyForSelector(Selector, Accesskey) {
  debugout(dbg, 350, calleeWithArguments(arguments)+">call>start");
  try {
    debugout(dbg, 400, calleeWithArguments(arguments)+">try>start");
    SetAttributeForSelector("accesskey", Selector, Accesskey);
  } catch(ERR) {
    debugout(dbg, 50, calleeWithArguments(arguments)+">error>"+ERR);
  }
}

function SetLabelForElement(Element, Label) {
  debugout(dbg, 350, calleeWithArguments(arguments)+">call>start");
  try {
    debugout(dbg, 400, calleeWithArguments(arguments)+">try>start");
    SetAttributeForElement("aria-label", Element, Label);
  } catch(ERR) {
    debugout(dbg, 150, calleeWithArguments(arguments)+">error>"+ERR);
  }
}

function SetLabelForElements(Elements, Label) {
  debugout(dbg, 350, calleeWithArguments(arguments)+">call>start");
  try {
    debugout(dbg, 400, calleeWithArguments(arguments)+">try>start");
    SetAttributeForElements("aria-label", Elements, Label);
  } catch(ERR) {
    debugout(dbg, 100, calleeWithArguments(arguments)+">error>"+ERR);
  }
}

function SetLabelForClassname(Classname, Label) {
  debugout(dbg, 350, calleeWithArguments(arguments)+">call>start");
  try {
    debugout(dbg, 400, calleeWithArguments(arguments)+">try>start");
    SetAttributeForClassname("aria-label", Classname, Label);
  } catch(ERR) {
    debugout(dbg, 50, calleeWithArguments(arguments)+">error>"+ERR);
  }
}

function SetLabelForTagname(Tagname, Label) {
  debugout(dbg, 350, calleeWithArguments(arguments)+">call>start");
  try {
    debugout(dbg, 400, calleeWithArguments(arguments)+">try>start");
    SetAttributeForTagname("aria-label", Tagname, Label);
  } catch(ERR) {
    debugout(dbg, 50, calleeWithArguments(arguments)+">error>"+ERR);
  }
}

function SetLabelForID(Id, Label) {
  debugout(dbg, 350, calleeWithArguments(arguments)+">call>start");
  try {
    debugout(dbg, 400, calleeWithArguments(arguments)+">try>start");
    SetAttributeForID("aria-label", Id, Label);
  } catch(ERR) {
    debugout(dbg, 50, calleeWithArguments(arguments)+">error>"+ERR);
  }
}

function SetLabelForSelector(Selector, Label) {
  debugout(dbg, 350, calleeWithArguments(arguments)+">call>start");
  try {
    debugout(dbg, 400, calleeWithArguments(arguments)+">try>start");
    SetAttributeForSelector("aria-label", Selector, Label);
  } catch(ERR) {
    debugout(dbg, 50, calleeWithArguments(arguments)+">error>"+ERR);
  }
}

function SetRoleAndLabelForElement(Element, Role, Label) {
  debugout(dbg, 350, calleeWithArguments(arguments)+">call>start");
  try {
    debugout(dbg, 400, calleeWithArguments(arguments)+">try>start");
    SetRoleForElement(Element, Role);
    SetLabelForElement(Element, Label);
  } catch(ERR) {
    debugout(dbg, 150, calleeWithArguments(arguments)+">error>"+ERR);
  }
}

function SetRoleAndLabelForElements(Elements, Role, Label) {
  debugout(dbg, 350, calleeWithArguments(arguments)+">call>start");
  try {
    debugout(dbg, 400, calleeWithArguments(arguments)+">try>start");
    for (var i = 0; i < Elements.length; i++) {
      debugout(dbg, 450, calleeWithArguments(arguments)+">for>start "+i);
      SetRoleForElement(Elements[i], Role);
      SetLabelForElement(Elements[i], Label);
    }
  } catch(ERR) {
    debugout(dbg, 100, calleeWithArguments(arguments)+">error>"+ERR);
  }
}

function SetRoleAndLabelForClassname(Classname, Role, Label) {
  debugout(dbg, 350, calleeWithArguments(arguments)+">call>start");
  try {
    debugout(dbg, 400, calleeWithArguments(arguments)+">try>start");
    SetRoleAndLabelForElements(document.getElementsByClassName(Classname), Role, Label);
  } catch(ERR) {
    debugout(dbg, 50, calleeWithArguments(arguments)+">error>"+ERR);
  }
}

function SetRoleAndLabelForTagname(Tagname, Role, Label) {
  debugout(dbg, 350, calleeWithArguments(arguments)+">call>start");
  try {
    debugout(dbg, 400, calleeWithArguments(arguments)+">try>start");
    SetRoleAndLabelForElements(document.getElementsByTagName(Tagname), Role, Label);
  } catch(ERR) {
    debugout(dbg, 50, calleeWithArguments(arguments)+">error>"+ERR);
  }
}

function SetRoleAndLabelForID(Id, Role, Label) {
  debugout(dbg, 350, calleeWithArguments(arguments)+">call>start");
  try {
    debugout(dbg, 400, calleeWithArguments(arguments)+">try>start");
    SetRoleAndLabelForElement(document.getElementById(Id), Role, Label);
  } catch(ERR) {
    debugout(dbg, 50, calleeWithArguments(arguments)+">error>"+ERR);
  }
}

function SetRoleAndLabelForSelector(Selector, Role, Label) {
  debugout(dbg, 350, calleeWithArguments(arguments)+">call>start");
  try {
    debugout(dbg, 400, calleeWithArguments(arguments)+">try>start");
    SetRoleAndLabelForElements(document.querySelectorAll(Selector), Role, Label);
  } catch(ERR) {
    debugout(dbg, 50, calleeWithArguments(arguments)+">error>"+ERR);
  }
}

function RemoveAttributeFromElement(Attribute, Element) {
  debugout(dbg, 350, calleeWithArguments(arguments)+">call>start");
  try {
    debugout(dbg, 400, calleeWithArguments(arguments)+">try>start");
    Element.removeAttribute(Attribute);
  } catch(ERR) {
    debugout(dbg, 150, calleeWithArguments(arguments)+">error>"+ERR);
  }
}

function RemoveAttributeFromElements(Attribute, Elements) {
  debugout(dbg, 350, calleeWithArguments(arguments)+">call>start");
  try {
    debugout(dbg, 400, calleeWithArguments(arguments)+">try>start");
    for (var i = 0; i < Elements.length; i++) {
      debugout(dbg, 450, calleeWithArguments(arguments)+">for>start "+i);
      Elements[i].removeAttribute(Attribute);
    }
  } catch(ERR) {
    debugout(dbg, 100, calleeWithArguments(arguments)+">error>"+ERR);
  }
}

function RemoveAttributeFromClassname(Attribute, Classname) {
  debugout(dbg, 350, calleeWithArguments(arguments)+">call>start");
  try {
    debugout(dbg, 400, calleeWithArguments(arguments)+">try>start");
    RemoveAttributeFromElements(Attribute, document.getElementsByClassName(Classname));
  } catch(ERR) {
    debugout(dbg, 50, calleeWithArguments(arguments)+">error>"+ERR);
  }
}

function RemoveAttributeFromTagname(Attribute, Tagname) {
  debugout(dbg, 350, calleeWithArguments(arguments)+">call>start");
  try {
    debugout(dbg, 400, calleeWithArguments(arguments)+">try>start");
    RemoveAttributeFromElements(Attribute, document.getElementsByTagName(Tagname));
  } catch(ERR) {
    debugout(dbg, 50, calleeWithArguments(arguments)+">error>"+ERR);
  }
}

function RemoveAttributeFromId(Attribute, Id) {
  debugout(dbg, 350, calleeWithArguments(arguments)+">call>start");
  try {
    debugout(dbg, 400, calleeWithArguments(arguments)+">try>start");
    RemoveAttributeFromElement(document.getElementById(Id), Attribute);
  } catch(ERR) {
    debugout(dbg, 50, calleeWithArguments(arguments)+">error>"+ERR);
  }
}

function RemoveAttributeFromSelector(Attribute, Selector) {
  debugout(dbg, 350, calleeWithArguments(arguments)+">call>start");
  try {
    debugout(dbg, 400, calleeWithArguments(arguments)+">try>start");
    RemoveAttributeFromElements(Attribute, document.querySelectorAll(Selector));
  } catch(ERR) {
    debugout(dbg, 50, calleeWithArguments(arguments)+">error>"+ERR);
  }
}

function ChangeAttributeForElement(OldAttribute, NewAttribute, Element, NewValue) {
  debugout(dbg, 350, calleeWithArguments(arguments)+">call>start");
  try {
    debugout(dbg, 400, calleeWithArguments(arguments)+">try>start");
    RemoveAttributeFromElement(OldAttribute, Element);
    SetAttributeForElement(NewAttribute, Element, NewValue);
  } catch(ERR) {
    debugout(dbg, 150, calleeWithArguments(arguments)+">error>"+ERR);
  }
}

function ChangeAttributeForElements(OldAttribute, NewAttribute, Elements, NewValue) {
  debugout(dbg, 350, calleeWithArguments(arguments)+">call>start");
  try {
    debugout(dbg, 400, calleeWithArguments(arguments)+">try>start");
    for (var i = 0; i < Elements.length; i++) {
      debugout(dbg, 450, calleeWithArguments(arguments)+">for>start "+i);
      ChangeAttributeForElement(OldAttribute, NewAttribute, Elements[i], NewValue);
    }
  } catch(ERR) {
    debugout(dbg, 100, calleeWithArguments(arguments)+">error>"+ERR);
  }
}

function ChangeAttributeForClassname(OldAttribute, NewAttribute, Classname, NewValue) {
  debugout(dbg, 350, calleeWithArguments(arguments)+">call>start");
  try {
    debugout(dbg, 400, calleeWithArguments(arguments)+">try>start");
    ChangeAttributeForElements(OldAttribute, NewAttribute, document.getElementsByClassName(Classname), NewValue);
  } catch(ERR) {
    debugout(dbg, 50, calleeWithArguments(arguments)+">error>"+ERR);
  }
}

function ChangeAttributeForTagname(OldAttribute, NewAttribute, Tagname, NewValue) {
  debugout(dbg, 350, calleeWithArguments(arguments)+">call>start");
  try {
    debugout(dbg, 400, calleeWithArguments(arguments)+">try>start");
    ChangeAttributeForElements(OldAttribute, NewAttribute, document.getElementsByTagName(Tagname), NewValue);
  } catch(ERR) {
    debugout(dbg, 50, calleeWithArguments(arguments)+">error>"+ERR);
  }
}

function ChangeAttributeForID(OldAttribute, NewAttribute, Id, NewValue) {
  debugout(dbg, 350, calleeWithArguments(arguments)+">call>start");
  try {
    debugout(dbg, 400, calleeWithArguments(arguments)+">try>start");
    ChangeAttributeForElement(document.getElementById(Id), OldAttribute, NewAttribute, NewValue);
  } catch(ERR) {
    debugout(dbg, 50, calleeWithArguments(arguments)+">error>"+ERR);
  }
}

function ChangeAttributeForSelector(OldAttribute, NewAttribute, Selector, NewValue) {
  debugout(dbg, 350, calleeWithArguments(arguments)+">call>start");
  try {
    debugout(dbg, 400, calleeWithArguments(arguments)+">try>start");
    ChangeAttributeForElements(OldAttribute, NewAttribute, document.querySelectorAll(Selector), NewValue);
  } catch(ERR) {
    debugout(dbg, 50, calleeWithArguments(arguments)+">error>"+ERR);
  }
}

//  --- [ AANPASSINGEN SPECIFIEK VOOR EHBO ] ---
setTimeout(function() {
  if (localDebug === 1) {
    console.log("Begin van het EHBO script");
  }
  // Voorkomt het meervoudig uitvoeren van dit script, wordt gereset na 3,5 seconden:
  if (!runOnce) {
    runOnce = true;
    var topFrame = window.frames[0];
    var mainFrame = window.frames[3];
    // Split de URL, alles na de "?" is voor het script niet van toepassing en kan verwijderd worden:
    var mainFrameUrl = mainFrame.location.href.split("?")[0].toLowerCase();
    // Zet een navigatie marker bovenaan het topframe en hoofdframe:
    topFrame.document.body.setAttribute("role", "navigation");
    mainFrame.document.body.setAttribute("role", "navigation");
    // Achterhaal op eenvoudige wijze de URL van de inhoud in het hoofdframe:
    if (localDebug === 1) {
      console.log(mainFrameUrl);
    }
    // Controle op de inhoud van het frame, zo kunnen meerdere inhouden van het hoofdframe behandeld worden:
    if (mainFrameUrl === "https://kris/zoeken/zoeken.asp") {
      /* Pagina: [ KLANT ZOEKEN ]
         Zoek alle tables binnen een specifiek element en haal alle WIDTH attributen weg: */
      var zoekVeld = mainFrame.document.getElementById("ZoekForm").getElementsByTagName("table");
      for (var i = 0; i < zoekVeld.length; ++i) {
        zoekVeld[i].removeAttribute("width");
      }
      // Invoervelden strGeboorteDatumRelatieMaand en strGeboorteDatumRelatieJaar voorzien van verborgen labels:
      mainFrame.document.getElementById("strGeboorteDatumRelatieMaand").insertAdjacentHTML("beforebegin", "<label style=\"display:none\" for=\"strGeboorteDatumRelatieMaand\">geboortemaand</label>");
      mainFrame.document.getElementById("strGeboorteDatumRelatieJaar").insertAdjacentHTML("beforebegin", "<label style=\"display:none\" for=\"strGeboorteDatumRelatieJaar\">geboortejaar</label>");
    }
    if (mainFrameUrl === "https://kris/algemeneklantinfo/algklantbeeld.asp") {
      /* Tabblad: [ KLANTBEELD - ALGEMENE KLANT INFO ]
         Plaats een navigation role op ieder TD element waar de colSpan 4 is: */
      var navMarker = mainFrame.document.getElementsByTagName("td");
      for (var i = 0; i < navMarker.length; ++i) {
        if (navMarker[i].getAttribute("colSpan") == 4) {
          navMarker[i].setAttribute("role", "navigation");
        }
      }
    }
    if (mainFrameUrl === "https://kris/detailklant/detailklant.asp") {
      /* Tabblad: [ KLANTBEELD - DETAIL KLANT INFO ]
         Plaats een navigation role op ieder TD element waar de colSpan 4 is: */
      var navMarker = mainFrame.document.getElementsByTagName("td");
      for (var i = 0; i < navMarker.length; ++i) {
        if (navMarker[i].getAttribute("colSpan") == 4) {
          navMarker[i].setAttribute("role", "navigation");
        }
      }
    }
    if (mainFrameUrl === "https://kris/overeenkomsten/overeenkomsten.asp") {
      /* Tabblad: [ KLANTBEELD - OVEREENKOMSTEN ]
         Plaats een label op ieder CLASS element clsTDTeLaat: */
      var colorMarker = mainFrame.document.getElementsByTagName("td");
      for (var i = 0; i < colorMarker.length; ++i) {
        if (colorMarker[i].className == "clsTDTeLaat") {
          colorMarker[i].setAttribute("aria-label", "Rood gemarkeerd - te laat");
        }
      }
    }
    if (mainFrameUrl === "https://kris/machtigingen/detailmachtiging.asp") {
      // Tabblad: [ KLANTBEELD - DETAIL MACHTIGING ]
      var navMarker = mainFrame.document.getElementsByTagName("b");
      for (var i = 0; i < navMarker.length; ++i) {
        if (navMarker[i].innerHTML == "Detail machtiging") {
          navMarker[i].parentElement.setAttribute("role", "navigation");
        }
      }
    }
    if (mainFrameUrl === "https://kris/contactregistratie/contacthistorie.asp") {
      // Pagina: [ CONTACTHISTORIE ]
      mainFrame.document.getElementById("DetailDiv").setAttribute("role", "navigation");
    }
    if (mainFrameUrl === "https://kris/wijzigingsformulier/wijzigingsformulier.asp") {
      /* Pagina: [ WIJZIGINGSFORMULIER ]
         Selectie: [ WIJZIGEN ADRES ] - labels plaatsen bij de checkbox en invoervelden: */
      var wijzGebForm = mainFrame.document.getElementsByTagName("input");
      for (var i = 0; i < wijzGebForm.length; ++i) {
        if (wijzGebForm[i].getAttribute("name") == "WIJZ_chkWijzGeboorte") {
          wijzGebForm[i].setAttribute("aria-label", "geboorte");
        }
        if (wijzGebForm[i].getAttribute("name") == "WIJZ_radWijzGebManVrouw0") {
          if (wijzGebForm[i].getAttribute("value") == "man") {
            wijzGebForm[i].setAttribute("aria-label", "man");
          } else if (wijzGebForm[i].getAttribute("value") == "vrouw") {
            wijzGebForm[i].setAttribute("aria-label", "vrouw");
          }
        }
      }
      // Plaats een button role op ieder TABLE element dat een ONCLICK event heeft:
      var navMarker = mainFrame.document.getElementsByTagName("table");
      for (var i = 0; i < navMarker.length; ++i) {
        if (navMarker[i].getAttribute("onclick") !== null) {
          navMarker[i].setAttribute("role", "button");
        }
      }
    }
    if (mainFrameUrl === "https://kris/contactregistratie/contactregistratie.asp") {
      /* Pagina: [ CONTACTREGISTRATIE ]
         Plaats een navigation role op het memo invoerveld: */
      mainFrame.document.getElementById("txtMemo").setAttribute("role", "navigation");
      // Plaats een navigation role op ieder TD element waar de colSpan 2 is:
      var navMarker = mainFrame.document.getElementsByTagName("td");
      for (var i = 0; i < navMarker.length; ++i) {
        if (navMarker[i].getAttribute("colSpan") == 2) {
          navMarker[i].setAttribute("role", "navigation");
        }
      }
    }
  }
  if (localDebug === 1) {
    console.log("Eind van het EHBO script");
  }
/* Een ONLOAD functie werkt helaas niet vanwege de hoeveelheid frames in frames waardoor er niet altijd
   getriggerd wordt op nieuwe inhoud, daardoor de keus van een SETTIMEOUT functie.
   De VARIABELE "mainFrameUrl" toont dit ook in de CONSOLE, mits ingeschakeld. */
}, 2500);

/* Het script wordt meerdere malen aangeroepen, dit voorkomt dat gedrag.
   3,5 seconden na de initiele aanroep kan het script pas weer uitgevoerd worden door de browser.
   Effectief voer je hiermee het script eenmaal uit, ondanks dat het meerdere malen aangeroepen wordt. */
setTimeout(function() {
  runOnce = false;
}, 3500);

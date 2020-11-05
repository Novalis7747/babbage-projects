// ==UserScript==
// @name        Ditzo - Zendesk.
// @namespace   http://www.babbage.com/
// @description Toegankelijkheid van Zendesk verbeteren.
// @include     *://*.zendesk.com/*
// @version     Beta.
// @grant       none
// ==/UserScript==

/*
  --- [ VARIABELEN ] ---
*/

var currentPage = window.location.href;
var dbg = {OutputDirection:"0000100", level:"0"};

/*
  --- [ BABBAGE JAVASCRIPT LIBRARY ] ---
*/

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
  // aantal millisec sinds 00:00h
  var MsecSinceMidnight = ms+s*1000+m*60000+h*3600000;
  if (level<=dbg.level) {
    if (dbg.OutputDirection[0] == 1) {}
    if (dbg.OutputDirection[1] == 1) {
      alert(ts+" "+msg);
    }
    if (dbg.OutputDirection[2] == 1) {}
    if (dbg.OutputDirection[3] == 1) {
      // Let op, clipboard wordt bij iedere melding overschreven
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
      // Geen gebruik van SetAttributeForElement, extra debugging niet nodig op dit punt
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
    // Omdat we voor ieder element role en label willen toevoegen, gebruiken we een losse for loop in deze functie
    // Zowel SetRole- als SetLabelForElements aanroepen resulteert namelijk in twee for loops
    for (var i = 0; i < Elements.length; i++) {
      debugout(dbg, 450, calleeWithArguments(arguments)+">for>start "+i);
      // SetRole- en SetLabelForElement hier per element los aanroepen is effectiever dan één keer SetRoleAndLabelForElement
      // Dat laatste zou leiden tot een extra tussenstap die overbodige debug info zou genereren
      // Zie ook rationale bij SetAttributeForElements
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
      // Geen gebruik van RemoveAttributeFromElement, extra debugging niet nodig op dit punt
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
    // Bewust gebruik van onze eigen functies i.p.v. een losse removeAttribute en setAttribute
    // Wanneer namelijk een remove wel lukt en een set niet, is dat direct zichtbaar in de debug info
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
    // Omdat we voor ieder element een attribute willen verwijderen en toevoegen, gebruiken we een losse for loop in deze functie
    // Zowel SetAttributeFor- als RemoveAttributeFromElements aanroepen resulteert namelijk in twee for loops
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

/*
  --- [ AANPASSINGEN SPECIFIEK VOOR ZENDESK ] ---
*/

// Plaats de opmerking 'Intern:' voor alle interne berichten.
function distinguishInternalExternalNotes() {
  var isInternal = document.querySelectorAll('.event.web:not(.is-public)');
  for (var counter = 0; counter < isInternal.length; ++counter) {
    var xP = isInternal[counter].querySelector('p').innerHTML;
    if (isInternal[counter].querySelector('p').innerHTML.indexOf('Intern:') !== -1) {
      break;
    }
    isInternal[counter].querySelector('p').innerHTML = 'Intern:' + ' ' + xP;
  }
}

// Voeg een CSS property toe aan de globale CSS of verander een bestaande property.
function changeCSS(theClass, element, value) {
  var cssRules;
  for (var S = 0; S < document.styleSheets.length; S++) {
    try {
      document.styleSheets[S].insertRule(theClass + ' { ' + element + ': ' + value + '; }', document.styleSheets[S][cssRules].length);
    } catch (ERR) {
      try {
        document.styleSheets[S].addRule(theClass, element + ': ' + value + ';');
      } catch (ERR) {
        try {
          if (document.styleSheets[S]['rules']) {
            cssRules = 'rules'; // Internet Explorer
          } else if (document.styleSheets[S]['cssRules']) {
            cssRules = 'cssRules'; // De rest
          } else {
            alert('Deze browser wordt niet ondersteund');
          }
          for (var R = 0; R < document.styleSheets[S][cssRules].length; R++) {
            if (document.styleSheets[S][cssRules][R].selectorText == theClass) {
              if (document.styleSheets[S][cssRules][R].style[element]) {
                document.styleSheets[S][cssRules][R].style[element] = value;
                break;
              }
            }
          }
        } catch (ERR) {}
      }
    }
  }
}

setInterval(function() {
  SetRoleForClassname('zd-menu-item', 'menuitem');
  SetRoleForClassname('jGrowl-message', 'alert');
  SetRoleForClassname('toolbar_link', 'button');
  SetRoleForClassname('ember-view ticket_collision', 'navigation');
  SetRoleForClassname('has-zero-ticket-count', 'button');
  SetRoleForClassname('ember-view play-button', 'button');
  SetLabelForClassname('zd-selectmenu-base', 'Dropdown keuzemenu');
  SetLabelForClassname('is-viewed-by-others', 'Wordt door anderen bekeken');
  SetAttributeForClassname('aria-haspopup', 'zd-selectmenu-base', 'true');
  SetAttributeForClassname('aria-haspopup', 'zd-selectmenu-root', 'true');
  SetAttributeForClassname('aria-label', 'pop ticket_status_label compact open', 'Ticket status: open');
  SetAttributeForClassname('aria-label', 'btn dropdown-toggle object_options_btn', 'Dropdown menu: opties');
  SetAttributeForClassname('aria-haspopup', 'btn dropdown-toggle object_options_btn', 'true');
  SetAttributeForClassname('aria-label', 'ember-view close', 'Sluiten');
  SetAttributeForClassname('aria-label', 'btn btn-inverse dropdown-toggle', 'Verzenden als: keuzemenu');
  SetAttributeForClassname('aria-haspopup', 'zd-selectmenu-base', 'true');
  SetRoleAndLabelForClassname('search-icon', 'button', 'Zoeken in Zendesk');
  if (currentPage !== window.location.href) {
    currentPage = window.location.href;
    distinguishInternalExternalNotes();
  }
}, 7000);

setTimeout(function() {
  changeCSS('section.ticket .for_save', 'display', 'initial');
}, 10000);

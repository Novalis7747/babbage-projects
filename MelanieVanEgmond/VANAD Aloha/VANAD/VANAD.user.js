// ==UserScript==
// @name        BPL - VANAD Aloha.
// @namespace   http://www.babbage.com/
// @description Toegankelijkheid van VANAD Aloha verbeteren.
// @include     *://desktop.eu2.vanadcimplicity.net/*
// @include     *://desktop.eu2.vanadaloha.net/*
// @version     Beta.
// @grant       none
// ==/UserScript==

// @match       *://desktop.eu2.*.net/*

/*
  --- [ VARIABELEN ] ---
*/

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
  --- [ AANPASSINGEN SPECIFIEK VOOR VANAD ALOHA ] ---
*/

setTimeout(function() {
  // De volgende regel is voor debugging doeleinden, kan verwijderd worden:
  console.log('Begin van het VANAD Aloha script - setTimeout 01');
  SetRoleForClassname('btn', 'button');
  SetRoleForClassname('telephony_caller_id', 'alert');
  SetRoleForClassname('panel-heading tight', 'navigation');
  SetAttributeForClassname('aria-live', 'telephony_caller_id', 'polite');
  SetRoleAndLabelForClassname('dropdown-toggle', 'button', 'Opties menu');
  // De volgende regel is voor debugging doeleinden, kan verwijderd worden:
  console.log('Eind van het VANAD Aloha script - setTimeout 01');
}, 5000);

/*
  --- [ MOGELIJK ALTERNATIEF VOOR IE ] ---
  Bron: https://www.paciellogroup.com/blog/2012/06/html5-accessibility-chops-aria-rolealert-browser-support/ .
  Gaat dit wel automatisch werken?
*/

/*
  function addError() {
    var elem1 = document.getElementById("add1");
    document.getElementById('add1').setAttribute("role", "alert");
    document.getElementById('display2').style.clip='auto';
    alertText = document.createTextNode("alert via createTextnode()");
    elem1.appendChild(alertText);
    elem1.style.display='none';
    elem1.style.display='inline';
  }
*/

/*
  --- [ TEST OM EEN INKOMENDE OPROEP NA TE BOOTSEN ] ---
*/

setTimeout(function() {
  // De volgende regel is voor debugging doeleinden, kan verwijderd worden:
  console.log('Begin van het VANAD Aloha script - setTimeout 02');
  var x = document.querySelectorAll('.telephony_caller_id');
  for (var counter = 0; counter < x.length; ++counter) {
    x[counter].innerHTML = '0612345678';
  }
  // De volgende regel is voor debugging doeleinden, kan verwijderd worden:
  console.log('Eind van het VANAD Aloha script - setTimeout 02');
}, 15000);

setTimeout(function() {
  // De volgende regel is voor debugging doeleinden, kan verwijderd worden:
  console.log('Begin van het VANAD Aloha script - setTimeout 03');
  var x = document.querySelectorAll('.telephony_caller_id');
  for (var counter = 0; counter < x.length; ++counter) {
    x[counter].innerHTML = '0654367213';
  }
  // De volgende regel is voor debugging doeleinden, kan verwijderd worden:
  console.log('Eind van het VANAD Aloha script - setTimeout 03');
}, 25000);

/*
  --- [ NOTITIES ] ---
*/

/*
  Er moet nog getest worden hoe het aannemen van de telefoon in praktijk gaat.
  Op moment is het zo ingesteld dat als je gebeld wordt, dat VANAD meteen opneemt.
  Scripting gewijs kun je daar niet zoveel mee, behalve een alert role toevoegen?
*/

/*
	h: heading (kop)
	l: lijst
	i: lijstonderdeel
	t: tabel
	k: link
	n: niet-gelinkte tekst
	f: formulierveld
	u: unvisited (niet-bezochte) link
	v: visited (bezochte) link
	e: edit field (tekstvak)
	b: button (knop)
	x: checkbox (selectievakje)
	c: combo box (vervolgkeuzelijst)
	r: radio button (keuzerondje)
	q: block quote (blokcitaat)
	s: separator (scheiding)
	m: frame (kader)
	g: graphic (afbeelding)
	d: ARIA oriëntatiepunt in een Internetomgeving
	o: embedded object (ingevoegd object)
	1 tot en met 6: respectievelijk, kop op niveau 1, 2, 3, 4, 5 en 6
*/

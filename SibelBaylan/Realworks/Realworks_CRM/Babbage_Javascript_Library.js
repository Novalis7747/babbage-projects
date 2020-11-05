/*
----------------------------------------------------------------------------------------------------
Babbage JavaScript Library

Changes:
2016-06-28:  Poging gedaan om TRY / CATCH te plaatsen op logische plekken.
               Moet nog nagedacht worden over de "CATCH".
               Wat wil je waar en wanneer afvangen?

2016-06-27:  Code opgeschoond. Library getest.
             To do: TRY / CATCH of IF statements plaatsen voor correctere afhandeling.

2016-06-15:  Code opgeschoond. Back-up gemaakt van het origineel.
             Logischere indeling proberen te maken met koppen.
             Commentaar van N.V. verwerkt.
             Functie om eventlistener te realiseren in commentaar geplaatst: zie de
               notities bij deze functie voor de reden.

2016-05-20:  Code opgeschoond. Back-up gemaakt van het origineel.
             Functie toegevoegd I.O.V. Mario: functie om eventlistener te realiseren.

Online test tool:
De volgende tool kan als snelle test gebruikt worden om de syntax te controleren:
"http://jsbin.com/?html,js,output".

Index:
- [ CLASSES ]
- [ TAGNAME ]
- [ ID ]
- [ REPLACEMENTS ]
- [ EVENT LISTENERS ]
----------------------------------------------------------------------------------------------------
*/

// MyCreateElement("button","babbage","willekeurige tekst","a","click",MyFunction);
function MyCreateElement(Mytype,Myid,Mylabel,Mykey,MyInteraction,MyExecute) {
  /* 
    Een button toevoegen om atttributen aan ontoegankelijke elementen toe te voegen.
    Conclusie = deze commandos worden namelijk uitgevoerd voordat de probleem elementen
    op de pag aanwezig zijn. Dit is eventueel af te vangen met een window.onload = function().
    In het geval een window.onload niet werkt kan de volgende optie gebruikt worden:
  */
  var btn = document.createElement(Mytype);
  document.body.appendChild(btn);
  btn.innerHTML = Mylabel;
  btn.id = Myid;
  document.getElementById(Myid).addEventListener(MyInteraction,MyExecute);
  // For Firefox the accesskey is triggered with: alt+shift+o 
  SetAttributeForID("accesskey",Myid,Mykey);
}

// ------------ [ CLASSES ] ------------

/*
  Onderstaand zijn getest doen het wél extern.
  Aanroep: SetAttributeForClassname("role","checkbox_icon","checkbox");
*/
function SetAttributeForClassname(Attribute,Class_Name,Role_Name) {
  try {
    var x = document.getElementsByClassName(Class_Name);
    for (var i = 0; i < x.length; i++) {
      x[i].setAttribute(Attribute,Role_Name);
    }
  }
  catch(err) {
    console.log("SetAttributeForClassname kan niet uitgevoerd worden.");
  }
}

function SetRoleForClassname(Class_Name,Role_Name) {
  SetAttributeForClassname("role",Class_Name,Role_Name);
}

function SetLabelForClassname(Class_Name,label) {
  SetAttributeForClassname("aria-label",Class_Name,label);
}

// Aanroep: SetRoleAndLabelForClass("fa fa-print printerIcon","button","Printen");
function SetRoleAndLabelForClass(Class_Name,Role_Name,label) {
  SetRoleForClassname(Class_Name,Role_Name);
  SetLabelForClassname(Class_Name,label);
  console.log("function SetRoleAndLabelForClass" + Class_Name + " " + Role_Name + " " + label);
  // N.V.: kan performance impact t.g.v. de 2 maal aanroepen van document.getElementsByClassName groot zijn?
}

/*
  Nog niet breedvoerig getest.
  Handig als een combobox role="button" als attribuut heeft; dan moet dat verwijderd.
*/
function RemoveAttributeFromClassname(Attribute,Class_Name) {
  try {
    var x = document.getElementsByClassName(Class_Name);
    for (var i = 0; i < x.length; i++) {
      x[i].removeAttribute(Attribute);
    }
  }
  catch(err) {
    console.log("RemoveAttributeFromClassname kan niet uitgevoerd worden.");
  }
}

/*
  Handig als een combobox role="button" als attribuut heeft; dan moet dat verwijderd
  en daarna vervangen worden door role="checkbox".
  Aanroep: ChangeAttributeForClassname("role","role","checkbox","checkbox_icon");
*/
function ChangeAttributeForClassname(OldAttribute,NewAttribute,NewRole_Name,Class_Name) {
  try {
    var x = document.getElementsByClassName(Class_Name);
    for (var i = 0; i < x.length; i++) {
      x[i].removeAttribute(OldAttribute);
      x[i].setAttribute(NewAttribute,NewRole_Name);
    }
  }
  catch(err) {
    console.log("ChangeAttributeForClassname kan niet uitgevoerd worden.");
  }
}

// ------------ [ TAGNAME ] ------------

// SetAttributeForTagName("role","LI","checkbox");
function SetAttributeForTagName(Attribute,Tag_Name,Role_Name) {
  try {
    var x = document.getElementsByTagName(Tag_Name);
    var i;
    for (i = 0; i < x.length; i++) {
      x[i].setAttribute(Attribute,Role_Name);
    }
  }
  catch(err) {
    console.log("SetAttributeForTagName kan niet uitgevoerd worden.");
  }
}

function SetRoleForTagName(Tag_Name,Role_Name) {
  SetAttributeForTagName("role",Tag_Name,Role_Name);
}

// ------------ [ ID ] ------------

function SetAttributeForID(Attribute,xxid,rolename) {
  try {
    var x = document.getElementById(xxid);
    x.setAttribute(Attribute,rolename);
    console.log("function SetAttributeForID    " + Attribute + " " + xxid + " " + rolename);
  }
  catch(err) {
    console.log("SetAttributeForID kan niet uitgevoerd worden.");
  }
}

// De volgende functie kent geen goede naam, laten staan omwille van eventueel al bestaande scripts.
function SetLabelForIDForID(xxid,label) {
  SetAttributeForID("aria-label",xxid,label);
}

function SetLabelForID(xxid,label) {
  SetAttributeForID("aria-label",xxid,label);
}

function SetRoleForID(xxid,rolename) {
  try {
    document.getElementById(xxid).setAttribute("role",rolename);
  }
  catch(err) {
    console.log("SetRoleForID kan niet uitgevoerd worden.");
  }
}

// SetRoleAndLabelForID("helpIcon","button","bekijk de verbeteringen");
function SetRoleAndLabelForID(xxid,rolename,label) {
  SetRoleForID(xxid,rolename);
  SetLabelForID(xxid,label);
  console.log("function SetRoleAndLabelForID   " + xxid + " " + rolename + " " + label);
}

// ------------ [ REPLACEMENTS ] ------------

/*
  Icoontjes die niet toegankelijk zijn vervangen door checkbox
  SetRoleForInvisibleIcon("menuitem icon fa fa-2x fa-bell-o","button");
*/
function SetRoleForInvisibleIcon(Class_Name) {
  var x = document.getElementsByClassName(Class_Name);
  for (var i = 0; i < x.length; i++) {
    x[i].setAttribute("role","checkbox");
    x[i].setAttribute("tabindex","0");
    var str = x[i].src; // image name
    var res = str.split("/");
    var re2 = res[res.length - 1];
    var re3 = re2.split(".");
    var re4 = re3[0];
    x[i].setAttribute("aria-label",re4);
  }
}

function addGlobalStyle(css) {
  var head,style;
  head = document.getElementsByTagName("head")[0];
  if (!head) {
    return;
  }
  style = document.createElement("style");
  style.type = 'text/css';
  style.innerHTML = css;
  head.appendChild(style);
}

// ------------ [ EVENT LISTENERS ] ------------

/*
  Moet nog verder uitgewerkt worden. Opzet door Mario.
  Aanroep: SetEventForId("keydown","searchbar_labelcomboeditE");
*/
function showTestAlert() {
  alert("Test");
}

function SetEventForClassname(New_Event,Class_Name) {
  var x = document.getElementsByClassName(Class_Name);
  for (var i = 0; i < x.length; i++) {
    x[i].addEventListener(New_Event,showTestAlert);
  }
}

function keyCode(New_Event) {
  if (New_Event.keyCode == 27) {
    alert("You pressed the Enter key!");
  }
}

function SetEventForId(New_Event,xxid) {
  document.getElementById("grid").addEventListener("mouseenter",showTestAlert);
  document.getElementById("grid").addEventListener("mouseover",showTestAlert);
  document.getElementById(xxid).addEventListener(New_Event,keyCode);
}

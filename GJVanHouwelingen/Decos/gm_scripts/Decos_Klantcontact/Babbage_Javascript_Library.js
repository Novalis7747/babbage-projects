/*
------------------------------------------
Babbage JavaScript Library

Changes:
2016-05-20:   Code opgeschoond. Back-up gemaakt van het origineel onder de naam: "20160520_Babbage_Javascript_Library.js".
              Functie toegevoegd I.O.V. Mario: functie om eventlistener op mouseover of onfocus te realiseren.

Online test tool:
De volgende tool kan als snelle test gebruikt worden om de syntax te controleren: "http://jsbin.com/?html,js,output".

Index:


------------------------------------------
*/

// nog niet breedvoerig getest
function RemoveAttributeFromClassname(Attribute, Class_Name)
// Handig als een combobox role="button" als attribuut heeft; dan moet dat verwijderd
{
  var x = document.getElementsByClassName(Class_Name);
  for (var i = 0; i < x.length; i++) {
    x[i].removeAttribute(Attribute);
  }
}

// Handig als een combobox role="button" als attribuut heeft; dan moet dat verwijderd
// en daarna vervangen worden door role="checkbox"
// Aanroep:  ChangeAttributeForClassname("role","role","checkbox","checkbox_icon");
function ChangeAttributeForClassname(OldAttribute, NewAttribute, NewRole_Name, Class_Name) {
  var x = document.getElementsByClassName(Class_Name);
  for (var i = 0; i < x.length; i++) {
    x[i].removeAttribute(OldAttribute);
    x[i].setAttribute(Attribute, Role_Name);
  }
}

function MyFunction() {
  alert("Hello");
  SetAttributeForClassname("aria-label", "leading", "Oh oh oh wat een labeltje");
}

// MyCreateElement("button","babbage","willekeurige tekst","a","click",MyFunction);
function MyCreateElement(Mytype, Myid, Mylabel, Mykey, MyInteraction, MyExecute) {
  // een button toevoegen om atttributen aan ontoegankelijke elementen toe te voegen
  // conclusie = Deze comandoos worden namelijk uitgevoerd voordat de probleem elementen op de pag aanwezig zijn.
  var btn = document.createElement(Mytype);
  document.body.appendChild(btn);
  btn.innerHTML = Mylabel;
  btn.id = Myid;
  document.getElementById(Myid).addEventListener(MyInteraction, MyExecute);
  // For Firefox the accesskey is triggered with alt+shift+o 
  SetAttributeForID("accesskey", Myid, Mykey);
}

// Onderstaand zijn getest doen het wél extern
// ******************** Class_Name    ****************************************************
// aanroep SetAttributeForClassname("role","checkbox_icon","checkbox");
function SetAttributeForClassname(Attribute, Class_Name, Role_Name) {
  var x = document.getElementsByClassName(Class_Name);
  for (var i = 0; i < x.length; i++) {
    x[i].setAttribute(Attribute, Role_Name);
  }
}

function SetRoleForClassname(Class_Name, Role_Name) {
  SetAttributeForClassname("role", Class_Name, Role_Name);
}

function SetLabelForClassname(Class_Name, label) {
  SetAttributeForClassname("aria-label", Class_Name, label);
}

// SetRoleAndLabelForClass("fa fa-print printerIcon","button","Printen");
function SetRoleAndLabelForClass(Class_Name, Role_Name, label) {
  console.log("function SetRoleAndLabelForClass" + Class_Name + " " + Role_Name + " " + label);
  SetRoleForClassname(Class_Name, Role_Name);
  SetLabelForClassname(Class_Name, label);
}

// ******************************** TAGNAME  ***************************************
// SetAttributeForTagName("role","LI","checkbox");
function SetAttributeForTagName(Attribute, Tag_Name, Role_Name) {
  var x = document.getElementsByTagName(Tag_Name);
  var i;
  for (i = 0; i < x.length; i++) {
    x[i].style.backgroundColor = "red";
    x[i].setAttribute(Attribute, Role_Name);
  }
}

function SetRoleForTagName(Tag_Name, Role_Name) {
  SetAttributeForTagName("role", Tag_Name, Role_Name);
}

// ******************************** ID 
function SetAttributeForID(Attribute, xxid, rolename) {
  console.log("function SetAttributeForID    " + Attribute + " " + xxid + " " + rolename);
  var x = document.getElementById(xxid);
  x.setAttribute(Attribute, rolename);
}

function SetLabelForIDForID(xxid, label) {
  SetAttributeForID("aria-label", xxid, label);
}

function SetRoleForID(xxid, rolename) {
  //var x = document.getElementById(xxid);
  //x.setAttribute("role", rolename); 
  document.getElementById(xxid).setAttribute("role", rolename);
}

//  SetRoleAndLabelForID("helpIcon","button" , "bekijk de verbeteringen" )
function SetRoleAndLabelForID(xxid, rolename, label) {
  console.log("function SetRoleAndLabelForID   " + xxid + " " + rolename + " " + label);
  SetRoleForID(xxid, rolename);
  SetLabelForIDForID(xxid, label);
}

function addGlobalStyle(css) {
  var head, style;
  head = document.getElementsByTagName('head')[0];
  if (!head) {
    return;
  }
  style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = css;
  head.appendChild(style);
}

// **********************   Icoontjes die niet toegankelijk zijn vervangen door checkbox   ******************
function SetRoleForInvisibleIcon(Class_Name)
//SetRoleForClassname("menuitem icon fa fa-2x fa-bell-o", "button");
{
  var x = document.getElementsByClassName(Class_Name);
  for (var i = 0; i < x.length; i++) {
    x[i].setAttribute("role", "checkbox");
    x[i].setAttribute("tabindex", "0");
    var str = x[i].src; // image name
    var res = str.split("/"); // Meerdere malen komt de variable "res" voor, doelbewust?
    var res = res[res.length - 1];
    var res = res.split(".");
    var res = res[0];
    x[i].setAttribute("aria-label", res);
  }
}

// ***************************   pogin om eventlistener op mouseover of onfocus te realiseren   *********************
function MyFunction2() {
  alert("Jallooow");
}

function SetEventForClassname(Event, Class_Name) {
  var x = document.getElementsByClassName(Class_Name);
  for (var i = 0; i < x.length; i++) {
    x[i].addEventListener(Event, MyFunction2);
  }
}

function keyCode(event) {
  if (event.keyCode == 27) {
    alert("You pressed the Enter key!");
  }
}

function SetEventForId(Event, xxid) {
  // b.v.
  // document.getElementById("grid").addEventListener("mouseenter", MyFunction2);
  // document.getElementById("grid").addEventListener("mouseover", MyFunction2);
  // document.getElementById(xxid).addEventListener(Event, keyCode);
}

// SetEventForId("keydown", "searchbar_labelcomboeditE");

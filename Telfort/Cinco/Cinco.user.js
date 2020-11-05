// ==UserScript==
// @name Telfort Cinco
// @namespace http://www.babbage.eu/
// @description Rebuild Imagest to accessible controls
// @include http://www.babbage.eu/cinco_test/*


// ==/UserScript==

// -@- include http://cinco.telfortglasvezel.local/crm/*
// 2016/03/29 nv:
// Voor Amsterdam moet de volgende include gebruikt worden: @include https://cinco.kpnnl.local/authenticate
// tenzij de @include http://www.babbage.eu/cinco_test/*
// voor zowel Breda als Amsterdam werkt

 

function SetRoleForClassname(Class_Name, Role_Name)
{
                var x = document.getElementsByClassName(Class_Name);
                for (var i = 0; i < x.length; i++)
                {
                               x[i].setAttribute("role", Role_Name);
                }       
}


// **********************   Icoontjes die niet toegankelijk zijn vervangen door checkbox   ******************
function SetRoleForInvisibleIcon(Class_Name)  
{
	var x = document.getElementsByClassName(Class_Name);
	for (var i = 0; i < x.length; i++)
	{
	    x[i].setAttribute("role", "checkbox");
	    x[i].setAttribute("tabindex", "0");
	    var str = x[i].src;            // image name
	    var res = str.split("/");
	    var res = res[res.length-1];
	    var res = res.split(".");
	    var res = res[0];
	    x[i].setAttribute("aria-label", res);
	}
}

SetRoleForInvisibleIcon("indicatie");
SetRoleForInvisibleIcon("unlocked clickable");
SetRoleForInvisibleIcon("locked clickable");

SetRoleForClassname("updateclientbutton","button")
SetRoleForClassname("klantenkaart infobutton","button");
SetRoleForClassname("headerbutton button_grey","button");
SetRoleForClassname("box_head grad_colour","banner");
SetRoleForClassname("tab_header grad_colour clearfix ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all","banner");
SetRoleForClassname("menu_whole_width", "banner");
SetRoleForClassname("fg-toolbar ui-toolbar ui-widget-header ui-helper-clearfix ui-corner-tl ui-corner-tr","banner");
SetRoleForClassname("fg-toolbar ui-toolbar ui-widget-header ui-helper-clearfix ui-corner-tl ui-corner-tr","banner");
 
 

 
 
 

 

 

//    x[i].setAttribute("original-title", res);

    // x[i].setAttribute("alt", res);         

 

// ************* niet gelukte tooltip pooging   *******************************************************

//     x[i].createElement ("abbr")

//    var tag = x[j].getElementsByTagName("abbr");

//     tag[j].setAttribute("abbrr", res);         

 

 

  

   // document.getElementById("demo").innerHTML = res;

   // evt kan document.createTextNode() gebruikt worden om het label er tussen te plakken

  // voor de slechtzienen kunnen alle plaatjse witdh en heigt geset worden op een grotere waarde

   //   alt="Mountain View" style="width:304px;height:228px;

 

// ==UserScript==
// @name        Realworks Test 
// @namespace   http://www.babbage.com/
// @include     https://crm.realworks.nl/*
// @version     1
// @grant       none
// ==/UserScript==

// https://crm.realworks.nl/*  zonder sterretje werkt het niet


function SetRoleForID(xxid,rolename)
	{
  var x=document.getElementById(xxid);
  x.setAttribute("role", rolename);	
  }

 SetRoleForID("error","button");


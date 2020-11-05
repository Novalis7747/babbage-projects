// ==UserScript==
// @name        Microsoft Dynamics CRM
// @namespace   http://www.babbage.com/
// @description Script for Microsoft Dynamics CRM
// @include     *://*.crm.obvion.nl/main*
// @require     http://www.babbage.com/library/Babbage_Javascript_Library.js
// @version     1
// @grant       none
// ==/UserScript==

var dbg = {OutputDirection:"0100100", level:"50"};

window.onload = function() {
setTimeout(function() {
	SetAttributeForSelector("accesskey",'a[id="Mscrm.AdvancedFind.Groups.Show.Results-Large"]',"r");
},3000);
	SetAttributeForSelector("accesskey",'span[id="AdvFindSearch"]>a',"z");
}
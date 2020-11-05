// ==UserScript==
// @name		KPN - TeamKPN.
// @namespace	http://www.babbage.com/
// @description	Toegankelijkheid van TeamKPN verbeteren.
// @include		*://teamkpn.kpnnet.org/*
// @version		Beta.
// @date		20170829.
// @grant		none
// ==/UserScript==

function SetAttributeForElements(Attribute, Elements, Value) {
	for (var i = 0; i < Elements.length; i++) {
		Elements[i].setAttribute(Attribute, Value);
	}
}

// Leuke functie om mee te rommelen. Dit veranderd alle button tekst. Niet wat je wenst. Ter demonstratie.
function SetInnertHTMLForElements(Elements) {
	for (var i = 0; i < Elements.length; i++) {
		Elements[i].innerHTML = 'BTN';
	}
}

setTimeout(function() {
	SetAttributeForElements('role', document.getElementsByClassName('menu-item'), 'button');
	SetAttributeForElements('role', document.getElementsByClassName('menu-button'), 'button');
	// Commentaar regel weghalen van de volgende regel en ervaren wat de impact is op het menu.
	// SetInnertHTMLForElements(document.getElementsByClassName('menu-icon'));
}, 3000);

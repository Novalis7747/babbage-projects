"use strict";
// ==UserScript==
// @name        NPS Script
// @namespace http://www.babbage.com/
// @description Accessible NPS Tool for Telfort
// @include     *:/*npstool.nl/*
// @version     3
// @grant  none
// ==/UserScript==

function getElementBySelector (root, selector) {
	if (typeof root.querySelector === "function") {
		return root.querySelector(selector);
	} else {
		return null
	}
}

function getElementsBySelector (root, selector) {
	if (typeof root.querySelectorAll === "function") {
		return root.querySelectorAll(selector);
	} else {
		return []
	}
}

function setRole(element, role) {
	if(element==null) {
		return
	}
	element.setAttribute("role", role);
	return element;
}

function setRoles(nodes, role) {
	for (var i=0; i < nodes.length; i++) {
		setRole(nodes[i], role);
	}
	return nodes;
}

function setAttributeForElements(nodes, attribute, value) {
	for (var i=0; i < nodes.length; i++) {
		nodes[i].setAttribute(attribute,value);
	}
	return nodes;
}

function init (root) {
	setRoles(getElementsBySelector(root,".tile--label, .btn"),"button");
	setRoles(getElementsBySelector(root,".checkbox_icon"),"checkbox");
	setAttributeForElements(getElementsBySelector(root,".js-chosen"),"tabindex","0");
	var timer = getElementBySelector(root,"#js-session-notification");
	if (timer) {
		setRole(timer,"button");
		timer.setAttribute("aria-live","polite");
		timer.setAttribute("accesskey","t");
	}
}

var addedNodesObserver = new MutationObserver(function (mutations) {
	mutations.forEach(function (mutation) {
		for (var i=0; i < mutation.addedNodes.length; i++) {
			init(mutation.addedNodes[i]);
		}
	});
});

init(document);
addedNodesObserver.observe(document, { childList: true, subtree: true });


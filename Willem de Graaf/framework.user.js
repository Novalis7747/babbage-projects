"use strict";
// ==UserScript==
// @name        Framework
// @namespace   http://www.babbage.com/
// @description Script to make CJG Zwijndrecht Framework more accessible
// @include     *://www.cjgzwijndrecht.nl/framework/*
// @version     1
// @grant       none
// ==/UserScript==

function setRole(element, role) {
	if(element==null) {
		return
	}
	element.setAttribute("role", role);
	return element;
}

function setTabIndex(element, index) {
	if(element==null) {
		return
	}
	element.setAttribute("tabindex", index);
	return element;
}

function setAsFocusableButtons(nodes) {
	for (var i=0; i < nodes.length; i++) {
		setRole(nodes[i], "button");
		setTabIndex(nodes[i], "0");
		var label = nodes[i].getAttribute("data-title")
		if(label!=null) {
			nodes[i].setAttribute("aria-label", label);
		}
	}
	return nodes;
}

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

function init (root) {
	setAsFocusableButtons(getElementsBySelector(root,"a[data-href]"));
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
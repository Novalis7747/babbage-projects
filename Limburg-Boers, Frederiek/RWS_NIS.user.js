"use strict";
// ==UserScript==
// @name        RWS NIS
// @namespace   http://www.babbage.eu/
// @description Maakt NIS toegankelijk voor RWS personeel
// @include     *://nis.rijkswaterstaat.nl/*
// @version     1
// @grant       none
// ==/UserScript==

function getElementById (root, id) {
	if (typeof root.getElementById === "function") {
		return root.getElementById(id);
	} else {
		return null
	}
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

function setHeadingLevel(element, level) {
	if(element==null) {
		return
	}
	element.setAttribute("aria-level", level);
	return element;
}

function setRole(element, role) {
	if(element==null) {
		return
	}
	element.setAttribute("role", role);
	return element;
}

function setHeadings(nodes, level) {
	for (var node of nodes) {
		setRole(node, "heading");
		setHeadingLevel(node,level);
	}
	return nodes;
}

function setRoles(nodes, role) {
	for (var node of nodes) {
		setRole(node, role);
	}
	return nodes;
}

function setAttributeForElements(nodes, attribute, value) {
	for (var node of nodes) {
		node.setAttribute(attribute,value);
	}
	return nodes;
}

function patchTables(root) {
	var nodes = getElementsBySelector(root,"th");
	for (var node of nodes) {
		var actions = getElementsBySelector(node,"a");
		for (var action of actions) {
			action.setAttribute("aria-label","-");
			setRole(action,"button");
			if (action.id.indexOf("DD_a")==-1) {
				var expanded = action.id.indexOf("COL_a")>=0;
				action.setAttribute("aria-expanded",  expanded ? "true" : "false");
			}
			setRole(action.firstChild,"presentation");
		}
	}
}

function onNodeAdded(root) {
	setHeadings(root.getElementsByClassName("portletTableHeaderLeft"),2);
	setHeadings(root.getElementsByClassName("treeText"),4);
	setRole(getElementBySelector(root,"#info"), "contentinfo");
	setRole(getElementBySelector(root,"#banner"), "banner");
	setRole(getElementBySelector(root,"#pageTabs_Table, #bannerMenuRibbon"), "navigation");
	setRole(getElementBySelector(root,"body>table:nth-child(4)>tbody, #wrsMainContentBand"), "main");
	patchTables(root);
}

var observer = new MutationObserver(function(mutations) {
	for (var mutation of mutations) {
		try {
//			if (mutation.type === "childList") {
				for (var node of mutation.addedNodes) {
					onNodeAdded(node);
				}
//			}
		} catch (e) {
			// Catch exceptions for individual mutations so other mutations are still handled.
			console.log("Exception while handling mutation: " + e);
		}
	}
});
observer.observe(document, {childList: true, attributes: true,
	subtree: true });

onNodeAdded(document);
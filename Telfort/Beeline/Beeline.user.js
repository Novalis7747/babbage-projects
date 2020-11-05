"use strict";
// ==UserScript==
// @name		KPN - Beeline.
// @namespace	http://www.babbage.com/
// @description	Toegankelijkheid van Beeline verbeteren.
// @include		*://prod*.beeline.com/*
// @version		2.0.1
// @grant		none
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

function onNodeAdded(root) {
	var comboboxes = getElementsBySelector(root,".TimeAndExpenseContainerCell > input:first-of-type");
	setRoles(comboboxes,"combobox");
	setAttributeForElements(comboboxes,"aria-autocomplete","inline");

}

function onDateModified(target) {
	target.setAttribute("aria-label",target.getAttribute("date").slice(0, -22));
}

var observer = new MutationObserver(function(mutations) {
	for (var mutation of mutations) {
		try {
			if (mutation.type === "childList") {
				for (var node of mutation.addedNodes) {
					// Versie 2.0.1 aanpassing, de { en } misten
					// bij de volgende IF statement, toegevoegd:
					if (node.nodeType != Node.ELEMENT_NODE) {
						continue;
                    }
					onNodeAdded(node);
				}
			} else if (mutation.type === "attributes") {
				onDateModified(mutation.target);
			}
		} catch (e) {
			// Catch exceptions for individual mutations so other mutations are still handled.
			console.log("Exception while handling mutation: " + e);
		}
	}
});
observer.observe(document, {childList: true, attributes: true,
	subtree: true, attributeFilter: ["date"]});

onNodeAdded(document);

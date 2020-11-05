// ==UserScript==
// @name        Zaaksysteem
// @namespace   http://www.babbage.com/
// @description Toegankelijk maken van zaaksysteem.nl
// @include     *://*zaaksysteem.nl/*
// @include     https://mijn.vijfheerenlanden.nl/*
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

function setHeadings(nodes, level) {
	for (var node of nodes) {
		setRole(node, "heading");
		node.setAttribute('aria-level',level);
	}
	return nodes;
}

function setAttributeForElements(nodes, attribute, value) {
	for (var node of nodes) {
		node.setAttribute(attribute,value);
	}
	return nodes;
}

function onClassModified(target) {
	var classes = target.classList;
	if (!classes)
		return;
	if (target.classList.contains("table-row")) {
		setRole(target, "row");
	} else if (target.classList.contains("case-navigation-list-item")) {
		target.setAttribute("aria-current", target.classList.contains("selected") ? "true" : "");
	} else if (target.hasAttribute("data-zs-modal")) {
		var checkbox = getElementBySelector(document,"input[type=checkbox]");
		setRole(target, "dialog");
		target.setAttribute('aria-modal',"true");
		target.addEventListener(
			"DOMNodeRemoved",
			function() { checkbox.focus(); },
			false
		);
	} else if (target.classList.contains("side-menu")) {
		var notHidden = target.classList.contains("side-menu-open");
		var button = target.parentElement.firstElementChild;
		var list = target.firstElementChild.lastElementChild;
		if (notHidden) {
			list.removeAttribute("hidden");
		} else {
			list.setAttribute("hidden", "hidden");
		}
		button.setAttribute("aria-expanded", notHidden ? "true" : "false");
	} else if (target.classList.contains("mdi")) {
		if (target.classList.contains("mdi-chevron-up")) {
			target.setAttribute("aria-expanded", "true");
		} else if (target.classList.contains("mdi-chevron-down")) {
			target.setAttribute("aria-expanded", "false");
		}
	}
}

function onNodeAdded(target) {
	onClassModified(target);
	setHeadings(getElementsBySelector(target,".widget-header-title"), 2);
	setHeadings(getElementsBySelector(target,".top-bar-current-location"), 1);
	setRoles(getElementsBySelector(target,".ui-tabs-anchor"), "button");
	setAttributeForElements(getElementsBySelector(target,".widget-header-search-button"), "aria-label","Inhoud van widget filteren");
	setAttributeForElements(getElementsBySelector(target,".widget-header-remove-button"), "aria-label","Widget verwijderen");
	setRoles(getElementsBySelector(target,".table"), "table");
	// We deal with table rows in onClassMOdified
	setRoles(getElementsBySelector(target,".table-cell"), "cell");
	setRoles(getElementsBySelector(target,".zs-table-header-cell"), "columnheader");
	setRoles(getElementsBySelector(target,".table-body"), "presentation");
	setRoles(getElementsBySelector(target,".case-message-text"), "alert");
	var unlabeled = ['data-zs-title','data-zs-tooltip','zs-tooltip'];
	for (var cls of unlabeled) {
		for (var node of getElementsBySelector(target, "["+cls+"]")) {
			var attrVal = node.getAttribute(cls);
			if (node.tagName == "LI") {
				node.firstElementChild.setAttribute("aria-label", attrVal);
			} else {
				node.setAttribute("aria-label", attrVal);
			}
		}
	}
	var linksWithSpan = getElementsBySelector(target, "a > span");
	for (node of linksWithSpan) {
		var parent = node.parentElement;
		parent.setAttribute('aria-label', node.textContent);
	}
	var buttonsWithIcons = getElementsBySelector(target, "button:not([aria-label]) > zs-icon");
	for (node of buttonsWithIcons) {
		var parent = node.parentNode;
		parent.setAttribute("aria-label", node.getAttribute("icon-type"));
	}
}

var observer = new MutationObserver(function(mutations) {
	for (var mutation of mutations) {
		try {
			if (mutation.type === "childList") {
				for (var node of mutation.addedNodes) {
					onNodeAdded(node);
				}
			} else if (mutation.type === "attributes") {
				if (mutation.attributeName == "class") {
					onClassModified(mutation.target);
				}
			}
		} catch (e) {
			// Catch exceptions for individual mutations so other mutations are still handled.
			console.log("Exception while handling mutation: " + e);
		}
	}
});

observer.observe(document, {childList: true, attributes: true,
	subtree: true, attributeFilter: ["class"]});

onNodeAdded(document);
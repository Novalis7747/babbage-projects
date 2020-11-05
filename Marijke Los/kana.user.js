"use strict";
// ==UserScript==
// @name        Kana
// @namespace   http://www.babbage.com/
// @description Script to make Kana more accessible
// @include     *://trinicom*
// @version     1
// @grant       none
// ==/UserScript==

function setLabel(element, label) {
	if(element==null) {
		return
	}
	element.setAttribute("aria-label", label);
	return element;
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

function setRoleAndLabel(element, role, label) {
	if(element==null) {
		return
	}
	setRole(element,role);
	setLabel(element,label);
	return element;
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

function labelButtons(root) {
	var buttons = getElementsBySelector(root,".Button,.PrimaryButtonBackgroundColor");
	for (var i=0; i < buttons.length; i++) {
		var id = buttons[i].getAttribute("id");
		if (id && buttons[i].textContent === "") {
			var index = id.indexOf("_lb")+3;
			if (index<4) {
				index = id.indexOf("_ctl03_")+7;
			}
			setLabel(buttons[i],id.slice(index,id.length));
		}
		setRole(buttons[i],"button");
	}
}

function init (root) {
	setRoleAndLabel(getElementBySelector(root,"#navigation"),"navigation","Hoofdmenu");
	setRoles(getElementsBySelector(root,".button"),"button");
	setLabel(getElementBySelector(root,"#btnLogout"),"Uitloggen");
	setRole(getElementBySelector(root,"#mainContent"),"main");
	setRole(getElementBySelector(root,"#MainContent_KnowledgeBase_FaqPanel"),"main");
	setRole(getElementBySelector(root,"#MainContent_KnowledgeBase_AnswerPanel"),"main");
	setRole(getElementBySelector(root,"#topContent"),"banner");
	setRole(getElementBySelector(root,"#topContent"),"banner");
	setRoles(getElementsBySelector(root,"td.flow"),"link");
	labelButtons(root);
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
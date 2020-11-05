// ==UserScript==
// @name         Babbage - Test.
// @namespace    http://www.babbage.com/
// @description  Test script voor Babbage. IE7.
// @include      *://www.babbage.eu/pages/ontoegankelijke_webpagina/index.html
// @version      20200703-1158
// @grant        none
// ==/UserScript==

// --- [ USERSCRIPT NOTITIES ] ---
// ==Developer==
// @browser      Internet Explorer (Versie 11.657.18362.0 (x86))
// @extension    Trixie (Versie 0.1.3.0 (Beta - x86))
// @source       https://stackoverflow.com/questions/6584635/
// ==/Developer==

// ==Validator==
// @validator    JSLint (Edition 2020.07.02)
// @url          https://www.jslint.com/
// @help         https://www.jslint.com/help.html
// @settings     Assume: "a browser"
// @settings     Tolerate: "long lines"
// @settings     Tolerate: "for statement"
// ==/Validator==

// --- [ VALIDATOR SETTINGS ] ---
// Automatisch instellen van bovenstaande @SETTINGS voor JSLINT:
/*jslint
    browser, long, for
*/

// --- [ MIT LICENSE ] ---
// Code & licensing: http://code.google.com/p/getelementsbyclassname/ .

// --- [ GLOBALE VARIABELEN ] ---
var localDebug = true;
var scriptName = "Babbage";

// --- [ DEBUG FUNCTIE ] ---
function debugConsoleMessage(level, message) {
    // Geeft een DEBUG MESSAGE al dan wel of niet weer. Dit is afhankelijk van
    // de VARIABELE localDebug:
    "use strict";
    try {
        var ms;
        var newDate;
        var sec;
        // Alleen een melding geven als LOCALDEBUG waar is:
        if (localDebug) {
            // LEVEL 1 geeft alleen de boodschap weer:
            if (level === 1) {
                window.console.log("       ", message);
            }
            // LEVEL 2 geeft de boodschap inclusief het aantal milliseconden
            // weer:
            if (level === 2) {
                newDate = new Date();
                sec = newDate.getSeconds();
                ms = newDate.getMilliseconds();
                window.console.log(message, sec, ms, "ss:ms.");
            }
        }
    } catch (err) {
        window.console.log("Babbage debugConsoleMessage: " + err.message);
    }
}

// --- [ CONTROLEER OF JE TE MAKEN HEBT MET DE IE11-MODUS ] ---
if (window.MSInputMethodContext && document.documentMode) {
    debugConsoleMessage(1, "Internet Explorer 11");
} else {
    debugConsoleMessage(1, "Geen Internet Explorer 11");
}

// --- [ GETELEMENTSBYCLASSNAME SPECIFIEK VOOR IE7 ] ---
// Developed by Robert Nyman: http://www.robertnyman.com .
// Edited by P. Dackers: http://www.babbage.com .
// So the function allows 3 parameters: class (required),
// tag name (optional, searches for all tags if not specified),
// root element (optional, document if not specified).
// Example: getElementsByClassName("col", "div", document.getElementById(" "));
var getElementsByClassName = function (className, tag, elm){
    if (document.getElementsByClassName) {
        getElementsByClassName = function (className, tag, elm) {
            elm = elm || document;
            var elements = elm.getElementsByClassName(className);
            var nodeName = (
                (tag)
                ? new RegExp("\\b" + tag + "\\b", "i")
                : null
            );
            var returnElements = [];
            var current;
            for (var i = 0, il = elements.length; i < il; i +=1){
                current = elements[i];
                if (!nodeName || nodeName.test(current.nodeName)) {
                    returnElements.push(current);
                }
            }
            return returnElements;
        };
    } else if (document.evaluate) {
        getElementsByClassName = function (className, tag, elm) {
            tag = tag || "*";
            elm = elm || document;
            var classes = className.split(" ");
            var classesToCheck = "";
            var xhtmlNamespace = "http://www.w3.org/1999/xhtml";
            var namespaceResolver = (
                (document.documentElement.namespaceURI === xhtmlNamespace)
                ? xhtmlNamespace
                : null
            );
            var returnElements = [];
            var elements;
            var node;
            for (var j = 0, jl = classes.length; j < jl; j += 1) {
                classesToCheck += "[contains(concat(' ', @class, ' '), ' " + classes[j] + " ')]";
            }
            try {
                elements = document.evaluate(".//" + tag + classesToCheck, elm, namespaceResolver, 0, null);
            } catch (err) {
                elements = document.evaluate(".//" + tag + classesToCheck, elm, null, 0, null);
                debugConsoleMessage(1, err.message);
            }
            while ((node = elements.iterateNext())) {
                returnElements.push(node);
            }
            return returnElements;
        };
    } else {
        getElementsByClassName = function (className, tag, elm) {
            tag = tag || "*";
            elm = elm || document;
            var classes = className.split(" ");
            var classesToCheck = [];
            var elements = (
                (tag === "*" && elm.all)
                ? elm.all
                : elm.getElementsByTagName(tag)
            );
            var current;
            var returnElements = [];
            var match;
            for (var k = 0, kl = classes.length; k < kl; k += 1){
                classesToCheck.push(new RegExp("(^|\\s)" + classes[k] + "(\\s|$)"));
            }
            for (var l = 0, ll = elements.length; l < ll; l += 1){
                current = elements[l];
                match = false;
                for (var m = 0, ml = classesToCheck.length; m < ml; m += 1){
                    match = classesToCheck[m].test(current.className);
                    if (!match) {
                        break;
                    }
                }
                if (match) {
                    returnElements.push(current);
                }
            }
            return returnElements;
        };
    }
    return getElementsByClassName(className, tag, elm);
};

// --- [ FUNCTIE AANROEP NA LADEN DOM ] ---
window.onload = function () {
    debugConsoleMessage(2, "DOM geladen voor " + scriptName + ":");
    // var getClass = getElementsByClassName("spacer", "div", document);
    var getClass = getElementsByClassName("mainheader", "div", document);
    debugConsoleMessage(1, getClass);
    debugConsoleMessage(1, getClass[0]);
    getClass[0].setAttribute("aria-label", "test");
    debugConsoleMessage(1, getClass[0]);
};

// --- [ EINDE SCRIPT ] ---
// Als de volgende melding in de CONSOLE wordt getoond, dan kan het script in
// ieder geval tot het eind foutloos uitgevoerd worden:
debugConsoleMessage(2, "Einde script voor " + scriptName + ":");

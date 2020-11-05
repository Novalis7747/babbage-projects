// ==UserScript==
// @name		Decos_Klantcontact
// @namespace   http://www.babbage.com/
// @include	 http://klantcontact.joinsuite.nl/*
// @require	 http://www.babbage.com/library/Babbage_Javascript_Library.js
// @require	 https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @version	 1.1
// @grant	   GM_getValue
// @grant	   GM_setValue
// ==/UserScript==

jQuery.debug = true;
$ = function (selector, context) {
	if (jQuery.debug && typeof selector === "string" && !jQuery(selector, context).length) 
		throw new Error("No element found for selector "+selector);
	return jQuery.apply(this, arguments);
};

(function($) {
	$.fn.changeElementType = function(newType) {
		var attrs = {};

		$.each(this[0].attributes, function(idx, attr) {
			attrs[attr.nodeName] = attr.nodeValue;
		});

		this.replaceWith(function() {
			return $("<" + newType + "/>", attrs).append($(this).contents());
		});
	}
})(jQuery);

function TryUntilSucceeded(Function, Interval) {
  try {
		Function();
  } 
  catch(err) {
	//alert(err);
	setTimeout(function(){TryUntilSucceeded(Function,Interval);},Interval);
  }
}
  
function BuildDetailPage() {
$("#detailMenuDropDownToggle").attr("aria-label","Bewerkingen voor record");
$("#detailTable > .table").changeElementType("table");
$(".tableRow").changeElementType("tr");
$(".fieldCaption,.fieldValue").changeElementType("td");
$(".fontWeightSemibold").attr({"aria-level":"2","role":"heading"});
}

function Decos()
{
  $("body").attr("role","document");TryUntilSucceeded(function(){$("#actionMenuDropDownToggle").attr("aria-label", "Nieuw item aanmaken");},500);
	//if (document.location.hash.includes("/searchResult/")) {//TryUntilSucceeded(function(){$("a[record-selection]").attr("aria-label", "DecosConnect, record bekijken");},500);
	//}
	if (document.location.hash.includes("/detailView/")) {
	TryUntilSucceeded(BuildDetailPage,1500);
	}
}

$(document).ready(Decos);
window.addEventListener("hashchange", Decos);
// een button toevoegen om atttributen aan ontoegankelijke elementen toe te voegen
// conclusie = Deze comandoos worden namelijk uitgevoerd voordat de probleem elementen op de pag aanwezig zijn.
var btn = document.createElement("BUTTON");
	document.body.appendChild(btn);
	btn.innerHTML="Babbage script uitvoeren";
	btn.id="12345";
	document.getElementById("12345").addEventListener("click", Decos);
	SetAttributeForID("accesskey","12345","o")
 


// ==UserScript==
// @name         PZP Zorgvinder (2017).
// @namespace    http://www.babbage.com/
// @version      20171121. Alpha.
// @description  Toegankelijkheid van de webapplicatie Zorgvinder verbeteren.
// @author       Peter Dackers. (Babbage Automation, Roosendaal).
// @match        *://zorgvinder-pzp.cz.nl/*
// @grant        none
// ==/UserScript==

// Verbetering: 1 algemene functie van maken en aanroepen I.P.V. losse functies.
function resultsTableWT1() {
    if (document.getElementById("CZTheme_External_wt1_block_wtMainContent_wtrl_wb_results_ctl00_wtwb_results_wtTR_Zorgverleners") !== null) {
        var resultaat = document.getElementById("CZTheme_External_wt1_block_wtMainContent_wtrl_wb_results_ctl00_wtwb_results_wtTR_Zorgverleners").outerHTML;
        if (document.getElementById("CZTheme_External_wt1_block_wtMainContent_wtrl_wb_results_ctl00_wtwb_results_wtTR_Zorgverleners").getAttribute("label") === null) {
            document.getElementById("CZTheme_External_wt1_block_wtMainContent_wtContainer_AutoLocate").innerHTML += resultaat;
        }
        document.getElementById("CZTheme_External_wt1_block_wtMainContent_wtrl_wb_results_ctl00_wtwb_results_wtTR_Zorgverleners").setAttribute("label", "Babbage");
    }
}

function resultsTableWT2() {
    if (document.getElementById("CZTheme_External_wt2_block_wtMainContent_wtrl_wb_results_ctl00_wtwb_results_wtTR_Zorgverleners") !== null) {
        var resultaat = document.getElementById("CZTheme_External_wt2_block_wtMainContent_wtrl_wb_results_ctl00_wtwb_results_wtTR_Zorgverleners").outerHTML;
        if (document.getElementById("CZTheme_External_wt2_block_wtMainContent_wtrl_wb_results_ctl00_wtwb_results_wtTR_Zorgverleners").getAttribute("label") === null) {
            document.getElementById("CZTheme_External_wt2_block_wtMainContent_wtContainer_AutoLocate").innerHTML += resultaat;
        }
        document.getElementById("CZTheme_External_wt2_block_wtMainContent_wtrl_wb_results_ctl00_wtwb_results_wtTR_Zorgverleners").setAttribute("label", "Babbage");
    }
}

function resultsTableWT3() {
    if (document.getElementById("CZTheme_External_wt3_block_wtMainContent_wtrl_wb_results_ctl00_wtwb_results_wtTR_Zorgverleners") !== null) {
        var resultaat = document.getElementById("CZTheme_External_wt3_block_wtMainContent_wtrl_wb_results_ctl00_wtwb_results_wtTR_Zorgverleners").outerHTML;
        if (document.getElementById("CZTheme_External_wt3_block_wtMainContent_wtrl_wb_results_ctl00_wtwb_results_wtTR_Zorgverleners").getAttribute("label") === null) {
            document.getElementById("CZTheme_External_wt3_block_wtMainContent_wtContainer_AutoLocate").innerHTML += resultaat;
        }
        document.getElementById("CZTheme_External_wt3_block_wtMainContent_wtrl_wb_results_ctl00_wtwb_results_wtTR_Zorgverleners").setAttribute("label", "Babbage");
    }
}

setTimeout(function () {
    resultsTableWT1();
    resultsTableWT2();
    resultsTableWT3();
}, 15000);

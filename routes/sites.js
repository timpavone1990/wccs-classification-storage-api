"use strict";

const express = require('express');
const router = express.Router();
const unirest = require("unirest");

let sites = {};

(function init() {
    let siteNames = [
        "B.A. Bildungswissenschaft",
        "B.A. Kulturwissenschaften mit Fachschwerpunkt Geschichte, Literaturwissenschaft, Philosophie",
        "B.A. Politikwissenschaft, Verwaltungswissenschaft, Soziologie (PVS)",
        "B.Sc. Psychologie",
        "M.A. Bildung und Medien - eEducation",
        "M.A. Europäische Moderne: Geschichte und Literatur",
        "M.A. Geschichte Europas - Epochen, Umbrüche, Verflechtungen",
        "M.A. Governance",
        "M.A. Philosophie - Philosophie im europäischen Kontext",
        "M.Sc. Psychologie",
        "M.A. Soziologie – Zugänge zur Gegenwartsgesellschaft",
        "B.A. Kulturwissenschaften (ohne Fachschwerpunkt)",
        "B.A. Soziologie",
        "M.A. Soziologie: Individualisierung und Sozialstruktur",
        "Institut für Bildungswissenschaft und Medienforschung"
    ];

    let states = ["Analyzing", "Analysed", "In Review", "Waiting", "Approved"];

    siteNames.forEach((siteName) => {
        let siteId = siteName
            .replace(/\./g, "")
            .replace(/\s/g, "")
            .replace(/\(/g, "")
            .replace(/\)/g, "")
            .replace(/,/g, "");

        let pages = {};
        let numberOfPages = Math.floor(Math.random() * 10) + 1;
        for (let i = 0; i < numberOfPages; i++) {
            let page = {
                "url": "http://www.fernuni-hagen.de/ksw/" + siteId + "/page" + i,
                "status": states[Math.floor(Math.random() * 5)]
            };
            pages[page.url.replace(/\//g, "")] = page;
        }

        sites[siteId] = { "name": siteId , "pages" : pages};
    });
})();

router.get('/', (request, response) => {
    let sitesArray = Object.keys(sites).map((siteName) => sites[siteName]);
    response.json({
        "total": sitesArray.length,
        "sites": sitesArray
    });
});

router.get("/:id/pages", (request, response) => {
    let site = sites[request.params.id];
    let pagesArray = Object.keys(site.pages).map(pageId => site.pages[pageId]);
    response.json(pagesArray);
});

router.get("/:siteId/pages/:pageId", (request, response) => {
    response.json(sites[request.params.siteId].pages[request.params.pageId]);
});

module.exports = router;

"use strict";

const express = require('express');
const router = express.Router();
const unirest = require("unirest");
const pageRepository = new (require("../lib/PageRepository"))(unirest);

let sites = {};

(() => {
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
    let pageTypes = ["FAQ", "Kontakt", "Aktuelles"];

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
                "status": states[Math.floor(Math.random() * 5)],
                "pageType": pageTypes[Math.floor(Math.random() * 3)]
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

router.route("/:siteId/pages")
    .post((request, response) => {
        console.time("overall");
        let storePagePromise = pageRepository.store(request.body, {"id": request.params.siteId});
        storePagePromise.then(() => {
            // TODO Set Location header and payload?
            response.status(201).end();
            console.timeEnd("overall");
        }, (error) => {
            console.log(error);
            response.status(500).json({ "error": "Unexpected error. See log for details." });
        });
    });

router.route("/:siteId/pages/:url")
    .get(async (request, response) => {
        try {
            const page = await pageRepository.getPage(request.params.url);
            response.json(page);
        } catch (e) {
            console.log(e);
            response.status(500).json({ "error": "Unexpected error. See log for details." });
        }
    });

router.get("/:siteId/pages/:pageId", (request, response) => {
    response.json(sites[request.params.siteId].pages[request.params.pageId]);
});

module.exports = router;

"use strict";

const express = require('express');
const router = express.Router();
const logger = require("../lib/Logger");
const unirest = require("unirest");
const pageRepository = new (require("../lib/PageRepository"))(unirest);
const siteRepository = new (require("../lib/SiteRepository"))(unirest);

router.get('/', async (request, response, next) => {
    try {
        const sites = await siteRepository.getSites();
        response.json({ "total": sites.length, "sites": sites });
    } catch (e) {
        logger.error(e.message);
        next(e);
    }
});

router.route("/:siteId/pages")
    .get(async (request, response, next) => {
        try {
            const pages = await pageRepository.getSitePages(request.params.siteId);
            response.json({"total": pages.length, "pages": pages});
        } catch (e) {
            logger.error(e.message);
            next(e);
        }
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
    })
    .put((request, response) => {
        console.time("overall");
        request.body.url = request.params.url;
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

module.exports = router;

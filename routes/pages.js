"use strict";

const express = require('express');
const router = express.Router();

const unirest = require("unirest");
const pageRepository = new (require("../lib/PageRepository"))(unirest);

router.route("/:url")
    .get(async (request, response) => {
        try {
            const page = await pageRepository.getPage(request.params.url);
            response.json(page);
        } catch (e) {
            console.log(e);
            response.status(500).json({ "error": "Unexpected error. See log for details." });
        }
    });

module.exports = router;

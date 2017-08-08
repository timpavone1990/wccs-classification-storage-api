"use strict";

const express = require('express');
const router = express.Router();
const unirest = require("unirest");
const pageRepository = new (require("../lib/PageRepository"))(unirest);

router.post('/', (request, response) => {
    const startTime = new Date();
    let storePagePromise = pageRepository.store(request.body);
    storePagePromise.then(() => {
        // TODO Set Location header and payload?
        const duration = new Date() - startTime;
        response.status(201).end();
        console.log(`Database request duration: ${duration} ms`);
    }, (error) => {
        console.log(error);
        response.status(500).json({ "error": "Unexpected error. See log for details." });
    });
});

module.exports = router;

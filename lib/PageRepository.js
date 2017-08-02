"use strict";

const pageBatchJobFactory = require("./PageBatchJobFactory");
const HttpRequestExecutor = require("./HttpRequestExecutor");

module.exports = class PageRepository {
    constructor(httpClient) {
        this.httpRequestExecutor = new HttpRequestExecutor(httpClient)
    }

    store(page) {
        let pageStorageStatements = pageBatchJobFactory.createPageStorageJob(page);
        return this.httpRequestExecutor
            .post("http://localhost:7474/db/data/transaction/commit", pageStorageStatements)
    }

    getPage(id) {

    }
};
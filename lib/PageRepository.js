"use strict";

const pageBatchJobFactory = require("./PageBatchJobFactory");
const HttpRequestExecutor = require("./HttpRequestExecutor");

module.exports = class PageRepository {
    constructor(httpClient) {
        this.httpRequestExecutor = new HttpRequestExecutor(httpClient)
    }

    store(page, site) {
        console.time("Build statement");
        let pageStorageStatements = pageBatchJobFactory.buildPageStorageStatement(page, site);
        console.timeEnd("Build statement");
        return this.httpRequestExecutor
            .post("http://localhost:7474/db/data/transaction/commit", pageStorageStatements)
    }

    getPage(id) {

    }
};
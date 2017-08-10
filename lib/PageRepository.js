"use strict";

const pageBatchJobFactory = require("./PageBatchJobFactory");
const HttpRequestExecutor = require("./HttpRequestExecutor");

module.exports = class PageRepository {
    constructor(httpClient) {
        this.httpRequestExecutor = new HttpRequestExecutor(httpClient)
    }

    store(page, site) {
        let pageStorageStatements = pageBatchJobFactory.buildPageStorageStatement(page, site);
        return this.httpRequestExecutor
            .post("http://localhost:7474/db/data/transaction/commit", pageStorageStatements)
    }

    getPage(id) {

    }
};
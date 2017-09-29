"use strict";

const pageBatchJobFactory = require("./PageBatchJobFactory");
const GetPageJobHelper = require("./GetPageHelper");
const PageAssembler = require("./PageAssembler");
const HttpRequestExecutor = require("./HttpRequestExecutor");

module.exports = class PageRepository {
    constructor(httpClient) {
        this.httpRequestExecutor = new HttpRequestExecutor(httpClient);
        this.getPageJobHelper = new GetPageJobHelper();
        this.pageAssembler = new PageAssembler();
    }

    store(page, site) {
        console.time("Build statement");
        let pageStorageStatements = pageBatchJobFactory.buildPageStorageStatement(page, site);
        console.timeEnd("Build statement");
        return this.httpRequestExecutor
            .post("http://storage:7474/db/data/transaction/commit", pageStorageStatements);
    }

    async getPage(url) {
        const pageStatements = this.getPageJobHelper.getPageStatement(url);
        const getPageResults = await this.httpRequestExecutor
            .post("http://storage:7474/db/data/transaction/commit", pageStatements);
        return this.pageAssembler.assemble(getPageResults.body);
    }

    async getSitePages(siteId) {
        const statement = {
            "statements": [
                {
                    "statement": "MATCH (s:Site {id:$siteId})-[:Owns]->(p:Page) RETURN p",
                    "parameters": { "siteId": siteId }
                }
            ]
        };

        const dbResult = await this.httpRequestExecutor.post("http://storage:7474/db/data/transaction/commit", statement);
        return dbResult.body.results[0].data.map(data => data.row[0]);
    }
};
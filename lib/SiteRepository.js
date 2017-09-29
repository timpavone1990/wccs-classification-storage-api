"use strict";

const HttpRequestExecutor = require("./HttpRequestExecutor");

module.exports = class SiteRepository {
    constructor(httpClient) {
        this.httpRequestExecutor = new HttpRequestExecutor(httpClient);
    }

    async getSites() {
        const dbResult = await this.httpRequestExecutor.get("http://storage:7474/db/data/label/Site/nodes");
        return dbResult.body.map(result => result.data);
    }
};
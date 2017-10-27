"use strict";

const Statement = require("./Statement");

module.exports = class ContentStatement extends Statement {
    constructor(value) {
        super("MERGE (c:Content {value: $c.value})", { "c": { "value": value } });
    }
};
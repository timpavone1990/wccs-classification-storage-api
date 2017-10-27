"use strict";

const Statement = require("./Statement");

module.exports = class ResourceStatement extends Statement {
    constructor(destination) {
        super("MERGE (r:Resource {url: $r.destination})", { "r": { "destination": destination }});
    }
};
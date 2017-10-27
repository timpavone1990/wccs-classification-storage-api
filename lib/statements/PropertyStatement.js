"use strict";

const Statement = require("./Statement");

module.exports = class PropertyStatement extends Statement {
    constructor(checksum, type) {
        super("MERGE (p:Property {checksum: $p.checksum,type: $p.type})", { "p": { "checksum": checksum, "type": type } });
    }
};
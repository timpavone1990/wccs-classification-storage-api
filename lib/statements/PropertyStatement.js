"use strict";

const Statement = require("./Statement");

module.exports = class PropertyStatement extends Statement {
    constructor(checksum, contentClass) {
        super("MERGE (p:Content {checksum: $p.checksum,class: $p.class})", { "p": { "checksum": checksum, "class": contentClass } });
    }
};
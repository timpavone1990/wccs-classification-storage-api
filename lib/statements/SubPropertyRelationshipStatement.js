"use strict";

const PropertyRelationshipStatement = require("./PropertyRelationshipStatement");

module.exports = class SubPropertyRelationshipStatement extends PropertyRelationshipStatement {
    constructor(parentPropertyChecksum, subPropertyChecksum, relationshipProperties) {
        super(
            "p1", "Content {checksum: $p1.checksum}",
            "p2", "Content {checksum: $p2.checksum}",
            {
                "p1": { "checksum": parentPropertyChecksum },
                "p2": { "checksum": subPropertyChecksum },
                "o": relationshipProperties
            }
        );
    }
};
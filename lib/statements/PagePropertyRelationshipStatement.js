"use strict";

const PropertyRelationshipStatement = require("./PropertyRelationshipStatement");

module.exports = class PagePropertyRelationshipStatement extends PropertyRelationshipStatement {
    constructor(pageUrl, propertyChecksum, relationshipProperties) {
        super(
            "p", "Resource {url: $p.url}",
            "prop", "Content {checksum: $prop.checksum}",
            {
                "p": { "url": pageUrl },
                "prop": { "checksum": propertyChecksum },
                "o": relationshipProperties
            }
        );
    }
};
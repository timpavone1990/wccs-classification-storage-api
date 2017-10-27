"use strict";

const Statement = require("./Statement");

module.exports = class PropertyRelationshipStatement extends Statement {
    constructor(parentAlias, parentMatcher, propertyAlias, propertyMatcher, parameters) {
        super(
            "MATCH" +
                `(${parentAlias}:${parentMatcher}),` +
                `(${propertyAlias}:${propertyMatcher})\n` +
            `MERGE (${parentAlias})-[o:Owns {` +
                "name: $o.name," +
                "isCollection: $o.isCollection," +
                "selectorType: $o.selector.type," +
                "startSelectorType: $o.selector.startSelector.type," +
                "startSelectorValue: $o.selector.startSelector.value," +
                "startSelectorOffset: $o.selector.startSelector.offset," +
                "endSelectorType: $o.selector.endSelector.type," +
                "endSelectorValue: $o.selector.endSelector.value," +
                "endSelectorOffset: $o.selector.endSelector.offset" +
            `}]->(${propertyAlias})`,
            parameters
        );
    }
};
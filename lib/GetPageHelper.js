"use stricht";

class Statement {
    constructor(statement, parameters) {
        this.statement = statement;
        this.parameters = parameters;
    }
}

module.exports = class GetPageHelper {



    getPageStatement(url) {
        const statements = [];
        
        const getPageAndPageReferences =
            "MATCH (page:Resource {url: $url})-[reference:References]->(resource:Resource)\n" +
            "RETURN page {" +
                ".type, .url," +
                "references: collect({" +
                    "name: reference.name," +
                    "type: reference.type," +
                    "destination: resource.url," +
                    "isCollection: reference.isCollection," +
                    "selector: {" +
                        "type: reference.selectorType," +
                        "startSelector: {type: reference.startSelectorType,value: reference.startSelectorValue, offset: reference.startSelectorOffset}," +
                        "endSelector: {type: reference.endSelectorType, value: reference.endSelectorValue, offset: reference.endSelectorValue}" +
                    "}" +
                "})" +
            "}";

        const getPageAndPageReferencesStatement = new Statement(getPageAndPageReferences, {"url": url});
        statements.push(getPageAndPageReferencesStatement);

        const getPropertyReferences =
            "MATCH (page:Resource {url: $url})-[:Owns*]->(property:Property)-[reference:References]->(resource:Resource)\n" +
            "RETURN {" +
                "parent: property.checksum," +
                "references: collect({" +
                    "name: reference.name," +
                    "type: reference.type," +
                    "destination: resource.url," +
                    "selector: {" +
                        "type: reference.selectorType," +
                        "startSelector: {type: reference.startSelectorType, value: reference.startSelectorValue, offset: reference.startSelectorOffset}," +
                        "endSelector: {type: reference.endSelectorType, value: reference.endSelectorValue, offset: reference.endSelectorValue}" +
                    "}" +
                "})" +
            "}";

        const getPropertyReferencesStatement = new Statement(getPropertyReferences, {"url": url});
        statements.push(getPropertyReferencesStatement);

        const getFirstLevelPageProperties =
            "MATCH (page:Resource {url: $url})-[relationship:Owns]->(property:Property)\n" +
            "RETURN collect({name: relationship.name, checksum: property.checksum})";

        const getFirstLevelPagePropertiesStatement = new Statement(getFirstLevelPageProperties, {"url": url});
        statements.push(getFirstLevelPagePropertiesStatement);

        return { "statements": statements };
    }
};
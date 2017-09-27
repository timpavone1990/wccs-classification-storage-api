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

        const getPage = "MATCH (page:Resource {url: $url}) RETURN page {.type, .url}";
        const getPageStatement = new Statement(getPage, {"url": url});
        statements.push(getPageStatement);

        const getPageReferences =
            "MATCH (page:Resource {url: $url})-[reference:References]->(resource:Resource)\n" +
            "RETURN page {" +
                "references: collect({" +
                    "name: reference.name," +
                    "type: reference.type," +
                    "destination: resource.url," +
                    "isCollection: reference.isCollection," +
                    "selector: {" +
                        "type: reference.selectorType," +
                        "startSelector: {type: reference.startSelectorType,value: reference.startSelectorValue, offset: reference.startSelectorOffset}," +
                        "endSelector: {type: reference.endSelectorType, value: reference.endSelectorValue, offset: reference.endSelectorOffset}" +
                    "}" +
                "})" +
            "}";

        const getPageAndPageReferencesStatement = new Statement(getPageReferences, {"url": url});
        statements.push(getPageAndPageReferencesStatement);

        const getPropertyReferences =
            "MATCH (page:Resource {url: $url})-[:Owns*]->(property:Property)-[reference:References]->(resource:Resource)\n" +
            "RETURN {" +
                "parent: property.checksum," +
                "references: collect({" +
                    "name: reference.name," +
                    "type: reference.type," +
                    "destination: resource.url," +
                    "isCollection: reference.isCollection," +
                    "selector: {" +
                        "type: reference.selectorType," +
                        "startSelector: {type: reference.startSelectorType, value: reference.startSelectorValue, offset: reference.startSelectorOffset}," +
                        "endSelector: {type: reference.endSelectorType, value: reference.endSelectorValue, offset: reference.endSelectorOffset}" +
                    "}" +
                "})" +
            "}";

        const getPropertyReferencesStatement = new Statement(getPropertyReferences, {"url": url});
        statements.push(getPropertyReferencesStatement);

        const getFirstLevelProperties =
            "MATCH (page:Resource {url: $url})-[relationship:Owns]->(property:Property)\n" +
            "WITH page, relationship, property\n" +
            "OPTIONAL MATCH (property)-[:Reads]->(propertyContent:Content)\n" +
            "RETURN collect({" +
                "type: property.type," +
                "checksum: property.checksum," +
                "name: relationship.name," +
                "content: propertyContent.value," +
                "isCollection: relationship.isCollection," +
                "selector: {" +
                    "type: relationship.selectorType," +
                    "startSelector: {type: relationship.startSelectorType, value: relationship.startSelectorValue, offset: relationship.startSelectorOffset}," +
                    "endSelector: {type: relationship.endSelectorType, value: relationship.endSelectorValue, offset: relationship.endSelectorOffset}" +
                "}" +
            "})";

        const getFirstLevelPropertiesStatement = new Statement(getFirstLevelProperties, {"url": url});
        statements.push(getFirstLevelPropertiesStatement);

        const getProperties =
            "MATCH (page)-[:Owns*]->(:Property)-[subPropertyRelationship:Owns]-(subProperty:Property)\n" +
            "WITH page, subPropertyRelationship, subProperty\n" +
            "OPTIONAL MATCH (subProperty)-[:Reads]->(subPropertyContent:Content)\n" +
            "RETURN collect({" +
                "type: subProperty.type," +
                "checksum: subProperty.checksum," +
                "name: subPropertyRelationship.name," +
                "content: subPropertyContent.value," +
                "isCollection: subPropertyRelationship.isCollection," +
                "selector: {" +
                    "type: subPropertyRelationship.selectorType," +
                    "startSelector: {type: subPropertyRelationship.startSelectorType, value: subPropertyRelationship.startSelectorValue, offset: subPropertyRelationship.startSelectorOffset}," +
                    "endSelector: {type: subPropertyRelationship.endSelectorType, value: subPropertyRelationship.endSelectorValue, offset: subPropertyRelationship.endSelectorOffset}" +
                "}" +
            "})";

        const getPropertiesStatement = new Statement(getProperties, {"url": url});
        statements.push(getPropertiesStatement);

        const getSubProperties = "MATCH (page:Resource {url: $url})-[:Owns*]->(property:Property)-[subPropertyRelationship:Owns]->(subProperty:Property)" +
            "RETURN {property: property.checksum, subProperties: collect({name:subPropertyRelationship.name, checksum: subProperty.checksum})}";

        const getSubPropertiesStatement = new Statement(getSubProperties, {"url": url});
        statements.push(getSubPropertiesStatement);

        return { "statements": statements };
    }
};
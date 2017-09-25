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

        const getProperties =
            "MATCH (page:Resource {url: $url})-[pagePropertyRelationship:Owns]->(pageProperty:Property)\n" +
            "WITH page, pagePropertyRelationship, pageProperty\n" +
            "OPTIONAL MATCH (pageProperty)-[:Reads]->(pagePropertyContent:Content)\n" +
            "\n" +
            "WITH collect({" +
                "type: pageProperty.type," +
                "checksum: pageProperty.checksum," +
                "name: pagePropertyRelationship.name," +
                "content: pagePropertyContent.value," +
                "isCollection: pagePropertyRelationship.isCollection," +
                "selector: {" +
                    "type: pagePropertyRelationship.selectorType," +
                    "startSelector: {type: pagePropertyRelationship.startSelectorType, value: pagePropertyRelationship.startSelectorValue, offset: pagePropertyRelationship.startSelectorOffset}," +
                    "endSelector: {type: pagePropertyRelationship.endSelectorType, value: pagePropertyRelationship.endSelectorValue, offset: pagePropertyRelationship.endSelectorValue}" +
                "}" +
            "}) AS pageProperties, page\n" +
            "\n" +
            "MATCH (page)-[:Owns*]->(:Property)-[subPropertyRelationship:Owns]-(subProperty:Property)\n" +
            "WITH page, subPropertyRelationship, subProperty, pageProperties\n" +
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
                    "endSelector: {type: subPropertyRelationship.endSelectorType, value: subPropertyRelationship.endSelectorValue, offset: subPropertyRelationship.endSelectorValue}" +
                "}" +
            "}) + pageProperties";

        const getPropertiesStatement = new Statement(getProperties, {"url": url});
        statements.push(getPropertiesStatement);

        const getSubProperties = "MATCH (page:Resource {url: $url})-[:Owns*]->(property:Property)-[subPropertyRelationship:Owns]->(subProperty:Property)" +
            "RETURN {property: property.checksum, subProperties: collect({name:subPropertyRelationship.name, checksum: subProperty.checksum})}";

        const getSubPropertiesStatement = new Statement(getSubProperties, {"url": url});
        statements.push(getSubPropertiesStatement);

        return { "statements": statements };
    }
};
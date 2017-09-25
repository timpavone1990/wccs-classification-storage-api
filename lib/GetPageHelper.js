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



        return { "statements": statements };
    }
};
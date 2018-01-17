"use stricht";

const expect = require("chai").expect;
const GetPageHelper = require("./GetPageHelper");

describe("#GetPageHelper", () => {
    it("should return statements", () => {
        const helper = new GetPageHelper();
        const statements = helper.getPageStatement("http://myhost/myfolder/mypage");

        expect(statements).to.eql({
            "statements": [
                {
                    "statement": "MATCH (page:Resource {url: $url}) RETURN page",
                    "parameters": {"url": "http://myhost/myfolder/mypage"}
                },
                {
                    "statement":
                        "MATCH (page:Resource {url: $url})-[reference:References]->(resource:Resource)\n" +
                        "WITH page, reference, resource ORDER BY reference.name, reference.startSelectorValue\n" +
                        "RETURN page {" +
                            "references: collect({" +
                                "name: reference.name," +
                                "class: reference.class," +
                                "destination: resource.url," +
                                "isCollection: reference.isCollection," +
                                "selector: {" +
                                    "type: reference.selectorType," +
                                    "startSelector: {type: reference.startSelectorType,value: reference.startSelectorValue, offset: reference.startSelectorOffset}," +
                                    "endSelector: {type: reference.endSelectorType, value: reference.endSelectorValue, offset: reference.endSelectorOffset}" +
                                "}" +
                            "})" +
                        "}",
                    "parameters": {"url": "http://myhost/myfolder/mypage"}
                },
                {
                    "statement":
                        "MATCH (page:Resource {url: $url})-[:Owns*]->(property:Content)-[reference:References]->(resource:Resource)\n" +
                        "WITH property, reference, resource ORDER BY reference.name, reference.startSelectorValue\n" +
                        "RETURN {" +
                            "parent: property.checksum," +
                            "references: collect({" +
                                "name: reference.name," +
                                "class: reference.class," +
                                "destination: resource.url," +
                                "isCollection: reference.isCollection," +
                                "selector: {" +
                                    "type: reference.selectorType," +
                                    "startSelector: {type: reference.startSelectorType, value: reference.startSelectorValue, offset: reference.startSelectorOffset}," +
                                    "endSelector: {type: reference.endSelectorType, value: reference.endSelectorValue, offset: reference.endSelectorOffset}" +
                                "}" +
                            "})" +
                        "} AS result ORDER BY result.parent",
                    "parameters": {"url": "http://myhost/myfolder/mypage"}
                },
                {
                    "statement":
                        "MATCH (page:Resource {url: $url})-[relationship:Owns]->(property:Content)\n" +
                        "WITH page, relationship, property ORDER BY relationship.name, relationship.startSelectorValue\n" +
                        "OPTIONAL MATCH (property)-[:Reads]->(propertyContent:Text)\n" +
                        "RETURN collect({" +
                            "class: property.class," +
                            "checksum: property.checksum," +
                            "name: relationship.name," +
                            "content: propertyContent.value," +
                            "isCollection: relationship.isCollection," +
                            "selector: {" +
                                "type: relationship.selectorType," +
                                "startSelector: {type: relationship.startSelectorType, value: relationship.startSelectorValue, offset: relationship.startSelectorOffset}," +
                                "endSelector: {type: relationship.endSelectorType, value: relationship.endSelectorValue, offset: relationship.endSelectorOffset}" +
                            "}" +
                        "})",
                    "parameters": {"url": "http://myhost/myfolder/mypage"}
                },
                {
                    "statement":
                    "MATCH (page:Resource {url: $url})-[:Owns*]->(:Content)-[subPropertyRelationship:Owns]->(subProperty:Content)\n" +
                    "WITH page, subPropertyRelationship, subProperty ORDER BY subPropertyRelationship.name, subPropertyRelationship.startSelectorValue\n" +
                    "OPTIONAL MATCH (subProperty)-[:Reads]->(subPropertyContent:Text)\n" +
                    "RETURN collect({" +
                        "class: subProperty.class," +
                        "checksum: subProperty.checksum," +
                        "content: subPropertyContent.value" +
                    "})",
                    "parameters": {"url": "http://myhost/myfolder/mypage"}
                },
                {
                    "statement":
                    "MATCH (page:Resource {url: $url})-[:Owns*]->(property:Content)-[subPropertyRelationship:Owns]->(subProperty:Content)\n" +
                    "WITH property, subPropertyRelationship, subProperty ORDER BY subPropertyRelationship.name, subPropertyRelationship.startSelectorValue\n" +
                    "RETURN {" +
                        "property: property.checksum," +
                        "subProperties: collect({" +
                            "name:subPropertyRelationship.name," +
                            "isCollection: subPropertyRelationship.isCollection," +
                            "checksum: subProperty.checksum," +
                            "selector: {" +
                                "type: subPropertyRelationship.selectorType," +
                                "startSelector: {" +
                                    "type: subPropertyRelationship.startSelectorType," +
                                    "value: subPropertyRelationship.startSelectorValue," +
                                    "offset: subPropertyRelationship.startSelectorOffset" +
                                "}," +
                                "endSelector: {" +
                                    "type: subPropertyRelationship.endSelectorType," +
                                    "value: subPropertyRelationship.endSelectorValue," +
                                    "offset: subPropertyRelationship.endSelectorOffset" +
                                "}" +
                            "}" +
                        "})" +
                    "} AS result ORDER BY result.property",
                    "parameters": {"url": "http://myhost/myfolder/mypage"}
                }
            ]
        });
    })
});
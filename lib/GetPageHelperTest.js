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
                    "statement": "MATCH (page:Resource {url: $url})-[reference:References]->(resource:Resource)\n" +
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
                        "}",
                    "parameters": {"url": "http://myhost/myfolder/mypage"}
                }
            ]
        });
    })
});
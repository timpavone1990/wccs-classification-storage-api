"use strict";

const pageBatchJobFactory = require("./PageBatchJobFactory");
const expect = require("chai").expect;

const testPage = {
    "url": "http://myhost/myfolder/mypage",
    "type": "MyPageType",
    "properties": {
        "my_property_1": {
            "type": "MyProperty1Type",
            "selector": {
                "type": "RangeSelector",
                "startSelector": { "type": "XPathSelector", "value": "//p[1]/span[1]/span[1]","offset": 0 },
                "endSelector": { "type": "XPathSelector", "value": "//p[1]/span[1]/span[11]", "offset": 120 }
            },
            "content": "MyProperty1Content",
            "references": {
                "my_reference_1.1": {
                    "type": "MyReference1.1Type",
                    "destination": "http://myhost/myfolder/myotherpage1.1",
                    "selector": {
                        "type": "RangeSelector",
                        "startSelector": { "type": "XPathSelector", "value": "//table[11]/tr[11]/td[11]","offset": 0 },
                        "endSelector": { "type": "XPathSelector", "value": "//table[11]/tr[11]/td[111]", "offset": 120 }
                    },
                    "content": "MyReference1.1Content"
                },
                "my_reference_1.2": {
                    "type": "MyReference1.2Type",
                    "destination": "http://myhost/myfolder/myotherpage1.2",
                    "selector": {
                        "type": "RangeSelector",
                        "startSelector": { "type": "XPathSelector", "value": "//table[12]/tr[12]/td[12]","offset": 0 },
                        "endSelector": { "type": "XPathSelector", "value": "//table[12]/tr[12]/td[122]", "offset": 120 }
                    },
                    "content": "MyReference1.2Content"
                }
            }
        },
        "my_property_2": {
            "type": "MyProperty2Type",
            "selector": {
                "type": "RangeSelector",
                "startSelector": { "type": "XPathSelector", "value": "//p[2]/span[2]/span[2]","offset": 0 },
                "endSelector": { "type": "XPathSelector", "value": "//p[2]/span[2]/span[22]", "offset": 120 }
            },
            "content": "MyProperty2Content",
            "properties": {
                "my_property_2.1": {
                    "type": "MyProperty2.1Type",
                    "selector": {
                        "type": "RangeSelector",
                        "startSelector": { "type": "XPathSelector", "value": "//p[21]/span[2]/span[21]","offset": 0 },
                        "endSelector": { "type": "XPathSelector", "value": "//p[21]/span[2]/span[211]", "offset": 120 }
                    },
                    "content": "MyProperty2.1Content"
                },
                "my_property_2.2": {
                    "type": "MyProperty2.2Type",
                    "selector": {
                        "type": "RangeSelector",
                        "startSelector": { "type": "XPathSelector", "value": "//p[22]/span[2]/span[22]","offset": 0 },
                        "endSelector": { "type": "XPathSelector", "value": "//p[22]/span[22]/span[222]", "offset": 120 }
                    },
                    "content": "MyProperty2.2Content"
                }
            },
            "references": {
                "my_reference_2.1": {
                    "type": "MyReference2.1Type",
                    "destination": "http://myhost/myfolder/myotherpage2.1",
                    "selector": {
                        "type": "RangeSelector",
                        "startSelector": { "type": "XPathSelector", "value": "//table[21]/tr[21]/td[21]","offset": 0 },
                        "endSelector": { "type": "XPathSelector", "value": "//table[21]/tr[21]/td[211]", "offset": 120 }
                    },
                    "content": "MyReference2.1Content"
                },
                "my_reference_2.2": {
                    "type": "MyReference2.2Type",
                    "destination": "http://myhost/myfolder/myotherpage2.2",
                    "selector": {
                        "type": "RangeSelector",
                        "startSelector": { "type": "XPathSelector", "value": "//table[22]/tr[22]/td[22]","offset": 0 },
                        "endSelector": { "type": "XPathSelector", "value": "//table[22]/tr[22]/td[222]", "offset": 120 }
                    },
                    "content": "MyReference2.2Content"
                }
            }
        },
        "my_property_3": [
            {
                "type": "MyProperty3Type",
                "selector": {
                    "type": "RangeSelector",
                    "startSelector": { "type": "XPathSelector", "value": "//p[31]/span[31]/span[31]","offset": 0 },
                    "endSelector": { "type": "XPathSelector", "value": "//p[31]/span[31]/span[311]", "offset": 120 }
                },
                "content": "MyProperty3Item1Content"
            },
            {
                "type": "MyProperty3Type",
                "selector": {
                    "type": "RangeSelector",
                    "startSelector": { "type": "XPathSelector", "value": "//p[32]/span[32]/span[32]","offset": 0 },
                    "endSelector": { "type": "XPathSelector", "value": "//p[32]/span[32]/span[322]", "offset": 120 }
                },
                "content": "MyProperty3Item2Content"
            }
        ]
    },
    "references": {
        "my_reference_1": {
            "type": "MyReference1Type",
            "destination": "http://myhost/myfolder/myotherpage1",
            "selector": {
                "type": "RangeSelector",
                "startSelector": { "type": "XPathSelector", "value": "//table[1]/tr[1]/td[1]","offset": 0 },
                "endSelector": { "type": "XPathSelector", "value": "//table[1]/tr[1]/td[11]", "offset": 120 }
            },
            "content": "MyReference1Content"
        },
        "my_reference_2": {
            "type": "MyReference2Type",
            "destination": "http://myhost/myfolder/myotherpage2",
            "selector": {
                "type": "RangeSelector",
                "startSelector": { "type": "XPathSelector", "value": "//table[2]/tr[2]/td[2]","offset": 0 },
                "endSelector": { "type": "XPathSelector", "value": "//table[2]/tr[2]/td[22]", "offset": 120 }
            },
            "content": "MyReference2Content"
        },
        "my_reference_3": {
            "type": "MyReference3Type",
            "destination": "http://myhost/myfolder/myotherpage3",
            "selector": {
                "type": "RangeSelector",
                "startSelector": { "type": "XPathSelector", "value": "//table[3]/tr[3]/td[3]","offset": 0 },
                "endSelector": { "type": "XPathSelector", "value": "//table[3]/tr[3]/td[33]", "offset": 120 }
            },
            "content": "MyReference3Content"
        }
    }
};

describe("#buildPageStorageStatement", () => {
    it("should compute the statements correctly", () => {
        const statements = pageBatchJobFactory.buildPageStorageStatement(testPage, {"name": "MySite"});
        expect(statements).to.eql({
            "statements": [{
                "statement":
                    (
                    "MERGE (p:Page {url: $p.url})\n" +
                    "SET p.type = $p.type\n" +

                    "MERGE (s:Site {name: $s.name})\n" +
                    "MERGE (s)-[:Owns]->(p)\n" +

                    "WITH s,p\n" +
                    "OPTIONAL MATCH (p)-[e]->()\n" +
                    "DELETE e\n" +

                    "MERGE (p_ref0_p:Page {url: $p_ref0.destination})\n" +
                    "MERGE (p_ref1_p:Page {url: $p_ref1.destination})\n" +
                    "MERGE (p_ref2_p:Page {url: $p_ref2.destination})\n" +
                    "MERGE (p)-[:Reference {" +
                        "name: $p_ref0.name," +
                        "type: $p_ref0.type," +
                        "content: $p_ref0.content," +
                        "selectorType: $p_ref0.selector.type," +
                        "startSelectorType: $p_ref0.selector.startSelector.type," +
                        "startSelectorValue: $p_ref0.selector.startSelector.value," +
                        "startSelectorOffset: $p_ref0.selector.startSelector.offset," +
                        "endSelectorType: $p_ref0.selector.endSelector.type," +
                        "endSelectorValue: $p_ref0.selector.endSelector.value," +
                        "endSelectorOffset: $p_ref0.selector.endSelector.offset" +
                    "}]->(p_ref0_p)\n" +
                    "MERGE (p)-[:Reference {" +
                        "name: $p_ref1.name," +
                        "type: $p_ref1.type," +
                        "content: $p_ref1.content," +
                        "selectorType: $p_ref1.selector.type," +
                        "startSelectorType: $p_ref1.selector.startSelector.type," +
                        "startSelectorValue: $p_ref1.selector.startSelector.value," +
                        "startSelectorOffset: $p_ref1.selector.startSelector.offset," +
                        "endSelectorType: $p_ref1.selector.endSelector.type," +
                        "endSelectorValue: $p_ref1.selector.endSelector.value," +
                        "endSelectorOffset: $p_ref1.selector.endSelector.offset" +
                    "}]->(p_ref1_p)\n" +
                    "MERGE (p)-[:Reference {" +
                        "name: $p_ref2.name," +
                        "type: $p_ref2.type," +
                        "content: $p_ref2.content," +
                        "selectorType: $p_ref2.selector.type," +
                        "startSelectorType: $p_ref2.selector.startSelector.type," +
                        "startSelectorValue: $p_ref2.selector.startSelector.value," +
                        "startSelectorOffset: $p_ref2.selector.startSelector.offset," +
                        "endSelectorType: $p_ref2.selector.endSelector.type," +
                        "endSelectorValue: $p_ref2.selector.endSelector.value," +
                        "endSelectorOffset: $p_ref2.selector.endSelector.offset" +
                    "}]->(p_ref2_p)\n" +

                    "MERGE (p_prop0_ref0_p:Page {url: $p_prop0_ref0.destination})\n" +
                    "MERGE (p_prop0_ref1_p:Page {url: $p_prop0_ref1.destination})\n" +
                    "MERGE (p_prop0:Content {type: $p_prop0.type,content: $p_prop0.content})-[:Reference {" +
                        "name: $p_prop0_ref0.name," +
                        "type: $p_prop0_ref0.type," +
                        "content: $p_prop0_ref0.content," +
                        "selectorType: $p_prop0_ref0.selector.type," +
                        "startSelectorType: $p_prop0_ref0.selector.startSelector.type," +
                        "startSelectorValue: $p_prop0_ref0.selector.startSelector.value," +
                        "startSelectorOffset: $p_prop0_ref0.selector.startSelector.offset," +
                        "endSelectorType: $p_prop0_ref0.selector.endSelector.type," +
                        "endSelectorValue: $p_prop0_ref0.selector.endSelector.value," +
                        "endSelectorOffset: $p_prop0_ref0.selector.endSelector.offset" +
                    "}]->(p_prop0_ref0_p)-[:ReferencedBy]->(p_prop0)-[:Reference {" +
                        "name: $p_prop0_ref1.name," +
                        "type: $p_prop0_ref1.type," +
                        "content: $p_prop0_ref1.content," +
                        "selectorType: $p_prop0_ref1.selector.type," +
                        "startSelectorType: $p_prop0_ref1.selector.startSelector.type," +
                        "startSelectorValue: $p_prop0_ref1.selector.startSelector.value," +
                        "startSelectorOffset: $p_prop0_ref1.selector.startSelector.offset," +
                        "endSelectorType: $p_prop0_ref1.selector.endSelector.type," +
                        "endSelectorValue: $p_prop0_ref1.selector.endSelector.value," +
                        "endSelectorOffset: $p_prop0_ref1.selector.endSelector.offset" +
                    "}]->(p_prop0_ref1_p)-[:ReferencedBy]->(p_prop0)\n" +

                    "MERGE (p_prop1_prop0:Content {type: $p_prop1_prop0.type,content: $p_prop1_prop0.content})\n" +

                    "MERGE (p_prop1_prop1:Content {type: $p_prop1_prop1.type,content: $p_prop1_prop1.content})\n" +

                    "MERGE (p_prop1_ref0_p:Page {url: $p_prop1_ref0.destination})\n" +
                    "MERGE (p_prop1_ref1_p:Page {url: $p_prop1_ref1.destination})\n" +
                    "MERGE (p_prop1:Content {type: $p_prop1.type,content: $p_prop1.content})" +
                        "-[:Property {" +
                            "name: $p_prop1_prop0.name," +
                            "selectorType: $p_prop1_prop0.selector.type," +
                            "startSelectorType: $p_prop1_prop0.selector.startSelector.type," +
                            "startSelectorValue: $p_prop1_prop0.selector.startSelector.value," +
                            "startSelectorOffset: $p_prop1_prop0.selector.startSelector.offset," +
                            "endSelectorType: $p_prop1_prop0.selector.endSelector.type," +
                            "endSelectorValue: $p_prop1_prop0.selector.endSelector.value," +
                            "endSelectorOffset: $p_prop1_prop0.selector.endSelector.offset" +
                        "}]->(p_prop1_prop0)-[:Parent]->(p_prop1)" +
                        "-[:Property {" +
                            "name: $p_prop1_prop1.name," +
                            "selectorType: $p_prop1_prop1.selector.type," +
                            "startSelectorType: $p_prop1_prop1.selector.startSelector.type," +
                            "startSelectorValue: $p_prop1_prop1.selector.startSelector.value," +
                            "startSelectorOffset: $p_prop1_prop1.selector.startSelector.offset," +
                            "endSelectorType: $p_prop1_prop1.selector.endSelector.type," +
                            "endSelectorValue: $p_prop1_prop1.selector.endSelector.value," +
                            "endSelectorOffset: $p_prop1_prop1.selector.endSelector.offset" +
                        "}]->(p_prop1_prop1)-[:Parent]->(p_prop1)" +
                        "-[:Reference {" +
                            "name: $p_prop1_ref0.name," +
                            "type: $p_prop1_ref0.type," +
                            "content: $p_prop1_ref0.content," +
                            "selectorType: $p_prop1_ref0.selector.type," +
                            "startSelectorType: $p_prop1_ref0.selector.startSelector.type," +
                            "startSelectorValue: $p_prop1_ref0.selector.startSelector.value," +
                            "startSelectorOffset: $p_prop1_ref0.selector.startSelector.offset," +
                            "endSelectorType: $p_prop1_ref0.selector.endSelector.type," +
                            "endSelectorValue: $p_prop1_ref0.selector.endSelector.value," +
                            "endSelectorOffset: $p_prop1_ref0.selector.endSelector.offset" +
                        "}]->(p_prop1_ref0_p)-[:ReferencedBy]->(p_prop1)" +
                        "-[:Reference {" +
                            "name: $p_prop1_ref1.name," +
                            "type: $p_prop1_ref1.type," +
                            "content: $p_prop1_ref1.content," +
                            "selectorType: $p_prop1_ref1.selector.type," +
                            "startSelectorType: $p_prop1_ref1.selector.startSelector.type," +
                            "startSelectorValue: $p_prop1_ref1.selector.startSelector.value," +
                            "startSelectorOffset: $p_prop1_ref1.selector.startSelector.offset," +
                            "endSelectorType: $p_prop1_ref1.selector.endSelector.type," +
                            "endSelectorValue: $p_prop1_ref1.selector.endSelector.value," +
                            "endSelectorOffset: $p_prop1_ref1.selector.endSelector.offset" +
                        "}]->(p_prop1_ref1_p)-[:ReferencedBy]->(p_prop1)\n" +

                    "MERGE (p_prop2_item0:Content {type: $p_prop2_item0.type,content: $p_prop2_item0.content})\n" +

                    "MERGE (p_prop2_item1:Content {type: $p_prop2_item1.type,content: $p_prop2_item1.content})\n" +

                    "MERGE (p)" +
                        "-[:Property {" +
                            "name: $p_prop0.name," +
                            "selectorType: $p_prop0.selector.type," +
                            "startSelectorType: $p_prop0.selector.startSelector.type," +
                            "startSelectorValue: $p_prop0.selector.startSelector.value," +
                            "startSelectorOffset: $p_prop0.selector.startSelector.offset," +
                            "endSelectorType: $p_prop0.selector.endSelector.type," +
                            "endSelectorValue: $p_prop0.selector.endSelector.value," +
                            "endSelectorOffset: $p_prop0.selector.endSelector.offset" +
                        "}]->(p_prop0)\n" +
                    "MERGE (p)" +
                        "-[:Property {" +
                            "name: $p_prop1.name," +
                            "selectorType: $p_prop1.selector.type," +
                            "startSelectorType: $p_prop1.selector.startSelector.type," +
                            "startSelectorValue: $p_prop1.selector.startSelector.value," +
                            "startSelectorOffset: $p_prop1.selector.startSelector.offset," +
                            "endSelectorType: $p_prop1.selector.endSelector.type," +
                            "endSelectorValue: $p_prop1.selector.endSelector.value," +
                            "endSelectorOffset: $p_prop1.selector.endSelector.offset" +
                    "}]->(p_prop1)\n" +
                    "MERGE (p)" +
                        "-[:Property {" +
                            "name: $p_prop2_item0.name," +
                            "selectorType: $p_prop2_item0.selector.type," +
                            "startSelectorType: $p_prop2_item0.selector.startSelector.type," +
                            "startSelectorValue: $p_prop2_item0.selector.startSelector.value," +
                            "startSelectorOffset: $p_prop2_item0.selector.startSelector.offset," +
                            "endSelectorType: $p_prop2_item0.selector.endSelector.type," +
                            "endSelectorValue: $p_prop2_item0.selector.endSelector.value," +
                            "endSelectorOffset: $p_prop2_item0.selector.endSelector.offset" +
                    "}]->(p_prop2_item0)\n" +
                    "MERGE (p)" +
                        "-[:Property {" +
                            "name: $p_prop2_item1.name," +
                            "selectorType: $p_prop2_item1.selector.type," +
                            "startSelectorType: $p_prop2_item1.selector.startSelector.type," +
                            "startSelectorValue: $p_prop2_item1.selector.startSelector.value," +
                            "startSelectorOffset: $p_prop2_item1.selector.startSelector.offset," +
                            "endSelectorType: $p_prop2_item1.selector.endSelector.type," +
                            "endSelectorValue: $p_prop2_item1.selector.endSelector.value," +
                            "endSelectorOffset: $p_prop2_item1.selector.endSelector.offset" +
                    "}]->(p_prop2_item1)\n" +

                    "WITH s,p,p_ref0_p,p_ref1_p,p_ref2_p,p_prop0_ref0_p,p_prop0_ref1_p,p_prop0,p_prop1_prop0,p_prop1_prop1,p_prop1_ref0_p,p_prop1_ref1_p,p_prop1,p_prop2_item0,p_prop2_item1\n" +
                    "OPTIONAL MATCH (q:Content)-[toDeletedProperty:Property]->(deletedProperty:Content)-[fromDeletedProperty:Parent]->(q)\n" +
                    "WHERE q IN [s,p,p_ref0_p,p_ref1_p,p_ref2_p,p_prop0_ref0_p,p_prop0_ref1_p,p_prop0,p_prop1_prop0,p_prop1_prop1,p_prop1_ref0_p,p_prop1_ref1_p,p_prop1,p_prop2_item0,p_prop2_item1] AND NOT deletedProperty IN [s,p,p_ref0_p,p_ref1_p,p_ref2_p,p_prop0_ref0_p,p_prop0_ref1_p,p_prop0,p_prop1_prop0,p_prop1_prop1,p_prop1_ref0_p,p_prop1_ref1_p,p_prop1,p_prop2_item0,p_prop2_item1]\n" +
                    "DELETE toDeletedProperty, fromDeletedProperty\n" +

                    "WITH s,p,p_ref0_p,p_ref1_p,p_ref2_p,p_prop0_ref0_p,p_prop0_ref1_p,p_prop0,p_prop1_prop0,p_prop1_prop1,p_prop1_ref0_p,p_prop1_ref1_p,p_prop1,p_prop2_item0,p_prop2_item1\n" +
                    "OPTIONAL MATCH (x:Content)-[deletedReference:Reference]->(y:Page)-[deletedReferencedBy:ReferencedBy]->(x)\n" +
                    "WHERE x IN [s,p,p_ref0_p,p_ref1_p,p_ref2_p,p_prop0_ref0_p,p_prop0_ref1_p,p_prop0,p_prop1_prop0,p_prop1_prop1,p_prop1_ref0_p,p_prop1_ref1_p,p_prop1,p_prop2_item0,p_prop2_item1] AND NOT y IN [s,p,p_ref0_p,p_ref1_p,p_ref2_p,p_prop0_ref0_p,p_prop0_ref1_p,p_prop0,p_prop1_prop0,p_prop1_prop1,p_prop1_ref0_p,p_prop1_ref1_p,p_prop1,p_prop2_item0,p_prop2_item1]\n" +
                    `DELETE deletedReference, deletedReferencedBy\n` +

                    "WITH p\n" +
                    "OPTIONAL MATCH (c:Content) WHERE NOT (:Page)-[:Property*]->(c)\n" +
                    "DETACH DELETE c\n" +

                    "WITH p\n" +
                    "OPTIONAL MATCH (n:Page) WHERE NOT (()-[:Reference]->(n) OR (n)-[:Property]-())\n" +
                    "DELETE n\n"
                    ),
                "parameters": {
                    "s": {"name": "MySite"},
                    "p_prop0": {"type": "MyProperty1Type", "name": "my_property_1", "content": "MyProperty1Content", "selector": {"type": "RangeSelector","startSelector": { "type": "XPathSelector", "value": "//p[1]/span[1]/span[1]","offset": 0 },"endSelector": { "type": "XPathSelector", "value": "//p[1]/span[1]/span[11]", "offset": 120 }}},
                    "p_prop0_ref0": {"type": "MyReference1.1Type", "name": "my_reference_1.1", "destination": "http://myhost/myfolder/myotherpage1.1", "content": "MyReference1.1Content", "selector": {"type": "RangeSelector","startSelector": { "type": "XPathSelector", "value": "//table[11]/tr[11]/td[11]","offset": 0 },"endSelector": { "type": "XPathSelector", "value": "//table[11]/tr[11]/td[111]", "offset": 120 }}},
                    "p_prop0_ref1": {"type": "MyReference1.2Type", "name": "my_reference_1.2", "destination": "http://myhost/myfolder/myotherpage1.2", "content": "MyReference1.2Content", "selector": {"type": "RangeSelector","startSelector": { "type": "XPathSelector", "value": "//table[12]/tr[12]/td[12]","offset": 0 },"endSelector": { "type": "XPathSelector", "value": "//table[12]/tr[12]/td[122]", "offset": 120 }}},
                    "p_prop1_ref0": {"type": "MyReference2.1Type", "name": "my_reference_2.1", "destination": "http://myhost/myfolder/myotherpage2.1", "content": "MyReference2.1Content", "selector": {"type": "RangeSelector","startSelector": { "type": "XPathSelector", "value": "//table[21]/tr[21]/td[21]","offset": 0 },"endSelector": { "type": "XPathSelector", "value": "//table[21]/tr[21]/td[211]", "offset": 120 }}},
                    "p_prop1_ref1": {"type": "MyReference2.2Type", "name": "my_reference_2.2", "destination": "http://myhost/myfolder/myotherpage2.2", "content": "MyReference2.2Content", "selector": {"type": "RangeSelector","startSelector": { "type": "XPathSelector", "value": "//table[22]/tr[22]/td[22]","offset": 0 },"endSelector": { "type": "XPathSelector", "value": "//table[22]/tr[22]/td[222]", "offset": 120 }}},
                    "p_prop1_prop0": {"type": "MyProperty2.1Type", "name": "my_property_2.1", "content": "MyProperty2.1Content", "selector": {"type": "RangeSelector","startSelector": { "type": "XPathSelector", "value": "//p[21]/span[2]/span[21]","offset": 0 },"endSelector": { "type": "XPathSelector", "value": "//p[21]/span[2]/span[211]", "offset": 120 }}},
                    "p_prop1_prop1": {"type": "MyProperty2.2Type", "name": "my_property_2.2", "content": "MyProperty2.2Content", "selector": {"type": "RangeSelector","startSelector": { "type": "XPathSelector", "value": "//p[22]/span[2]/span[22]","offset": 0 },"endSelector": { "type": "XPathSelector", "value": "//p[22]/span[22]/span[222]", "offset": 120 }}},
                    "p_prop1": {"type": "MyProperty2Type", "name": "my_property_2", "content": "MyProperty2Content", "selector": {"type": "RangeSelector","startSelector": { "type": "XPathSelector", "value": "//p[2]/span[2]/span[2]","offset": 0 },"endSelector": { "type": "XPathSelector", "value": "//p[2]/span[2]/span[22]", "offset": 120 }}},
                    "p_prop2_item0": {"type": "MyProperty3Type", "name": "my_property_3", "content": "MyProperty3Item1Content", "selector": {"type": "RangeSelector","startSelector": { "type": "XPathSelector", "value": "//p[31]/span[31]/span[31]","offset": 0 },"endSelector": { "type": "XPathSelector", "value": "//p[31]/span[31]/span[311]", "offset": 120 }}},
                    "p_prop2_item1": {"type": "MyProperty3Type", "name": "my_property_3", "content": "MyProperty3Item2Content", "selector": {"type": "RangeSelector","startSelector": { "type": "XPathSelector", "value": "//p[32]/span[32]/span[32]","offset": 0 },"endSelector": { "type": "XPathSelector", "value": "//p[32]/span[32]/span[322]", "offset": 120 }}},
                    "p": {"type": "MyPageType", "url": "http://myhost/myfolder/mypage"},
                    "p_ref0": {"name":"my_reference_1", "type": "MyReference1Type", "destination": "http://myhost/myfolder/myotherpage1", "content": "MyReference1Content", "selector": {"type": "RangeSelector","startSelector": { "type": "XPathSelector", "value": "//table[1]/tr[1]/td[1]","offset": 0 },"endSelector": { "type": "XPathSelector", "value": "//table[1]/tr[1]/td[11]", "offset": 120 }}},
                    "p_ref1": {"name":"my_reference_2", "type": "MyReference2Type", "destination": "http://myhost/myfolder/myotherpage2", "content": "MyReference2Content", "selector": {"type": "RangeSelector","startSelector": { "type": "XPathSelector", "value": "//table[2]/tr[2]/td[2]","offset": 0 },"endSelector": { "type": "XPathSelector", "value": "//table[2]/tr[2]/td[22]", "offset": 120 }}},
                    "p_ref2": {"name":"my_reference_3", "type": "MyReference3Type", "destination": "http://myhost/myfolder/myotherpage3", "content": "MyReference3Content", "selector": {"type": "RangeSelector","startSelector": { "type": "XPathSelector", "value": "//table[3]/tr[3]/td[3]","offset": 0 },"endSelector": { "type": "XPathSelector", "value": "//table[3]/tr[3]/td[33]", "offset": 120 }}}
                }
            }]
        });
    });
});
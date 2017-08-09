"use strict";

const pageBatchJobFactory = require("./PageBatchJobFactory");
const expect = require("chai").expect;

const testPage = {
    "url": "http://myhost/myfolder/mypage",
    "type": "MyPageType",
    "properties": {
        "my_property_1": {
            "type": "MyProperty1Type",
            "references": {
                "my_reference_1.1": {
                    "type": "MyReference1.1Type",
                    "destination": "http://myhost/myfolder/myotherpage1.1"
                },
                "my_reference_1.2": {
                    "type": "MyReference1.2Type",
                    "destination": "http://myhost/myfolder/myotherpage1.2"
                }
            }
        },
        "my_property_2": {
            "type": "MyProperty2Type",
            "properties": {
                "my_property_2.1": {
                    "type": "MyProperty2.1Type"
                },
                "my_property_2.2": {
                    "type": "MyProperty2.2Type"
                }
            },
            "references": {
                "my_reference_2.1": {
                    "type": "MyReference2.1Type",
                    "destination": "http://myhost/myfolder/myotherpage2.1"
                },
                "my_reference_2.2": {
                    "type": "MyReference2.2Type",
                    "destination": "http://myhost/myfolder/myotherpage2.2"
                }
            }
        },
        "my_property_3": [
            { "type": "MyProperty3Type", "text": "MyProperty3Item1Text" },
            { "type": "MyProperty3Type", "text": "MyProperty3Item2Text" }
        ]
    },
    "references": {
        "my_reference_1": {
            "type": "MyReference1Type",
            "destination": "http://myhost/myfolder/myotherpage1"
        },
        "my_reference_2": {
            "type": "MyReference2Type",
            "destination": "http://myhost/myfolder/myotherpage2"
        },
        "my_reference_3": {
            "type": "MyReference3Type",
            "destination": "http://myhost/myfolder/myotherpage3"
        }
    }
};

describe("#createPageBatchJob", () => {
    it("should compute the batch jobs correctly.", () => {
        let batchJobs = pageBatchJobFactory.createPageBatchJob(testPage);
        expect(batchJobs).to.eql([
            { "id": 0, "method": "POST", "to": "/node", "body": { "url": "http://myhost/myfolder/mypage", "type": "MyPageType" } },
            { "id": 1, "method": "POST", "to": "{0}/labels", "body": "Page" },
            { "id": 2, "method": "POST", "to": "/node", "body": { "type": "MyProperty1Type" } },
            { "id": 3, "method": "POST", "to": "{2}/labels", "body": "Content" },
            { "id": 4, "method": "POST", "to": "{0}/relationships", "body": { "to": "{2}", "type": "my_property_1" } },
            { "id": 5, "method": "POST", "to": "/node", "body": { "type": "MyProperty2Type" } },
            { "id": 6, "method": "POST", "to": "{5}/labels", "body": "Content" },
            { "id": 7, "method": "POST", "to": "/node", "body": { "type": "MyProperty2.1Type" } },
            { "id": 8, "method": "POST", "to": "{7}/labels", "body": "Content" },
            { "id": 9, "method": "POST", "to": "{5}/relationships", "body": { "to": "{7}", "type": "my_property_2.1" } },
            { "id": 10, "method": "POST", "to": "/node", "body": { "type": "MyProperty2.2Type" } },
            { "id": 11, "method": "POST", "to": "{10}/labels", "body": "Content" },
            { "id": 12, "method": "POST", "to": "{5}/relationships", "body": { "to": "{10}", "type": "my_property_2.2" } },
            { "id": 13, "method": "POST", "to": "{0}/relationships", "body": { "to": "{5}", "type": "my_property_2" } },
            { "id": 14, "method": "POST", "to": "/node", "body": { "type": "MyProperty3Type" } },
            { "id": 15, "method": "POST", "to": "{14}/labels", "body": "Content" },
            { "id": 16, "method": "POST", "to": "{0}/relationships", "body": { "to": "{14}", "type": "my_property_3" } },
            { "id": 17, "method": "POST", "to": "/node", "body": { "type": "MyProperty3.1Type" } },
            { "id": 18, "method": "POST", "to": "{17}/labels", "body": "Content" },
            { "id": 19, "method": "POST", "to": "{0}/relationships", "body": { "to": "{17}", "type": "my_property_3" } }
        ]);
    })
});

describe("#buildPageStorageStatement", () => {
    it("should compute the statements correctly", () => {
        const statements = pageBatchJobFactory.buildPageStorageStatement(testPage);
        expect(statements).to.eql({
            "statements": [{
                "statement":
                    (
                    "MERGE (p:Page {url: $p.url})\n" +
                    "SET p.type = $p.type\n" +
                    "WITH p\n" +
                    "OPTIONAL MATCH (p)-[e]->()\n" +
                    "DELETE e\n" +

                    "MERGE (p_ref0_p:Page {url: $p_ref0.destination})\n" +
                    "MERGE (p_ref1_p:Page {url: $p_ref1.destination})\n" +
                    "MERGE (p_ref2_p:Page {url: $p_ref2.destination})\n" +
                    "MERGE (p)-[:Reference {name: $p_ref0.name, type: $p_ref0.type}]->(p_ref0_p)\n" +
                    "MERGE (p)-[:Reference {name: $p_ref1.name, type: $p_ref1.type}]->(p_ref1_p)\n" +
                    "MERGE (p)-[:Reference {name: $p_ref2.name, type: $p_ref2.type}]->(p_ref2_p)\n" +

                    "MERGE (p_0_ref0_p:Page {url: $p_0_ref0.destination})\n" +
                    "MERGE (p_0_ref1_p:Page {url: $p_0_ref1.destination})\n" +
                    "MERGE (p_0:Content {type: $p_0.type})-[:Reference {name: $p_0_ref0.name, type: $p_0_ref0.type}]->(p_0_ref0_p)-[:ReferencedBy]->(p_0)-[:Reference {name: $p_0_ref1.name, type: $p_0_ref1.type}]->(p_0_ref1_p)-[:ReferencedBy]->(p_0)\n" +

                    "MERGE (p_1_0:Content {type: $p_1_0.type})\n" +
                    "MERGE (p_1_1:Content {type: $p_1_1.type})\n" +
                    "MERGE (p_1_ref0_p:Page {url: $p_1_ref0.destination})\n" +
                    "MERGE (p_1_ref1_p:Page {url: $p_1_ref1.destination})\n" +
                    "MERGE (p_1:Content {type: $p_1.type})-[:Property {name: $p_1_0.name}]->(p_1_0)-[:Parent]->(p_1)-[:Property {name: $p_1_1.name}]->(p_1_1)-[:Parent]->(p_1)-[:Reference {name: $p_1_ref0.name, type: $p_1_ref0.type}]->(p_1_ref0_p)-[:ReferencedBy]->(p_1)-[:Reference {name: $p_1_ref1.name, type: $p_1_ref1.type}]->(p_1_ref1_p)-[:ReferencedBy]->(p_1)\n" +

                    "MERGE (p_2_0:Content {type: $p_2_0.type,text: $p_2_0.text})\n" +
                    "MERGE (p_2_1:Content {type: $p_2_1.type,text: $p_2_1.text})\n" +

                    "MERGE (p)-[:Property {name: $p_0.name}]->(p_0)\n" +
                    "MERGE (p)-[:Property {name: $p_1.name}]->(p_1)\n" +
                    "MERGE (p)-[:Property {name: $p_2_0.name}]->(p_2_0)\n" +
                    "MERGE (p)-[:Property {name: $p_2_1.name}]->(p_2_1)\n" +

                    "WITH p\n" +
                    "OPTIONAL MATCH (c:Content) WHERE NOT (:Page)-[:Property*]->(c)\n" +
                    "DETACH DELETE c\n" +

                    "WITH p\n" +
                    "OPTIONAL MATCH (n:Page) WHERE NOT (()-[:Reference]->(n) OR (n)-[:Property]-())\n" +
                    "DELETE n\n"
                    ),
                "parameters": {
                    "p_0": {"type": "MyProperty1Type", "name": "my_property_1"},
                    "p_0_ref0": {"type": "MyReference1.1Type", "name": "my_reference_1.1", "destination": "http://myhost/myfolder/myotherpage1.1"},
                    "p_0_ref1": {"type": "MyReference1.2Type", "name": "my_reference_1.2", "destination": "http://myhost/myfolder/myotherpage1.2"},
                    "p_1_ref0": {"type": "MyReference2.1Type", "name": "my_reference_2.1", "destination": "http://myhost/myfolder/myotherpage2.1"},
                    "p_1_ref1": {"type": "MyReference2.2Type", "name": "my_reference_2.2", "destination": "http://myhost/myfolder/myotherpage2.2"},
                    "p_1_0": {"type": "MyProperty2.1Type", "name": "my_property_2.1"},
                    "p_1_1": {"type": "MyProperty2.2Type", "name": "my_property_2.2"},
                    "p_1": {"type": "MyProperty2Type", "name": "my_property_2"},
                    "p_2_0": {"type": "MyProperty3Type", "name": "my_property_3", "text": "MyProperty3Item1Text"},
                    "p_2_1": {"type": "MyProperty3Type", "name": "my_property_3", "text": "MyProperty3Item2Text"},
                    "p": {"type": "MyPageType", "url": "http://myhost/myfolder/mypage"},
                    "p_ref0": {"name":"my_reference_1", "type": "MyReference1Type", "destination": "http://myhost/myfolder/myotherpage1"},
                    "p_ref1": {"name":"my_reference_2", "type": "MyReference2Type", "destination": "http://myhost/myfolder/myotherpage2"},
                    "p_ref2": {"name":"my_reference_3", "type": "MyReference3Type", "destination": "http://myhost/myfolder/myotherpage3"}
                }
            }]
        });
    });
});
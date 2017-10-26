"use strict";

const pageBatchJobFactory = require("./PageBatchJobFactory");
const expect = require("chai").expect;
const testPage = require("../resources/ExamplePageObject");

describe("#buildPageStorageStatement", () => {
    it("should compute the statements correctly", () => {
        const statements = pageBatchJobFactory.buildCreateStatement(testPage, {"id": "MySite"});
        expect(statements).to.eql({
            "statements": [
                {
                    // RESOURCE
                    "statement": "MERGE (r:Resource {url: $r.destination})",
                    "parameters": { "r": { "destination": "http://myhost/myfolder/myotherpage1.1" } }
                },
                {
                    "statement": "MERGE (r:Resource {url: $r.destination})",
                    "parameters": { "r": { "destination": "http://myhost/myfolder/myotherpage1.2" } }
                },
                {
                    // CONTENT
                    "statement": "MERGE (c:Content {value: $c.value})",
                    "parameters": { "c": { "value": "MyProperty1Content" } }
                },
                {
                    // PROPERTY
                    "statement": "MERGE (p:Property {checksum: $p.checksum,type: $p.type})",
                    "parameters": { "p": { "checksum": "c1b13f177c6446d1f0ecc37abbae005c", "type": "MyProperty1Type"} }
                },
                {
                    // REFERENCE
                    "statement":
                        "MATCH" +
                            "(p:Property {checksum: $p.checksum})," +
                            "(r:Resource {url: $r.destination})\n" +
                        "MERGE (p)-[:References {" +
                            "name: $ref.name," +
                            "type: $ref.type," +
                            "isCollection: $ref.isCollection," +
                            "selectorType: $ref.selector.type," +
                            "startSelectorType: $ref.selector.startSelector.type," +
                            "startSelectorValue: $ref.selector.startSelector.value," +
                            "startSelectorOffset: $ref.selector.startSelector.offset," +
                            "endSelectorType: $ref.selector.endSelector.type," +
                            "endSelectorValue: $ref.selector.endSelector.value," +
                            "endSelectorOffset: $ref.selector.endSelector.offset" +
                        "}]->(r)",
                    "parameters": {
                        "p": { "checksum": "c1b13f177c6446d1f0ecc37abbae005c" },
                        "r": { "destination": "http://myhost/myfolder/myotherpage1.1" },
                        "ref": {"type": "MyReference1.1Type", "name": "my_reference_1.1", "isCollection": false, "selector": {"type": "RangeSelector","startSelector": { "type": "XPathSelector", "value": "//table[11]/tr[11]/td[11]","offset": 0 },"endSelector": { "type": "XPathSelector", "value": "//table[11]/tr[11]/td[111]", "offset": 120 }}}
                    }
                },
                {
                    "statement":
                        "MATCH" +
                            "(p:Property {checksum: $p.checksum})," +
                            "(r:Resource {url: $r.destination})\n" +
                        "MERGE (p)-[:References {" +
                            "name: $ref.name," +
                            "type: $ref.type," +
                            "isCollection: $ref.isCollection," +
                            "selectorType: $ref.selector.type," +
                            "startSelectorType: $ref.selector.startSelector.type," +
                            "startSelectorValue: $ref.selector.startSelector.value," +
                            "startSelectorOffset: $ref.selector.startSelector.offset," +
                            "endSelectorType: $ref.selector.endSelector.type," +
                            "endSelectorValue: $ref.selector.endSelector.value," +
                            "endSelectorOffset: $ref.selector.endSelector.offset" +
                        "}]->(r)",
                    "parameters": {
                        "p": { "checksum": "c1b13f177c6446d1f0ecc37abbae005c" },
                        "r": { "destination": "http://myhost/myfolder/myotherpage1.2" },
                        "ref": {"type": "MyReference1.2Type", "name": "my_reference_1.2", "isCollection": false, "selector": {"type": "RangeSelector","startSelector": { "type": "XPathSelector", "value": "//table[12]/tr[12]/td[12]","offset": 0 },"endSelector": { "type": "XPathSelector", "value": "//table[12]/tr[12]/td[122]", "offset": 120 }}}
                    }
                },
                {
                    // READS
                    "statement":
                        "MATCH" +
                            "(p:Property {checksum: $p.checksum})," +
                            "(c:Content {value: $c.value})\n" +
                        "MERGE (p)-[:Reads]->(c)",
                    "parameters": {
                        "p": { "checksum": "c1b13f177c6446d1f0ecc37abbae005c" },
                        "c": { "value": "MyProperty1Content" }
                    }
                },
                {
                    "statement": "MERGE (r:Resource {url: $r.destination})",
                    "parameters": { "r": { "destination": "http://myhost/myfolder/myotherpage1.2" } }
                },
                {
                    "statement": "MERGE (c:Content {value: $c.value})",
                    "parameters": { "c": { "value": "MyProperty2.1Content" } }
                },
                {
                    "statement": "MERGE (p:Property {checksum: $p.checksum,type: $p.type})",
                    "parameters": { "p": { "checksum": "99ee50ece1191c1bf875eded0866c54c", "type": "MyProperty2.1Type"} }
                },
                {
                    "statement":
                    "MATCH" +
                    "(p:Property {checksum: $p.checksum})," +
                    "(r:Resource {url: $r.destination})\n" +
                    "MERGE (p)-[:References {" +
                    "name: $ref.name," +
                    "type: $ref.type," +
                    "isCollection: $ref.isCollection," +
                    "selectorType: $ref.selector.type," +
                    "startSelectorType: $ref.selector.startSelector.type," +
                    "startSelectorValue: $ref.selector.startSelector.value," +
                    "startSelectorOffset: $ref.selector.startSelector.offset," +
                    "endSelectorType: $ref.selector.endSelector.type," +
                    "endSelectorValue: $ref.selector.endSelector.value," +
                    "endSelectorOffset: $ref.selector.endSelector.offset" +
                    "}]->(r)",
                    "parameters": {
                        "p": { "checksum": "99ee50ece1191c1bf875eded0866c54c" },
                        "r": { "destination": "http://myhost/myfolder/myotherpage1.2" },
                        "ref": {"type": "MyReference1.2Type", "name": "my_reference_2.1.1", "isCollection": false, "selector": {"type": "RangeSelector","startSelector": { "type": "XPathSelector", "value": "//table[12]/tr[12]/td[12]","offset": 0 },"endSelector": { "type": "XPathSelector", "value": "//table[12]/tr[12]/td[122]", "offset": 120 }}}
                    }
                },
                {
                    "statement":
                    "MATCH" +
                    "(p:Property {checksum: $p.checksum})," +
                    "(c:Content {value: $c.value})\n" +
                    "MERGE (p)-[:Reads]->(c)",
                    "parameters": {
                        "p": { "checksum": "99ee50ece1191c1bf875eded0866c54c" },
                        "c": { "value": "MyProperty2.1Content" }
                    }
                },
                {
                    "statement": "MERGE (c:Content {value: $c.value})",
                    "parameters": { "c": { "value": "MyProperty2.2Content" } }
                },
                {
                    "statement": "MERGE (p:Property {checksum: $p.checksum,type: $p.type})",
                    "parameters": { "p": { "checksum": "11fa789c32c7f7e77f0aefc96a281957", "type": "MyProperty2.2Type"} }
                },
                {
                    // READS
                    "statement":
                    "MATCH" +
                    "(p:Property {checksum: $p.checksum})," +
                    "(c:Content {value: $c.value})\n" +
                    "MERGE (p)-[:Reads]->(c)",
                    "parameters": {
                        "p": { "checksum": "11fa789c32c7f7e77f0aefc96a281957" },
                        "c": { "value": "MyProperty2.2Content" }
                    }
                },
                {
                    // CONTENT
                    "statement": "MERGE (c:Content {value: $c.value})",
                    "parameters": { "c": { "value": "MyProperty3Item1Content" } }
                },
                {
                    // PROPERTY
                    "statement": "MERGE (p:Property {checksum: $p.checksum,type: $p.type})",
                    "parameters": { "p": { "checksum": "d5ede2981a48bf3f010f1159212ee85f", "type": "MyProperty3Type"} }
                },
                {
                    // READS
                    "statement":
                    "MATCH" +
                    "(p:Property {checksum: $p.checksum})," +
                    "(c:Content {value: $c.value})\n" +
                    "MERGE (p)-[:Reads]->(c)",
                    "parameters": {
                        "p": { "checksum": "d5ede2981a48bf3f010f1159212ee85f" },
                        "c": { "value": "MyProperty3Item1Content" }
                    }
                },
                {
                    // RESOURCE
                    "statement": "MERGE (r:Resource {url: $r.destination})",
                    "parameters": { "r": { "destination": "http://myhost/myfolder/myotherpage2.1" } }
                },
                {
                    // RESOURCE
                    "statement": "MERGE (r:Resource {url: $r.destination})",
                    "parameters": { "r": { "destination": "http://myhost/myfolder/myotherpage2.2" } }
                },
                {
                    // CONTENT
                    "statement": "MERGE (c:Content {value: $c.value})",
                    "parameters": { "c": { "value": "MyProperty2Content" } }
                },
                {
                    // PROPERTY
                    "statement": "MERGE (p:Property {checksum: $p.checksum,type: $p.type})",
                    "parameters": { "p": { "checksum": "2ae9c40b28a208305b6aae864cd17341", "type": "MyProperty2Type"} }
                },
                {
                    // OWNS
                    "statement":
                        "MATCH" +
                            "(p1:Property {checksum: $p1.checksum})," +
                            "(p2:Property {checksum: $p2.checksum})\n" +
                        "MERGE (p1)-[o:Owns {" +
                            "name: $o.name," +
                            "isCollection: $o.isCollection," +
                            "selectorType: $o.selector.type," +
                            "startSelectorType: $o.selector.startSelector.type," +
                            "startSelectorValue: $o.selector.startSelector.value," +
                            "startSelectorOffset: $o.selector.startSelector.offset," +
                            "endSelectorType: $o.selector.endSelector.type," +
                            "endSelectorValue: $o.selector.endSelector.value," +
                            "endSelectorOffset: $o.selector.endSelector.offset" +
                        "}]->(p2)",
                    "parameters": {
                        "p1": { "checksum": "2ae9c40b28a208305b6aae864cd17341" },
                        "p2": { "checksum": "99ee50ece1191c1bf875eded0866c54c" },
                        "o": {"name": "my_property_2.1", "isCollection": false, "selector": {"type": "RangeSelector","startSelector": { "type": "XPathSelector", "value": "//p[21]/span[2]/span[21]","offset": 0 },"endSelector": { "type": "XPathSelector", "value": "//p[21]/span[2]/span[211]", "offset": 120 }}}
                    }
                },
                {
                    // OWNS
                    "statement":
                    "MATCH" +
                    "(p1:Property {checksum: $p1.checksum})," +
                    "(p2:Property {checksum: $p2.checksum})\n" +
                    "MERGE (p1)-[o:Owns {" +
                    "name: $o.name," +
                    "isCollection: $o.isCollection," +
                    "selectorType: $o.selector.type," +
                    "startSelectorType: $o.selector.startSelector.type," +
                    "startSelectorValue: $o.selector.startSelector.value," +
                    "startSelectorOffset: $o.selector.startSelector.offset," +
                    "endSelectorType: $o.selector.endSelector.type," +
                    "endSelectorValue: $o.selector.endSelector.value," +
                    "endSelectorOffset: $o.selector.endSelector.offset" +
                    "}]->(p2)",
                    "parameters": {
                        "p1": { "checksum": "2ae9c40b28a208305b6aae864cd17341" },
                        "p2": { "checksum": "11fa789c32c7f7e77f0aefc96a281957" },
                        "o": {"name": "my_property_2.2", "isCollection": false, "selector": {"type": "RangeSelector","startSelector": { "type": "XPathSelector", "value": "//p[22]/span[2]/span[22]","offset": 0 },"endSelector": { "type": "XPathSelector", "value": "//p[22]/span[22]/span[222]", "offset": 120 }}}
                    }
                },
                {
                    // OWNS
                    "statement":
                    "MATCH" +
                    "(p1:Property {checksum: $p1.checksum})," +
                    "(p2:Property {checksum: $p2.checksum})\n" +
                    "MERGE (p1)-[o:Owns {" +
                    "name: $o.name," +
                    "isCollection: $o.isCollection," +
                    "selectorType: $o.selector.type," +
                    "startSelectorType: $o.selector.startSelector.type," +
                    "startSelectorValue: $o.selector.startSelector.value," +
                    "startSelectorOffset: $o.selector.startSelector.offset," +
                    "endSelectorType: $o.selector.endSelector.type," +
                    "endSelectorValue: $o.selector.endSelector.value," +
                    "endSelectorOffset: $o.selector.endSelector.offset" +
                    "}]->(p2)",
                    "parameters": {
                        "p1": { "checksum": "2ae9c40b28a208305b6aae864cd17341" },
                        "p2": { "checksum": "d5ede2981a48bf3f010f1159212ee85f" },
                        "o": {"name": "my_property_2.3", "isCollection": false, "selector": {"type": "RangeSelector","startSelector": { "type": "XPathSelector", "value": "//p[31]/span[31]/span[31]","offset": 0 },"endSelector": { "type": "XPathSelector", "value": "//p[31]/span[31]/span[311]", "offset": 120 }}}
                    }
                },
                {
                    // REFERENCE
                    "statement":
                    "MATCH" +
                    "(p:Property {checksum: $p.checksum})," +
                    "(r:Resource {url: $r.destination})\n" +
                    "MERGE (p)-[:References {" +
                    "name: $ref.name," +
                    "type: $ref.type," +
                    "isCollection: $ref.isCollection," +
                    "selectorType: $ref.selector.type," +
                    "startSelectorType: $ref.selector.startSelector.type," +
                    "startSelectorValue: $ref.selector.startSelector.value," +
                    "startSelectorOffset: $ref.selector.startSelector.offset," +
                    "endSelectorType: $ref.selector.endSelector.type," +
                    "endSelectorValue: $ref.selector.endSelector.value," +
                    "endSelectorOffset: $ref.selector.endSelector.offset" +
                    "}]->(r)",
                    "parameters": {
                        "p": { "checksum": "2ae9c40b28a208305b6aae864cd17341" },
                        "r": { "destination": "http://myhost/myfolder/myotherpage2.1" },
                        "ref": {"type": "MyReference2.1Type", "name": "my_reference_2.1", "isCollection": false, "selector": {"type": "RangeSelector","startSelector": { "type": "XPathSelector", "value": "//table[21]/tr[21]/td[21]","offset": 0 },"endSelector": { "type": "XPathSelector", "value": "//table[21]/tr[21]/td[211]", "offset": 120 }}}
                    }
                },
                {
                    // REFERENCE
                    "statement":
                    "MATCH" +
                    "(p:Property {checksum: $p.checksum})," +
                    "(r:Resource {url: $r.destination})\n" +
                    "MERGE (p)-[:References {" +
                    "name: $ref.name," +
                    "type: $ref.type," +
                    "isCollection: $ref.isCollection," +
                    "selectorType: $ref.selector.type," +
                    "startSelectorType: $ref.selector.startSelector.type," +
                    "startSelectorValue: $ref.selector.startSelector.value," +
                    "startSelectorOffset: $ref.selector.startSelector.offset," +
                    "endSelectorType: $ref.selector.endSelector.type," +
                    "endSelectorValue: $ref.selector.endSelector.value," +
                    "endSelectorOffset: $ref.selector.endSelector.offset" +
                    "}]->(r)",
                    "parameters": {
                        "p": { "checksum": "2ae9c40b28a208305b6aae864cd17341" },
                        "r": { "destination": "http://myhost/myfolder/myotherpage2.2" },
                        "ref": {"type": "MyReference2.2Type", "name": "my_reference_2.2", "isCollection": false, "selector": {"type": "RangeSelector","startSelector": { "type": "XPathSelector", "value": "//table[22]/tr[22]/td[22]","offset": 0 },"endSelector": { "type": "XPathSelector", "value": "//table[22]/tr[22]/td[222]", "offset": 120 }}}
                    }
                },
                {
                    // READS
                    "statement":
                    "MATCH" +
                    "(p:Property {checksum: $p.checksum})," +
                    "(c:Content {value: $c.value})\n" +
                    "MERGE (p)-[:Reads]->(c)",
                    "parameters": {
                        "p": { "checksum": "2ae9c40b28a208305b6aae864cd17341" },
                        "c": { "value": "MyProperty2Content" }
                    }
                },
                {
                    // RESOURCE
                    "statement": "MERGE (r:Resource {url: $r.destination})",
                    "parameters": { "r": { "destination": "http://myhost/myfolder/myotherpage3#1.1" } }
                },
                {
                    // RESOURCE
                    "statement": "MERGE (r:Resource {url: $r.destination})",
                    "parameters": { "r": { "destination": "http://myhost/myfolder/myotherpage3#1.2" } }
                },
                {
                    // CONTENT
                    "statement": "MERGE (c:Content {value: $c.value})",
                    "parameters": { "c": { "value": "MyProperty3Item1Content" } }
                },
                {
                    // PROPERTY
                    "statement": "MERGE (p:Property {checksum: $p.checksum,type: $p.type})",
                    "parameters": { "p": { "checksum": "176b48fad17a1c4d1c278a1c47940948", "type": "MyProperty3Type"} }
                },
                {
                    // REFERENCE
                    "statement":
                    "MATCH" +
                    "(p:Property {checksum: $p.checksum})," +
                    "(r:Resource {url: $r.destination})\n" +
                    "MERGE (p)-[:References {" +
                    "name: $ref.name," +
                    "type: $ref.type," +
                    "isCollection: $ref.isCollection," +
                    "selectorType: $ref.selector.type," +
                    "startSelectorType: $ref.selector.startSelector.type," +
                    "startSelectorValue: $ref.selector.startSelector.value," +
                    "startSelectorOffset: $ref.selector.startSelector.offset," +
                    "endSelectorType: $ref.selector.endSelector.type," +
                    "endSelectorValue: $ref.selector.endSelector.value," +
                    "endSelectorOffset: $ref.selector.endSelector.offset" +
                    "}]->(r)",
                    "parameters": {
                        "p": { "checksum": "176b48fad17a1c4d1c278a1c47940948" },
                        "r": { "destination": "http://myhost/myfolder/myotherpage3#1.1" },
                        "ref": {"type": "MyReference3Item1.1Type", "name": "my_reference_3Item1", "isCollection": true, "selector": {"type": "RangeSelector","startSelector": { "type": "XPathSelector", "value": "//table[311]/tr[311]/td[311]","offset": 0 },"endSelector": { "type": "XPathSelector", "value": "//table[311]/tr[311]/td[3111]", "offset": 120 }}}
                    }
                },
                {
                    // REFERENCE
                    "statement":
                    "MATCH" +
                    "(p:Property {checksum: $p.checksum})," +
                    "(r:Resource {url: $r.destination})\n" +
                    "MERGE (p)-[:References {" +
                    "name: $ref.name," +
                    "type: $ref.type," +
                    "isCollection: $ref.isCollection," +
                    "selectorType: $ref.selector.type," +
                    "startSelectorType: $ref.selector.startSelector.type," +
                    "startSelectorValue: $ref.selector.startSelector.value," +
                    "startSelectorOffset: $ref.selector.startSelector.offset," +
                    "endSelectorType: $ref.selector.endSelector.type," +
                    "endSelectorValue: $ref.selector.endSelector.value," +
                    "endSelectorOffset: $ref.selector.endSelector.offset" +
                    "}]->(r)",
                    "parameters": {
                        "p": { "checksum": "176b48fad17a1c4d1c278a1c47940948" },
                        "r": { "destination": "http://myhost/myfolder/myotherpage3#1.2" },
                        "ref": {"type": "MyReference3Item1.2Type", "name": "my_reference_3Item1", "isCollection": true, "selector": {"type": "RangeSelector","startSelector": { "type": "XPathSelector", "value": "//table[312]/tr[312]/td[312]","offset": 0 },"endSelector": { "type": "XPathSelector", "value": "//table[312]/tr[312]/td[3122]", "offset": 120 }}}
                    }
                },
                {
                    // READS
                    "statement":
                    "MATCH" +
                    "(p:Property {checksum: $p.checksum})," +
                    "(c:Content {value: $c.value})\n" +
                    "MERGE (p)-[:Reads]->(c)",
                    "parameters": {
                        "p": { "checksum": "176b48fad17a1c4d1c278a1c47940948" },
                        "c": { "value": "MyProperty3Item1Content" }
                    }
                },
                {
                    // CONTENT
                    "statement": "MERGE (c:Content {value: $c.value})",
                    "parameters": { "c": { "value": "MyProperty3Item2Content" } }
                },
                {
                    // PROPERTY
                    "statement": "MERGE (p:Property {checksum: $p.checksum,type: $p.type})",
                    "parameters": { "p": { "checksum": "bac60ba1fcccf1636836b14be209e9ec", "type": "MyProperty3Type"} }
                },
                {
                    // READS
                    "statement":
                    "MATCH" +
                    "(p:Property {checksum: $p.checksum})," +
                    "(c:Content {value: $c.value})\n" +
                    "MERGE (p)-[:Reads]->(c)",
                    "parameters": {
                        "p": { "checksum": "bac60ba1fcccf1636836b14be209e9ec" },
                        "c": { "value": "MyProperty3Item2Content" }
                    }
                },
                {
                    // RESOURCE
                    "statement": "MERGE (r:Resource {url: $r.destination})",
                    "parameters": { "r": { "destination": "http://myhost/myfolder/myotherpage1" } }
                },
                {
                    // RESOURCE
                    "statement": "MERGE (r:Resource {url: $r.destination})",
                    "parameters": { "r": { "destination": "http://myhost/myfolder/myotherpage2" } }
                },
                {
                    // RESOURCE
                    "statement": "MERGE (r:Resource {url: $r.destination})",
                    "parameters": { "r": { "destination": "http://myhost/myfolder/myotherpage3" } }
                },
                {
                    // PAGE
                    "statement":
                        "MERGE (p:Resource {url: $p.url})\n" +
                        "SET p :Page\n" +
                        "SET p.type = $p.type, p.status = $p.status\n" +
                        "WITH p\n" +
                        "OPTIONAL MATCH (p)-[e]->()\n" +
                        "DELETE e",
                    "parameters": { "p": {"type": "MyPageType", "url": "http://myhost/myfolder/mypage", "status": "Classified"} }
                },
                {
                    // PAGE OWNS
                    "statement":
                    "MATCH" +
                    "(p:Resource {url: $p.url})," +
                    "(prop:Property {checksum: $prop.checksum})\n" +
                    "MERGE (p)-[o:Owns {" +
                        "name: $o.name," +
                        "isCollection: $o.isCollection," +
                        "selectorType: $o.selector.type," +
                        "startSelectorType: $o.selector.startSelector.type," +
                        "startSelectorValue: $o.selector.startSelector.value," +
                        "startSelectorOffset: $o.selector.startSelector.offset," +
                        "endSelectorType: $o.selector.endSelector.type," +
                        "endSelectorValue: $o.selector.endSelector.value," +
                        "endSelectorOffset: $o.selector.endSelector.offset" +
                    "}]->(prop)",
                    "parameters": {
                        "p": {"url": "http://myhost/myfolder/mypage"},
                        "prop": { "checksum": "c1b13f177c6446d1f0ecc37abbae005c" },
                        "o": {"name": "my_property_1", "isCollection": false, "selector": {"type": "RangeSelector","startSelector": { "type": "XPathSelector", "value": "//p[1]/span[1]/span[1]","offset": 0 },"endSelector": { "type": "XPathSelector", "value": "//p[1]/span[1]/span[11]", "offset": 120 }}}
                    }
                },
                {
                    // PAGE OWNS
                    "statement":
                    "MATCH" +
                    "(p:Resource {url: $p.url})," +
                    "(prop:Property {checksum: $prop.checksum})\n" +
                    "MERGE (p)-[o:Owns {" +
                    "name: $o.name," +
                    "isCollection: $o.isCollection," +
                    "selectorType: $o.selector.type," +
                    "startSelectorType: $o.selector.startSelector.type," +
                    "startSelectorValue: $o.selector.startSelector.value," +
                    "startSelectorOffset: $o.selector.startSelector.offset," +
                    "endSelectorType: $o.selector.endSelector.type," +
                    "endSelectorValue: $o.selector.endSelector.value," +
                    "endSelectorOffset: $o.selector.endSelector.offset" +
                    "}]->(prop)",
                    "parameters": {
                        "p": {"url": "http://myhost/myfolder/mypage"},
                        "prop": { "checksum": "2ae9c40b28a208305b6aae864cd17341" },
                        "o": {"name": "my_property_2", "isCollection": false, "selector": {"type": "RangeSelector","startSelector": { "type": "XPathSelector", "value": "//p[2]/span[2]/span[2]","offset": 0 },"endSelector": { "type": "XPathSelector", "value": "//p[2]/span[2]/span[22]", "offset": 120 }}}
                    }
                },
                {
                    // PAGE OWNS
                    "statement":
                    "MATCH" +
                    "(p:Resource {url: $p.url})," +
                    "(prop:Property {checksum: $prop.checksum})\n" +
                    "MERGE (p)-[o:Owns {" +
                    "name: $o.name," +
                    "isCollection: $o.isCollection," +
                    "selectorType: $o.selector.type," +
                    "startSelectorType: $o.selector.startSelector.type," +
                    "startSelectorValue: $o.selector.startSelector.value," +
                    "startSelectorOffset: $o.selector.startSelector.offset," +
                    "endSelectorType: $o.selector.endSelector.type," +
                    "endSelectorValue: $o.selector.endSelector.value," +
                    "endSelectorOffset: $o.selector.endSelector.offset" +
                    "}]->(prop)",
                    "parameters": {
                        "p": {"url": "http://myhost/myfolder/mypage"},
                        "prop": { "checksum": "176b48fad17a1c4d1c278a1c47940948" },
                        "o": {"name": "my_property_3", "isCollection": true, "selector": {"type": "RangeSelector","startSelector": { "type": "XPathSelector", "value": "//p[31]/span[31]/span[31]","offset": 0 },"endSelector": { "type": "XPathSelector", "value": "//p[31]/span[31]/span[311]", "offset": 120 }}}
                    }
                },
                {
                    // PAGE OWNS
                    "statement":
                    "MATCH" +
                    "(p:Resource {url: $p.url})," +
                    "(prop:Property {checksum: $prop.checksum})\n" +
                    "MERGE (p)-[o:Owns {" +
                    "name: $o.name," +
                    "isCollection: $o.isCollection," +
                    "selectorType: $o.selector.type," +
                    "startSelectorType: $o.selector.startSelector.type," +
                    "startSelectorValue: $o.selector.startSelector.value," +
                    "startSelectorOffset: $o.selector.startSelector.offset," +
                    "endSelectorType: $o.selector.endSelector.type," +
                    "endSelectorValue: $o.selector.endSelector.value," +
                    "endSelectorOffset: $o.selector.endSelector.offset" +
                    "}]->(prop)",
                    "parameters": {
                        "p": {"url": "http://myhost/myfolder/mypage"},
                        "prop": { "checksum": "bac60ba1fcccf1636836b14be209e9ec" },
                        "o": {"isCollection": true, "name": "my_property_3", "selector": {"type": "RangeSelector","startSelector": { "type": "XPathSelector", "value": "//p[32]/span[32]/span[32]","offset": 0 },"endSelector": { "type": "XPathSelector", "value": "//p[32]/span[32]/span[322]", "offset": 120 }}}
                    }
                },
                {
                    // PAGE REFERENCE
                    "statement":
                        "MATCH" +
                            "(p:Resource {url: $p.url})," +
                            "(r:Resource {url: $r.destination})\n" +
                        "MERGE (p)-[:References {" +
                            "name: $ref.name," +
                            "type: $ref.type," +
                            "isCollection: $ref.isCollection," +
                            "selectorType: $ref.selector.type," +
                            "startSelectorType: $ref.selector.startSelector.type," +
                            "startSelectorValue: $ref.selector.startSelector.value," +
                            "startSelectorOffset: $ref.selector.startSelector.offset," +
                            "endSelectorType: $ref.selector.endSelector.type," +
                            "endSelectorValue: $ref.selector.endSelector.value," +
                            "endSelectorOffset: $ref.selector.endSelector.offset" +
                        "}]->(r)",
                    "parameters": {
                        "p": {"url": "http://myhost/myfolder/mypage"},
                        "r": { "destination": "http://myhost/myfolder/myotherpage1" },
                        "ref": {"name":"my_reference_1", "type": "MyReference1Type", "isCollection": false, "selector": {"type": "RangeSelector","startSelector": { "type": "XPathSelector", "value": "//table[1]/tr[1]/td[1]","offset": 0 },"endSelector": { "type": "XPathSelector", "value": "//table[1]/tr[1]/td[11]", "offset": 120 }}}
                    }
                },
                {
                    // PAGE REFERENCE
                    "statement":
                    "MATCH" +
                    "(p:Resource {url: $p.url})," +
                    "(r:Resource {url: $r.destination})\n" +
                    "MERGE (p)-[:References {" +
                    "name: $ref.name," +
                    "type: $ref.type," +
                    "isCollection: $ref.isCollection," +
                    "selectorType: $ref.selector.type," +
                    "startSelectorType: $ref.selector.startSelector.type," +
                    "startSelectorValue: $ref.selector.startSelector.value," +
                    "startSelectorOffset: $ref.selector.startSelector.offset," +
                    "endSelectorType: $ref.selector.endSelector.type," +
                    "endSelectorValue: $ref.selector.endSelector.value," +
                    "endSelectorOffset: $ref.selector.endSelector.offset" +
                    "}]->(r)",
                    "parameters": {
                        "p": {"url": "http://myhost/myfolder/mypage"},
                        "r": { "destination": "http://myhost/myfolder/myotherpage2" },
                        "ref": {"name":"my_reference_2", "type": "MyReference2Type", "isCollection": false, "selector": {"type": "RangeSelector","startSelector": { "type": "XPathSelector", "value": "//table[2]/tr[2]/td[2]","offset": 0 },"endSelector": { "type": "XPathSelector", "value": "//table[2]/tr[2]/td[22]", "offset": 120 }}}
                    }
                },
                {
                    // PAGE REFERENCE
                    "statement":
                    "MATCH" +
                    "(p:Resource {url: $p.url})," +
                    "(r:Resource {url: $r.destination})\n" +
                    "MERGE (p)-[:References {" +
                    "name: $ref.name," +
                    "type: $ref.type," +
                    "isCollection: $ref.isCollection," +
                    "selectorType: $ref.selector.type," +
                    "startSelectorType: $ref.selector.startSelector.type," +
                    "startSelectorValue: $ref.selector.startSelector.value," +
                    "startSelectorOffset: $ref.selector.startSelector.offset," +
                    "endSelectorType: $ref.selector.endSelector.type," +
                    "endSelectorValue: $ref.selector.endSelector.value," +
                    "endSelectorOffset: $ref.selector.endSelector.offset" +
                    "}]->(r)",
                    "parameters": {
                        "p": {"url": "http://myhost/myfolder/mypage"},
                        "r": { "destination": "http://myhost/myfolder/myotherpage3" },
                        "ref": {"name":"my_reference_3", "type": "MyReference3Type", "isCollection": false, "selector": {"type": "RangeSelector","startSelector": { "type": "XPathSelector", "value": "//table[3]/tr[3]/td[3]","offset": 0 },"endSelector": { "type": "XPathSelector", "value": "//table[3]/tr[3]/td[33]", "offset": 120 }}}
                    }
                },
                {
                    // SITE & CLEAN UP
                    "statement":
                        "MERGE (s:Site {id: $s.id})\n" +
                        "WITH s\n" +

                        "MATCH (s:Site {id: $s.id}), (p:Resource {url: $p.url})\n" +
                        "MERGE (s)-[o:Owns]->(p)\n" +

                        "WITH s,o,p\n" +
                        "OPTIONAL MATCH (p)<-[fromOtherSite:Owns]-(:Site)\n" +
                        "WHERE fromOtherSite <> o\n" +
                        "DELETE fromOtherSite\n" +

                        "WITH p\n" +
                        "OPTIONAL MATCH (c:Property) WHERE NOT (:Page)-[:Owns*]->(c)\n" +
                        "DETACH DELETE c\n" +

                        "WITH p\n" +
                        "OPTIONAL MATCH (q:Content) WHERE NOT (:Property)-[:Reads]->(q)\n" +
                        "DELETE q",
                    "parameters": {
                        "s": {"id": "MySite"},
                        "p": {"url": "http://myhost/myfolder/mypage"}
                    }
                }
            ]
        });
    });
});
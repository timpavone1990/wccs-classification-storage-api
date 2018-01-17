"use strict";

module.exports ={
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
            "statement": "MERGE (c:Text {value: $c.value})",
            "parameters": { "c": { "value": "MyProperty1Content" } }
        },
        {
            // PROPERTY
            "statement": "MERGE (p:Content {checksum: $p.checksum,class: $p.class})",
            "parameters": { "p": { "checksum": "a293120b6ec1f760c05284a0bd357b26", "class": "MyProperty1Type"} }
        },
        {
            // REFERENCE
            "statement":
            "MATCH" +
            "(p:Content {checksum: $p.checksum})," +
            "(r:Resource {url: $r.destination})\n" +
            "MERGE (p)-[:References {" +
            "name: $ref.name," +
            "class: $ref.class," +
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
                "p": { "checksum": "a293120b6ec1f760c05284a0bd357b26" },
                "r": { "destination": "http://myhost/myfolder/myotherpage1.1" },
                "ref": {"class": "MyReference1.1Type", "name": "my_reference_1.1", "isCollection": false, "selector": {"type": "RangeSelector","startSelector": { "type": "XPathSelector", "value": "//table[11]/tr[11]/td[11]","offset": 0 },"endSelector": { "type": "XPathSelector", "value": "//table[11]/tr[11]/td[111]", "offset": 120 }}}
            }
        },
        {
            "statement":
            "MATCH" +
            "(p:Content {checksum: $p.checksum})," +
            "(r:Resource {url: $r.destination})\n" +
            "MERGE (p)-[:References {" +
            "name: $ref.name," +
            "class: $ref.class," +
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
                "p": { "checksum": "a293120b6ec1f760c05284a0bd357b26" },
                "r": { "destination": "http://myhost/myfolder/myotherpage1.2" },
                "ref": {"class": "MyReference1.2Type", "name": "my_reference_1.2", "isCollection": false, "selector": {"type": "RangeSelector","startSelector": { "type": "XPathSelector", "value": "//table[12]/tr[12]/td[12]","offset": 0 },"endSelector": { "type": "XPathSelector", "value": "//table[12]/tr[12]/td[122]", "offset": 120 }}}
            }
        },
        {
            // READS
            "statement":
            "MATCH" +
            "(p:Content {checksum: $p.checksum})," +
            "(c:Text {value: $c.value})\n" +
            "MERGE (p)-[:Reads]->(c)",
            "parameters": {
                "p": { "checksum": "a293120b6ec1f760c05284a0bd357b26" },
                "c": { "value": "MyProperty1Content" }
            }
        },
        {
            "statement": "MERGE (r:Resource {url: $r.destination})",
            "parameters": { "r": { "destination": "http://myhost/myfolder/myotherpage1.2" } }
        },
        {
            "statement": "MERGE (c:Text {value: $c.value})",
            "parameters": { "c": { "value": "MyProperty2.1Content" } }
        },
        {
            "statement": "MERGE (p:Content {checksum: $p.checksum,class: $p.class})",
            "parameters": { "p": { "checksum": "505d7bb88bd0361b71798299b7c15698", "class": "MyProperty2.1Type"} }
        },
        {
            "statement":
            "MATCH" +
            "(p:Content {checksum: $p.checksum})," +
            "(r:Resource {url: $r.destination})\n" +
            "MERGE (p)-[:References {" +
            "name: $ref.name," +
            "class: $ref.class," +
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
                "p": { "checksum": "505d7bb88bd0361b71798299b7c15698" },
                "r": { "destination": "http://myhost/myfolder/myotherpage1.2" },
                "ref": {"class": "MyReference1.2Type", "name": "my_reference_2.1.1", "isCollection": false, "selector": {"type": "RangeSelector","startSelector": { "type": "XPathSelector", "value": "//table[12]/tr[12]/td[12]","offset": 0 },"endSelector": { "type": "XPathSelector", "value": "//table[12]/tr[12]/td[122]", "offset": 120 }}}
            }
        },
        {
            "statement":
            "MATCH" +
            "(p:Content {checksum: $p.checksum})," +
            "(c:Text {value: $c.value})\n" +
            "MERGE (p)-[:Reads]->(c)",
            "parameters": {
                "p": { "checksum": "505d7bb88bd0361b71798299b7c15698" },
                "c": { "value": "MyProperty2.1Content" }
            }
        },
        {
            "statement": "MERGE (c:Text {value: $c.value})",
            "parameters": { "c": { "value": "MyProperty2.2Content" } }
        },
        {
            "statement": "MERGE (p:Content {checksum: $p.checksum,class: $p.class})",
            "parameters": { "p": { "checksum": "040b64e32443ef7fe6c1a347d36103f8", "class": "MyProperty2.2Type"} }
        },
        {
            // READS
            "statement":
            "MATCH" +
            "(p:Content {checksum: $p.checksum})," +
            "(c:Text {value: $c.value})\n" +
            "MERGE (p)-[:Reads]->(c)",
            "parameters": {
                "p": { "checksum": "040b64e32443ef7fe6c1a347d36103f8" },
                "c": { "value": "MyProperty2.2Content" }
            }
        },
        {
            // CONTENT
            "statement": "MERGE (c:Text {value: $c.value})",
            "parameters": { "c": { "value": "MyProperty3Item1Content" } }
        },
        {
            // PROPERTY
            "statement": "MERGE (p:Content {checksum: $p.checksum,class: $p.class})",
            "parameters": { "p": { "checksum": "5d7f2942a6a095c8125b104765994dfd", "class": "MyProperty3Type"} }
        },
        {
            // READS
            "statement":
            "MATCH" +
            "(p:Content {checksum: $p.checksum})," +
            "(c:Text {value: $c.value})\n" +
            "MERGE (p)-[:Reads]->(c)",
            "parameters": {
                "p": { "checksum": "5d7f2942a6a095c8125b104765994dfd" },
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
            "statement": "MERGE (c:Text {value: $c.value})",
            "parameters": { "c": { "value": "MyProperty2Content" } }
        },
        {
            // PROPERTY
            "statement": "MERGE (p:Content {checksum: $p.checksum,class: $p.class})",
            "parameters": { "p": { "checksum": "a014e680661e8a9fd37a66a03b1881ee", "class": "MyProperty2Type"} }
        },
        {
            // OWNS
            "statement":
            "MATCH" +
            "(p1:Content {checksum: $p1.checksum})," +
            "(p2:Content {checksum: $p2.checksum})\n" +
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
                "p1": { "checksum": "a014e680661e8a9fd37a66a03b1881ee" },
                "p2": { "checksum": "505d7bb88bd0361b71798299b7c15698" },
                "o": {"name": "my_property_2.1", "isCollection": false, "selector": {"type": "RangeSelector","startSelector": { "type": "XPathSelector", "value": "//p[21]/span[2]/span[21]","offset": 0 },"endSelector": { "type": "XPathSelector", "value": "//p[21]/span[2]/span[211]", "offset": 120 }}}
            }
        },
        {
            // OWNS
            "statement":
            "MATCH" +
            "(p1:Content {checksum: $p1.checksum})," +
            "(p2:Content {checksum: $p2.checksum})\n" +
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
                "p1": { "checksum": "a014e680661e8a9fd37a66a03b1881ee" },
                "p2": { "checksum": "040b64e32443ef7fe6c1a347d36103f8" },
                "o": {"name": "my_property_2.2", "isCollection": false, "selector": {"type": "RangeSelector","startSelector": { "type": "XPathSelector", "value": "//p[22]/span[2]/span[22]","offset": 0 },"endSelector": { "type": "XPathSelector", "value": "//p[22]/span[22]/span[222]", "offset": 120 }}}
            }
        },
        {
            // OWNS
            "statement":
            "MATCH" +
            "(p1:Content {checksum: $p1.checksum})," +
            "(p2:Content {checksum: $p2.checksum})\n" +
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
                "p1": { "checksum": "a014e680661e8a9fd37a66a03b1881ee" },
                "p2": { "checksum": "5d7f2942a6a095c8125b104765994dfd" },
                "o": {"name": "my_property_2.3", "isCollection": false, "selector": {"type": "RangeSelector","startSelector": { "type": "XPathSelector", "value": "//p[31]/span[31]/span[31]","offset": 0 },"endSelector": { "type": "XPathSelector", "value": "//p[31]/span[31]/span[311]", "offset": 120 }}}
            }
        },
        {
            // REFERENCE
            "statement":
            "MATCH" +
            "(p:Content {checksum: $p.checksum})," +
            "(r:Resource {url: $r.destination})\n" +
            "MERGE (p)-[:References {" +
            "name: $ref.name," +
            "class: $ref.class," +
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
                "p": { "checksum": "a014e680661e8a9fd37a66a03b1881ee" },
                "r": { "destination": "http://myhost/myfolder/myotherpage2.1" },
                "ref": {"class": "MyReference2.1Type", "name": "my_reference_2.1", "isCollection": false, "selector": {"type": "RangeSelector","startSelector": { "type": "XPathSelector", "value": "//table[21]/tr[21]/td[21]","offset": 0 },"endSelector": { "type": "XPathSelector", "value": "//table[21]/tr[21]/td[211]", "offset": 120 }}}
            }
        },
        {
            // REFERENCE
            "statement":
            "MATCH" +
            "(p:Content {checksum: $p.checksum})," +
            "(r:Resource {url: $r.destination})\n" +
            "MERGE (p)-[:References {" +
            "name: $ref.name," +
            "class: $ref.class," +
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
                "p": { "checksum": "a014e680661e8a9fd37a66a03b1881ee" },
                "r": { "destination": "http://myhost/myfolder/myotherpage2.2" },
                "ref": {"class": "MyReference2.2Type", "name": "my_reference_2.2", "isCollection": false, "selector": {"type": "RangeSelector","startSelector": { "type": "XPathSelector", "value": "//table[22]/tr[22]/td[22]","offset": 0 },"endSelector": { "type": "XPathSelector", "value": "//table[22]/tr[22]/td[222]", "offset": 120 }}}
            }
        },
        {
            // READS
            "statement":
            "MATCH" +
            "(p:Content {checksum: $p.checksum})," +
            "(c:Text {value: $c.value})\n" +
            "MERGE (p)-[:Reads]->(c)",
            "parameters": {
                "p": { "checksum": "a014e680661e8a9fd37a66a03b1881ee" },
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
            "statement": "MERGE (c:Text {value: $c.value})",
            "parameters": { "c": { "value": "MyProperty3Item1Content" } }
        },
        {
            // PROPERTY
            "statement": "MERGE (p:Content {checksum: $p.checksum,class: $p.class})",
            "parameters": { "p": { "checksum": "56708a58ef115b9c9a5e2b967b8940ce", "class": "MyProperty3Type"} }
        },
        {
            // REFERENCE
            "statement":
            "MATCH" +
            "(p:Content {checksum: $p.checksum})," +
            "(r:Resource {url: $r.destination})\n" +
            "MERGE (p)-[:References {" +
            "name: $ref.name," +
            "class: $ref.class," +
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
                "p": { "checksum": "56708a58ef115b9c9a5e2b967b8940ce" },
                "r": { "destination": "http://myhost/myfolder/myotherpage3#1.1" },
                "ref": {"class": "MyReference3Item1.1Type", "name": "my_reference_3Item1", "isCollection": true, "selector": {"type": "RangeSelector","startSelector": { "type": "XPathSelector", "value": "//table[311]/tr[311]/td[311]","offset": 0 },"endSelector": { "type": "XPathSelector", "value": "//table[311]/tr[311]/td[3111]", "offset": 120 }}}
            }
        },
        {
            // REFERENCE
            "statement":
            "MATCH" +
            "(p:Content {checksum: $p.checksum})," +
            "(r:Resource {url: $r.destination})\n" +
            "MERGE (p)-[:References {" +
            "name: $ref.name," +
            "class: $ref.class," +
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
                "p": { "checksum": "56708a58ef115b9c9a5e2b967b8940ce" },
                "r": { "destination": "http://myhost/myfolder/myotherpage3#1.2" },
                "ref": {"class": "MyReference3Item1.2Type", "name": "my_reference_3Item1", "isCollection": true, "selector": {"type": "RangeSelector","startSelector": { "type": "XPathSelector", "value": "//table[312]/tr[312]/td[312]","offset": 0 },"endSelector": { "type": "XPathSelector", "value": "//table[312]/tr[312]/td[3122]", "offset": 120 }}}
            }
        },
        {
            // READS
            "statement":
            "MATCH" +
            "(p:Content {checksum: $p.checksum})," +
            "(c:Text {value: $c.value})\n" +
            "MERGE (p)-[:Reads]->(c)",
            "parameters": {
                "p": { "checksum": "56708a58ef115b9c9a5e2b967b8940ce" },
                "c": { "value": "MyProperty3Item1Content" }
            }
        },
        {
            // CONTENT
            "statement": "MERGE (c:Text {value: $c.value})",
            "parameters": { "c": { "value": "MyProperty3Item2Content" } }
        },
        {
            // PROPERTY
            "statement": "MERGE (p:Content {checksum: $p.checksum,class: $p.class})",
            "parameters": { "p": { "checksum": "f1e479f94eb12c54960f618879ef830f", "class": "MyProperty3Type"} }
        },
        {
            // READS
            "statement":
            "MATCH" +
            "(p:Content {checksum: $p.checksum})," +
            "(c:Text {value: $c.value})\n" +
            "MERGE (p)-[:Reads]->(c)",
            "parameters": {
                "p": { "checksum": "f1e479f94eb12c54960f618879ef830f" },
                "c": { "value": "MyProperty3Item2Content" }
            }
        },
        {
            // CONTENT
            "parameters": {
                "c": {
                    "value": "MyProperty4.1Item1Content"
                }
            },
            "statement": "MERGE (c:Text {value: $c.value})"
        },
        {
            // PROPERTY
            "parameters": {
                "p": {
                    "checksum": "6cc7e1bda7f4c111d6338ec5022f0818",
                    "class": "MyProperty4.1Type"
                }
            },
            "statement": "MERGE (p:Content {checksum: $p.checksum,class: $p.class})"
        },
        {
            // READS
            "parameters": {
                "c": {
                    "value": "MyProperty4.1Item1Content"
                },
                "p": {
                    "checksum": "6cc7e1bda7f4c111d6338ec5022f0818"
                }
            },
            "statement": "MATCH(p:Content {checksum: $p.checksum}),(c:Text {value: $c.value})\nMERGE (p)-[:Reads]->(c)"
        },
        {
            // CONTENT
            "parameters": {
                "c": {
                    "value": "MyProperty4.1Item2Content"
                }
            },
            "statement": "MERGE (c:Text {value: $c.value})"
        },
        {
            // PROPERTY
            "parameters": {
                "p": {
                    "checksum": "897002fb87896978f25c72bb752fcc06",
                    "class": "MyProperty4.1Type"
                }
            },
            "statement": "MERGE (p:Content {checksum: $p.checksum,class: $p.class})"
        },
        {
            // READS
            "parameters": {
                "c": {
                    "value": "MyProperty4.1Item2Content"
                },
                "p": {
                    "checksum": "897002fb87896978f25c72bb752fcc06"
                }
            },
            "statement": "MATCH(p:Content {checksum: $p.checksum}),(c:Text {value: $c.value})\nMERGE (p)-[:Reads]->(c)"
        },
        {
            // CONTENT
            "parameters": {
                "c": {
                    "value": "MyProperty4Content"
                }
            },
            "statement": "MERGE (c:Text {value: $c.value})"
        },
        {
            // PROPERTY
            "parameters": {
                "p": {
                    "checksum": "f96e7409ee2f353dc5cf957a949213c4",
                    "class": "MyProperty4Type"
                }
            },
            "statement": "MERGE (p:Content {checksum: $p.checksum,class: $p.class})"
        },
        {
            // OWNS
            "parameters": {
                "o": {
                    "isCollection": true,
                    "name": "my_property_4.1",
                    "selector": {
                        "endSelector": {
                            "offset": 120,
                            "type": "XPathSelector",
                            "value": "//p[411]/span[411]/span[4111]"
                        },
                        "startSelector": {
                            "offset": 0,
                            "type": "XPathSelector",
                            "value": "//p[411]/span[411]/span[411]"
                        },
                        "type": "RangeSelector"
                    }
                },
                "p1": {
                    "checksum": "f96e7409ee2f353dc5cf957a949213c4"
                },
                "p2": {
                    "checksum": "6cc7e1bda7f4c111d6338ec5022f0818"
                }
            },
            "statement": "MATCH(p1:Content {checksum: $p1.checksum}),(p2:Content {checksum: $p2.checksum})\nMERGE (p1)-[o:Owns {name: $o.name,isCollection: $o.isCollection,selectorType: $o.selector.type,startSelectorType: $o.selector.startSelector.type,startSelectorValue: $o.selector.startSelector.value,startSelectorOffset: $o.selector.startSelector.offset,endSelectorType: $o.selector.endSelector.type,endSelectorValue: $o.selector.endSelector.value,endSelectorOffset: $o.selector.endSelector.offset}]->(p2)"
        },
        {
            // OWNS
            "parameters": {
                "o": {
                    "isCollection": true,
                    "name": "my_property_4.1",
                    "selector": {
                        "endSelector": {
                            "offset": 120,
                            "type": "XPathSelector",
                            "value": "//p[412]/span[412]/span[4122]"
                        },
                        "startSelector": {
                            "offset": 0,
                            "type": "XPathSelector",
                            "value": "//p[412]/span[412]/span[412]"
                        },
                        "type": "RangeSelector"
                    }
                },
                "p1": {
                    "checksum": "f96e7409ee2f353dc5cf957a949213c4"
                },
                "p2": {
                    "checksum": "897002fb87896978f25c72bb752fcc06"
                }
            },
            "statement": "MATCH(p1:Content {checksum: $p1.checksum}),(p2:Content {checksum: $p2.checksum})\nMERGE (p1)-[o:Owns {name: $o.name,isCollection: $o.isCollection,selectorType: $o.selector.type,startSelectorType: $o.selector.startSelector.type,startSelectorValue: $o.selector.startSelector.value,startSelectorOffset: $o.selector.startSelector.offset,endSelectorType: $o.selector.endSelector.type,endSelectorValue: $o.selector.endSelector.value,endSelectorOffset: $o.selector.endSelector.offset}]->(p2)"
        },
        {
            // READS
            "parameters": {
                "c": {
                    "value": "MyProperty4Content"
                },
                "p": {
                    "checksum": "f96e7409ee2f353dc5cf957a949213c4"
                }
            },
            "statement": "MATCH(p:Content {checksum: $p.checksum}),(c:Text {value: $c.value})\nMERGE (p)-[:Reads]->(c)"
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
            // RESOURCE
            "statement": "MERGE (r:Resource {url: $r.destination})",
            "parameters": { "r": { "destination": "http://myhost/myfolder/myotherpage4#1" } }
        },
        {
            // RESOURCE
            "statement": "MERGE (r:Resource {url: $r.destination})",
            "parameters": { "r": { "destination": "http://myhost/myfolder/myotherpage4#2" } }
        },
        {
            // PAGE
            "statement":
            "MERGE (p:Resource {url: $p.url})\n" +
            "SET p :Page\n" +
            "SET p.class = $p.class, p.status = $p.status\n" +
            "WITH p\n" +
            "OPTIONAL MATCH (p)-[e]->()\n" +
            "DELETE e",
            "parameters": { "p": {"class": "MyPageType", "url": "http://myhost/myfolder/mypage", "status": "Classified"} }
        },
        {
            // PAGE OWNS
            "statement":
            "MATCH" +
            "(p:Resource {url: $p.url})," +
            "(prop:Content {checksum: $prop.checksum})\n" +
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
                "prop": { "checksum": "a293120b6ec1f760c05284a0bd357b26" },
                "o": {"name": "my_property_1", "isCollection": false, "selector": {"type": "RangeSelector","startSelector": { "type": "XPathSelector", "value": "//p[1]/span[1]/span[1]","offset": 0 },"endSelector": { "type": "XPathSelector", "value": "//p[1]/span[1]/span[11]", "offset": 120 }}}
            }
        },
        {
            // PAGE OWNS
            "statement":
            "MATCH" +
            "(p:Resource {url: $p.url})," +
            "(prop:Content {checksum: $prop.checksum})\n" +
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
                "prop": { "checksum": "a014e680661e8a9fd37a66a03b1881ee" },
                "o": {"name": "my_property_2", "isCollection": false, "selector": {"type": "RangeSelector","startSelector": { "type": "XPathSelector", "value": "//p[2]/span[2]/span[2]","offset": 0 },"endSelector": { "type": "XPathSelector", "value": "//p[2]/span[2]/span[22]", "offset": 120 }}}
            }
        },
        {
            // PAGE OWNS
            "statement":
            "MATCH" +
            "(p:Resource {url: $p.url})," +
            "(prop:Content {checksum: $prop.checksum})\n" +
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
                "prop": { "checksum": "56708a58ef115b9c9a5e2b967b8940ce" },
                "o": {"name": "my_property_3", "isCollection": true, "selector": {"type": "RangeSelector","startSelector": { "type": "XPathSelector", "value": "//p[31]/span[31]/span[31]","offset": 0 },"endSelector": { "type": "XPathSelector", "value": "//p[31]/span[31]/span[311]", "offset": 120 }}}
            }
        },
        {
            // PAGE OWNS
            "statement":
            "MATCH" +
            "(p:Resource {url: $p.url})," +
            "(prop:Content {checksum: $prop.checksum})\n" +
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
                "prop": { "checksum": "f1e479f94eb12c54960f618879ef830f" },
                "o": {"isCollection": true, "name": "my_property_3", "selector": {"type": "RangeSelector","startSelector": { "type": "XPathSelector", "value": "//p[32]/span[32]/span[32]","offset": 0 },"endSelector": { "type": "XPathSelector", "value": "//p[32]/span[32]/span[322]", "offset": 120 }}}
            }
        },
        {
            // PAGE OWNS
            "parameters": {
                "o": {
                    "isCollection": false,
                    "name": "my_property_4",
                    "selector": {
                        "endSelector": {
                            "offset": 120,
                            "type": "XPathSelector",
                            "value": "//p[4]/span[4]/span[44]"
                        },
                        "startSelector": {
                            "offset": 0,
                            "type": "XPathSelector",
                            "value": "//p[4]/span[4]/span[4]"
                        },
                        "type": "RangeSelector"
                    }
                },
                "p": {
                    "url": "http://myhost/myfolder/mypage"
                },
                "prop": {
                    "checksum": "f96e7409ee2f353dc5cf957a949213c4"
                }
            },
            "statement": "MATCH(p:Resource {url: $p.url}),(prop:Content {checksum: $prop.checksum})\nMERGE (p)-[o:Owns {name: $o.name,isCollection: $o.isCollection,selectorType: $o.selector.type,startSelectorType: $o.selector.startSelector.type,startSelectorValue: $o.selector.startSelector.value,startSelectorOffset: $o.selector.startSelector.offset,endSelectorType: $o.selector.endSelector.type,endSelectorValue: $o.selector.endSelector.value,endSelectorOffset: $o.selector.endSelector.offset}]->(prop)"
        },
        {
            // PAGE REFERENCE
            "statement":
            "MATCH" +
            "(p:Resource {url: $p.url})," +
            "(r:Resource {url: $r.destination})\n" +
            "MERGE (p)-[:References {" +
            "name: $ref.name," +
            "class: $ref.class," +
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
                "ref": {"name":"my_reference_1", "class": "MyReference1Type", "isCollection": false, "selector": {"type": "RangeSelector","startSelector": { "type": "XPathSelector", "value": "//table[1]/tr[1]/td[1]","offset": 0 },"endSelector": { "type": "XPathSelector", "value": "//table[1]/tr[1]/td[11]", "offset": 120 }}}
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
            "class: $ref.class," +
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
                "ref": {"name":"my_reference_2", "class": "MyReference2Type", "isCollection": false, "selector": {"type": "RangeSelector","startSelector": { "type": "XPathSelector", "value": "//table[2]/tr[2]/td[2]","offset": 0 },"endSelector": { "type": "XPathSelector", "value": "//table[2]/tr[2]/td[22]", "offset": 120 }}}
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
            "class: $ref.class," +
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
                "ref": {"name":"my_reference_3", "class": "MyReference3Type", "isCollection": false, "selector": {"type": "RangeSelector","startSelector": { "type": "XPathSelector", "value": "//table[3]/tr[3]/td[3]","offset": 0 },"endSelector": { "type": "XPathSelector", "value": "//table[3]/tr[3]/td[33]", "offset": 120 }}}
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
            "class: $ref.class," +
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
                "p": { "url": "http://myhost/myfolder/mypage" },
                "r": { "destination": "http://myhost/myfolder/myotherpage4#1" },
                "ref": {
                    "isCollection": true,
                    "name": "my_reference_4",
                    "selector": {
                        "endSelector": {
                            "offset": 120,
                            "type": "XPathSelector",
                            "value": "//table[41]/tr[41]/td[411]"
                        },
                        "startSelector": {
                            "offset": 0,
                            "type": "XPathSelector",
                            "value": "//table[41]/tr[41]/td[41]"
                        },
                        "type": "RangeSelector"
                    },
                    "class": "MyReference4.1Type"
                }
            }
        },
        {
            "statement":
            "MATCH" +
            "(p:Resource {url: $p.url})," +
            "(r:Resource {url: $r.destination})\n" +
            "MERGE (p)-[:References {" +
            "name: $ref.name," +
            "class: $ref.class," +
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
                "p": { "url": "http://myhost/myfolder/mypage" },
                "r": { "destination": "http://myhost/myfolder/myotherpage4#2" },
                "ref": {
                    "isCollection": true,
                    "name": "my_reference_4",
                    "selector": {
                        "endSelector": {
                            "offset": 120,
                            "type": "XPathSelector",
                            "value": "//table[42]/tr[42]/td[422]"
                        },
                        "startSelector": {
                            "offset": 0,
                            "type": "XPathSelector",
                            "value": "//table[42]/tr[42]/td[42]"
                        },
                        "type": "RangeSelector"
                    },
                    "class": "MyReference4.2Type"
                }
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
            "OPTIONAL MATCH (c:Content) WHERE NOT (:Page)-[:Owns*]->(c)\n" +
            "DETACH DELETE c\n" +

            "WITH p\n" +
            "OPTIONAL MATCH (q:Text) WHERE NOT (:Content)-[:Reads]->(q)\n" +
            "DELETE q",
            "parameters": {
                "s": {"id": "MySite"},
                "p": {"url": "http://myhost/myfolder/mypage"}
            }
        }
    ]
};
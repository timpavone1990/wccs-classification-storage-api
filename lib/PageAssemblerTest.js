"use strict";

const expect = require("chai").expect;
const PageAssembler = require("./PageAssembler");
const expectedPage = require("../resources/ExamplePageObject");

const dbResult = {
    "results": [
        {
            "columns": [
                "page"
            ],
            "data": [
                {
                    "row": [
                        {
                            "type": "MyPageType",
                            "url": "http://myhost/myfolder/mypage",
                            "references": [
                                {
                                    "name": "my_reference_1",
                                    "isCollection": false,
                                    "type": "MyReference1Type",
                                    "selector": {
                                        "type": "RangeSelector",
                                        "startSelector": {
                                            "type": "XPathSelector",
                                            "value": "//table[1]/tr[1]/td[1]",
                                            "offset": 0
                                        },
                                        "endSelector": {
                                            "type": "XPathSelector",
                                            "value": "//table[1]/tr[1]/td[11]",
                                            "offset": 120
                                        }
                                    },
                                    "destination": "http://myhost/myfolder/myotherpage1"
                                },
                                {
                                    "name": "my_reference_3",
                                    "isCollection": false,
                                    "type": "MyReference3Type",
                                    "selector": {
                                        "type": "RangeSelector",
                                        "startSelector": {
                                            "type": "XPathSelector",
                                            "value": "//table[3]/tr[3]/td[3]",
                                            "offset": 0
                                        },
                                        "endSelector": {
                                            "type": "XPathSelector",
                                            "value": "//table[3]/tr[3]/td[33]",
                                            "offset": 120
                                        }
                                    },
                                    "destination": "http://myhost/myfolder/myotherpage3"
                                },
                                {
                                    "name": "my_reference_2",
                                    "isCollection": false,
                                    "type": "MyReference2Type",
                                    "selector": {
                                        "type": "RangeSelector",
                                        "startSelector": {
                                            "type": "XPathSelector",
                                            "value": "//table[2]/tr[2]/td[2]",
                                            "offset": 0
                                        },
                                        "endSelector": {
                                            "type": "XPathSelector",
                                            "value": "//table[2]/tr[2]/td[22]",
                                            "offset": 120
                                        }
                                    },
                                    "destination": "http://myhost/myfolder/myotherpage2"
                                }
                            ]
                        }
                    ],
                    "meta": [
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null
                    ]
                }
            ]
        },
        {
            "columns": [
                "{parent: property.checksum,references: collect({name: reference.name,type: reference.type,destination: resource.url,isCollection: reference.isCollection,selector: {type: reference.selectorType,startSelector: {type: reference.startSelectorType, value: reference.startSelectorValue, offset: reference.startSelectorOffset},endSelector: {type: reference.endSelectorType, value: reference.endSelectorValue, offset: reference.endSelectorOffset}}})}"
            ],
            "data": [
                {
                    "row": [
                        {
                            "parent": "ce70351cd47a89ee24f07c99d6ae68d1",
                            "references": [
                                {
                                    "name": "my_reference_3Item1",
                                    "isCollection": true,
                                    "type": "MyReference3Item1.1Type",
                                    "selector": {
                                        "type": "RangeSelector",
                                        "startSelector": {
                                            "type": "XPathSelector",
                                            "value": "//table[311]/tr[311]/td[311]",
                                            "offset": 0
                                        },
                                        "endSelector": {
                                            "type": "XPathSelector",
                                            "value": "//table[311]/tr[311]/td[3111]",
                                            "offset": 120
                                        }
                                    },
                                    "destination": "http://myhost/myfolder/myotherpage3#1.1"
                                },
                                {
                                    "name": "my_reference_3Item1",
                                    "isCollection": true,
                                    "type": "MyReference3Item1.2Type",
                                    "selector": {
                                        "type": "RangeSelector",
                                        "startSelector": {
                                            "type": "XPathSelector",
                                            "value": "//table[312]/tr[312]/td[312]",
                                            "offset": 0
                                        },
                                        "endSelector": {
                                            "type": "XPathSelector",
                                            "value": "//table[312]/tr[312]/td[3122]",
                                            "offset": 120
                                        }
                                    },
                                    "destination": "http://myhost/myfolder/myotherpage3#1.2"
                                }
                            ]
                        }
                    ],
                    "meta": [
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null
                    ]
                },
                {
                    "row": [
                        {
                            "parent": "a9cb08207d7ac85b0dcb2d7462c1cd60",
                            "references": [
                                {
                                    "name": "my_reference_1.2",
                                    "isCollection": false,
                                    "type": "MyReference1.2Type",
                                    "selector": {
                                        "type": "RangeSelector",
                                        "startSelector": {
                                            "type": "XPathSelector",
                                            "value": "//table[12]/tr[12]/td[12]",
                                            "offset": 0
                                        },
                                        "endSelector": {
                                            "type": "XPathSelector",
                                            "value": "//table[12]/tr[12]/td[122]",
                                            "offset": 120
                                        }
                                    },
                                    "destination": "http://myhost/myfolder/myotherpage1.2"
                                },
                                {
                                    "name": "my_reference_1.1",
                                    "isCollection": false,
                                    "type": "MyReference1.1Type",
                                    "selector": {
                                        "type": "RangeSelector",
                                        "startSelector": {
                                            "type": "XPathSelector",
                                            "value": "//table[11]/tr[11]/td[11]",
                                            "offset": 0
                                        },
                                        "endSelector": {
                                            "type": "XPathSelector",
                                            "value": "//table[11]/tr[11]/td[111]",
                                            "offset": 120
                                        }
                                    },
                                    "destination": "http://myhost/myfolder/myotherpage1.1"
                                }
                            ]
                        }
                    ],
                    "meta": [
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null
                    ]
                },
                {
                    "row": [
                        {
                            "parent": "87891f531425855f560e1b77932a4a74",
                            "references": [
                                {
                                    "name": "my_reference_2.1.1",
                                    "isCollection": false,
                                    "type": "MyReference1.2Type",
                                    "selector": {
                                        "type": "RangeSelector",
                                        "startSelector": {
                                            "type": "XPathSelector",
                                            "value": "//table[12]/tr[12]/td[12]",
                                            "offset": 0
                                        },
                                        "endSelector": {
                                            "type": "XPathSelector",
                                            "value": "//table[12]/tr[12]/td[122]",
                                            "offset": 120
                                        }
                                    },
                                    "destination": "http://myhost/myfolder/myotherpage1.2"
                                }
                            ]
                        }
                    ],
                    "meta": [
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null
                    ]
                },
                {
                    "row": [
                        {
                            "parent": "b9bd57b561cf33d8cb7804a52e50356b",
                            "references": [
                                {
                                    "name": "my_reference_2.1",
                                    "isCollection": false,
                                    "type": "MyReference2.1Type",
                                    "selector": {
                                        "type": "RangeSelector",
                                        "startSelector": {
                                            "type": "XPathSelector",
                                            "value": "//table[21]/tr[21]/td[21]",
                                            "offset": 0
                                        },
                                        "endSelector": {
                                            "type": "XPathSelector",
                                            "value": "//table[21]/tr[21]/td[211]",
                                            "offset": 120
                                        }
                                    },
                                    "destination": "http://myhost/myfolder/myotherpage2.1"
                                },
                                {
                                    "name": "my_reference_2.2",
                                    "isCollection": false,
                                    "type": "MyReference2.2Type",
                                    "selector": {
                                        "type": "RangeSelector",
                                        "startSelector": {
                                            "type": "XPathSelector",
                                            "value": "//table[22]/tr[22]/td[22]",
                                            "offset": 0
                                        },
                                        "endSelector": {
                                            "type": "XPathSelector",
                                            "value": "//table[22]/tr[22]/td[222]",
                                            "offset": 120
                                        }
                                    },
                                    "destination": "http://myhost/myfolder/myotherpage2.2"
                                }
                            ]
                        }
                    ],
                    "meta": [
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null
                    ]
                }
            ]
        },
        {
            "columns": [
                "collect({name: relationship.name, checksum: property.checksum})"
            ],
            "data": [
                {
                    "row": [
                        [
                            {
                                "name": "my_property_1",
                                "checksum": "a9cb08207d7ac85b0dcb2d7462c1cd60"
                            },
                            {
                                "name": "my_property_2",
                                "checksum": "b9bd57b561cf33d8cb7804a52e50356b"
                            },
                            {
                                "name": "my_property_3",
                                "checksum": "ce70351cd47a89ee24f07c99d6ae68d1"
                            },
                            {
                                "name": "my_property_3",
                                "checksum": "4773de9ea77a83760e2f99c85ba9105c"
                            }
                        ]
                    ],
                    "meta": [
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null
                    ]
                }
            ]
        },
        {
            "columns": [
                "collect({type: subProperty.type,checksum: subProperty.checksum,name: subPropertyRelationship.name,content: subPropertyContent.value,isCollection: subPropertyRelationship.isCollection,selector: {type: subPropertyRelationship.selectorType,startSelector: {type: subPropertyRelationship.startSelectorType, value: subPropertyRelationship.startSelectorValue, offset: subPropertyRelationship.startSelectorOffset},endSelector: {type: subPropertyRelationship.endSelectorType, value: subPropertyRelationship.endSelectorValue, offset: subPropertyRelationship.endSelectorOffset}}}) + pageProperties"
            ],
            "data": [
                {
                    "row": [
                        [
                            {
                                "name": "my_property_2.1",
                                "checksum": "87891f531425855f560e1b77932a4a74",
                                "content": "MyProperty2.1Content",
                                "isCollection": false,
                                "type": "MyProperty2.1Type",
                                "selector": {
                                    "type": "RangeSelector",
                                    "startSelector": {
                                        "type": "XPathSelector",
                                        "value": "//p[21]/span[2]/span[21]",
                                        "offset": 0
                                    },
                                    "endSelector": {
                                        "type": "XPathSelector",
                                        "value": "//p[21]/span[2]/span[211]",
                                        "offset": 120
                                    }
                                }
                            },
                            {
                                "name": "my_property_2.2",
                                "checksum": "dc337579485d6be6252349b4ffc06613",
                                "content": "MyProperty2.2Content",
                                "isCollection": false,
                                "type": "MyProperty2.2Type",
                                "selector": {
                                    "type": "RangeSelector",
                                    "startSelector": {
                                        "type": "XPathSelector",
                                        "value": "//p[22]/span[2]/span[22]",
                                        "offset": 0
                                    },
                                    "endSelector": {
                                        "type": "XPathSelector",
                                        "value": "//p[22]/span[22]/span[222]",
                                        "offset": 120
                                    }
                                }
                            },
                            {
                                "name": "my_property_2.3",
                                "checksum": "1cd32dd17f10978f173ab59b5b67cd91",
                                "content": "MyProperty3Item1Content",
                                "isCollection": false,
                                "type": "MyProperty3Type",
                                "selector": {
                                    "type": "RangeSelector",
                                    "startSelector": {
                                        "type": "XPathSelector",
                                        "value": "//p[31]/span[31]/span[31]",
                                        "offset": 0
                                    },
                                    "endSelector": {
                                        "type": "XPathSelector",
                                        "value": "//p[31]/span[31]/span[311]",
                                        "offset": 120
                                    }
                                }
                            },
                            {
                                "name": "my_property_1",
                                "checksum": "a9cb08207d7ac85b0dcb2d7462c1cd60",
                                "content": "MyProperty1Content",
                                "isCollection": false,
                                "type": "MyProperty1Type",
                                "selector": {
                                    "type": "RangeSelector",
                                    "startSelector": {
                                        "type": "XPathSelector",
                                        "value": "//p[1]/span[1]/span[1]",
                                        "offset": 0
                                    },
                                    "endSelector": {
                                        "type": "XPathSelector",
                                        "value": "//p[1]/span[1]/span[11]",
                                        "offset": 120
                                    }
                                }
                            },
                            {
                                "name": "my_property_2",
                                "checksum": "b9bd57b561cf33d8cb7804a52e50356b",
                                "content": "MyProperty2Content",
                                "isCollection": false,
                                "type": "MyProperty2Type",
                                "selector": {
                                    "type": "RangeSelector",
                                    "startSelector": {
                                        "type": "XPathSelector",
                                        "value": "//p[2]/span[2]/span[2]",
                                        "offset": 0
                                    },
                                    "endSelector": {
                                        "type": "XPathSelector",
                                        "value": "//p[2]/span[2]/span[22]",
                                        "offset": 120
                                    }
                                }
                            },
                            {
                                "name": "my_property_3",
                                "checksum": "ce70351cd47a89ee24f07c99d6ae68d1",
                                "content": "MyProperty3Item1Content",
                                "isCollection": true,
                                "type": "MyProperty3Type",
                                "selector": {
                                    "type": "RangeSelector",
                                    "startSelector": {
                                        "type": "XPathSelector",
                                        "value": "//p[31]/span[31]/span[31]",
                                        "offset": 0
                                    },
                                    "endSelector": {
                                        "type": "XPathSelector",
                                        "value": "//p[31]/span[31]/span[311]",
                                        "offset": 120
                                    }
                                }
                            },
                            {
                                "name": "my_property_3",
                                "checksum": "4773de9ea77a83760e2f99c85ba9105c",
                                "content": "MyProperty3Item2Content",
                                "isCollection": true,
                                "type": "MyProperty3Type",
                                "selector": {
                                    "type": "RangeSelector",
                                    "startSelector": {
                                        "type": "XPathSelector",
                                        "value": "//p[32]/span[32]/span[32]",
                                        "offset": 0
                                    },
                                    "endSelector": {
                                        "type": "XPathSelector",
                                        "value": "//p[32]/span[32]/span[322]",
                                        "offset": 120
                                    }
                                }
                            }
                        ]
                    ],
                    "meta": [
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null
                    ]
                }
            ]
        },
        {
            "columns": [
                "{property: property.checksum, subProperties: collect({name:subPropertyRelationship.name, checksum: subProperty.checksum})}"
            ],
            "data": [
                {
                    "row": [
                        {
                            "property": "b9bd57b561cf33d8cb7804a52e50356b",
                            "subProperties": [
                                {
                                    "name": "my_property_2.1",
                                    "checksum": "87891f531425855f560e1b77932a4a74"
                                },
                                {
                                    "name": "my_property_2.2",
                                    "checksum": "dc337579485d6be6252349b4ffc06613"
                                },
                                {
                                    "name": "my_property_2.3",
                                    "checksum": "1cd32dd17f10978f173ab59b5b67cd91"
                                }
                            ]
                        }
                    ],
                    "meta": [
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null
                    ]
                }
            ]
        }
    ],
    "errors": []
};

describe("#assembler", () => {
    it("should assemble correctly", () => {
        const pageAssembler = new PageAssembler();
        const page = pageAssembler.assemble(dbResult);
        expect(page).to.eql(expectedPage);
    });
});
"use strict";

module.exports = {
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
                    }
                },
                "my_reference_1.2": {
                    "type": "MyReference1.2Type",
                    "destination": "http://myhost/myfolder/myotherpage1.2",
                    "selector": {
                        "type": "RangeSelector",
                        "startSelector": { "type": "XPathSelector", "value": "//table[12]/tr[12]/td[12]","offset": 0 },
                        "endSelector": { "type": "XPathSelector", "value": "//table[12]/tr[12]/td[122]", "offset": 120 }
                    }
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
                    "content": "MyProperty2.1Content",
                    "references": {
                        "my_reference_2.1.1": {
                            "type": "MyReference1.2Type",
                            "destination": "http://myhost/myfolder/myotherpage1.2",
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
                            }
                        }
                    }
                },
                "my_property_2.2": {
                    "type": "MyProperty2.2Type",
                    "selector": {
                        "type": "RangeSelector",
                        "startSelector": { "type": "XPathSelector", "value": "//p[22]/span[2]/span[22]","offset": 0 },
                        "endSelector": { "type": "XPathSelector", "value": "//p[22]/span[22]/span[222]", "offset": 120 }
                    },
                    "content": "MyProperty2.2Content"
                },
                "my_property_2.3": {
                    "type": "MyProperty3Type",
                    "selector": {
                        "type": "RangeSelector",
                        "startSelector": { "type": "XPathSelector", "value": "//p[31]/span[31]/span[31]","offset": 0 },
                        "endSelector": { "type": "XPathSelector", "value": "//p[31]/span[31]/span[311]", "offset": 120 }
                    },
                    "content": "MyProperty3Item1Content"
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
                    }
                },
                "my_reference_2.2": {
                    "type": "MyReference2.2Type",
                    "destination": "http://myhost/myfolder/myotherpage2.2",
                    "selector": {
                        "type": "RangeSelector",
                        "startSelector": { "type": "XPathSelector", "value": "//table[22]/tr[22]/td[22]","offset": 0 },
                        "endSelector": { "type": "XPathSelector", "value": "//table[22]/tr[22]/td[222]", "offset": 120 }
                    }
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
                "content": "MyProperty3Item1Content",
                "references": {
                    "my_reference_3Item1": [
                        {
                            "type": "MyReference3Item1.1Type",
                            "destination": "http://myhost/myfolder/myotherpage3#1.1",
                            "selector": {
                                "type": "RangeSelector",
                                "startSelector": { "type": "XPathSelector", "value": "//table[311]/tr[311]/td[311]","offset": 0 },
                                "endSelector": { "type": "XPathSelector", "value": "//table[311]/tr[311]/td[3111]", "offset": 120 }
                            }
                        },
                        {
                            "type": "MyReference3Item1.2Type",
                            "destination": "http://myhost/myfolder/myotherpage3#1.2",
                            "selector": {
                                "type": "RangeSelector",
                                "startSelector": { "type": "XPathSelector", "value": "//table[312]/tr[312]/td[312]","offset": 0 },
                                "endSelector": { "type": "XPathSelector", "value": "//table[312]/tr[312]/td[3122]", "offset": 120 }
                            }
                        }
                    ]
                }
            },
            {
                "type": "MyProperty3Type",
                "selector": {
                    "type": "RangeSelector",
                    "startSelector": { "type": "XPathSelector", "value": "//p[32]/span[32]/span[32]","offset": 0 },
                    "endSelector": { "type": "XPathSelector", "value": "//p[32]/span[32]/span[322]", "offset": 120 }
                },
                "content": "MyProperty3Item2Content",
                "references": {}
            }
        ]
    },
    "references": {
        "my_reference_1": {
            "type": "MyReference1Type",
            "destination": "http://myhost/myfolder/myotherpage1",
            "isCollection": false,
            "selector": {
                "type": "RangeSelector",
                "startSelector": { "type": "XPathSelector", "value": "//table[1]/tr[1]/td[1]","offset": 0 },
                "endSelector": { "type": "XPathSelector", "value": "//table[1]/tr[1]/td[11]", "offset": 120 }
            }
        },
        "my_reference_2": {
            "type": "MyReference2Type",
            "destination": "http://myhost/myfolder/myotherpage2",
            "isCollection": false,
            "selector": {
                "type": "RangeSelector",
                "startSelector": { "type": "XPathSelector", "value": "//table[2]/tr[2]/td[2]","offset": 0 },
                "endSelector": { "type": "XPathSelector", "value": "//table[2]/tr[2]/td[22]", "offset": 120 }
            }
        },
        "my_reference_3": {
            "type": "MyReference3Type",
            "destination": "http://myhost/myfolder/myotherpage3",
            "isCollection": false,
            "selector": {
                "type": "RangeSelector",
                "startSelector": { "type": "XPathSelector", "value": "//table[3]/tr[3]/td[3]","offset": 0 },
                "endSelector": { "type": "XPathSelector", "value": "//table[3]/tr[3]/td[33]", "offset": 120 }
            }
        }
    }
};
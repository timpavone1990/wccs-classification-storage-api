"use strict";

const pageBatchJobFactory = require("./PageBatchJobFactory");
const expect = require("chai").expect;
const testPage = require("../resources/ExamplePageObject");

describe("#buildCreateStatement", () => {
    it("should compute the statements correctly", () => {
        const statements = pageBatchJobFactory.buildCreateStatement(testPage, {"id": "MySite"});
        const expectedStatements = require("../resources/ExamplePageDbWriteStatements");
        expect(statements).to.eql(expectedStatements);
    });
});

describe("#buildUpdateStatement", () => {
    it("should compute the statements correctly", () => {
        const statements = pageBatchJobFactory.buildUpdateStatement(testPage);
        const expectedStatements = require("../resources/ExamplePageDbUpdateStatements");
        expect(statements).to.eql(expectedStatements);
    });
});
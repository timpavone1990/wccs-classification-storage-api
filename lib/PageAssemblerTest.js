"use strict";

const expect = require("chai").expect;
const PageAssembler = require("./PageAssembler");

describe("#assembler", () => {
    it("should assemble correctly", () => {
        const pageAssembler = new PageAssembler();
        const page = pageAssembler.assemble(require("../resources/ExamplePageDbResult"));
        expect(page).to.eql(require("../resources/ExamplePageObject"));
    });

    it("should assemble real pages correctly", () => {
        const pageAssembler = new PageAssembler();
        const page = pageAssembler.assemble(require("../resources/BaBwServiceDbResponse"));
        expect(page).to.eql(require("../resources/BaBwPageObject"));
    });

    it("two contents share the same child content with equal names", () => {
        const pageAssembler = new PageAssembler();
        const page = pageAssembler.assemble(require("../resources/TwoContentsShareChildContentDbResponse"));
        expect(page).to.eql(require("../resources/TwoContentsShareChildContent"));
    });

    it("two contents share the same child content with unequal names", () => {
        const pageAssembler = new PageAssembler();
        const page =
            pageAssembler.assemble(require("../resources/TwoContentsShareChildContentUnequalNamesDbResult"));
        expect(page).to.eql(require("../resources/TwoContentsShareChildContentUnequalNames"));
    });

    it("two contents reference the same resource with equal names", () => {
        const pageAssembler = new PageAssembler();
        const page = pageAssembler.assemble(require("../resources/TwoContentsShareResourceDbResult"));
        expect(page).to.eql(require("../resources/TwoContentsShareResource"));
    });

    it("two contents reference the same resource with unequal names", () => {
        const pageAssembler = new PageAssembler();
        const page = pageAssembler.assemble(require("../resources/TwoContentsShareResourceUnequalNamesDbResult"));
        expect(page).to.eql(require("../resources/TwoContentsShareResourceUnequalNames"));
    });

    it("content references child content twice", () => {
        const pageAssembler = new PageAssembler();
        const page = pageAssembler.assemble(require("../resources/DuplicateChildContentDbResult"));
        expect(page).to.eql(require("../resources/DuplicateChildContent"));
    });

    it("content references resource twice", () => {
        const pageAssembler = new PageAssembler();
        const page = pageAssembler.assemble(require("../resources/ContentReferencesResourceTwiceDbResult"));
        expect(page).to.eql(require("../resources/ContentReferencesResourceTwice"));
    });

    it("page references content twice", () => {
        const pageAssembler = new PageAssembler();
        const page = pageAssembler.assemble(require("../resources/DuplicatePageContentsDbResult"));
        expect(page).to.eql(require("../resources/DuplicatePageContents"));
    });

    it("page references resource twice", () => {
        const pageAssembler = new PageAssembler();
        const page = pageAssembler.assemble(require("../resources/PageReferencesResourceTwiceDbResult"));
        expect(page).to.eql(require("../resources/PageReferencesResourceTwice"));
    });
});

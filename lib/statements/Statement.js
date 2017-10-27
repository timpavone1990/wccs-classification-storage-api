"use strict";

module.exports = class Statement {
    constructor(statementText, parameters) {
        this.statement = statementText;
        this.parameters = parameters;
    }
};
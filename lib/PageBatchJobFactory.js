"use strict";

const Neo4jJob = require("./Neo4jJob");

module.exports.createPageBatchJob = function(page) {
    let nextJobIndex = 0;

    function createPropertyJob(property, jobs) {
        let propertyJobIndex = nextJobIndex;

        jobs.push(new Neo4jJob(nextJobIndex++, "POST", "/node", { "type": property.type }));
        jobs.push(new Neo4jJob(nextJobIndex++, "POST", "{" + propertyJobIndex + "}/labels", "Content"));

        if (property.properties) {
            createPropertiesJobs(property, jobs, propertyJobIndex);
        }
    }

    function createPropertiesJobs(object, jobs, objectJobIndex) {
        Object.keys(object.properties).forEach((name) => {
            let property = object.properties[name];

            if (Array.isArray(property)) {
                property.forEach((propertyItem) => {
                    let propertyJobIndex = nextJobIndex;
                    createPropertyJob(propertyItem, jobs);
                    jobs.push(new Neo4jJob(nextJobIndex++, "POST", "{" + objectJobIndex + "}/relationships", { "to": "{" + propertyJobIndex + "}", "type": name }));
                });
            } else {
                let propertyJobIndex = nextJobIndex;
                createPropertyJob(property, jobs);
                jobs.push(new Neo4jJob(nextJobIndex++, "POST", "{" + objectJobIndex + "}/relationships", { "to": "{" + propertyJobIndex + "}", "type": name }));
            }
        });
    }

    let jobs = [
        new Neo4jJob(nextJobIndex++, "POST", "/node", { "url": page.url, "type": page.type }),
        new Neo4jJob(nextJobIndex++, "POST", "{0}/labels", "Page")
    ];

    createPropertiesJobs(page, jobs, 0);
    return jobs;
};



module.exports.createPageStorageJob = (page) => {
    let statement = "";
    let parameters = {};
    let counter = 0;

    function store(properties) {
        Object.keys(properties).forEach(propertyName => {
            const property = properties[propertyName];
            let nodeAlias = "n" + counter++;

            if (Array.isArray(property)) {

            } else {
                statement += `MERGE (${nodeAlias}:Content { type: ${nodeAlias}.type})` + "\n";
                parameters[nodeAlias] = {
                    "type": property.type
                }
            }

            // TODO: Nodes must be created bottom up!!!
            if (property.properties) {
                const firstChildPropertyAliasId = counter;
                const childPropertiesCount = Object.keys[property.properties].length;
                store(property.properties);

                for (let i = 0; i < childPropertiesCount; i++) {
                    const childPropertyAlias = "n" + (firstChildPropertyAliasId + i);
                    statement += `MERGE (${nodeAlias})-[:Property]>(${childPropertyAlias})` + "\n";
                }
            }
        });
    }

    store(page.properties);
    return { "statements": [{
        "statement": statement,
        "parameters": parameters
    }] };
};
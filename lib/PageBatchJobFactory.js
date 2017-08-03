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

    function store(properties, propertyAlias) {
        const property = properties;

        if (Array.isArray(property)) {

        } else {
            if (property.properties) {
                let propertyNames = Object.keys(property.properties);
                propertyNames.forEach((propertyName, index) => {
                    store(property.properties[propertyName], `${propertyAlias}_${index}`);
                });

                statement += `MERGE (${propertyAlias}:Content {type: $${propertyAlias}.type})`;
                parameters[propertyAlias] = {
                    "type": property.type
                };

                for (let i = 0; i < propertyNames.length; i++) {
                    const childPropertyAlias = `${propertyAlias}_${i}`;
                    statement += `-[:Property]->(${childPropertyAlias})-[:Parent]->(${propertyAlias})`;
                }

                statement += "\n";
            } else {
                statement += `MERGE (${propertyAlias}:Content {type: $${propertyAlias}.type})` + "\n";
                parameters[propertyAlias] = {
                    "type": property.type
                };
            }
        }
    }

    const pageAlias = "p";
    parameters[pageAlias] = {
        "type": page.type,
        "url": page.url
    };

    if (page.properties) {
        const propertyNames = Object.keys(page.properties);
        propertyNames.forEach((propertyName, index) => {
            const property = page.properties[propertyName];
            store(property, `${pageAlias}_${index}`);
        });

        statement += `MERGE (${pageAlias}:Page {url: $${pageAlias}.url})` + "\n";
        statement += `MERGE (${pageAlias})`;

        for (let i = 0; i < propertyNames.length; i++) {
            if (!Array.isArray(page.properties[propertyNames[i]])) {
                const childPropertyAlias = `${pageAlias}_${i}`;
                statement += `-[:Property]->(${childPropertyAlias})-[:Parent]->(${pageAlias})`;
            }
        }

        statement += "\n";
    } else {
        statement += `MERGE (${pageAlias}:Page {url: $${pageAlias}.url})` + "\n";
    }

    statement += `SET ${pageAlias}.type = $${pageAlias}.type` + "\n";

    return { "statements": [{
        "statement": statement,
        "parameters": parameters
    }] };
};
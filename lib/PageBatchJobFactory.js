"use strict";

class PageStatementBuilder {
    constructor() {
        this.parameters = {};
    }

    static build(page) {
        const pageAlias = "p";
        const builder = new PageStatementBuilder();
        builder.addParameter(pageAlias, {"type": page.type, "url": page.url});

        const statement =
            `MERGE (${pageAlias}:Page {url: $${pageAlias}.url})\n` +
            `SET ${pageAlias}.type = $${pageAlias}.type` + "\n" +
            `WITH ${pageAlias}\n` +
            `OPTIONAL MATCH (${pageAlias})-[e]->()\n` +
            `DELETE e\n` +
            builder.referencesRelationships(page, pageAlias) + "\n" +
            builder.propertiesStatements(page, pageAlias) + "\n" +
            builder.pagePropertiesRelationShips(page, pageAlias) + "\n" +
            `WITH ${pageAlias}\n` +
            "OPTIONAL MATCH (c:Content) WHERE NOT (:Page)-[:Property*]->(c)\n" +
            "DETACH DELETE c\n" +
            `WITH ${pageAlias}\n` +
            "OPTIONAL MATCH (n:Page) WHERE NOT (()-[:Reference]->(n) OR (n)-[:Property]-())\n" +
            "DELETE n\n";

        return {
            "statements": [{
                "statement": statement,
                "parameters": builder.parameters
            }]};
    }

    addParameter(name, value) {
        this.parameters[name] = value;
    }

    propertiesStatements(parent, parentAlias) {
        const propertyNames = parent.properties && Object.keys(parent.properties) || [];
        const statements = propertyNames.map((propertyName, index) => {
            return this.propertyStatements(parent.properties[propertyName], propertyName, `${parentAlias}_${index}`);
        });
        return statements.join("\n");
    }

    propertyStatements(property, name, propertyAlias) {
        let statements = [];
        if (Array.isArray(property)) {
            statements = property.map((property, index) => {
                return this.propertyStatements(property, name, `${propertyAlias}_${index}`);
            });
        } else {
            const statementParameters = { "type": property.type, "name": name };
            if (property.text) {
                statementParameters.text = property.text;
            }
            this.addParameter(propertyAlias, statementParameters);

            if (property.properties) {
                statements.push(this.propertiesStatements(property, propertyAlias));
            }

            let propertyStatement = `MERGE (${propertyAlias}:Content {${this.contentNodeProperties(property, propertyAlias)}})`;
            if (property.properties) {
                propertyStatement += this.subPropertiesRelationshipsStatement(property, propertyAlias);
            }
            statements.push(propertyStatement);

            // TODO Does not work, if type of reference changes.
            // TODO What happens, if e.g. selector of property changes?
            // TODO Save site
            if (property.references) {
                statements.push(this.referencesRelationships(property, propertyAlias));
            }
        }
        return statements.join("\n");
    }

    contentNodeProperties(object, nodeAlias) {
        const nodeProperties = [];
        nodeProperties.push(`type: $${nodeAlias}.type`);
        if (object.text) {
            nodeProperties.push(`text: $${nodeAlias}.text`);
        }
        return nodeProperties.join(",");
    }

    subPropertiesRelationshipsStatement(parentProperty, parentPropertyAlias) {
        const propertyNames = parentProperty.properties && Object.keys(parentProperty.properties) || [];
        return propertyNames.map((propertyName, index) => {
            const childPropertyAlias = `${parentPropertyAlias}_${index}`;
            return `-[:Property {name: $${childPropertyAlias}.name}]->(${childPropertyAlias})-[:Parent]->(${parentPropertyAlias})`;
        }).join("");
    }

    pagePropertiesRelationShips(page, pageAlias) {
        let statements = [];
        const propertyNames = page.properties && Object.keys(page.properties) || [];
        propertyNames.forEach((propertyName, pagePropertyIndex) => {
            const property = page.properties[propertyName];
            if (Array.isArray(property)) {
                property.forEach((item, propertyItemIndex) => {
                    statements.push(this.pagePropertyRelationship(pageAlias, `${pageAlias}_${pagePropertyIndex}_${propertyItemIndex}`));
                });
            } else {
                statements.push(this.pagePropertyRelationship(pageAlias, `${pageAlias}_${pagePropertyIndex}`));
            }
        });
        return statements.join("\n");
    }

    pagePropertyRelationship(pageAlias, childPropertyAlias) {
        return `MERGE (${pageAlias})-[:Property {name: $${childPropertyAlias}.name}]->(${childPropertyAlias})`;
    }

    referencesRelationships(object, objectAlias) {
        const statements = [];
        const referenceNames = object.references && Object.keys(object.references) || [];
        referenceNames.forEach((referenceName, index) => {
            const referenceAlias = `${objectAlias}_ref${index}`;
            const referencedPageAlias = `${referenceAlias}_p`;
            statements.push(`MERGE (${referencedPageAlias}:Page {url: $${referenceAlias}.destination})`);

            const reference = object.references[referenceName];
            statements.push(`MERGE (${objectAlias})-[:Reference {name: $${referenceAlias}.name, type: $${referenceAlias}.type}]->(${referencedPageAlias})`);
            this.addParameter(referenceAlias, {
                "name": referenceName,
                "type": reference.type,
                "destination": reference.destination
            });
        });
        return statements.join("\n");
    }
}

module.exports.buildPageStorageStatement = (page) => {
    return PageStatementBuilder.build(page);
};
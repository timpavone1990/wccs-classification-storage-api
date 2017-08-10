"use strict";

class PageStatementBuilder {
    constructor() {
        this.parameters = {};
    }

    static build(page, site) {
        const pageAlias = "p";
        const builder = new PageStatementBuilder();
        builder.addParameter("s", site);
        builder.addParameter(pageAlias, {"type": page.type, "url": page.url});

        const statement =
            `MERGE (${pageAlias}:Page {url: $${pageAlias}.url})\n` +
            `SET ${pageAlias}.type = $${pageAlias}.type` + "\n" +
            `MERGE (s:Site {name: $s.name})\n` +
            `MERGE (s)-[:Owns]->(p)\n` +
            `WITH ${pageAlias}\n` +
            `OPTIONAL MATCH (${pageAlias})-[e]->()\n` +
            `DELETE e\n` +
            builder.referencedPagesStatements(page, pageAlias) + "\n" +
            builder.pageReferencesRelationships(page, pageAlias) + "\n" +
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

            let propertyStatement = `MERGE (${propertyAlias}:Content {${this.contentNodeProperties(property, propertyAlias)}})`;

            if (property.properties) {
                statements.push(this.propertiesStatements(property, propertyAlias));
                propertyStatement += this.subPropertiesRelationshipsStatement(property, propertyAlias);
            }

            if (property.references) {
                statements.push(this.referencedPagesStatements(property, propertyAlias));
                propertyStatement += this.referencesRelationshipsStatement(property, propertyAlias);
            }

            statements.push(propertyStatement);

            // TODO What happens, if e.g. selector of property changes?
            // TODO Save site
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
            return `-[${this.propertyRelationShip(childPropertyAlias)}]->(${childPropertyAlias})-[:Parent]->(${parentPropertyAlias})`;
        }).join("");
    }

    propertyRelationShip(propertyAlias) {
        return `:Property {name: $${propertyAlias}.name}`;
    }

    referencesRelationshipsStatement(property, propertyAlias) {
        const referenceNames = property.references && Object.keys(property.references) || [];
        return referenceNames.map((referenceName, index) => {
            const referenceAlias = `${propertyAlias}_ref${index}`;
            const referencedPageAlias = `${referenceAlias}_p`;
            return `-[${this.referenceRelationShip(referenceAlias)}]->(${referencedPageAlias})-[:ReferencedBy]->(${propertyAlias})`;
        }).join("");
    }

    referenceRelationShip(referenceAlias) {
        return `:Reference {name: $${referenceAlias}.name, type: $${referenceAlias}.type}`;
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
        return `MERGE (${pageAlias})-[${this.propertyRelationShip(childPropertyAlias)}]->(${childPropertyAlias})`;
    }

    referencedPagesStatements(object, objectAlias) {
        const statements = [];
        const referenceNames = object.references && Object.keys(object.references) || [];
        referenceNames.forEach((referenceName, index) => {
            const referenceAlias = `${objectAlias}_ref${index}`;
            const referencedPageAlias = `${referenceAlias}_p`;
            const reference = object.references[referenceName];
            statements.push(`MERGE (${referencedPageAlias}:Page {url: $${referenceAlias}.destination})`);
            this.addParameter(referenceAlias, {
                "name": referenceName,
                "type": reference.type,
                "destination": reference.destination
            });
        });
        return statements.join("\n");
    }

    pageReferencesRelationships(object, objectAlias) {
        const statements = [];
        const referenceNames = object.references && Object.keys(object.references) || [];
        referenceNames.forEach((referenceName, index) => {
            const referenceAlias = `${objectAlias}_ref${index}`;
            const referencedPageAlias = `${referenceAlias}_p`;
            statements.push(`MERGE (${objectAlias})-[${this.referenceRelationShip(referenceAlias)}]->(${referencedPageAlias})`);
        });
        return statements.join("\n");
    }
}

module.exports.buildPageStorageStatement = (page, site) => {
    return PageStatementBuilder.build(page, site);
};
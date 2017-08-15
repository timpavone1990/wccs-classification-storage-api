"use strict";

class PageStatementBuilder {
    constructor() {
        this.parameters = {};
        this.nodeAliases = new Set();
    }

    static build(page, site) {
        const pageAlias = "p";
        const builder = new PageStatementBuilder();
        builder.addParameter("s", site);
        builder.addParameter(pageAlias, {"type": page.type, "url": page.url});

        builder.nodeAliases.add("s");
        builder.nodeAliases.add(pageAlias);

        let statement =
            `MERGE (${pageAlias}:Page {url: $${pageAlias}.url})\n` +
            `SET ${pageAlias}.type = $${pageAlias}.type` + "\n" +
            `MERGE (s:Site {name: $s.name})\n` +
            `MERGE (s)-[:Owns]->(p)\n` +
            `WITH s,${pageAlias}\n` +
            `OPTIONAL MATCH (${pageAlias})-[e]->()\n` +
            `DELETE e\n` +
            builder.referencedPages(page, pageAlias) + "\n" +
            builder.relationshipsFromPageToReferencedPages(page, pageAlias) + "\n" +
            builder.properties(page, pageAlias) + "\n" +
            builder.relationshipsToProperties(page, pageAlias) + "\n";

        const commaSeparatedNodeAliases = Array.from(builder.nodeAliases).join(",");

        statement +=
            `WITH ${commaSeparatedNodeAliases}\n` +
            `OPTIONAL MATCH (q:Content)-[toDeletedProperty:Property]->(deletedProperty:Content)-[fromDeletedProperty:Parent]->(q)\n` +
            `WHERE q IN [${commaSeparatedNodeAliases}] AND NOT deletedProperty IN [${commaSeparatedNodeAliases}]\n` +
            `DELETE toDeletedProperty, fromDeletedProperty\n` +

            `WITH ${commaSeparatedNodeAliases}\n` +
            `OPTIONAL MATCH (x:Content)-[deletedReference:Reference]->(y:Page)-[deletedReferencedBy:ReferencedBy]->(x)\n` +
            `WHERE x IN [${Array.from(builder.nodeAliases).join(",")}] AND NOT y IN [${commaSeparatedNodeAliases}]\n` +
            `DELETE deletedReference, deletedReferencedBy\n` +

            // TODO Deleting orphan nodes doesn't need to be done in this transaction. Create a repeating schedule.
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

    properties(parent, parentAlias) {
        const propertyNames = parent.properties && Object.keys(parent.properties) || [];
        const statements = propertyNames.map((propertyName, index) => {
            return this.propertyStatements(parent.properties[propertyName], propertyName, `${parentAlias}_prop${index}`);
        });
        return statements.join("\n");
    }

    propertyStatements(property, name, propertyAlias) {
        let statements = [];
        if (Array.isArray(property)) {
            statements = property.map((property, index) => {
                return this.propertyStatements(property, name, `${propertyAlias}_item${index}`);
            });
        } else {
            const statementParameters = { "type": property.type, "name": name, "selector": property.selector };
            if (property.content) {
                statementParameters.content = property.content;
            }
            this.addParameter(propertyAlias, statementParameters);

            let propertyStatement = `MERGE (${propertyAlias}:Content {${this.contentNodeProperties(property, propertyAlias)}})`;

            if (property.properties) {
                statements.push(this.properties(property, propertyAlias));
                propertyStatement += this.subPropertiesRelationshipsStatement(property, propertyAlias);
            }

            if (property.references) {
                statements.push(this.referencedPages(property, propertyAlias));
                propertyStatement += this.referencesRelationshipsStatement(property, propertyAlias);
            }

            statements.push(propertyStatement);
            this.nodeAliases.add(propertyAlias);
        }
        return statements.join("\n");
    }

    contentNodeProperties(object, nodeAlias) {
        const nodeProperties = [];
        nodeProperties.push(`type: $${nodeAlias}.type`);
        if (object.content) {
            nodeProperties.push(`content: $${nodeAlias}.content`);
        }
        return nodeProperties.join(",");
    }

    subPropertiesRelationshipsStatement(parentProperty, parentPropertyAlias) {
        const propertyNames = parentProperty.properties && Object.keys(parentProperty.properties) || [];
        return propertyNames.map((propertyName, index) => {
            const childPropertyAlias = `${parentPropertyAlias}_prop${index}`;
            return `-[${this.propertyRelationShip(childPropertyAlias)}]->(${childPropertyAlias})-[:Parent]->(${parentPropertyAlias})`;
        }).join("");
    }

    propertyRelationShip(propertyAlias) {
        return `:Property {name: $${propertyAlias}.name,${this.selectorProperties(propertyAlias)}}`;
    }

    selectorProperties(objectAlias) {
        return `selectorType: $${objectAlias}.selector.type,` +
            `startSelectorType: $${objectAlias}.selector.startSelector.type,` +
            `startSelectorValue: $${objectAlias}.selector.startSelector.value,` +
            `startSelectorOffset: $${objectAlias}.selector.startSelector.offset,` +
            `endSelectorType: $${objectAlias}.selector.endSelector.type,` +
            `endSelectorValue: $${objectAlias}.selector.endSelector.value,` +
            `endSelectorOffset: $${objectAlias}.selector.endSelector.offset`;
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
        return `:Reference {name: $${referenceAlias}.name,type: $${referenceAlias}.type,content: $${referenceAlias}.content,${this.selectorProperties(referenceAlias)}}`;
    }

    relationshipsToProperties(page, pageAlias) {
        let statements = [];
        const propertyNames = page.properties && Object.keys(page.properties) || [];
        propertyNames.forEach((propertyName, pagePropertyIndex) => {
            const property = page.properties[propertyName];
            if (Array.isArray(property)) {
                property.forEach((item, propertyItemIndex) => {
                    statements.push(this.pagePropertyRelationship(pageAlias, `${pageAlias}_prop${pagePropertyIndex}_item${propertyItemIndex}`));
                });
            } else {
                statements.push(this.pagePropertyRelationship(pageAlias, `${pageAlias}_prop${pagePropertyIndex}`));
            }
        });
        return statements.join("\n");
    }

    pagePropertyRelationship(pageAlias, childPropertyAlias) {
        return `MERGE (${pageAlias})-[${this.propertyRelationShip(childPropertyAlias)}]->(${childPropertyAlias})`;
    }

    // TODO: WCTS-2 References can also be made to images, pdfs, videos etc.
    referencedPages(object, objectAlias) {
        const statements = [];
        const referenceNames = object.references && Object.keys(object.references) || [];
        referenceNames.forEach((referenceName, index) => {
            const referenceAlias = `${objectAlias}_ref${index}`;
            const referencedPageAlias = `${referenceAlias}_p`;
            const reference = object.references[referenceName];
            statements.push(`MERGE (${referencedPageAlias}:Page {url: $${referenceAlias}.destination})`);
            this.nodeAliases.add(referencedPageAlias);

            const parameter = {
                "name": referenceName,
                "type": reference.type,
                "destination": reference.destination,
                "selector": reference.selector
            };

            if (reference.content) {
                parameter.content = reference.content;
            }

            // TODO Move this to referenceRelationShip?
            this.addParameter(referenceAlias, parameter);
        });
        return statements.join("\n");
    }

    relationshipsFromPageToReferencedPages(object, objectAlias) {
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
"use strict";

class PageStatementBuilder {
    constructor() {
        this.parameters = {};
        this.nodeAliases = new Set();
    }

    static build(page, site) {
        const siteAlias = "s";
        const pageAlias = "p";
        const builder = new PageStatementBuilder();
        builder.addParameter("s", site);
        builder.addParameter(pageAlias, {"type": page.type, "url": page.url});

        builder.nodeAliases.add("s");
        builder.nodeAliases.add(pageAlias);

        // TODO Let property2.3 be the same as 3#1
        // TODO Let Reference2.1.1 be the same as 1.2
        // TODO Only delete outgoing relationship of page if necessary
        // TODO MERGE (n {url:"https://mytest"}) REMOVE n:Resource SET n :Page SET n.type = "MyTpe" return n

        const statement =
            `MERGE (${pageAlias}:Page {url: $${pageAlias}.url})\n` +
            `SET ${pageAlias}.type = $${pageAlias}.type` + "\n" +
            `MERGE (${siteAlias}:Site {name: $s.name})\n` +
            `MERGE (${siteAlias})-[s_page0:Owns]->(${pageAlias})\n` +
            `WITH ${siteAlias},${siteAlias}_page0, ${pageAlias}\n` +
            `OPTIONAL MATCH (${pageAlias})<-[fromOtherSite:Owns]-(:Site)\n` +
            `WHERE fromOtherSite <> s_page0\n` +
            `DELETE fromOtherSite\n` +
            `WITH s,${pageAlias}\n` +
            `OPTIONAL MATCH (${pageAlias})-[e]->()\n` +
            `DELETE e\n` +
            builder.referencedPages(page, pageAlias) + "\n" +
            builder.relationshipsFromPageToReferencedPages(page, pageAlias) + "\n" +
            builder.properties(page, pageAlias) + "\n" +
            builder.relationshipsToProperties(page, pageAlias) + "\n" +

            // TODO Deleting orphan nodes doesn't need to be done in this transaction. Create a repeating schedule.
            `WITH ${pageAlias}\n` +
            `OPTIONAL MATCH (c:Content) WHERE NOT (:Page)-[:Property*]->(c)\n` +
            `DETACH DELETE c`;

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
            const subPropertiesCount = property.properties ? Object.keys(property.properties).length : 0;
            const referencesCount = property.references ? Object.keys(property.references).length : 0;
            statements.push(this.deleteObsoleteRelationshipsStatements(propertyAlias, subPropertiesCount, referencesCount));
        }
        return statements.join("\n");
    }

    /**
     * If the only change in a property is the deletion of a sub property or a reference,
     * this method creates the necessary statements to delete relationships to or from this other nodes.
     * The other nodes can not be deleted, because they might be referenced by other elements.
     * @param propertyAlias
     * @param subPropertiesCount
     * @param referencesCount
     * @returns {string}
     */
    deleteObsoleteRelationshipsStatements(propertyAlias, subPropertiesCount, referencesCount) {
        // For the current property, find each sub property that has not been created/matched in one of the preceding MERGE statement, i.e. is no sub property anymore.
        // For each of these properties, delete the :Property and :Parent relationship
        // Do the same for references

        const withAliases = Array.from(this.nodeAliases).join(",");

        let subPropertiesAliases = [];
        for (let i = 0; i < subPropertiesCount; i++) {
            subPropertiesAliases.push(`${propertyAlias}_prop${i}`);
        }

        let referencedResourcesAliases = [];
        for (let i = 0; i < referencesCount; i++) {
            referencedResourcesAliases.push(`${propertyAlias}_ref${i}_p`);
        }

        return `WITH ${withAliases}\n` +
            `OPTIONAL MATCH (${propertyAlias})-[${propertyAlias}_toDeletedProperty:Property]->(${propertyAlias}_deletedProperty:Content)-[${propertyAlias}_fromDeletedProperty:Parent]->(${propertyAlias})\n` +
            `WHERE NOT ${propertyAlias}_deletedProperty IN [${subPropertiesAliases.join(",")}]\n` +
            `DELETE ${propertyAlias}_toDeletedProperty, ${propertyAlias}_fromDeletedProperty\n` +
            `WITH ${withAliases}\n` +
            `OPTIONAL MATCH (${propertyAlias})-[${propertyAlias}_toDeletedResource:Reference]->(${propertyAlias}_deletedResource:Page)-[${propertyAlias}_fromDeletedResource:ReferencedBy]->(${propertyAlias})\n` +
            `WHERE NOT ${propertyAlias}_deletedResource IN [${referencedResourcesAliases.join(",")}]\n` +
            `DELETE ${propertyAlias}_toDeletedResource, ${propertyAlias}_fromDeletedResource`;
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
        this.nodeAliases.add(referenceAlias);
        return `${referenceAlias}:Reference {name: $${referenceAlias}.name,type: $${referenceAlias}.type,content: $${referenceAlias}.content,${this.selectorProperties(referenceAlias)}}`;
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
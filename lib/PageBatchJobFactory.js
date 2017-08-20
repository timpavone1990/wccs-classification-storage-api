"use strict";

const hash = require('object-hash');

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

        // TODO Let property2.3 be the same as 3#1
        // TODO Let Reference2.1.1 be the same as 1.2
        // TODO Only delete outgoing relationship of page if necessary

        const statement =
            builder.properties(page, pageAlias) + "\n" +
            builder.referencedResources(page, pageAlias) + "\n" +
            builder.page(pageAlias) + "\n" +
            builder.removeOutgoingRelationships(pageAlias) + "\n" +
            builder.relationshipsToProperties(page, pageAlias) + "\n" +
            builder.relationshipsToReferencedResources(page, pageAlias) + "\n" +
            builder.site(siteAlias) + "\n" +
            builder.relationshipToPage(siteAlias, pageAlias) + "\n" +
            builder.deleteObsoleteRelationshipsToPage(siteAlias, pageAlias) + "\n" +
            builder.deleteOrphanProperties(pageAlias) + "\n" +
            builder.deleteOrphanContentNodes(pageAlias);

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
            return this.property(parent.properties[propertyName], propertyName, `${parentAlias}_prop${index}`);
        });
        return statements.join("\n");
    }

    property(property, name, propertyAlias) {
        let statements = [];
        if (Array.isArray(property)) {
            statements = property.map((property, index) => {
                return this.property(property, name, `${propertyAlias}_item${index}`);
            });
        } else {
            if (property.properties) {
                statements.push(this.properties(property, propertyAlias));
            }

            if (property.references) {
                statements.push(this.referencedResources(property, propertyAlias));
            }

            if (property.content) {
                statements.push(this.content(propertyAlias, property.content));
            }

            statements.push(`MERGE (${propertyAlias}:Property {checksum: $${propertyAlias}.checksum,type: $${propertyAlias}.type})`);
            statements.push(this.relationshipsToProperties(property, propertyAlias));
            statements.push(this.relationshipsToReferencedResources(property, propertyAlias));
            statements.push(this.relationshipsToContent(property, propertyAlias));

            this.addParameter(propertyAlias, { "checksum": hash.MD5(property), "type": property.type, "name": name, "selector": property.selector });
            this.nodeAliases.add(propertyAlias);
        }
        return statements.join("\n");
    }

    referencedResources(object, objectAlias) {
        const statements = [];
        const referenceNames = object.references && Object.keys(object.references) || [];
        referenceNames.forEach((referenceName, index) => {
            const referenceAlias = `${objectAlias}_ref${index}`;
            const referencedResourceAlias = `${referenceAlias}_r`;
            const reference = object.references[referenceName];
            statements.push(`MERGE (${referencedResourceAlias}:Resource {url: $${referenceAlias}.destination})`);
            this.nodeAliases.add(referencedResourceAlias);

            const parameter = {
                "name": referenceName,
                "type": reference.type,
                "destination": reference.destination,
                "selector": reference.selector
            };

            if (reference.content) {
                parameter.content = reference.content;
            }

            // TODO Move this to referenceRelationship?
            this.addParameter(referenceAlias, parameter);
        });
        return statements.join("\n");
    }

    content(objectAlias, value) {
        const contentNodeAlias = `${objectAlias}_c`;
        this.addParameter(contentNodeAlias, { "value": value });
        return `MERGE (${contentNodeAlias}:Content {value: $${contentNodeAlias}.value})`
    }

    relationshipsToProperties(object, objectAlias) {
        const statements = [];
        const propertyNames = object.properties && Object.keys(object.properties) || [];
        propertyNames.forEach((propertyName, index) => {
            const property = object.properties[propertyName];
            if (Array.isArray(property)) {
                property.forEach((item, propertyItemIndex) => {
                    statements.push(this.propertyRelationship(objectAlias, `${objectAlias}_prop${index}_item${propertyItemIndex}`));
                });
            } else {
                statements.push(this.propertyRelationship(objectAlias, `${objectAlias}_prop${index}`));
            }
        });
        return statements.join("\n");
    }

    propertyRelationship(objectAlias, propertyAlias) {
        return `MERGE (${objectAlias})-[:Owns {${this.propertyRelationshipProperties(propertyAlias)}}]->(${propertyAlias})`;
    }

    propertyRelationshipProperties(propertyAlias) {
        return `name: $${propertyAlias}.name,${this.selectorProperties(propertyAlias)}`;
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

    relationshipsToReferencedResources(object, objectAlias) {
        const referenceNames = object.references && Object.keys(object.references) || [];
        return referenceNames.map((referenceName, index) => {
            const referenceAlias = `${objectAlias}_ref${index}`;
            const referencedPageAlias = `${referenceAlias}_r`;
            return `MERGE (${objectAlias})-[${this.referenceRelationship(referenceAlias)}]->(${referencedPageAlias})`;
        }).join("\n");
    }

    referenceRelationship(referenceAlias) {
        this.nodeAliases.add(referenceAlias);
        return `${referenceAlias}:References {${this.referenceRelationshipProperties(referenceAlias)}}`;
    }

    referenceRelationshipProperties(referenceAlias) {
        return `name: $${referenceAlias}.name,type: $${referenceAlias}.type,content: $${referenceAlias}.content,${this.selectorProperties(referenceAlias)}`;
    }

    relationshipsToContent(object, objectAlias) {
        return object.content ? `MERGE (${objectAlias})-[:Reads]->(${objectAlias}_c)` : "";
    }

    page(pageAlias) {
        this.nodeAliases.add(pageAlias);
        return `MERGE (${pageAlias}:Resource {url: $${pageAlias}.url})\n` +
            `SET ${pageAlias} :Page\n` +
            `SET ${pageAlias}.type = $${pageAlias}.type`;
    }

    removeOutgoingRelationships(objectAlias) {
        return `WITH ${Array.from(this.nodeAliases).join(",")}\n` +
            `OPTIONAL MATCH (${objectAlias})-[e]->()\n` +
            `DELETE e`;
    }

    site(siteAlias) {
        this.nodeAliases.add(siteAlias);
        return `MERGE (${siteAlias}:Site {name: $s.name})`;
    }

    relationshipToPage(siteAlias, pageAlias) {
        const siteToPageRelationshipAlias = `${siteAlias}_page0`;
        this.nodeAliases.add(siteToPageRelationshipAlias);
        return `MERGE (${siteAlias})-[${siteToPageRelationshipAlias}:Owns]->(${pageAlias})`
    }

    deleteObsoleteRelationshipsToPage(siteAlias, pageAlias) {
        return `WITH ${siteAlias},${siteAlias}_page0,${pageAlias}\n` +
            `OPTIONAL MATCH (${pageAlias})<-[fromOtherSite:Owns]-(:Site)\n` +
            `WHERE fromOtherSite <> ${siteAlias}_page0\n` +
            `DELETE fromOtherSite`;
    }

    deleteOrphanProperties(pageAlias) {
        // TODO Deleting orphan nodes doesn't need to be done in this transaction. Create a repeating schedule.
        return `WITH ${pageAlias}\n` +
            `OPTIONAL MATCH (c:Property) WHERE NOT (:Page)-[:Owns*]->(c)\n` +
            `DETACH DELETE c`;
    }

    deleteOrphanContentNodes(pageAlias) {
        return `WITH ${pageAlias}\n` +
            `OPTIONAL MATCH (q:Content) WHERE NOT (:Property)-[:Reads]->(q)\n` +
            `DELETE q`;
    }
}

module.exports.buildPageStorageStatement = (page, site) => {
    return PageStatementBuilder.build(page, site);
};
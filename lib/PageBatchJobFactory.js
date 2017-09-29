"use strict";

const hash = require('object-hash');

// TODO Throw error (Bad Request), if mandatory fields in the page object are missing

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
        builder.addParameter(pageAlias, {"type": page.type, "url": page.url, "status": "Classified"});

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

    property(property, name, propertyAlias, isCollectionItem = false) {
        let statements = [];
        if (Array.isArray(property)) {
            statements = property.map((property, index) => {
                return this.property(property, name, `${propertyAlias}_item${index}`, true);
            });
        } else {
            if (property.properties) {
                this.pushIfNotBlank(statements, this.properties(property, propertyAlias));
            }

            if (property.references) {
                this.pushIfNotBlank(statements, this.referencedResources(property, propertyAlias));
            }

            if (property.content) {
                this.pushIfNotBlank(statements, this.content(propertyAlias, property.content));
            }

            this.pushIfNotBlank(statements, `MERGE (${propertyAlias}:Property {checksum: $${propertyAlias}.checksum,type: $${propertyAlias}.type})`);
            this.pushIfNotBlank(statements, this.relationshipsToProperties(property, propertyAlias));
            this.pushIfNotBlank(statements, this.relationshipsToReferencedResources(property, propertyAlias));
            this.pushIfNotBlank(statements, this.relationshipsToContent(property, propertyAlias));

            this.addParameter(propertyAlias, { "checksum": hash.MD5(property), "type": property.type, "name": name, "isCollection": isCollectionItem, "selector": property.selector });
            this.nodeAliases.add(propertyAlias);
        }
        return statements.join("\n");
    }

    referencedResources(object, objectAlias) {
        const referenceNames = object.references && Object.keys(object.references) || [];
        const statements = referenceNames.map((referenceName, index) => {
            return this.referencedResource(object.references[referenceName], referenceName, `${objectAlias}_ref${index}`);
        });
        return statements.join("\n");
    }

    referencedResource(reference, name, referenceAlias, isCollectionItem = false) {
        let statements = [];
        if (Array.isArray(reference)) {
            statements = reference.map((reference, index) => {
                return this.referencedResource(reference, name, `${referenceAlias}_item${index}`, true);
            });
        } else {
            const referencedResourceAlias = `${referenceAlias}_r`;
            this.pushIfNotBlank(statements, `MERGE (${referencedResourceAlias}:Resource {url: $${referenceAlias}.destination})`);
            this.nodeAliases.add(referencedResourceAlias);

            const parameter = {
                "name": name,
                "type": reference.type,
                "isCollection": isCollectionItem,
                "destination": reference.destination,
                "selector": reference.selector
            };

            // TODO Move this to referenceRelationship?
            this.addParameter(referenceAlias, parameter);
        }
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
                    this.pushIfNotBlank(statements, this.propertyRelationship(objectAlias, `${objectAlias}_prop${index}_item${propertyItemIndex}`));
                });
            } else {
                this.pushIfNotBlank(statements, this.propertyRelationship(objectAlias, `${objectAlias}_prop${index}`));
            }
        });
        return statements.join("\n");
    }

    propertyRelationship(objectAlias, propertyAlias) {
        return `MERGE (${objectAlias})-[:Owns {${this.propertyRelationshipProperties(propertyAlias)}}]->(${propertyAlias})`;
    }

    propertyRelationshipProperties(propertyAlias) {
        /*
         * Why save isCollection as a relationship property?
         *
         * 1. The information needs to be stored in the relationship,
         *    because one property can be owned by many pages and it might not be
         *    a collection property for all pages.
         * 2. A relationship can only have one label, so an additional label for collection properties is not possible
         */
        return `name: $${propertyAlias}.name,isCollection: $${propertyAlias}.isCollection,${this.selectorProperties(propertyAlias)}`;
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
        const statements = [];
        const referenceNames = object.references && Object.keys(object.references) || [];
        referenceNames.forEach((referenceName, index) => {
            const reference = object.references[referenceName];
            if (Array.isArray(reference)) {
                reference.forEach((item, referenceItemIndex) => {
                    const referenceAlias = `${objectAlias}_ref${index}_item${referenceItemIndex}`;
                    const referencedResourceAlias = `${referenceAlias}_r`;
                    this.pushIfNotBlank(statements, `MERGE (${objectAlias})-[${this.referenceRelationship(referenceAlias)}]->(${referencedResourceAlias})`);
                });
            } else {
                const referenceAlias = `${objectAlias}_ref${index}`;
                const referencedResourceAlias = `${referenceAlias}_r`;
                this.pushIfNotBlank(statements, `MERGE (${objectAlias})-[${this.referenceRelationship(referenceAlias)}]->(${referencedResourceAlias})`);
            }
        });
        return statements.join("\n");
    }

    referenceRelationship(referenceAlias) {
        this.nodeAliases.add(referenceAlias);
        return `${referenceAlias}:References {${this.referenceRelationshipProperties(referenceAlias)}}`;
    }

    referenceRelationshipProperties(referenceAlias) {
        /*
         * Why save isCollection as a relationship property?
         *
         * 1. The information needs to be stored in the relationship,
         *    because one resource can be referenced by many pages/properties and it might not be
         *    a collection property for all pages/properties.
         * 2. A relationship can only have one label, so an additional label for collection references is not possible
         */
        return `name: $${referenceAlias}.name,type: $${referenceAlias}.type,isCollection: $${referenceAlias}.isCollection,${this.selectorProperties(referenceAlias)}`;
    }

    relationshipsToContent(object, objectAlias) {
        return object.content ? `MERGE (${objectAlias})-[:Reads]->(${objectAlias}_c)` : "";
    }

    page(pageAlias) {
        this.nodeAliases.add(pageAlias);
        return `MERGE (${pageAlias}:Resource {url: $${pageAlias}.url})\n` +
            `SET ${pageAlias} :Page\n` +
            `SET ${pageAlias}.type = $${pageAlias}.type, ${pageAlias}.status = $${pageAlias}.status`;
    }

    removeOutgoingRelationships(objectAlias) {
        // TODO Only delete outgoing relationship if necessary
        return `WITH ${Array.from(this.nodeAliases).join(",")}\n` +
            `OPTIONAL MATCH (${objectAlias})-[e]->()\n` +
            `DELETE e`;
    }

    site(siteAlias) {
        this.nodeAliases.add(siteAlias);
        return `MERGE (${siteAlias}:Site {id: $s.id})`;
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

    pushIfNotBlank(array, newElement) {
        if (newElement) {
            array.push(newElement);
        }
    }
}

module.exports.buildPageStorageStatement = (page, site) => {
    return PageStatementBuilder.build(page, site);
};
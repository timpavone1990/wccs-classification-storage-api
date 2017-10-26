"use strict";

const hash = require('object-hash');

// TODO Throw error (Bad Request), if mandatory fields in the page object are missing

class Statement {
    constructor(statementText, parameters) {
        this.statement = statementText;
        this.parameters = parameters;
    }
}

class PageStatementBuilder {


    constructor() {
        this.parameters = {};
        this.nodeAliases = new Set();

        this.statements = [];
    }

    static buildCreateStatement(page, site) {
        const siteAlias = "s";
        const pageAlias = "p";
        const builder = new PageStatementBuilder();
        //builder.addParameter("s", site);
        //builder.addParameter(pageAlias, {"type": page.type, "url": page.url, "status": page.status});

        builder.properties(page, pageAlias);
        builder.referencedResources(page, pageAlias);
        builder.page(page);
        builder.addPagePropertiesRelationshipStatements(page);
        builder.addPageResourcesRelationshipStatement(page);
        builder.site(site, page);
        builder.relationshipToPage(siteAlias, pageAlias);
        builder.deleteObsoleteRelationshipsToPage(siteAlias, pageAlias);
        builder.deleteOrphanProperties(pageAlias);
        builder.deleteOrphanContentNodes(pageAlias);

        return { "statements": builder.statements };
    }

    static buildUpdateStatement(page) {
        const pageAlias = "p";
        const builder = new PageStatementBuilder();
        builder.addParameter(pageAlias, {"type": page.type, "url": page.url, "status": page.status});

        const statement =
            builder.properties(page, pageAlias) + "\n" +
            builder.referencedResources(page, pageAlias) + "\n" +
            builder.page(pageAlias) + "\n" +
            builder.removeOutgoingRelationships(pageAlias) + "\n" +
            builder.relationshipsToProperties(page, pageAlias) + "\n" +
            builder.relationshipsToReferencedResources(page, pageAlias) + "\n" +
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
                this.properties(property, propertyAlias);
            }

            if (property.references) {
                this.referencedResources(property);
            }

            if (property.content) {
                this.content(property.content);
            }

            const statement = new Statement("MERGE (p:Property {checksum: $p.checksum,type: $p.type})", { "p": { "checksum": hash.MD5(property), "type": property.type } });
            this.statements.push(statement);


            this.relationshipsToProperties(property, propertyAlias);


            this.relationshipsToReferencedResources(property, propertyAlias);
            this.relationshipsToContent(property, propertyAlias);

            //this.addParameter(propertyAlias, { "checksum": hash.MD5(property), "type": property.type, "name": name, "isCollection": isCollectionItem, "selector": property.selector });
            //this.nodeAliases.add(propertyAlias);
        }
        return statements.join("\n");
    }

    referencedResources(object) {
        const referenceNames = object.references && Object.keys(object.references) || [];
        referenceNames.forEach(referenceName => {
            this.referencedResource(object.references[referenceName]);
        });
    }

    referencedResource(reference) {
        if (Array.isArray(reference)) {
            reference.forEach(reference => {
                this.referencedResource(reference);
            });
        } else {
            const statement = new Statement("MERGE (r:Resource {url: $r.destination})", { "r": { "destination": reference.destination, }});
            this.statements.push(statement);
        }
    }

    content(value) {
        const statement = new Statement("MERGE (c:Content {value: $c.value})", { "c": { "value": value } });
        this.statements.push(statement);
    }

    relationshipsToProperties(object, objectAlias, isCollection = false) {
        const statements = [];
        const propertyNames = object.properties && Object.keys(object.properties) || [];
        propertyNames.forEach((propertyName, index) => {
            const property = object.properties[propertyName];
            if (Array.isArray(property)) {
                property.forEach((item, propertyItemIndex) => {
                    this.pushIfNotBlank(statements, this.propertyRelationship(objectAlias, `${objectAlias}_prop${index}_item${propertyItemIndex}`));
                });
            } else {
                const statementText =
                    "MATCH" +
                        "(p1:Property {checksum: $p1.checksum})," +
                        "(p2:Property {checksum: $p2.checksum})\n" +
                    "MERGE (p1)-[o:Owns {" +
                        "name: $o.name," +
                        "isCollection: $o.isCollection," +
                        "selectorType: $o.selector.type," +
                        "startSelectorType: $o.selector.startSelector.type," +
                        "startSelectorValue: $o.selector.startSelector.value," +
                        "startSelectorOffset: $o.selector.startSelector.offset," +
                        "endSelectorType: $o.selector.endSelector.type," +
                        "endSelectorValue: $o.selector.endSelector.value," +
                        "endSelectorOffset: $o.selector.endSelector.offset" +
                    "}]->(p2)";

                const oParam = Object.assign({}, property);
                delete oParam.content;
                delete oParam.properties;
                delete oParam.references;
                delete oParam.type;
                oParam.name = propertyName;
                oParam.isCollection = isCollection;

                const parameters = {
                    "p1": { "checksum": hash.MD5(object) },
                    "p2": { "checksum": hash.MD5(property) },
                    "o": oParam
                };
                const statement = new Statement(statementText, parameters);
                this.statements.push(statement);

                this.pushIfNotBlank(statements, this.propertyRelationship(objectAlias, `${objectAlias}_prop${index}`));
            }
        });
        return statements.join("\n");
    }

    addPagePropertiesRelationshipStatements(page) {
        const propertyNames = page.properties && Object.keys(page.properties) || [];
        propertyNames.forEach(propertyName => {
            const property = page.properties[propertyName];
            if (Array.isArray(property)) {
                property.forEach(item => {
                    this.addPagePropertyRelationshipStatement(page, item, propertyName, true);
                });
            } else {
                this.addPagePropertyRelationshipStatement(page, property, propertyName, false);
            }
        });
    }

    addPagePropertyRelationshipStatement(page, property, propertyName, isCollection) {
        const statementText =
            "MATCH" +
                "(p:Resource {url: $p.url})," +
                "(prop:Property {checksum: $prop.checksum})\n" +
            "MERGE (p)-[o:Owns {" +
                "name: $o.name," +
                "isCollection: $o.isCollection," +
                "selectorType: $o.selector.type," +
                "startSelectorType: $o.selector.startSelector.type," +
                "startSelectorValue: $o.selector.startSelector.value," +
                "startSelectorOffset: $o.selector.startSelector.offset," +
                "endSelectorType: $o.selector.endSelector.type," +
                "endSelectorValue: $o.selector.endSelector.value," +
                "endSelectorOffset: $o.selector.endSelector.offset" +
            "}]->(prop)";

        const oParam = Object.assign({}, property);
        delete oParam.content;
        delete oParam.properties;
        delete oParam.references;
        delete oParam.type;
        oParam.name = propertyName;
        oParam.isCollection = isCollection;

        const parameters = {
            "p": { "url": page.url },
            "prop": { "checksum": hash.MD5(property) },
            "o": oParam
        };
        const statement = new Statement(statementText, parameters);
        this.statements.push(statement);
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

    relationshipsToReferencedResources(object) {
        const statements = [];
        const referenceNames = object.references && Object.keys(object.references) || [];
        referenceNames.forEach(referenceName => {
            const reference = object.references[referenceName];
            if (Array.isArray(reference)) {
                reference.forEach(item => {
                    this.addResourceRelationshipStatement(object, item, referenceName, true);
                });
            } else {
                this.addResourceRelationshipStatement(object, reference, referenceName, false)
            }
        });
        return statements.join("\n");
    }

    addResourceRelationshipStatement(parent, reference, referenceName, isCollection) {
        const statementText =
            "MATCH" +
                "(p:Property {checksum: $p.checksum})," +
                "(r:Resource {url: $r.destination})\n" +
            "MERGE (p)-[:References {" +
                "name: $ref.name," +
                "type: $ref.type," +
                "isCollection: $ref.isCollection," +
                "selectorType: $ref.selector.type," +
                "startSelectorType: $ref.selector.startSelector.type," +
                "startSelectorValue: $ref.selector.startSelector.value," +
                "startSelectorOffset: $ref.selector.startSelector.offset," +
                "endSelectorType: $ref.selector.endSelector.type," +
                "endSelectorValue: $ref.selector.endSelector.value," +
                "endSelectorOffset: $ref.selector.endSelector.offset" +
            "}]->(r)";

        const refParam = Object.assign({}, reference);
        delete refParam.destination;
        refParam.name = referenceName;
        refParam.isCollection = isCollection;

        const parameters = {
            "p": {
                "checksum": hash.MD5(parent)
            },
            "r": {
                "destination": reference.destination
            },
            "ref": refParam
        };

        const statement = new Statement(statementText, parameters);
        this.statements.push(statement);
    }

    addPageResourcesRelationshipStatement(page) {
        const referenceNames = page.references && Object.keys(page.references) || [];
        referenceNames.forEach(referenceName => {
            const reference = page.references[referenceName];
            if (Array.isArray(reference)) {
                reference.forEach(item => {
                    this.addPageResourceRelationshipStatement(page, item, referenceName, true);
                });
            } else {
                this.addPageResourceRelationshipStatement(page, reference, referenceName, false)
            }
        });
    }

    addPageResourceRelationshipStatement(page, reference, referenceName, isCollection) {
        const statementText =
            "MATCH" +
                "(p:Resource {url: $p.url})," +
                "(r:Resource {url: $r.destination})\n" +
            "MERGE (p)-[:References {" +
                "name: $ref.name," +
                "type: $ref.type," +
                "isCollection: $ref.isCollection," +
                "selectorType: $ref.selector.type," +
                "startSelectorType: $ref.selector.startSelector.type," +
                "startSelectorValue: $ref.selector.startSelector.value," +
                "startSelectorOffset: $ref.selector.startSelector.offset," +
                "endSelectorType: $ref.selector.endSelector.type," +
                "endSelectorValue: $ref.selector.endSelector.value," +
                "endSelectorOffset: $ref.selector.endSelector.offset" +
            "}]->(r)";

        const refParam = Object.assign({}, reference);
        delete refParam.destination;
        refParam.name = referenceName;
        refParam.isCollection = isCollection;

        const parameters = {
            "p": {
                "url": page.url
            },
            "r": {
                "destination": reference.destination
            },
            "ref": refParam
        };

        const statement = new Statement(statementText, parameters);
        this.statements.push(statement);
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
        if (object.content) {
            const statementText =
                "MATCH" +
                    "(p:Property {checksum: $p.checksum})," +
                    "(c:Content {value: $c.value})\n" +
                "MERGE (p)-[:Reads]->(c)";
            const parameters = {
                "p": { "checksum": hash.MD5(object) },
                "c": { "value": object.content }
            };
            const statement = new Statement(statementText, parameters);
            this.statements.push(statement);
        }
    }

    page(page) {
        const statementText =
            "MERGE (p:Resource {url: $p.url})\n" +
            "SET p :Page\n" +
            "SET p.type = $p.type, p.status = $p.status\n" +
            "WITH p\n" +
            "OPTIONAL MATCH (p)-[e]->()\n" +
            "DELETE e";
        const parameters = { "p": { "url": page.url, "type": page.type, "status": page.status } };
        const statement = new Statement(statementText, parameters);
        this.statements.push(statement);
    }

    removeOutgoingRelationships(objectAlias) {
        // TODO Only delete outgoing relationship if necessary
        return `WITH ${Array.from(this.nodeAliases).join(",")}\n` +
            `OPTIONAL MATCH (${objectAlias})-[e]->()\n` +
            `DELETE e`;
    }

    site(site, page) {
        const statementText =
            "MERGE (s:Site {id: $s.id})\n" +
            "WITH s\n" +

            "MATCH (s:Site {id: $s.id}), (p:Resource {url: $p.url})\n" +
            "MERGE (s)-[o:Owns]->(p)\n" +

            "WITH s,o,p\n" +
            "OPTIONAL MATCH (p)<-[fromOtherSite:Owns]-(:Site)\n" +
            "WHERE fromOtherSite <> o\n" +
            "DELETE fromOtherSite\n" +

            "WITH p\n" +
            "OPTIONAL MATCH (c:Property) WHERE NOT (:Page)-[:Owns*]->(c)\n" +
            "DETACH DELETE c\n" +

            "WITH p\n" +
            "OPTIONAL MATCH (q:Content) WHERE NOT (:Property)-[:Reads]->(q)\n" +
            "DELETE q";
        const parameters = {
            "s": { "id": site.id },
            "p": { "url": page.url }
        };
        const statement = new Statement(statementText, parameters);
        this.statements.push(statement);
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

module.exports = {
    "buildCreateStatement": (page, site) => PageStatementBuilder.buildCreateStatement(page, site),
    "buildUpdateStatement": (page) => PageStatementBuilder.buildUpdateStatement(page)
};
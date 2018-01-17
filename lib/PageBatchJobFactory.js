"use strict";

const hash = require('object-hash');
const Statement = require("./statements/Statement");
const ResourceStatement = require("./statements/ResourceStatement");
const ContentStatement = require("./statements/ContentStatement");
const PropertyStatement = require("./statements/PropertyStatement");
const SubPropertyRelationshipStatement = require("./statements/SubPropertyRelationshipStatement");
const PagePropertyRelationshipStatement = require("./statements/PagePropertyRelationshipStatement");

// TODO Throw error (Bad Request), if mandatory fields in the page object are missing

class PageStatementBuilder {
    constructor() {
        this.statements = [];
    }

    static get deleteOrphanProperties() {
        return "OPTIONAL MATCH (c:Content) WHERE NOT (:Page)-[:Owns*]->(c)\nDETACH DELETE c\n";
    }

    static get deleteOrphanContentNodes() {
        return "OPTIONAL MATCH (q:Text) WHERE NOT (:Content)-[:Reads]->(q)\nDELETE q";
    }

    static buildCreateStatement(page, site) {
        const builder = new PageStatementBuilder();
        builder.properties(page);
        builder.referencedResources(page);
        builder.page(page);
        builder.relationshipsFromPageToProperties(page);
        builder.relationshipsFromPageToResources(page);
        builder.site(site, page);
        return { "statements": builder.statements };
    }

    static buildUpdateStatement(page) {
        const builder = new PageStatementBuilder();
        builder.properties(page);
        builder.referencedResources(page);
        builder.page(page);
        builder.relationshipsFromPageToProperties(page);
        builder.relationshipsFromPageToResources(page);
        builder.cleanupAfterUpdate();
        return { "statements": builder.statements };
    }

    addStatement(statementText, parameters) {
        this.statements.push(new Statement(statementText, parameters));
    }

    properties(parent) {
        const propertyNames = parent.contents && Object.keys(parent.contents) || [];
        propertyNames.forEach(propertyName => {
            this.property(parent.contents[propertyName], propertyName);
        });
    }

    property(property, name) {
        if (Array.isArray(property)) {
            property.forEach(property => {
                this.property(property, name);
            });
        } else {
            if (property.contents) {
                this.properties(property);
            }

            if (property.references) {
                this.referencedResources(property);
            }

            if (property.content) {
                this.statements.push(new ContentStatement(property.content));
            }

            this.statements.push(new PropertyStatement(this.getChecksum(property), property.class));
            this.relationshipsFromPropertyToProperties(property);
            this.relationshipsFromPropertyToResources(property);
            this.relationshipFromPropertyToContent(property);
        }
    }

    getChecksum(object) {
        const hashedObject = Object.assign({}, object);
        delete hashedObject.selector;
        return hash.MD5(hashedObject);
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
            this.statements.push(new ResourceStatement(reference.destination));
        }
    }

    relationshipsFromPropertyToProperties(object) {
        const propertyNames = object.contents && Object.keys(object.contents) || [];
        propertyNames.forEach(propertyName => {
            const property = object.contents[propertyName];
            if (Array.isArray(property)) {
                property.forEach(item => {
                    this.addSubPropertyRelationshipStatement(object, item, propertyName, true);
                });
            } else {
                this.addSubPropertyRelationshipStatement(object, property, propertyName, false);
            }
        });
    }

    addSubPropertyRelationshipStatement(parent, property, propertyName, isCollection) {
        const relationshipParameters = this.createPropertyRelationshipParameters(property, propertyName, isCollection);
        this.statements.push(new SubPropertyRelationshipStatement(this.getChecksum(parent), this.getChecksum(property), relationshipParameters));
    }

    createPropertyRelationshipParameters(property, propertyName, isCollection) {
        const relationshipParameters = Object.assign({}, property);
        delete relationshipParameters.content;
        delete relationshipParameters.contents;
        delete relationshipParameters.references;
        delete relationshipParameters.class;
        relationshipParameters.name = propertyName;
        relationshipParameters.isCollection = isCollection;
        return relationshipParameters;
    }

    relationshipsFromPageToProperties(page) {
        const propertyNames = page.contents && Object.keys(page.contents) || [];
        propertyNames.forEach(propertyName => {
            const property = page.contents[propertyName];
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
        const relationshipParameters = this.createPropertyRelationshipParameters(property, propertyName, isCollection);
        this.statements.push(new PagePropertyRelationshipStatement(page.url, this.getChecksum(property), relationshipParameters));
    }

    relationshipsFromPropertyToResources(object) {
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
    }

    // TODO Finish refactoring of statements.
    // TODO Statement classes could also be given the elements and perform the respective part of the traversal
    addResourceRelationshipStatement(parent, reference, referenceName, isCollection) {
        const statementText =
            "MATCH" +
                "(p:Content {checksum: $p.checksum})," +
                "(r:Resource {url: $r.destination})\n" +
            "MERGE (p)-[:References {" +
                "name: $ref.name," +
                "class: $ref.class," +
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
                "checksum": this.getChecksum(parent)
            },
            "r": {
                "destination": reference.destination
            },
            "ref": refParam
        };
        this.addStatement(statementText, parameters);
    }

    relationshipsFromPageToResources(page) {
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
                "class: $ref.class," +
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
        this.addStatement(statementText, parameters);
    }

    relationshipFromPropertyToContent(object) {
        if (object.content) {
            const statementText =
                "MATCH" +
                    "(p:Content {checksum: $p.checksum})," +
                    "(c:Text {value: $c.value})\n" +
                "MERGE (p)-[:Reads]->(c)";
            const parameters = {
                "p": { "checksum": this.getChecksum(object) },
                "c": { "value": object.content }
            };
            this.addStatement(statementText, parameters);
        }
    }

    page(page) {
        const statementText =
            "MERGE (p:Resource {url: $p.url})\n" +
            "SET p :Page\n" +
            "SET p.class = $p.class, p.status = $p.status\n" +
            "WITH p\n" +
            "OPTIONAL MATCH (p)-[e]->()\n" +
            "DELETE e";
        const parameters = { "p": { "url": page.url, "class": page.class, "status": page.status } };
        this.addStatement(statementText, parameters);
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
            PageStatementBuilder.deleteOrphanProperties +

            "WITH p\n" +
            PageStatementBuilder.deleteOrphanContentNodes;
        const parameters = {
            "s": { "id": site.id },
            "p": { "url": page.url }
        };
        this.addStatement(statementText, parameters);
    }

    cleanupAfterUpdate() {
        const statementText =
            PageStatementBuilder.deleteOrphanProperties +
            "WITH {} AS d\n" +
            PageStatementBuilder.deleteOrphanContentNodes;
        this.addStatement(statementText, {});
    }
}

module.exports = {
    "buildCreateStatement": (page, site) => PageStatementBuilder.buildCreateStatement(page, site),
    "buildUpdateStatement": (page) => PageStatementBuilder.buildUpdateStatement(page)
};
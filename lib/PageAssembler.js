"use strict";

function getFirstRowIfPresent(resultData) {
    return resultData[0] ? resultData[0].row[0] : [];
}

module.exports = class PageAssembler {
    assemble(pageResults) {
        const pageResult = getFirstRowIfPresent(pageResults.results[0].data);
        const pageReferencesResult = getFirstRowIfPresent(pageResults.results[1].data);
        const propertyReferencesResult = pageResults.results[2].data;
        const firstLevelPropertiesResult = getFirstRowIfPresent(pageResults.results[3].data);
        const propertiesResult = getFirstRowIfPresent(pageResults.results[4].data);
        const subPropertiesResult = pageResults.results[5].data;

        const propertyReferencesByChecksum = {};
        propertyReferencesResult.forEach(result => {
            propertyReferencesByChecksum[result.row[0].parent] = result.row[0];
        });

        const subPropertiesByChecksum = {};
        subPropertiesResult.forEach(result => {
            subPropertiesByChecksum[result.row[0].property] = result.row[0];
        });

        const page = {
            "type": pageResult.type,
            "url": pageResult.url,
            "properties": {},
            "references": {}
        };

        this.pageReferences(page, pageReferencesResult);

        const propertiesByChecksum = {};
        propertiesResult.forEach(property => {
            propertiesByChecksum[property.checksum] = property;
        });

        const visitedProperties = [];
        firstLevelPropertiesResult.forEach(firstLevelProperty => {
            this.handleProperty(propertiesByChecksum, firstLevelProperty, page, propertyReferencesByChecksum, subPropertiesByChecksum, visitedProperties);
        });

        return page;
    }

    handleProperty(propertiesByChecksum, propertyDef, parent, propertyReferencesByChecksum, subPropertiesByChecksum, visited) {
        if (visited.indexOf(propertyDef.checksum) === -1) {
            visited.push(propertyDef.checksum);

            const property = propertiesByChecksum[propertyDef.checksum];

            if (!property.properties) {
                property.properties = {};
            }

            if (property.isCollection) {
                if (!parent.properties[property.name]) {
                    parent.properties[property.name] = [];
                }
                parent.properties[property.name].push(property);
            } else {
                parent.properties[property.name] = property;
            }

            if (!property.references) {
                property.references = {};
            }
            const propertyReferences = propertyReferencesByChecksum[property.checksum];
            if (propertyReferences && Array.isArray(propertyReferences.references)) {
                propertyReferences.references.forEach(reference => {
                    if (reference.isCollection) {
                        if (!property.references[reference.name]) {
                            property.references[reference.name] = [];
                        }
                        property.references[reference.name].push(reference);
                    } else {
                        property.references[reference.name] = reference;
                    }
                    delete reference.isCollection;
                    delete reference.name;
                });
            }

            const subProperties = subPropertiesByChecksum[propertyDef.checksum];
            if (subProperties && Array.isArray(subProperties.subProperties)) {
                const subPropertiesDef = subProperties.subProperties;
                subPropertiesDef.forEach(subProperty => {
                    this.handleProperty(propertiesByChecksum, subProperty, property, propertyReferencesByChecksum, subPropertiesByChecksum, visited);
                });
            }

            if (!property.content) {
                delete property.content;
            }

            delete property.checksum;
            delete property.isCollection;
            delete property.name;
        }
    }

    pageReferences(page, result) {
        if (result.references) {
            result.references.forEach(reference => {
                if (reference.isCollection) {
                    if (!page.references[reference.name]) {
                        page.references[reference.name] = []
                    }
                    page.references[reference.name].push(reference);
                } else {
                    page.references[reference.name] = reference;
                }

                delete reference.name;
                delete reference.isCollection;
            });
        }
    }
};
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
        const subPropertiesHierarchyResult = pageResults.results[5].data;

        const propertyReferencesByChecksum = {};
        propertyReferencesResult.forEach(result => {
            propertyReferencesByChecksum[result.row[0].parent] = result.row[0];
        });

        const subPropertiesHierarchyByChecksum = {};
        subPropertiesHierarchyResult.forEach(result => {
            subPropertiesHierarchyByChecksum[result.row[0].property] = result.row[0];
        });

        const page = {
            "type": pageResult.type,
            "url": pageResult.url,
            "status": pageResult.status,
            "properties": {},
            "references": {}
        };

        this.pageReferences(page, pageReferencesResult);

        const propertiesByChecksum = {};
        firstLevelPropertiesResult.forEach(property => {
            propertiesByChecksum[property.checksum] = property;
        });
        propertiesResult.forEach(property => {
            propertiesByChecksum[property.checksum] = property;
        });

        const visitedProperties = {};
        firstLevelPropertiesResult.forEach(firstLevelProperty => {
            this.handleProperty(propertiesByChecksum, firstLevelProperty, page, propertyReferencesByChecksum, subPropertiesHierarchyByChecksum, visitedProperties);
        });

        return page;
    }

    handleProperty(propertiesByChecksum, propertyDef, parent, propertyReferencesByChecksum, subPropertiesByChecksum, visited) {
        const cleanProperty = Object.assign({}, propertyDef);
        cleanProperty.type = propertiesByChecksum[propertyDef.checksum].type;
        cleanProperty.content = propertiesByChecksum[propertyDef.checksum].content;

        if (visited.hasOwnProperty(propertyDef.checksum)) {
            // We can not reuse the whole feature, because name and isCollection might be different
            cleanProperty.properties = visited[propertyDef.checksum].properties;
            cleanProperty.references = visited[propertyDef.checksum].references;
        } else {
            visited[propertyDef.checksum] = cleanProperty;

            if (!cleanProperty.properties) {
                cleanProperty.properties = {};
            }

            if (!cleanProperty.references) {
                cleanProperty.references = {};
            }
            const propertyReferences = propertyReferencesByChecksum[cleanProperty.checksum];
            if (propertyReferences && Array.isArray(propertyReferences.references)) {
                propertyReferences.references.forEach(reference => {
                    if (reference.isCollection) {
                        if (!cleanProperty.references[reference.name]) {
                            cleanProperty.references[reference.name] = [];
                        }
                        cleanProperty.references[reference.name].push(reference);
                    } else {
                        cleanProperty.references[reference.name] = reference;
                    }
                    delete reference.isCollection;
                    delete reference.name;
                });
            }

            const subProperties = subPropertiesByChecksum[propertyDef.checksum];
            if (subProperties && Array.isArray(subProperties.subProperties)) {
                const subPropertiesDef = subProperties.subProperties;
                subPropertiesDef.forEach(subProperty => {
                    this.handleProperty(propertiesByChecksum, subProperty, cleanProperty, propertyReferencesByChecksum, subPropertiesByChecksum, visited);
                });
            }
        }

        if (cleanProperty.isCollection) {
            if (!parent.properties[cleanProperty.name]) {
                parent.properties[cleanProperty.name] = [];
            }
            parent.properties[cleanProperty.name].push(cleanProperty);
        } else {
            parent.properties[cleanProperty.name] = cleanProperty;
        }

        if (!cleanProperty.content) {
            delete cleanProperty.content;
        }

        delete cleanProperty.checksum;
        delete cleanProperty.isCollection;
        delete cleanProperty.name;
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
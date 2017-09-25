"use strict";

module.exports = class PageAssembler {
    assemble(pageResults) {

        const pageAndPageReferencesResult = pageResults.results[0].data[0].row[0];
        const propertyReferencesResult = pageResults.results[1].data;
        const firstLevelPropertiesResult = pageResults.results[2].data[0].row[0];
        const propertiesResult = pageResults.results[3].data[0].row[0];
        const subPropertiesResult = pageResults.results[4].data;

        const page = {
            "type": pageAndPageReferencesResult.type,
            "url": pageAndPageReferencesResult.url,
            "references": {}
        };

        pageAndPageReferencesResult.references.forEach(reference => {
            page.references[reference.name] = reference;
        });

        return page;
    }
};
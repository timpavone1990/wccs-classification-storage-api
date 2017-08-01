"use strict";

module.exports.writeNode = (restClient) => {
    return new Promise((resolve, reject) => {
        try {
            restClient
                .post("http://localhost:7474/db/data/transaction/commit")
                .headers({ "Accept": "application/json;charset=utf-8", "Content-Type": "application/json"})
                .auth("neo4j", "z24yLDCYZympaqgy")
                .send({
                    "statements": [{
                        "statement": "MERGE (n:Content { text: $text }) RETURN id(n)",
                        "parameters": {
                            "text": "Ich denke also bin ich!"
                        }
                    }]
                })
                .end(response => {
                    if (response.ok) {
                        console.log(response.body);
                        resolve(true);
                    } else {
                        console.log(response);
                        reject({"status": response.status, "body": response.body});
                    }
                });
        } catch (e) {
            reject(e);
        }
    });
};

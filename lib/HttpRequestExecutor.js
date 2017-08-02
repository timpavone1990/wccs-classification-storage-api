"use strict";

// TODO Remove hard coded credentials
const NEO4J_USER = "neo4j";
const NEO4J_PASSWORD = "z24yLDCYZympaqgy";

module.exports = class HttpRequestExecutor {
    constructor(httpClient) {
        this.httpClient = httpClient
    }

    post(url, payload) {
        return new Promise((resolve, reject) => {
            try {
                this.httpClient
                    .post(url)
                    .headers({ "Accept": "application/json;charset=utf-8", "Content-Type": "application/json"})
                    .auth(NEO4J_USER, NEO4J_PASSWORD)
                    .send(payload)
                    .end(response => {
                        if (response.ok) {
                            resolve({"status": response.status, "body": response.body});
                        } else {
                            reject({"status": response.status, "body": response.body});
                        }
                    });
            } catch (e) {
                reject({"status": "ERROR", "body": "Request execution failed.", "exception": e });
            }
        });
    }
};

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
                            if (response.body.errors.length === 0) {
                                resolve({"status": response.status, "body": response.body});
                            } else {
                                reject({"status": "ERROR", "body": "Request execution failed.", "errors": response.body.errors});
                            }
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

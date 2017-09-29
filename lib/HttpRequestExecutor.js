"use strict";

// TODO Remove hard coded credentials
const NEO4J_USER = "neo4j";
const NEO4J_PASSWORD = "z24yLDCYZympaqgy";

module.exports = class HttpRequestExecutor {
    constructor(httpClient) {
        this.httpClient = httpClient
    }

    async get(url) {
        return new Promise((resolve, reject) => {
            this.httpClient
                .get(url)
                .headers({ "Accept": "application/json;charset=UFT-8" })
                .auth(NEO4J_USER, NEO4J_PASSWORD)
                .end(response => {
                    if (response.ok) {
                        resolve({"status": response.status, "body": response.body});
                    } else {
                        reject(new Error(`GET request to ${url} failed.\n${response.error}`));
                    }
                });
        });
    }

    post(url, payload) {
        return new Promise((resolve, reject) => {
            console.time("database request");
            this.httpClient
                .post(url)
                .headers({ "Accept": "application/json;charset=utf-8", "Content-Type": "application/json"})
                .auth(NEO4J_USER, NEO4J_PASSWORD)
                .send(payload)
                .end(response => {
                    console.timeEnd("database request");
                    if (response.ok) {
                        if (response.body.errors.length === 0) {
                            resolve({"status": response.status, "body": response.body});
                        } else {
                            reject(new Error(`POST request to ${url} failed.\n${JSON.stringify(response.body.errors)}`));
                        }
                    } else {
                        reject(new Error(`POST request to ${url} failed.\n${response.error}`));
                    }
                });
        });
    }
};

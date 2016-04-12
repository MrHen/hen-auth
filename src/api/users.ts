import express = require("express");
import path = require("path");
import superagent = require("superagent");

import * as authenticate from "./authenticate";
import permissions from "./permissions";

export interface UserRouteConfig {
    apiUrl: string;
    tokens: {
      userManagement: string;
    };
}

export default function(config: UserRouteConfig) {
    let router = express.Router();

    router.use("/", authenticate.token());
    router.use("/", permissions({ resource: "users" }));

    router.get("/", function(req, res, next) {
        let authHeader = req.headers["authorization"];

        superagent
            .get(config.apiUrl + "users")
            .set("Authorization", "Bearer " + config.tokens.userManagement)
            .set("Accept", "application/json")
            .end(function(err, response) {
                if (err) {
                    return res.status(err.status || 500).send(err.response || { message: "Unknown error." });
                }

                return res.status(response.status || 200).send(response.body);
            });
    });

    return router;
}

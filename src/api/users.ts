import _ = require("lodash");
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

                let userResponse = _.map(response.body, (user) => {
                  return _.pick(user, [
                      "user_id",
                      "name",
                      "email",
                      "email_verified",
                      "picture",
                      "nickname",
                      "updated_at",
                      "identities",
                      "created_at",
                      "user_metadata",
                      "blocked",
                      "last_ip",
                      "last_login",
                      "logins_count"
                  ]);
                });

                return res.status(response.status || 200).send(userResponse);
            });
    });

    return router;
}

import * as async from "async";

import bodyParser = require("body-parser");
import cors = require("cors");
import dotenv = require("dotenv");
import express = require("express");
import expressJwt = require("express-jwt");
import http = require("http");
import path = require("path");

import logger = require("morgan");

import authenticate from "./api/authenticate";
import * as permissions from "./api/permissions";

import apiRoute = require("./api/routes");

dotenv.config({
    silent: true
});

// Must happen after dotenv
import config = require("config");

async.auto({
    "configAuth": (cb) => {
      authenticate({
          secret: new Buffer(config.get<string>("auth0.clientSecret"), "base64"),
          audience: config.get<string>("auth0.clientId")
      });
      cb();
    },
    "configPermissions": (cb) => {
      permissions.init();
      cb();
    },
    "app": (cb) => {
        let app = express();

        app.set("port", config.get<string>("server.port"));

        app.use(cors());

        app.set("views", path.join(__dirname, "api", "views"));
        app.set("view engine", "jade");

        app.use(logger("dev"));
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({
            extended: false
        }));
        // app.use(cookieParser());

        cb(null, app);
    },
    "routes": ["app", (results, cb) => {
        results.app.use("/api", apiRoute);

        results.app.use("/bower_components", express.static(path.join(__dirname,
            "bower_components")));

        // Hack to get configs into the client. Angular doesn't like loading
        // external files via $http before/during the config step.
        results.app.use("/config.js", (req, res) => {
            res.send("var LOADED_CONFIG = " + JSON.stringify(config.get("client")));
        });

        results.app.use("/config.json", (req, res) => {
            res.send(config.get("client"));
        });

        results.app.use("/", express.static(path.join(__dirname, "dashboard")));

        cb();
    }],
    "server": ["configAuth", "app", "routes", (results, cb) => {
        cb(null, http.createServer(results.app));
    }],
    "listen": ["server", (results, cb) => {
        results.server.listen(results.app.get("port"), () => {
            console.info("Express server listening", { port: results.app.get("port") });
            cb(null);
        });
    }],
}, (err: Error, result) => {
    console.info("Setup completed", { err: err });
});

import * as async from "async";

let bodyParser = require("body-parser");
let cors = require("cors");
let dotenv = require("dotenv");
let express = require("express");
let expressJwt = require("express-jwt");
let http = require("http");
let path = require("path");

let logger = require("morgan");

let apiRoute = require("./api/routes/index");

dotenv
  .config({
    silent: true
  });

async.auto({
  "app": (cb) => {
    let app = express();

    let port = process.env.PORT || 3000;
    app.set("port", port);

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
    let authenticate = expressJwt({
      secret: new Buffer(process.env.AUTH0_CLIENT_SECRET, "base64"),
      audience: process.env.AUTH0_CLIENT_ID
    });

    results.app.use("/api/", apiRoute);
    results.app.use("/api/secured", authenticate);
    results.app.use("/api/scoped", authenticate);
    results.app.use("/api/scoped", function(req, res, next) {
      if (!req.user || !req.user.app_metadata) {
        return res.status(403).send("No app_metadata.");
      }

      if (req.user.app_metadata.test !== "test") {
        return res.status(403).send("Missing claim.");
      }

      next();
    });

    results.app.use("/bower_components", express.static(path.join(__dirname,
      "bower_components")));
    results.app.use("/public", express.static(path.join(__dirname, "public")));
    results.app.use("/", express.static(path.join(__dirname, "sample")));

    cb();
  }],
  "server": ["app", "routes", (results, cb) => {
    cb(null, http.createServer(results.app));
  }],
  "listen": ["server", (results, cb) => {
      results.server.listen(results.app.get("port"), () => {
          console.info("Express server listening", {port: results.app.get("port")});
          cb(null);
      });
  }],
}, (err: Error, result) => {
  console.info("Setup completed", {err: err});
});

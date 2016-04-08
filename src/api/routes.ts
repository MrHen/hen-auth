import express = require("express");
import path = require("path");

import authenticate from "./authenticate";

let router = express.Router();

router.use("/secured", authenticate());
router.use("/scoped", authenticate());
router.use("/scoped", function(req, res, next) {
    if (!req.user || !req.user.app_metadata) {
        return res.status(403).send("No app_metadata.");
    }

    if (req.user.app_metadata.test !== "test") {
        return res.status(403).send("Missing claim.");
    }

    next();
});

router.use("/public", express.static(path.join(__dirname, "public")));

router.get("/ping", function(req, res) {
  res.send("All good. You don't need to be authenticated to call this");
});

router.get("/secured/ping", function(req, res) {
  res.status(200).send(
    "All good. You only get this message if you're authenticated");
});

router.get("/scoped/ping", function(req, res) {
  res.status(200).send(
    "All good. You only get this message if you're scoped");
});

router.get("/", function(req, res, next) {
  res.render("index", {
    rootUrl: ".",
    title: "Express"
  });
});

module.exports = router;

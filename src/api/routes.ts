import express = require("express");
import path = require("path");

import * as authenticate from "./authenticate";
import permissions from "./permissions";

let router = express.Router();

router.use("/secured", authenticate.token());
router.use("/scoped", authenticate.token());
// router.use("/scoped", authenticate.userValues({"app_metadata.test": "test"}));
router.use("/scoped", permissions({resource: "test"}));

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

import express = require("express");
let router = express.Router();

router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

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

module.exports = router;

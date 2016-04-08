import * as async from "async";

let app = require("./app");
let http = require("http");

async.auto({
  "app": (cb) => {
    let port = process.env.PORT || 3000;
    app.set("port", port);
    cb(null, app);
  },
  "server": ["app", (results, cb) => {
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

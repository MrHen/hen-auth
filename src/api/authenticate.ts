import expressJwt = require("express-jwt");

let authenticate: expressJwt.RequestHandler = null;

export default function(config?: expressJwt.Options): expressJwt.RequestHandler {
    if (config) {
        authenticate = expressJwt(config);
    }

    return (req, res, next): any => {
      if (!authenticate) {
          throw new Error("Authentication not configured yet");
      }

      authenticate(req, res, next);
    };
}

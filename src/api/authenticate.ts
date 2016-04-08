import _ = require("lodash");
import expressJwt = require("express-jwt");

let authenticate: expressJwt.RequestHandler = null;

export function token(): expressJwt.RequestHandler {
  return (req, res, next): any => {
    if (!authenticate) {
        throw new Error("Authentication not configured yet");
    }

    authenticate(req, res, next);
  };
}

export function userValues(values: {[key: string]: string}) {
  return (req, res, next): any => {
    let invalid = _.omitBy(values, (value, key) => {
      return _.get(req.user, key, null) === value;
    });

    if (!_.isEmpty(invalid)) {
      return res.status(403).send("Could not match keys: " + _.keys(invalid).join(","));
    }

    next();
  };
}

export default function(config?: expressJwt.Options): expressJwt.RequestHandler {
    if (config) {
        authenticate = expressJwt(config);
    }

    return token();
}

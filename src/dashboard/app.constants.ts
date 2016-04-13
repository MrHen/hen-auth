// LOADED_CONFIG comes from a config hack in server.ts
let LOADED_CONFIG: DashboardConfig.ConfigInterface;

namespace DashboardConfig {
    export interface ConfigInterface {
        "auth0": {
            "clientId": string;
            "domain": string;
        };
        "storageKeys": {
            "token": string;
            "profile": string;
        };
        "states": {
          "debug": string;
          "login": string;
          "home": string;
          "users": string;
          "usersList": string;
          "root": string;
        };
    }

    angular.module("dashboard.constants", [])
        .constant("CONFIG", LOADED_CONFIG);
}

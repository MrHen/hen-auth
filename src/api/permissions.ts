import _ = require("lodash");
import acl = require("acl");
import express = require("express");

let permissions = new acl(new acl.memoryBackend());

export interface PermissionsConfig {
    rolePath?: string;
    roleDefault?: string;
}

let savedConfig: PermissionsConfig = {};

let defaultConfig: PermissionsConfig = {
    rolePath: "user.app_metadata.roles",
    roleDefault: "guest"
};

function build() {
    permissions.allow([
        {
            roles: ["verified", "test"],
            allows: [
                { resources: "test", permissions: "get" },
            ]
        },
        {
            roles: ["admin"],
            allows: [
                { resources: "roles", permissions: ["get", "put", "delete"] },
            ]
        }
    ]);
}

export function init(config?: PermissionsConfig) {
    _.merge(savedConfig, defaultConfig, config);
    permissions = new acl(new acl.memoryBackend());
    build();

    return permissions;
}

export default function middleware(overrides?: { roles?: string[], resource?: string; action?: string }): express.RequestHandler {
    return (req, res, next): any => {
        if (!permissions) {
            throw new Error("Permissions not configured yet");
        }

        let resource = overrides.resource || req.url;
        let action = (overrides.action || req.method).toLowerCase();
        let roles = overrides.roles || _.get(req, savedConfig.rolePath, [savedConfig.roleDefault]);

        permissions.areAnyRolesAllowed(roles, resource, action, (err, result) => {
            // console.log("permissions", { roles: roles, resource: resource, action: action, result: result });

            if (!result) {
                return res.status(403).send("Not authorized for these roles: " + roles.join(","));
            }

            next();
        });
    };
}

namespace DashboardProfileService {
    function dashboardProfileConfig($httpProvider, jwtInterceptorProvider) {
      jwtInterceptorProvider.tokenGetter = function(store) {
        return store.get("token");
      };

      // Add a simple interceptor that will fetch all requests and add the jwt token to its authorization header.
      // NOTE: in case you are calling APIs which expect a token signed with a different secret, you might
      // want to check the delegation-token example
      $httpProvider.interceptors.push("jwtInterceptor");
    }

    export class DashboardProfile {
        public static $inject: string[] = ["jwtHelper", "store"];

        constructor(private jwtHelper, private store) {
        }

        public get isExpired(): boolean {
          return this.jwtHelper.isTokenExpired(this.token);
        }

        public get token(): string {
          return this.store.get("token");
        }

        public set token(token: string) {
          this.store.set("token", token);
        }

        public get profile(): Object {
          return this.store.get("profile");
        }

        public set profile(profile: Object) {
          this.store.set("profile", profile);
        }
    }

    angular.module("dashboard.profile",
        [
            "angular-jwt",
            "angular-storage",
            "dashboard.constants"
        ])
        .config(dashboardProfileConfig)
        .service("DashboardProfile", DashboardProfile);
}

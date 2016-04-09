namespace DashboardAuthService {
    function dashboardAuthConfig(authProvider, CONFIG: DashboardConfig.ConfigInterface) {
        authProvider.init({
            domain: CONFIG.auth0.domain,
            clientID: CONFIG.auth0.clientId,
            loginUrl: "/login"
        });

        authProvider.on("loginSuccess", function(DashboardAuth: DashboardAuth, profilePromise, idToken) {
            DashboardAuth.success(profilePromise, idToken);
        });

        authProvider.on("loginFailure", function(DashboardAuth: DashboardAuth) {
            DashboardAuth.failure();
        });

        authProvider.on("authenticated", function(DashboardAuth: DashboardAuth) {
            DashboardAuth.authenticated();
        });
    }

    export class DashboardAuth {
        public static $inject: string[] = ["$location", "auth", "DashboardProfile"];

        constructor(private $location: angular.ILocationService, private auth, private DashboardProfile: DashboardProfileService.DashboardProfile) {
        }

        public success(profilePromise, idToken) {
            profilePromise.then((profile) => {
                this.DashboardProfile.profile = profile;
                this.DashboardProfile.token = idToken;
            });
            this.$location.path("/");
        }

        public failure() {
            alert("Error");
        }

        public authenticate(token: string) {
          this.auth.authenticate(this.DashboardProfile.profile, token);
        }

        public authenticated() {
            this.$location.path("/");
        }

        public get isAuthenticated(): boolean {
          return this.auth.isAuthenticated;
        }
    }

    angular.module("dashboard.auth",
        [
            "auth0",
            "dashboard.constants",
            "dashboard.profile"
        ])
        .config(dashboardAuthConfig)
        .service("DashboardAuth", DashboardAuth);
}

namespace DashboardAuthService {
    function dashboardAuthConfig(authProvider, CONFIG: DashboardConfig.ConfigInterface) {
        authProvider.init({
            domain: CONFIG.auth0.domain,
            clientID: CONFIG.auth0.clientId,
            loginState: CONFIG.states.login
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

        constructor(private $location: angular.ILocationService, private auth: auth0.angular.IAuth0Service, private DashboardProfile: DashboardProfileService.DashboardProfile) {
        }

        public success(profilePromise, idToken) {
            return profilePromise.then((profile) => {
                this.DashboardProfile.profile = profile;
                this.DashboardProfile.token = idToken;

                return profile;
            });
        }

        public failure() {
            alert("Error");
        }

        public authenticate(token: string) {
            this.auth.authenticate(this.DashboardProfile.profile, token);
        }

        public authenticated() {
        }

        public get isAuthenticated(): boolean {
            return this.auth.isAuthenticated;
        }

        public signin = () => {
          this.auth.signin(<any>{
              icon: "/resources/weave.png",
              authParams: {
                  scope: "openid name email app_metadata" // Specify the scopes you want to retrieve
              }
          });
        };

        public signout = () => {
            this.auth.signout();
            this.DashboardProfile.profile = null;
            this.DashboardProfile.token = null;
            this.$location.path("/login");
        };
    }

    angular.module("dashboard.auth",
        [
            "auth0",
            "dashboard.constants",
            "dashboard.profile"
        ])
        .config(dashboardAuthConfig)
        .service("DashboardAuth", DashboardAuthService.DashboardAuth);
}

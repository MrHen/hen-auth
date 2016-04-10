namespace DashboardApp {
    angular.module("dashboard",
        [
            "dashboard.constants",
            "dashboard.auth",
            "dashboard.home",
            "dashboard.login",
            "dashboard.profile"
        ])
        .run(dashboardAppRun)
        .controller("AppCtrl", AppCtrl);

    function dashboardAppRun(
        $rootScope: angular.IRootScopeService,
        $location: angular.ILocationService,
        DashboardAuth: DashboardAuthService.DashboardAuth,
        DashboardProfile: DashboardProfileService.DashboardProfile) {

        $rootScope.$on("$locationChangeStart", function() {

            let token = DashboardProfile.token;
            if (token) {
                if (!DashboardProfile.isExpired) {
                    if (!DashboardAuth.isAuthenticated) {
                        DashboardAuth.authenticate(token);
                    }
                } else {
                    // Either show the login page or use the refresh token to get a new idToken
                    $location.path("/");
                }
            }

        });
    }

    function AppCtrl($rootScope: angular.IRootScopeService) {
        $rootScope.$on("$stateChangeError", function(e) {
            console.log(e);
        });
    }
}

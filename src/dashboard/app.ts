namespace DashboardApp {
    angular.module("dashboard",
        [
            "dashboard.constants",
            "dashboard.services.auth",
            "dashboard.layout.debug",
            "dashboard.layout.home",
            "dashboard.layout.login",
            "dashboard.layout.users",
            "dashboard.services.profile",
            "dashboard.layout.root"
        ])
        .run(dashboardAppRun);

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

        $rootScope.$on("$stateChangeError", function(e) {
            console.log(e);
        });
    }
}

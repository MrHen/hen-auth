namespace DashboardApp {
    angular.module("dashboard",
        [
            "dashboard.constants",
            "dashboard.layout.debug",
            "dashboard.layout.home",
            "dashboard.layout.login",
            "dashboard.layout.users",
            "dashboard.layout.root",
            "dashboard.services.auth",
            "dashboard.services.profile"
        ])
        .run(dashboardAppRun);

    function dashboardAppRun(
        $rootScope: angular.IRootScopeService,
        $state: angular.ui.IStateService,
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

        // ui-router redirectTo trick
        $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState) {
          if (toState.redirectTo) {
            event.preventDefault();
            $state.go(toState.redirectTo, toParams);
          }
        });

        $rootScope.$on("$stateChangeError", function(e) {
            console.log(e);
        });
    }
}

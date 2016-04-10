namespace DashboardHome {
    angular.module("dashboard.home",
        [
            "ui.router",
            "dashboard.auth",
            "dashboard.profile"
        ])
        .config(dashboardHomeConfig)
        .controller("HomeCtrl", HomeController);

    function dashboardHomeConfig($stateProvider: angular.ui.IStateProvider) {
        $stateProvider
            .state("home", {
                url: "/",
                templateUrl: "home/home.html",
                controller: "HomeCtrl",
                data: {
                    requiresLogin: true
                }
            });
    }

    interface IHomeScope extends angular.IScope {
        callApi: () => any;
        callScopedApi: () => any;
        logout: () => any;
        profile: Object;
        response: string;
    }

    function HomeController(
        $scope: IHomeScope,
        $http: angular.IHttpService,
        $location: angular.ILocationService,
        DashboardAuth: DashboardAuthService.DashboardAuth,
        DashboardProfile: DashboardProfileService.DashboardProfile) {

        $scope.profile = DashboardProfile.profile;

        $scope.callApi = function() {
            // Just call the API as you'd do using $http
            $http({
                url: "/api/secured/ping",
                method: "GET"
            }).then(function(result) {
                $scope.response = JSON.stringify(result, null, 2);
            }, function(response) {
                if (response.status === -1) {
                    alert("Please download the API seed so that you can call it.");
                } else {
                    alert(response.data);
                }
            });
        };

        $scope.callScopedApi = function() {
            // Just call the API as you'd do using $http
            $http({
                url: "/api/scoped/ping",
                method: "GET"
            }).then(function(result) {
                $scope.response = JSON.stringify(result, null, 2);
            }, function(response) {
                if (response.status === -1) {
                    alert("Please download the API seed so that you can call it.");
                } else {
                    alert(response.data);
                }
            });
        };

        $scope.logout = function() {
            DashboardAuth.signout();
            $location.path("/login");
        };
    }
}

namespace DashboardHome {
    angular.module("dashboard.home",
        [
            "ui.router",
            "dashboard.api",
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
        DashboardApi: DashboardApiService.IDashboardApi,
        DashboardAuth: DashboardAuthService.DashboardAuth,
        DashboardProfile: DashboardProfileService.DashboardProfile) {

        $scope.callApi = callApi;
        $scope.callScopedApi = callScopedApi;
        $scope.logout = DashboardAuth.signout;
        $scope.profile = DashboardProfile.profile;

        function callApi() {
            // Just call the API as you'd do using $http
            DashboardApi.callApi()
                .then(function(result) {
                    $scope.response = JSON.stringify(result, null, 2);
                })
                .catch(function(response) {
                    if (response.status === -1) {
                        alert("Please download the API seed so that you can call it.");
                    } else {
                        alert(response.data);
                    }
                });
        }

        function callScopedApi() {
            // Just call the API as you'd do using $http
            DashboardApi.callScopedApi()
                .then(function(result) {
                    $scope.response = JSON.stringify(result, null, 2);
                })
                .catch(function(response) {
                    if (response.status === -1) {
                        alert("Please download the API seed so that you can call it.");
                    } else {
                        alert(response.data);
                    }
                });
        }
    }
}

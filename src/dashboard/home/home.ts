namespace DashboardHome {
    angular.module("dashboard.home",
        [
            "auth0",
            "angular-storage",
            "ui.router"
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
        auth: auth0.angular.IAuth0Service;
        callApi: () => any;
        callScopedApi: () => any;
        logout: () => any;
        response: string;
    }

    function HomeController(
        $scope: IHomeScope,
        auth: auth0.angular.IAuth0Service,
        $http: angular.IHttpService,
        $location: angular.ILocationService,
        store: angular.a0.storage.IStoreService) {

        $scope.auth = auth;

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
            auth.signout();
            store.remove("profile");
            store.remove("token");
            $location.path("/login");
        };

    }
}

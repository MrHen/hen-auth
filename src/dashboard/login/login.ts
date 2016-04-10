namespace DashboardHome {
    angular.module("dashboard.login",
        [
            "auth0",
            "ui.router"
        ])
        .config(function myAppConfig($stateProvider) {
            $stateProvider
                .state("login", {
                    url: "/login",
                    templateUrl: "login/login.html",
                    controller: "LoginCtrl"
                });
        })
        .controller("LoginCtrl", function($scope, auth) {

            $scope.signin = function() {
                auth.signin({
                    authParams: {
                        scope: "openid name email app_metadata" // Specify the scopes you want to retrieve
                    }
                });
            };

        });
}

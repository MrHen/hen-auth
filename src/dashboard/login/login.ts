namespace DashboardLogin {
    angular.module("dashboard.login",
        [
            "auth0",
            "ui.router"
        ])
        .config(dashboardLoginConfig)
        .controller("LoginCtrl", LoginController);

    function dashboardLoginConfig($stateProvider) {
        $stateProvider
            .state("login", {
                url: "/login",
                templateUrl: "login/login.html",
                controller: "LoginCtrl"
            });
    }

    function LoginController($scope, auth) {

        $scope.signin = function() {
            auth.signin({
                authParams: {
                    scope: "openid name email app_metadata" // Specify the scopes you want to retrieve
                }
            });
        };

    }
}

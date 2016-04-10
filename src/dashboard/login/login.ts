namespace DashboardLogin {
    angular.module("dashboard.login",
        [
            "auth0",
            "ui.router"
        ])
        .config(dashboardLoginConfig)
        .controller("LoginCtrl", LoginController);

    function dashboardLoginConfig($stateProvider: angular.ui.IStateProvider) {
        $stateProvider
            .state("login", {
                url: "/login",
                templateUrl: "login/login.html",
                controller: "LoginCtrl"
            });
    }

    interface ILoginScope {
        signin: () => any;
    }

    function LoginController($scope: ILoginScope, auth: auth0.angular.IAuth0Service) {
        $scope.signin = function() {
            auth.signin(<any>{
                authParams: {
                    scope: "openid name email app_metadata" // Specify the scopes you want to retrieve
                }
            });
        };
    }
}

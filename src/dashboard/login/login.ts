namespace DashboardLogin {
    angular.module("dashboard.login",
        [
            "ui.router",
            "dashboard.auth"
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

    function LoginController($scope: ILoginScope, DashboardAuth: DashboardAuthService.DashboardAuth) {
        $scope.signin = DashboardAuth.signin;
    }
}

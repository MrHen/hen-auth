namespace DashboardLogin {
    angular.module("dashboard.layout.login",
        [
            "ui.router",
            "dashboard.services.auth",
            "dashboard.constants"
        ])
        .config(dashboardLoginConfig)
        .controller("LoginCtrl", LoginController);

    function dashboardLoginConfig($stateProvider: angular.ui.IStateProvider, CONFIG: DashboardConfig.ConfigInterface) {
        $stateProvider
            .state(CONFIG.states.login, {
                url: "/login",
                templateUrl: "layout/login/login.html",
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

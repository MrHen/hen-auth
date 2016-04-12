namespace DashboardUsers {
    angular.module("dashboard.layout.users",
        [
            "ui.router",
            "dashboard.constants",
            "dashboard.services.profile",
            "dashboard.components.codePanel"
        ])
        .config(dashboardUsersConfig)
        .controller("UsersCtrl", UsersController);

    function dashboardUsersConfig($stateProvider: angular.ui.IStateProvider, CONFIG: DashboardConfig.ConfigInterface) {
        $stateProvider
            .state(CONFIG.states.users, {
                url: "/users",
                templateUrl: "layout/users/users.html",
                controller: "UsersCtrl",
                // controllerAs: "vm",
            });
    }

    interface IUsersScope extends angular.IScope {
        users: Object[];
    }

    function UsersController(
        $scope: IUsersScope,
        DashboardApi: DashboardApiService.IDashboardApi
    ) {
        $scope.users = null;

        DashboardApi.getUsers()
            .then((users) => {
                $scope.users = users.data;
            })
            .catch((error) => {
                console.log(error);
            });
    }
}

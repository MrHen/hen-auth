namespace DashboardUsers {
    angular.module("dashboard.layout.users",
        [
            "ui.router",
            "dashboard.constants",
            "dashboard.layout.usersList"
        ])
        .config(dashboardUsersConfig);

    function dashboardUsersConfig($stateProvider: angular.ui.IStateProvider, CONFIG: DashboardConfig.ConfigInterface) {
        $stateProvider
            .state(CONFIG.states.users, <any>{
                url: "/users",
                templateUrl: "layout/users/users.html",
                redirectTo: CONFIG.states.usersList
            })
            .state(CONFIG.states.usersList, {
                url: "/list",
                templateUrl: "layout/users/usersList.html",
                controller: "UsersListCtrl",
                // controllerAs: "vm",
            });
    }
}

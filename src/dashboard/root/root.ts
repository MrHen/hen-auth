namespace DashboardRoot {
    angular.module("dashboard.root",
        [
            "ui.router",
            "dashboard.constants"
        ])
        .config(dashboardRootConfig);

    function dashboardRootConfig($stateProvider: angular.ui.IStateProvider, CONFIG: DashboardConfig.ConfigInterface) {
        $stateProvider
            .state(CONFIG.states.root, {
                abstract: true,
                templateUrl: "root/root.html",
            });
    }
}

namespace DashboardDebug {
    angular.module("dashboard.debug",
        [
            "ui.router",
            "dashboard.api",
            "dashboard.constants",
            "dashboard.profile",
            "dashboard.components.codePanel"
        ])
        .config(dashboardDebugConfig)
        .controller("DebugCtrl", DebugController);

    function dashboardDebugConfig($stateProvider: angular.ui.IStateProvider, CONFIG: DashboardConfig.ConfigInterface) {
        $stateProvider
            .state(CONFIG.states.debug, {
                url: "/debug",
                templateUrl: "debug/debug.html",
                controller: "DebugCtrl"
            });
    }

    interface IDebugScope extends angular.IScope {
        callApi: () => any;
        callScopedApi: () => any;
        profile: Object;
        response: Object;
    }

    function DebugController(
        $scope: IDebugScope,
        DashboardApi: DashboardApiService.IDashboardApi,
        DashboardProfile: DashboardProfileService.DashboardProfile) {

        $scope.callApi = callApi;
        $scope.callScopedApi = callScopedApi;
        $scope.profile = DashboardProfile.profile;

        function callApi() {
            updateResponse(DashboardApi.callApi());
        }

        function callScopedApi() {
            updateResponse(DashboardApi.callScopedApi());
        }

        function updateResponse(promise: angular.IPromise<Object>) {
            promise
                .then((response) => {
                    $scope.response = response;
                    return response;
                })
                .catch((response) => {
                    $scope.response = response;
                    return response;
                });
        }
    }
}

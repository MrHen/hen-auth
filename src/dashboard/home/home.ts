namespace DashboardHome {
    angular.module("dashboard.home",
        [
            "ui.router",
            "dashboard.api",
            "dashboard.constants",
            "dashboard.profile",
            "dashboard.components.codePanel",
            "dashboard.components.userPanel",
            "dashboard.components.profileImage"
        ])
        .config(dashboardHomeConfig)
        .controller("HomeCtrl", HomeController);

    function dashboardHomeConfig($stateProvider: angular.ui.IStateProvider, CONFIG: DashboardConfig.ConfigInterface) {
        $stateProvider
            .state(CONFIG.states.home, {
                url: "/",
                templateUrl: "home/home.html",
                controller: "HomeCtrl",
                data: {
                    requiresLogin: true
                }
            });
    }

    interface IHomeScope extends angular.IScope {
        callApi: () => any;
        callScopedApi: () => any;
        profile: Object;
        response: Object;
    }

    function HomeController(
        $scope: IHomeScope,
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

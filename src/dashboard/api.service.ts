namespace DashboardApiService {
    angular.module("dashboard.api", [])
        .factory("DashboardApi", DashboardApi);

    export interface IDashboardApi {
      callApi: () => angular.IPromise<any>;
      callScopedApi: () => angular.IPromise<any>;
    }

    function DashboardApi($http: angular.IHttpService) {
        let service = {
          callApi: callApi,
          callScopedApi: callScopedApi
        };
        return service;

        function callApi() {
            return $http({
                url: "/api/secured/ping",
                method: "GET"
            });
        }

        function callScopedApi() {
            // Just call the API as you'd do using $http
            return $http({
                url: "/api/scoped/ping",
                method: "GET"
            });
        }
    }
}

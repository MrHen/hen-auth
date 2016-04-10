angular.module('dashboard.home', [
    'auth0',
    'ui.router'
  ])
  .config(function myAppConfig($stateProvider) {
    $stateProvider
      .state('home', {
        url: "/",
        templateUrl: "home/home.html",
        controller: 'HomeCtrl',
        data: {
          requiresLogin: true
        }
      });
  })
  .controller('HomeCtrl', function HomeController($scope, auth, $http,
    $location, store) {

    $scope.auth = auth;

    $scope.callApi = function() {
      // Just call the API as you'd do using $http
      $http({
        url: '/api/secured/ping',
        method: 'GET'
      }).then(function(result) {
        $scope.response = JSON.stringify(result, null, 2);
      }, function(response) {
        if (response.status == -1) {
          alert("Please download the API seed so that you can call it.");
        } else {
          alert(response.data);
        }
      });
    };

    $scope.callScopedApi = function() {
      // Just call the API as you'd do using $http
      $http({
        url: '/api/scoped/ping',
        method: 'GET'
      }).then(function(result) {
        $scope.response = JSON.stringify(result, null, 2);
      }, function(response) {
        if (response.status == -1) {
          alert("Please download the API seed so that you can call it.");
        } else {
          alert(response.data);
        }
      });
    };

    $scope.logout = function() {
      auth.signout();
      store.remove('profile');
      store.remove('token');
      $location.path('/login');
    };

  });

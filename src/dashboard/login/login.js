angular.module('dashboard')
  .config(function myAppConfig($routeProvider) {
    $routeProvider
      .when('/login', {
        controller: 'LoginCtrl',
        templateUrl: 'login/login.html',
        pageTitle: 'Login'
      });
  })
  .controller('LoginCtrl', function($scope, auth) {

    $scope.signin = function() {
      auth.signin({
        authParams: {
          scope: 'openid name email app_metadata' // Specify the scopes you want to retrieve
        }
      });
    };

  });

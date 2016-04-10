angular.module('dashboard', [
    'dashboard.constants',
    'dashboard.auth',
    'dashboard.home',
    "dashboard.login",
    'dashboard.profile'
  ])
  .run(function($rootScope, $location, DashboardAuth, DashboardProfile) {
    $rootScope.$on('$locationChangeStart', function() {

      var token = DashboardProfile.token;
      if (token) {
        if (!DashboardProfile.isExpired) {
          if (!DashboardAuth.isAuthenticated) {
            DashboardAuth.authenticate(token);
          }
        } else {
          // Either show the login page or use the refresh token to get a new idToken
          $location.path('/');
        }
      }

    });
  })
  .controller('AppCtrl', function AppCtrl($rootScope, $scope, $location) {
    $rootScope.$on("$stateChangeError", function(e) {
      console.log(e);
    });
  });

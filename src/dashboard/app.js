angular.module('dashboard', [
    'dashboard.constants',
    'dashboard.auth',
    'dashboard.home',
    'dashboard.profile'
  ])
  .run(function($rootScope, store, $location, DashboardAuth, DashboardProfile) {
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
  .controller('AppCtrl', function AppCtrl($scope, $location) {
    $scope.$on('$routeChangeSuccess', function(e, nextRoute) {
      if (nextRoute.$$route && angular.isDefined(nextRoute.$$route.pageTitle)) {
        $scope.pageTitle = nextRoute.$$route.pageTitle +
          ' | Auth0 Dashboard';
      }
    });
  });

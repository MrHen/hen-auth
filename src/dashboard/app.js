angular.module('dashboard', [
    'dashboard.constants',
    'dashboard.auth',
    'dashboard.home',
    'angular-storage',
    'angular-jwt'
  ])
  .config(function myAppConfig($httpProvider, jwtInterceptorProvider) {
    jwtInterceptorProvider.tokenGetter = function(store) {
      return store.get('token');
    };

    // Add a simple interceptor that will fetch all requests and add the jwt token to its authorization header.
    // NOTE: in case you are calling APIs which expect a token signed with a different secret, you might
    // want to check the delegation-token example
    $httpProvider.interceptors.push('jwtInterceptor');
  })
  .run(function($rootScope, store, jwtHelper, $location, DashboardAuth) {
    $rootScope.$on('$locationChangeStart', function() {

      var token = store.get('token');
      if (token) {
        if (!jwtHelper.isTokenExpired(token)) {
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

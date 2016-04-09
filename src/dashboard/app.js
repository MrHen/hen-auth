angular.module('dashboard', [
    'auth0',
    'dashboard.home',
    'angular-storage',
    'angular-jwt'
  ])
  .constant("CONFIG", LOADED_CONFIG)
  .config(function myAppConfig(authProvider, $httpProvider, $locationProvider,
    jwtInterceptorProvider, CONFIG) {

    authProvider.init({
      domain: CONFIG.auth0.domain,
      clientID: CONFIG.auth0.clientId,
      loginUrl: '/login'
    });

    authProvider.on('loginSuccess', function($location, profilePromise,
      idToken, store) {
      console.log("Login Success");
      profilePromise.then(function(profile) {
        store.set('profile', profile);
        store.set('token', idToken);
      });
      $location.path('/');
    });

    authProvider.on('loginFailure', function() {
      alert("Error");
    });

    authProvider.on('authenticated', function($location) {
      console.log("Authenticated");
      $location.path('/');
    });

    jwtInterceptorProvider.tokenGetter = function(store) {
      return store.get('token');
    };

    // Add a simple interceptor that will fetch all requests and add the jwt token to its authorization header.
    // NOTE: in case you are calling APIs which expect a token signed with a different secret, you might
    // want to check the delegation-token example
    $httpProvider.interceptors.push('jwtInterceptor');
  })
  .run(function($rootScope, auth, store, jwtHelper, $location) {
    $rootScope.$on('$locationChangeStart', function() {

      var token = store.get('token');
      if (token) {
        if (!jwtHelper.isTokenExpired(token)) {
          if (!auth.isAuthenticated) {
            auth.authenticate(store.get('profile'), token);
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

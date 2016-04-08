angular.module('sample')
  .controller('LoginCtrl', function($scope, auth) {

    $scope.signin = function() {
      auth.signin({
        authParams: {
          scope: 'openid name email app_metadata' // Specify the scopes you want to retrieve
        }
      });
    };

  });

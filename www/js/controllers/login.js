'use strict';

/**
 * @ngdoc function
 * @name CheckmateLifeApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the CheckmateLifeApp
 */

angular.module('checkmatelife.controllers')
    .controller('LoginCtrl', ['$scope', '$rootScope', 'AuthenticationSrvc', 'ngDialog', 'AUTH_EVENTS', '$state', function($scope, $rootScope, AuthenticationSrvc, ngDialog, AUTH_EVENTS, $state) {

        $scope.performLogin = function() {
            AuthenticationSrvc.authenticate($scope.loginData)
                .then(function(response) {
                    if (response.success) {
                        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                        //$scope.setCurrentUser(username);
                        ngDialog.close();
                        $state.go('app.purpose');
                    } else {
                        ngDialog.close();
                    }
                }, function(error) {
                    ngDialog.close();
                });
        };

    }]);
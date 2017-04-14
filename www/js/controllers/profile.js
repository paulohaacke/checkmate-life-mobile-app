'use strict';

/**
 * @ngdoc function
 * @name CheckmateLifeApp.service:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Service of the CheckmateLifeApp
 */

var app = angular.module('checkmatelife.controllers');

app.controller('ProfileCtrl', ['$scope', 'UserFactory', 'AuthenticationSrvc', function($scope, UserFactory, AuthenticationSrvc) {
    $scope.user = UserFactory.query(function(response) {
        $scope.user = response[0];
    });

    $scope.deleteUser = function() {
        UserFactory.delete(function(response) {
            console.log(response);
            AuthenticationSrvc.logout();
        });
    }
}]);
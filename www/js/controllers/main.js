'use strict';

/**
 * @ngdoc function
 * @name CheckmateLifeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the CheckmateLifeApp
 */
angular.module('CheckmateLifeApp')
    .controller('MainCtrl', ['$scope', '$rootScope', '$state', 'ngDialog', 'SessionSrvc', 'AuthenticationSrvc', 'AUTH_EVENTS', '$mdSidenav', '$timeout', function($scope, $rootScope, $state, ngDialog, SessionSrvc, AuthenticationSrvc, AUTH_EVENTS, $mdSidenav, $timeout) {

        $scope.openRegistrationDialog = function() {
            ngDialog.open({
                template: 'views/register.html',
                scope: $scope,
                className: 'ngdialog-theme-default',
                controller: 'RegisterCtrl'
            });
        };

        $scope.openLoginDialog = function() {
            ngDialog.open({
                template: 'views/login.html',
                scope: $scope,
                className: 'ngdialog-theme-default',
                controller: 'LoginCtrl'
            });
        };

        $scope.performLogout = function() {
            AuthenticationSrvc.logout();
        }

        $scope.openLeftMenu = function() {
            $mdSidenav('left').toggle();
        };

        $scope.stateis = function(curstate) {
            return $state.is(curstate);
        };

        $scope.getCurrentMenuTitle = function() {
            var title = "";
            if ($scope.stateis('app.dashboard')) {
                title = "Dashboard";
            } else if ($scope.stateis('app.purpose')) {
                title = "Purpose";
            } else if ($scope.stateis('app.whoami')) {
                title = "Who Am I?";
            } else if ($scope.stateis('app.goals')) {
                title = "Goals";
            } else if ($scope.stateis('app.tasks')) {
                title = "Tasks";
            } else if ($scope.stateis('app.strategymap')) {
                title = "Strategy Map";
            }
            return title;
        };

    }]);
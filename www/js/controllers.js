var app = angular.module('checkmatelife.controllers');

app.controller('AppCtrl', function($scope, $ionicModal, $timeout, AuthenticationSrvc, $rootScope, AUTH_EVENTS, $state, $location, $ionicHistory, LoginSrvc) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.closeLogin = LoginSrvc.closeLogin;
    $scope.login = LoginSrvc.login;
    $scope.logout = LoginSrvc.logout;

    $scope.closeRegister = LoginSrvc.closeRegister;
    $scope.register = LoginSrvc.register;

});
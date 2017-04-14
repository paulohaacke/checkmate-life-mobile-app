'use strict';

/**
 * @ngdoc function
 * @name CheckmateLifeApp.service:LoginSrvc
 * @description
 * # LoginSrvc
 * Service of the CheckmateLifeApp
 */

var app = angular.module('checkmatelife.controllers');

app.service('LoginSrvc', ['AuthenticationSrvc', '$rootScope', '$ionicModal', 'AUTH_EVENTS', '$ionicHistory', '$state', '$window', function(AuthenticationSrvc, $rootScope, $ionicModal, AUTH_EVENTS, $ionicHistory, $state, $window) {

    var scope = $rootScope.$new();

    scope.loginData = {};

    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: scope,
        animation: 'slide-in-up',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function(modal) {
        scope.loginModal = modal;
    });

    scope.login = function() {
        scope.loginModal.show();
    };

    scope.closeLogin = function() {
        //scope.loginModal.hide();
    };

    scope.logout = function() {
        AuthenticationSrvc.logout();
    }

    scope.doLogin = function() {
        AuthenticationSrvc.authenticate(scope.loginData)
            .then(function(response) {
                    if (response.success) {
                        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                        //$scope.setCurrentUser(username);
                        scope.closeLogin();
                        //$ionicHistory.nextViewOptions({
                        //    historyRoot: true
                        //});
                        //$ionicHistory.clearHistory();//.then(function() {
                        //$state.reload();
                        //$state.go('app.dashboard', {}, { reload: true });
                        //});
                        $window.location.reload(true);
                    } else {
                        scope.closeLogin();
                    }
                },
                function(error) {
                    scope.closeLogin();
                });
    };

    // Form data for the login modal
    scope.registrationData = {};

    $ionicModal.fromTemplateUrl('templates/register.html', {
        scope: scope
    }).then(function(modal) {
        scope.registerModal = modal;
    });

    scope.closeRegister = function() {
        scope.registerModal.hide();
    };

    scope.register = function() {
        scope.registerModal.show();
    };

    scope.doRegister = function() {
        AuthenticationSrvc.createAccount(scope.registrationData)
            .then(function(response) {
                AuthenticationSrvc.authenticate(scope.registrationData)
                    .then(function(response) {
                        if (response.success) {
                            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                            scope.closeRegister();
                            $window.location.reload(true);
                        } else {
                            scope.closeRegister();
                        }
                    }, function(error) {
                        scope.closeRegister();
                    });
            }, function(error) {
                scope.closeRegister();
            });
    };


    this.login = scope.login;
    this.logout = scope.logout;
    this.closeLogin = scope.closeLogin;

    this.register = scope.register;
    this.closeRegister = scope.closeRegister;
}]);
'use strict';

/**
 * @ngdoc function
 * @name CheckmateLifeApp.service:AuthenticationSrvc
 * @description
 * # AuthenticationSrvc
 * Service of the CheckmateLifeApp
 */

var app = angular.module('checkmatelife.services');

app.constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
})

app.constant('USER_ROLES', {
    all: '*',
    admin: 'admin',
    normal: 'normal',
    guest: 'guest'
})

app.service('AuthenticationSrvc', ['$localStorage', 'baseURL', 'USER_ROLES', 'SessionSrvc', '$q', '$timeout', '$resource', '$rootScope', 'AUTH_EVENTS', function($localStorage, baseURL, USER_ROLES, SessionSrvc, $q, $timeout, $resource, $rootScope, AUTH_EVENTS) {

    var TOKEN_KEY = 'Token';

    this.loadUserSession = function() {
        var session = $localStorage.getObject(TOKEN_KEY, '{}');
        if (session.id != undefined) {
            SessionSrvc.create(session);
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
        }
    }

    this.createAccount = function(account) {
        return $resource(baseURL + "users/register").save(account).$promise;
    };

    this.authenticate = function(credentials) {
        var defer = $q.defer();
        $resource(baseURL + "users/login").save(credentials)
            .$promise.then(function(response) {
                if (response.success) {
                    SessionSrvc.create({
                        id: response.token,
                        userId: credentials.username,
                        userRole: USER_ROLES.normal
                    });
                    $localStorage.storeObject(TOKEN_KEY, SessionSrvc);
                }
                defer.resolve(response);
            }, function(error) {
                defer.reject(error);
            });
        return defer.promise;
    };

    this.isAuthenticated = function() {
        return !!SessionSrvc.userId;
    };

    this.isAuthorized = function(authorizedRoles) {
        if (!angular.isArray(authorizedRoles)) {
            authorizedRoles = [authorizedRoles];
        };
        return ((this.isAuthenticated() && authorizedRoles.indexOf(SessionSrvc.userRole) !== -1) ||
            (authorizedRoles.indexOf(USER_ROLES.guest) !== -1));
    }

    this.logout = function() {
        $resource(baseURL + "users/logout").get(function(response) {
            SessionSrvc.destroy();
            $localStorage.remove(TOKEN_KEY);
            $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
        })
    }

}]);
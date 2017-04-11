'use strict';

/**
 * @ngdoc function
 * @name CheckmateLifeApp.service:SessionSrvc
 * @description
 * # SessionSrvc
 * Service of the CheckmateLifeApp
 */

var app = angular.module('checkmatelife.services');

app.service('SessionSrvc', ['$http', function($http) {

    this.create = function(session) {
        this.id = session.id;
        this.userId = session.userId;
        this.userRole = session.userRole;
        $http.defaults.headers.common['x-access-token'] = this.id;
    };

    this.destroy = function() {
        this.id = null;
        this.userId = null;
        this.userRole = null;
        $http.defaults.headers.common['x-access-token'] = this.id;
    };

}]);
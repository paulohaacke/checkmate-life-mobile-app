'use strict';

/**
 * @ngdoc function
 * @name CheckmateLifeApp.service:$localStorage
 * @description
 * # $localStorage
 * Service of the CheckmateLifeApp
 */

var app = angular.module('checkmatelife.services');

app.service('$localStorage', ['$window', function($window) {
    this.store = function(key, value) {
        $window.localStorage[key] = value;
    };
    this.get = function(key, defaultValue) {
        return $window.localStorage[key] || defaultValue;
    };
    this.remove = function(key) {
        $window.localStorage.removeItem(key);
    };
    this.storeObject = function(key, value) {
        $window.localStorage[key] = JSON.stringify(value);
    };
    this.getObject = function(key, defaultValue) {
        return JSON.parse($window.localStorage[key] || defaultValue);
    };
}])
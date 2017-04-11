'use strict';

/**
 * @ngdoc function
 * @name CheckmateLifeApp.controller:GoalsFactory
 * @description
 * # GoalsFactory
 * Factory of the CheckmateLifeApp
 */

var app = angular.module('checkmatelife.controllers');

app.constant('METRIC_TYPE', {
    tasks: "Number of completed tasks."
})

app.factory('GoalsFactory', ['$resource', 'baseURL', function($resource, baseURL) {

    return $resource(baseURL + "goals/:id", null, {
        'update': {
            method: 'PUT'
        }
    });

}]);
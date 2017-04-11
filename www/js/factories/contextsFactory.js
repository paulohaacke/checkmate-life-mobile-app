'use strict';

/**
 * @ngdoc function
 * @name CheckmateLifeApp.controller:ContextsFactory
 * @description
 * # ContextsFactory
 * Factory of the CheckmateLifeApp
 */

angular.module('checkmatelife.controllers')
    .factory('ContextsFactory', ['$resource', 'baseURL', function($resource, baseURL) {

        return $resource(baseURL + "contexts/:id", null, {
            'update': {
                method: 'PUT'
            }
        });

    }])
    .factory('FactsFactory', ['$resource', 'baseURL', function($resource, baseURL) {

        return $resource(baseURL + "contexts/:contextId/facts/:id", null, {
            'update': {
                method: 'PUT'
            }
        });

    }]);
'use strict';

/**
 * @ngdoc function
 * @name CheckmateLifeApp.controller:PurposeFactory
 * @description
 * # PurposeFactory
 * Factory of the CheckmateLifeApp
 */

angular.module('checkmatelife.controllers')
    .factory('PurposeFactory', ['$resource', 'baseURL', function($resource, baseURL) {

        return $resource(baseURL + "purpose/:id", null, {
            'update': {
                method: 'PUT'
            }
        });

    }])
    .factory('ValuesFactory', ['$resource', 'baseURL', function($resource, baseURL) {

        return $resource(baseURL + "purpose/:purposeId/values/:id", null, {
            'update': {
                method: 'PUT'
            }
        });

    }]);
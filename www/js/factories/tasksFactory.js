'use strict';

/**
 * @ngdoc function
 * @name CheckmateLifeApp.controller:TasksFactory
 * @description
 * # TasksFactory
 * Factory of the CheckmateLifeApp
 */

var app = angular.module('checkmatelife.controllers');

app.constant('TASK_STATES', {
    todo: 'todo',
    doing: 'doing',
    done: 'done',
    archive: 'archive'
});


app.factory('TasksFactory', ['TASK_STATES', '$resource', 'baseURL', function(TASK_STATES, $resource, baseURL) {

    return $resource(baseURL + "tasks/:id", null, {
        'update': {
            method: 'PUT'
        }
    });

}])
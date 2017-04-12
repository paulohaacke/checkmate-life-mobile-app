'use strict';

/**
 * @ngdoc function
 * @name CheckmateLifeApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the CheckmateLifeApp
 */

angular.module('checkmatelife.controllers')
    .controller('DashboardCtrl', ['$scope', 'TasksFactory', 'tasks', 'goals', 'lifeAreas', 'TASK_STATES', 'METRIC_TYPE', function($scope, TasksFactory, tasks, goals, lifeAreas, TASK_STATES, METRIC_TYPE) {
        $scope.lifeAreas = lifeAreas;
        $scope.tasks = tasks;
        $scope.goals = goals;

        $scope.filterMetrics = function(lifeAreaId) {
            return function(item) {
                return item.lifeArea == lifeAreaId && item.metrics.length > 0;
            }
        }

        $scope.getMetricStatus = function(goal, metric) {
            var numOfTasks = 0;
            if (metric.description === METRIC_TYPE.tasks) {
                angular.forEach($scope.tasks, function(task) {
                    numOfTasks += task.goal == goal._id && (task.state == TASK_STATES.done || task.state == TASK_STATES.archive) ? 1 : 0;
                });
                return numOfTasks;
            }
            return 0;
        }

        $scope.getMetricStatusForArea = function(area) {
            var numOfTasks = 0;
            angular.forEach($scope.goals, function(goal) {
                numOfTasks += goal.lifeArea == area._id && goal.metrics.length > 0 ? $scope.getMetricStatus(goal, goal.metrics[0]) : 0;
            });
            return numOfTasks;
        }
    }]);
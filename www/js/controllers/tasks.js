'use strict';

/**
 * @ngdoc function
 * @name CheckmateLifeApp.controller:TasksCtrl
 * @description
 * # TasksCtrl
 * Controller of the CheckmateLifeApp
 */

angular.module('checkmatelife.controllers')
    .controller('TasksCtrl', ['$scope', '$q', 'TasksFactory', 'tasks', 'goals', 'lifeAreas', 'TASK_STATES', function($scope, $q, TasksFactory, tasks, goals, lifeAreas, TASK_STATES) {
        $scope.lifeAreas = lifeAreas;
        $scope.tasks = tasks;
        $scope.goals = goals;

        $scope.curTab = TASK_STATES.todo;

        $scope.isSelected = function(taskState) {
            return $scope.curTab == taskState;
        }

        $scope.select = function(taskState) {
            $scope.curTab = taskState;
        }

        $scope.getLifeAreaFromGoal = function(goalId) {
            var goal = $scope.goals.find(function(el) { return goalId == el._id; });
            if (goal != undefined) {
                return $scope.lifeAreas.find(function(el) { return goal.lifeArea == el._id; });
            }
            return { 'color-bg': "white" };
        };

        $scope.changeTaskState = function(taskId, state) {
            TasksFactory.update({ id: taskId }, { state: state }, function(response) {
                $scope.tasks.find(function(el) { return taskId == el._id; }).state = response.state;
            });

        }

        $scope.openAddTaskDialog = function() {
            /*ngDialog.open({
                template: 'views/add-task.html',
                scope: $scope,
                data: { tasks: $scope.tasks },
                className: 'ngdialog-theme-default',
                controller: 'AddTaskCtrl'
            });*/
        }

        $scope.openEditTaskDialog = function(task) {
            /*ngDialog.open({
                template: 'views/add-task.html',
                scope: $scope,
                data: { task: task },
                className: 'ngdialog-theme-default',
                controller: 'AddTaskCtrl'
            });*/
        }

        $scope.rmTask = function(task) {
            TasksFactory.delete({ id: task._id },
                function(response) {
                    $scope.tasks.splice($scope.tasks.indexOf(task), 1);
                });
            //ngDialog.close();
        }

    }])
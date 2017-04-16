'use strict';

/**
 * @ngdoc function
 * @name CheckmateLifeApp.controller:TasksCtrl
 * @description
 * # TasksCtrl
 * Controller of the CheckmateLifeApp
 */

angular.module('checkmatelife.controllers')
    .controller('TasksCtrl', ['$scope', '$q', '$ionicPopup', '$ionicListDelegate', 'TasksFactory', 'tasks', 'goals', 'lifeAreas', 'TASK_STATES', function($scope, $q, $ionicPopup, $ionicListDelegate, TasksFactory, tasks, goals, lifeAreas, TASK_STATES) {
        $scope.lifeAreas = lifeAreas;
        $scope.tasks = tasks;
        $scope.goals = goals;
        $scope.shouldShowDelete = false;

        $scope.curTab = TASK_STATES.todo;

        $scope.toggleDelete = function() {
            $scope.shouldShowDelete = !$scope.shouldShowDelete;
        }

        $scope.isSelected = function(taskState) {
            return $scope.curTab == taskState;
        }

        $scope.select = function(taskState) {
            $scope.shouldShowDelete = false;
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
            $scope.shouldShowDelete = false;
            $ionicListDelegate.closeOptionButtons();
            $scope.taskData = {};

            var addTaskPopup = $ionicPopup.show({
                templateUrl: 'templates/form-task.html',
                title: 'Add Task',
                //subTitle: '',
                scope: $scope,
                buttons: [{
                        text: 'Cancel',
                    },
                    {
                        text: 'Add',
                        onTap: function(e) {
                            if (!$scope.taskData.description) {
                                e.preventDefault();
                            } else {
                                return $scope.taskData;
                            }
                        }
                    }
                ]
            });

            addTaskPopup.then(function(taskData) {
                if (taskData !== undefined)
                    $scope.addTask(taskData);
                $ionicListDelegate.closeOptionButtons();
            });
        }

        $scope.openEditTaskDialog = function(task) {
            $scope.taskData = {};
            $scope.taskData.description = task.description;
            $scope.taskData.goal = task.goal;

            var editTaskPopup = $ionicPopup.show({
                templateUrl: 'templates/form-task.html',
                title: 'Edit Task',
                //subTitle: '',
                scope: $scope,
                buttons: [{
                        text: 'Cancel'
                    },
                    {
                        text: 'Save',
                        onTap: function(e) {
                            if (!$scope.taskData.description) {
                                e.preventDefault();
                            } else {
                                return $scope.taskData;
                            }
                        }
                    }
                ]
            });

            editTaskPopup.then(function(taskData) {
                if (taskData !== undefined) {
                    $scope.updateTask(task, taskData);
                }
                $ionicListDelegate.closeOptionButtons();
            });
        }

        $scope.rmTask = function(task) {
            TasksFactory.delete({ id: task._id },
                function(response) {
                    $scope.tasks.splice($scope.tasks.indexOf(task), 1);
                });
            $ionicListDelegate.closeOptionButtons();
        }

        $scope.addTask = function(sendData) {
            TasksFactory.save(sendData,
                function(response) {
                    $scope.tasks.push(response);
                });
        }

        $scope.updateTask = function(task, sendData) {
            TasksFactory.update({ id: task._id }, sendData,
                function(response) {
                    task.description = response.description;
                    task.goal = response.goal;
                    task.state = response.state;
                });
        }

    }])
'use strict';

/**
 * @ngdoc function
 * @name CheckmateLifeApp.controller:GoalsCtrl
 * @description
 * # GoalsCtrl
 * Controller of the CheckmateLifeApp
 */

angular.module('checkmatelife')
    .controller('GoalsCtrl', ['$scope', '$ionicListDelegate', 'LifeAreaFactory', 'GoalsFactory', 'METRIC_TYPE', '$ionicSlideBoxDelegate', '$ionicPopup', '$rootScope', '$ionicModal', '$ionicHistory', function($scope, $ionicListDelegate, LifeAreaFactory, GoalsFactory, METRIC_TYPE, $ionicSlideBoxDelegate, $ionicPopup, $rootScope, $ionicModal, $ionicHistory) {

        $scope.metricTypes = [METRIC_TYPE.tasks];
        $scope.lifeAreas = LifeAreaFactory.query();
        $scope.goals = GoalsFactory.query();
        $scope.shouldShowDelete = false;

        $scope.toggleDelete = function() {
            $scope.shouldShowDelete = !$scope.shouldShowDelete;
        }

        $scope.options = {
            loop: false,
            effect: 'slide',
            //speed: 500,
            //direction: 'horizontal',
            //paginationType: 'fraction',
            //paginationHide: false,
            noSwiping: true,
            noSwipingClass: 'do_not_swipe'
        }

        $scope.getCurrentLifeAreaId = function() {
            return $scope.slider.slides[$scope.slider.activeIndex].id;
        }

        $scope.$on("$ionicSlides.sliderInitialized", function(event, data) {
            $scope.slider = data.slider;
        });

        $scope.openAddGoalDialog = function(lifeAreaId) {
            var scope = $rootScope.$new();

            scope.metricTypes = $scope.metricTypes;
            scope.goals = $scope.goals;
            scope.goalData = {};

            $ionicModal.fromTemplateUrl('templates/form-goal.html', {
                scope: scope,
            }).then(function(modal) {
                modal.show();
                scope.closeDialog = function() {
                    modal.hide();
                    $ionicListDelegate.closeOptionButtons();
                };
                scope.saveGoal = function(goalData) {
                    var sendData = goalData;
                    sendData.metrics = sendData.metrics === scope.metricTypes[0] ? [{ description: sendData.metrics }] : [];
                    sendData.dependencies = goalData.dependencies === undefined ? [] : Object.keys(goalData.dependencies).filter(function(key) {
                        return (goalData.dependencies[key] === true);
                    }, {});
                    sendData.lifeArea = lifeAreaId;
                    $scope.addGoal(sendData);
                    scope.closeDialog();
                    scope.$destroy();
                };
            });
        }

        $scope.openEditGoalDialog = function(lifeAreaId, goal) {
            var scope = $rootScope.$new();

            scope.metricTypes = $scope.metricTypes;
            scope.goals = $scope.goals;
            scope.goalData = {};
            scope.goalData.description = goal.description;
            scope.goalData.metrics = goal.metrics.length > 0 ? goal.metrics[0].description : "";
            scope.goalData.dependencies = goal.dependencies.reduce(function(deps, curDep) {
                deps[curDep] = true;
                return deps;
            }, {});

            $ionicModal.fromTemplateUrl('templates/form-goal.html', {
                scope: scope,
            }).then(function(modal) {
                modal.show();
                scope.closeDialog = function() {
                    modal.hide();
                    $ionicListDelegate.closeOptionButtons();
                };
                scope.saveGoal = function(goalData) {
                    var sendData = goalData;
                    sendData.metrics = sendData.metrics === scope.metricTypes[0] ? [{ description: sendData.metrics }] : [];
                    sendData.dependencies = goalData.dependencies === undefined ? [] : Object.keys(goalData.dependencies).filter(function(key) {
                        return (goalData.dependencies[key] === true);
                    }, {});
                    $scope.updateGoal(goal, sendData);
                    scope.closeDialog();
                    scope.$destroy();
                };
            });
        }

        $scope.rmGoal = function(goal) {
            GoalsFactory.delete({ id: goal._id },
                function(response) {
                    $scope.goals.splice($scope.goals.indexOf(goal), 1);
                    $ionicHistory.clearCache();
                });
        }

        $scope.updateGoal = function(goal, sendData) {
            GoalsFactory.update({ id: goal._id }, sendData,
                function(response) {
                    goal.description = response.description;
                    goal.metrics = response.metrics;
                    goal.dependencies = response.dependencies;
                    $ionicHistory.clearCache();
                });
        }

        $scope.addGoal = function(sendData) {
            GoalsFactory.save(sendData,
                function(response) {
                    $scope.goals.push(response);
                    $ionicHistory.clearCache();
                });
        }

    }]);
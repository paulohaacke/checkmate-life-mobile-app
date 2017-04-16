'use strict';

/**
 * @ngdoc function
 * @name CheckmateLifeApp.controller:ContextsCtrl
 * @description
 * # ContextsCtrl
 * Controller of the CheckmateLifeApp
 */

angular.module('checkmatelife.controllers')
    .controller('ContextsCtrl', ['$scope', '$state', '$ionicPopup', '$ionicListDelegate', 'ContextsFactory', 'FactsFactory', function($scope, $state, $ionicPopup, $ionicListDelegate, ContextsFactory, FactsFactory) {

        $scope.contexts = ContextsFactory.query();
        $scope.shouldShowDelete = [];

        $scope.toggleDelete = function(index) {
            $scope.shouldShowDelete[index] = !$scope.shouldShowDelete[index];
        }

        $scope.openAddFactDialog = function(context) {
            $scope.factData = {};

            var addFactPopup = $ionicPopup.show({
                templateUrl: 'templates/form-whoami.html',
                title: 'Add ' + context.name,
                //subTitle: '',
                scope: $scope,
                buttons: [{
                        text: 'Cancel',
                    },
                    {
                        text: 'Add',
                        onTap: function(e) {
                            return $scope.factData;
                        }
                    }
                ]
            });

            addFactPopup.then(function(factData) {
                if (factData !== undefined)
                    $scope.addFact(context, factData);
                $ionicListDelegate.closeOptionButtons();
            });
        }

        $scope.openEditFactDialog = function(contextId, fact) {
            $scope.factData = {};
            $scope.factData.description = fact.description;

            var editFactPopup = $ionicPopup.show({
                templateUrl: 'templates/form-whoami.html',
                title: 'Edit Fact',
                //subTitle: '',
                scope: $scope,
                buttons: [{
                        text: 'Cancel',
                    },
                    {
                        text: 'Save',
                        onTap: function(e) {
                            return $scope.factData;
                        }
                    }
                ]
            });

            editFactPopup.then(function(factData) {
                if (factData !== undefined)
                    $scope.saveFact(contextId, fact, factData.description);
                $ionicListDelegate.closeOptionButtons();
            });
        }

        $scope.addFact = function(context, fact) {
            FactsFactory.save({
                    contextId: context._id
                }, {
                    description: fact.description
                },
                function(response) {
                    context.facts.push(response);
                },
                function(error) {});
        }

        $scope.rmFact = function(context, value) {
            FactsFactory.delete({ contextId: context._id, id: value._id },
                function(response) {
                    context.facts.splice(context.facts.indexOf(value), 1);
                });
        }

        $scope.saveFact = function(contextId, fact, description) {
            FactsFactory.save({
                contextId: contextId,
                id: fact._id
            }, {
                description: description
            }, function(response) {
                fact.description = description;
            }, function(error) {});
        }

    }]);
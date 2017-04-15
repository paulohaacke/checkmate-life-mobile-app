'use strict';

/**
 * @ngdoc function
 * @name CheckmateLifeApp.controller:PurposeCtrl
 * @description
 * # PurposeCtrl
 * Controller of the CheckmateLifeApp
 */

angular.module('checkmatelife.controllers')
    .controller('PurposeCtrl', ['$scope', '$ionicListDelegate', '$ionicPopup', 'PurposeFactory', 'ValuesFactory', function($scope, $ionicListDelegate, $ionicPopup, PurposeFactory, ValuesFactory) {
        $scope.shouldShowDelete = false;

        $scope.purpose = PurposeFactory.query(function(purposes) {
            if (purposes.length == 0) {
                PurposeFactory.save({});
            }
            $scope.purpose = purposes[0];
        });

        $scope.toggleDelete = function() {
            $scope.shouldShowDelete = !$scope.shouldShowDelete;
        }

        $scope.openAddValueDialog = function() {
            $scope.valueData = {};

            var addValuePopup = $ionicPopup.show({
                templateUrl: 'templates/form-value.html',
                title: 'Add Value',
                //subTitle: '',
                scope: $scope,
                buttons: [{
                        text: 'Cancel',
                    },
                    {
                        text: 'Add',
                        onTap: function(e) {
                            if (!$scope.valueData.content) {
                                e.preventDefault();
                            } else {
                                return $scope.valueData;
                            }
                        }
                    }
                ]
            });

            addValuePopup.then(function(valueData) {
                if (valueData !== undefined)
                    $scope.addValue($scope.purpose, valueData);
                $ionicListDelegate.closeOptionButtons();
            });
        }

        $scope.openEditValueDialog = function(value) {
            $scope.valueData = {};
            $scope.valueData.content = value.content;

            var editValuePopup = $ionicPopup.show({
                templateUrl: 'templates/form-value.html',
                title: 'Edit Value',
                //subTitle: '',
                scope: $scope,
                buttons: [{
                        text: 'Cancel',
                    },
                    {
                        text: 'Save',
                        onTap: function(e) {
                            if (!$scope.valueData.content) {
                                e.preventDefault();
                            } else {
                                return $scope.valueData;
                            }
                        }
                    }
                ]
            });

            editValuePopup.then(function(valueData) {
                if (valueData !== undefined)
                    $scope.saveValueContent($scope.purpose._id, value, valueData.content);
                $ionicListDelegate.closeOptionButtons();
            });
        }

        $scope.openEditMissionDialog = function(mission) {
            $scope.missionData = {};
            $scope.missionData.text = mission;

            var editMissionPopup = $ionicPopup.show({
                templateUrl: 'templates/form-mission.html',
                title: 'Edit Mission',
                //subTitle: '',
                scope: $scope,
                buttons: [{
                        text: 'Cancel',
                    },
                    {
                        text: 'Save',
                        onTap: function(e) {
                            return $scope.missionData;
                        }
                    }
                ]
            });

            editMissionPopup.then(function(missionData) {
                if (missionData !== undefined)
                    $scope.saveMission($scope.purpose, missionData.text);
                $ionicListDelegate.closeOptionButtons();
            });
        }

        $scope.openEditVisionDialog = function(vision) {
            $scope.visionData = {};
            $scope.visionData.text = vision;

            var editVisionPopup = $ionicPopup.show({
                templateUrl: 'templates/form-vision.html',
                title: 'Edit Vision',
                //subTitle: '',
                scope: $scope,
                buttons: [{
                        text: 'Cancel',
                    },
                    {
                        text: 'Save',
                        onTap: function(e) {
                            return $scope.visionData;
                        }
                    }
                ]
            });

            editVisionPopup.then(function(visionData) {
                if (visionData !== undefined)
                    $scope.saveVision($scope.purpose, visionData.text);
                $ionicListDelegate.closeOptionButtons();
            });
        }

        $scope.addValue = function(purpose, value) {
            ValuesFactory.save({
                    purposeId: purpose._id
                }, {
                    content: value.content
                },
                function(response) {
                    purpose.values.push(response);
                },
                function(error) {

                });
        }

        $scope.rmValue = function(purposeId, value) {
            ValuesFactory.delete({
                    purposeId: purposeId,
                    id: value._id
                },
                function(response) {
                    $scope.purpose.values.splice($scope.purpose.values.indexOf(value), 1);
                });
            $ionicListDelegate.closeOptionButtons();
        }

        $scope.saveValueContent = function(purposeId, value, content) {
            ValuesFactory.save({
                purposeId: purposeId,
                id: value._id
            }, {
                content: content
            }, function(response) {
                value.content = content;
            }, function(error) {});
        }

        $scope.saveMission = function(purpose, mission) {
            PurposeFactory.update({
                id: purpose._id
            }, {
                mission: mission
            }, function(response) {
                purpose.mission = response.mission;
            }, function(error) {});
        }

        $scope.saveVision = function(purpose, vision) {
            PurposeFactory.update({
                id: purpose._id
            }, {
                vision: vision
            }, function(response) {
                purpose.vision = response.vision;
            }, function(error) {});
        }
    }]);
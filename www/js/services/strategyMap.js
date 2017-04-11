'use strict';

/**
 * @ngdoc function
 * @name CheckmateLifeApp.service:StrategyMapSrvc
 * @description
 * # StrategyMapSrvc
 * Service of the CheckmateLifeApp
 */

var app = angular.module('checkmatelife.services');

app.service('StrategyMapSrvc', ['$filter', function($filter) {

    var nodes = [];
    var edges = [];
    var styles = [];

    this.addLifeArea = function(id, label, color, colorBg) {
        nodes.push({ data: { id: id, label: label }, classes: 'goal-life-area-box' });
        nodes.push({ data: { id: 'left' + id, label: "", parent: id }, classes: 'position-node' });
        nodes.push({ data: { id: 'right' + id, label: "", parent: id }, classes: 'position-node' });
        styles.push({
            selector: '$node.goal-life-area-box#' + id,
            css: {
                'background-color': color,
                'color': color
            }
        }, {
            selector: '.goal-life-area-box#' + id + ' > node',
            css: {
                'background-color': colorBg,
                'color': color
            }
        });
    }

    this.addGoal = function(id, label, dependencies, lifeAreaId, lifeAreas, goals) {
        nodes.push({ data: { id: lifeAreaId + '.' + id, label: label, parent: lifeAreaId }, selectable: false });
        angular.forEach(dependencies, function(dependencyId) {
            var depLifeAreaId = goals.find(function(el) { return dependencyId == el._id }).lifeArea;
            var sourceId = depLifeAreaId + '.' + dependencyId;
            var targetId = lifeAreaId + '.' + id;
            var edgeId = sourceId + '->' + targetId;
            edges.push({ id: edgeId, data: { source: sourceId, target: targetId } });
            var depLifeArea = lifeAreas.find(function(el) { return depLifeAreaId == el._id; });
            styles.push({
                selector: 'edge[source="' + sourceId + '"]',
                css: {
                    'line-color': depLifeArea['color-bg'],
                    'target-arrow-color': depLifeArea['color-bg']
                }
            });
        })
    }

    var sumDic = function(obj, limitKey) {
        var sum = 0;
        for (var el in obj) {
            if (el == limitKey) break;
            if (obj.hasOwnProperty(el)) {
                sum += parseFloat(obj[el]);
            }
        }
        return sum;
    }

    this.create = function(lifeAreas, goals) {

        nodes = [];
        edges = [];

        styles = [{
                selector: 'node',
                css: {
                    'content': 'data(label)',
                    'text-valign': 'center',
                    'text-halign': 'center',
                    'background-color': 'green',
                    'width': 'label',
                    'height': 'label',
                    'padding': '15px',
                    'shape': 'ellipse',
                    'compound-sizing-wrt-labels': 'include',
                    'text-wrap': 'wrap',
                    'text-max-width': '150'
                }
            },
            {
                selector: '$node > node',
                css: {
                    'text-valign': 'top',
                    'text-halign': 'center'
                }
            },
            {
                selector: 'edge',
                css: {
                    'target-arrow-shape': 'vee',
                    'curve-style': 'bezier',
                    'width': '3px',
                    'opacity': '1'
                }
            },
            {
                selector: ':selected',
                css: {
                    'background-color': 'black',
                    'line-color': 'black',
                    'target-arrow-color': 'black',
                    'source-arrow-color': 'black'
                }
            },
            {
                selector: '$node.goal-life-area-box',
                css: {
                    'font-size': '20px',
                    'text-rotation': '0deg',
                    'text-halign': 'left',
                    'text-valign': 'center',
                    'text-margin-x': '-5px'
                }
            },
            {
                selector: '.goal-life-area-box > node',
                css: {
                    'font-size': '15px',
                    'background-opacity': '0.85',
                }
            },
            {
                selector: '$node.position-node',
                css: {
                    'visibility': 'hidden'
                }
            }
        ]

        angular.forEach(lifeAreas, function(area) {
            this.addLifeArea(area._id, area.label, area.color, area['color-bg']);
            angular.forEach($filter('filter')(goals, { lifeArea: area._id }), function(goal) {
                this.addGoal(goal._id, goal.description, goal.dependencies, goal.lifeArea, lifeAreas, goals);
            }, this);
        }, this);



        var contHeight = document.getElementById('cy').offsetHeight;
        var contWidth = document.getElementById('cy').offsetWidth;
        var areaWidth = {};
        var areaHeight = {};
        var totalHeight = 0;
        var cy = cytoscape({
            container: document.getElementById('cy'),

            autounselectify: true,
            userZoomingEnabled: false,
            userPanningEnabled: false,
            boxSelectionEnabled: false,

            style: styles,

            elements: {
                nodes: nodes,
                edges: edges
            },

            layout: {
                name: 'preset',

                positions: function(node) {
                    var nodeWidth = node.outerWidth();
                    var nodeHeight = node.outerHeight() + 140;
                    //alert('Area: ' + areaId + ' Goal: ' + goalId);
                    if (node.id().startsWith("left")) {
                        var areaId = node.id().substring(4);
                        return { x: ((nodeWidth / 2) + 150), y: sumDic(areaHeight, areaId) / 2 }
                    } else if (node.id().startsWith("right")) {
                        var areaId = node.id().substring(4);
                        return { x: 800, y: sumDic(areaHeight, areaId) / 2 }
                    } else if (node.parent().id() !== undefined) {
                        //alert(node.parent().id() + ': ' + node.parent().height());
                        var id = node.id().split('.');
                        var goalId = id[1];
                        var areaId = id[0];
                        areaWidth[areaId] = (typeof areaWidth[areaId] === 'undefined') ? ((nodeWidth / 2) + 150) : 5 + areaWidth[areaId] + nodeWidth / 2;
                        areaHeight[areaId] = (typeof nodeHeight[areaId] === 'undefined') ? nodeHeight : (areaHeight[areaId] > nodeHeight ? areaHeight[areaId] : nodeHeight);
                        var pos = { x: areaWidth[areaId], y: sumDic(areaHeight, areaId) / 2 };
                        areaWidth[areaId] = areaWidth[areaId] + nodeWidth / 2;
                        return pos;
                    }
                    return undefined;

                }, // map of (node id) => (position obj); or function(node){ return somPos; }
                zoom: undefined, // the zoom level to set (prob want fit = false if set)
                pan: undefined, // the pan level to set (prob want fit = false if set)
                fit: true, // whether to fit to viewport
                padding: 30, // padding on fit
                animate: true, // whether to transition the node positions
                animationDuration: 1000, // duration of animation in ms if enabled
                animationEasing: undefined, // easing of animation if enabled
                ready: undefined, // callback on layoutready
                stop: undefined // callback on layoutstop
            }
        });
    }
}]);
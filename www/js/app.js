// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('checkmatelife', ['ionic', 'checkmatelife.controllers', 'checkmatelife.services'])

.run(function($ionicPlatform, $rootScope, AUTH_EVENTS, AuthenticationSrvc, SessionSrvc) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });

    $rootScope.$on('$stateChangeStart', function(event, next) {
        AuthenticationSrvc.loadUserSession();
        if (next.data) {
            var authorizedRoles = next.data.authorizedRoles;
            if (!AuthenticationSrvc.isAuthorized(authorizedRoles)) {
                event.preventDefault();
                if (AuthenticationSrvc.isAuthenticated()) {
                    // user is not allowed
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                } else {
                    // user is not logged in
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                }
            };
        };
    });

    $rootScope.$on(AUTH_EVENTS.logoutSuccess, function() {
        $rootScope.isAuthenticated = AuthenticationSrvc.isAuthenticated();
        $rootScope.username = SessionSrvc.userId;
    });

    $rootScope.$on(AUTH_EVENTS.loginSuccess, function() {
        $rootScope.isAuthenticated = AuthenticationSrvc.isAuthenticated();
        $rootScope.username = SessionSrvc.userId;
    });
})

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

        .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })

    .state('app.dashboard', {
        url: '/dashboard',
        views: {
            'menuContent': {
                templateUrl: 'templates/dashboard.html',
                controller: 'DashboardCtrl',
                resolve: {
                    tasks: ['TasksFactory', function(TasksFactory) {
                        return TasksFactory.query();
                    }],
                    goals: ['GoalsFactory', function(GoalsFactory) {
                        return GoalsFactory.query();
                    }],
                    lifeAreas: ['LifeAreaFactory', function(LifeAreaFactory) {
                        return LifeAreaFactory.query();
                    }]
                }
            }
        }
    })

    .state('app.goals', {
            url: '/goals',
            views: {
                'menuContent': {
                    templateUrl: 'templates/goals.html'
                }
            }
        })
        .state('app.purpose', {
            url: '/purpose',
            views: {
                'menuContent': {
                    templateUrl: 'templates/purpose.html'
                }
            }
        })

    .state('app.tasks', {
        url: '/tasks',
        views: {
            'menuContent': {
                templateUrl: 'templates/tasks.html',
                controller: 'TasksCtrl',
                resolve: {
                    tasks: function(TasksFactory) { return TasksFactory.query(); },
                    goals: function(GoalsFactory) { return GoalsFactory.query(); },
                    lifeAreas: function(LifeAreaFactory) { return LifeAreaFactory.query() }
                }
            }
        }
    });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/dashboard');
});

angular.module('checkmatelife.controllers', ['checkmatelife.services']);

angular.module('checkmatelife.services', ['ngResource']);
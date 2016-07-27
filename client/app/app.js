(function() {
    'use strict';

    angular
        .module('app.core', ['ui.router', 'ngTouch', 'app.formBuilder', 'app.formMgmt', 'app.autofill', 'app.newEntry', 'app.shared', 'app.entryMgmt'])
        .config(routes)
        .run(init);

    routes.$inject = ['$urlRouterProvider', '$stateProvider', '$locationProvider', '$compileProvider'];

    function routes($urlRouterProvider, $stateProvider, $locationProvider, $compileProvider) {
        // Set AngularJS production mode
        $compileProvider.debugInfoEnabled(false);
        // Set HTML5 mode
        $locationProvider.html5Mode(true);
        $urlRouterProvider.otherwise('/forms');
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'app/Login/login.html',
                controller: 'loginCtrl',
                controllerAs: 'vm',
                resolve: {
                    security: ['$q', 'authServices', '$state', function($q, authServices, $state) {
                        if (authServices.getToken()) {
                            return $state.go('forms');
                        } 
                    }]
                }
            })
            .state('newentry', {
                url: '/newentry/:groupName',
                templateUrl: 'app/NewEntry/newEntry.html', //TOFIX
                controller: 'newEntryCtrl',
                controllerAs: 'vm',
                resolve: {
                    security: ['$q', 'authServices', function($q, authServices) {
                        if (authServices.getToken()) {
                            return $q.resolve();
                        } else {
                            return $q.reject(false);
                        }
                    }]
                }
            })
            .state('users', {
                url: '/users',
                templateUrl: 'app/UserMgmt/usermgmt.html',
                controller: 'usersCtrl',
                controllerAs: 'vm',
                resolve: {
                    security: ['$q', 'authServices', function($q, authServices) {
                        if (authServices.getToken() && authServices.getUserInfo().usertype === "Admin") {
                            return $q.resolve();
                        } else {
                            return $q.reject(false);
                        }
                    }]
                }
            })
            .state('entries', {
                url: '/entries',
                templateUrl: 'app/EntryMgmt/entryMgmt.html', //TOFIX
                controller: 'entryMgmtCtrl',
                controllerAs: 'vm',
                resolve: {
                    security: ['$q', 'authServices', function($q, authServices) {
                        if (authServices.getToken()) {
                            return $q.resolve();
                        } else {
                            return $q.reject(false);
                        }
                    }]
                }
            })
            .state('settings', {
                url: '/settings',
                templateUrl: 'app/Settings/settings.html',
                controller: 'settingsCtrl',
                controllerAs: 'vm',
                resolve: {
                    security: ['$q', 'authServices', function($q, authServices) {
                        if (authServices.getToken()) {
                            return $q.resolve();
                        } else {
                            return $q.reject(false);
                        }
                    }]
                }
            })
            .state('forms', {
                url: '/forms',
                templateUrl: 'app/FormMgmt/forms.html',
                controller: 'formsCtrl',
                controllerAs: 'vm',
                resolve: {
                    security: ['$q', 'authServices', function($q, authServices) {
                        if (authServices.getToken()) {
                            return $q.resolve();
                        } else {
                            return $q.reject(false);
                        }
                    }]
                }
            })
            .state('formBuilder', {
                url: '/formbuilder/:groupName/:formName',
                templateUrl: 'app/FormBuilder/formBuilder.html',
                controller: 'formBuilderCtrl',
                controllerAs: 'vm',
                resolve: {
                    security: ['$q', 'authServices', function($q, authServices) {
                        if (authServices.getToken() && (authServices.getUserInfo().usertype === "Admin" || authServices.getUserInfo().usertype === "User+")) {
                            return $q.resolve();
                        } else {
                            return $q.reject(false);
                        }
                    }]
                }
            })
            .state('autofill', {
                url: '/autofill',
                templateUrl: 'app/Autofill/autofill.html',
                controller: 'autofillCtrl',
                controllerAs: 'vm',
                resolve: {
                    security: ['$q', 'authServices', function($q, authServices) {
                        if (authServices.getToken()) {
                            return $q.resolve();
                        } else {
                            return $q.reject(false);
                        }
                    }]
                }
            });
    }

    init.$inject = ['$rootScope', '$timeout'];

    function init($rootScope, $timeout) {
        $rootScope.$on('$viewContentLoaded', function() {
            $timeout(function() {
                componentHandler.upgradeAllRegistered();
            });
        });
    }
})();
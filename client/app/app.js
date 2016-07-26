(function() {
    'use strict';

    angular
        .module('app.core', ['ui.router', 'ui.grid', 'ui.grid.autoResize', 'ui.grid.pagination', 'ui.grid.resizeColumns', 'ui.grid.moveColumns', 'ngTouch', 'ui.grid.selection', 'app.formBuilder', 'app.formMgmt', 'app.autofill', 'app.newEntry', 'app.shared','app.entryMgmt'])
        .config(['$urlRouterProvider', '$stateProvider', '$locationProvider', '$compileProvider', function($urlRouterProvider, $stateProvider, $locationProvider, $compileProvider) {
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
                    controllerAs: 'vm'
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
        }]);
})();
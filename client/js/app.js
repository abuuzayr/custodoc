angular
    .module('user-interface', ['ui.router', 'ui.grid', 'ui.grid.autoResize', 'ui.grid.pagination', 'ui.grid.resizeColumns', 'ui.grid.moveColumns', 'ngTouch', 'ui.grid.selection', 'formBuilderApp', 'formsApp','autofillApp'])
    .config(['$urlRouterProvider', '$stateProvider', '$locationProvider', function ($urlRouterProvider, $stateProvider, $locationProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('login', {
                url: '/',
                templateUrl: 'views/login.html',
                controller: 'loginCtrl',
                controllerAs: 'login'
            })
            .state('newentry', {
                url: '/newentry/:groupName',
                templateUrl: 'views/newEntry.html',
                controller: 'newEntryCtrl',
                controllerAs: 'vm'
            })
            .state('users', {
                url: '/users',
                templateUrl: 'views/users.html',
                controller: 'usersCtrl',
                controllerAs: 'users'
            })
            .state('entries', {
                url: '/entries/:groupName',
                templateUrl: 'views/entries.html',
                controller: 'entriesCtrl',
                controllerAs: 'entries'
            })
            .state('settings', {
                url: '/settings',
                templateUrl: 'views/settings.html',
                controller: 'settingsCtrl',
                controllerAs: 'settings'
            })
            .state('forms', {
                url: '/forms',
                templateUrl: 'views/forms.html',
                controller: 'formsCtrl',
                controllerAs: 'vm'
            })
            .state('formBuilder', {
                url: '/formBuilder/:groupName/:formName',
                templateUrl: 'views/formBuilder.html',
                controller: 'formBuilderCtrl',
                controllerAs: 'vm'
            })
            .state('formBuilderBase', {
                url: '/formBuilderBase',
                templateUrl: 'views/FBBase.html',
                controller: 'formBuilderCtrl',
                controllerAs: 'vm'
            })
            .state('autofill', {
                url: '/autofill',
                templateUrl: 'app/autofill/autofill.html',
                controller: 'autofillCtrl',
                controllerAs: 'vm'
            });
    }]);

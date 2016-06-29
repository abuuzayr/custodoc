angular
    .module('user-interface', ['naif.base64','ui.router', 'ui.grid','ui.grid.autoResize','ui.grid.pagination','ui.grid.resizeColumns','ui.grid.moveColumns', 'ngTouch', 'ui.grid.selection', 'formBuilderApp','formsApp'])
    .config(['$urlRouterProvider', '$stateProvider', function ($urlRouterProvider, $stateProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('login', {
                url: '/',
                templateUrl: 'views/login.html',
                controller: 'loginCtrl',
                controllerAs: 'login'
            })
            .state('newentry', {
                url: '/newentry',
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
                url: '/entries',
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
                url: '/formBuilder',
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
                templateUrl: 'views/autofill.html',
                controller: 'autofillCtrl',
                controllerAs: 'autofill'
            });
    }]);

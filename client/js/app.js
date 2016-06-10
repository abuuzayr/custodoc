angular
    .module('user-interface', ['ui.router', 'ui.grid', 'ngTouch', 'ui.grid.selection'])
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
                controllerAs: 'newEntry'
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
                controllerAs: 'forms'
            })
    }]);

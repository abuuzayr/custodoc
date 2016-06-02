angular
    .module('user-interface', ['ui.router'])
    .config(['$urlRouterProvider', '$stateProvider', function ($urlRouterProvider, $stateProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'views/login.html'
            })
            .state('forms', {
                url: '/',
                templateUrl: 'views/forms.html'
            });
    }]);
angular
    .module('user-interface', ['ui.router'])
    .config(['$urlRouterProvider', '$stateProvider', function ($urlRouterProvider, $stateProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('forms.html', {
                url: '/',
                templateUrl: 'views/forms.html'
            })
            .state('login.html', {
                url: '/login',
                templateUrl: 'views/login.html'
            });
    }]);
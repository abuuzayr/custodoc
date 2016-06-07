angular
    .module('user-interface', ['ui.router', 'ui.grid', 'ngTouch', 'ui.grid.selection'])
    .config(['$urlRouterProvider', '$stateProvider', function ($urlRouterProvider, $stateProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('login', {
                url: '/',
                templateUrl: 'views/login.html',
                controller: 'loginCtrl'
            })
            // .state('formsPage', {
            //     url: '/forms',
            //     views: {
            //         "topNav": {
            //             templateUrl: 'views/topNavBar.html',
            //             children: [
            //                 {
            //                     name: 'sideNav',
            //                     templateUrl: 'views/sideNavBar.html'
            //                 }
            //             ]
            //         },
            //         "forms": {
            //             templateUrl: 'views/forms.html',
            //             controller: 'formsCtrl'
            //         }
            //     }
            // })
            .state('newEntry', {
                url: '/newEntry',
                templateUrl: 'views/newEntry.html',
                controller: 'newEntry'
            })
            .state('entries', {
                url: '/entries',
                templateUrl: 'views/entries.html',
                controller: 'entriesCtrl'
            })
            .state('settings', {
                url: '/settings',
                templateUrl: 'views/settings.html',
                controller: 'settingsCtrl'
            })
    }])
    .controller('navBarCtrl', function ($scope, $interval) {
        $scope.date = new Date();
        $interval(function () {
            $scope.date = new Date();
        }, 1000);
        $scope.userGroup = 'System Admin';
        $scope.productName = 'BulletForms';
    });
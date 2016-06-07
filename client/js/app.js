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
            .state('newEntry', {
                url: '/newentry',
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
            .state('forms', {
                url: '/forms',
                templateUrl: 'views/forms.html',
                controller: 'formsCtrl'
            });
    }])
            // .state('formsPage', {
            //     url: '/forms',
            //     views: {
            //         topNav: {
            //             templateUrl: 'views/topNavBar.html'
            //         },
            //         main: {
            //             templateUrl: 'views/forms.html',
            //             controller: 'formsCtrl'
            //         },
            //         sideNav:{
            //         	templateUrl: 'views/sideNavBar.html'
            //         }
            //     }
            // })
            // .state('login', {
            //     url: '/',
            //     views: {
            //         topNav: {
            //             // templateUrl: 'views/topNavBar.html'
            //         },
            //         main: {
            //             templateUrl: 'views/login.html',
            //             controller: 'loginCtrl'
            //         },
            //         sideNav:{
            //         	// templateUrl: 'views/sideNavBar.html'
            //         }
            //     }
            // })
            // .state('entries', {
            //     url: '/entries',
            //     views: {
            //         topNav: {
            //             templateUrl: 'views/topNavBar.html'
            //         },
            //         main: {
            //             templateUrl: 'views/entries.html',
            //             controller: 'entriesCtrl'
            //         },
            //         sideNav:{
            //         	templateUrl: 'views/sideNavBar.html'
            //         }
            //     }
            // })  
            // .state('newEntry', {
            //     url: '/newEntry',
            //     views: {
            //         topNav: {
            //             templateUrl: 'views/topNavBar.html'
            //         },
            //         main: {
            //             templateUrl: 'views/newEntry.html'
            //             // controller: 'entriesCtrl'
            //         },
            //         sideNav:{
            //         	templateUrl: 'views/sideNavBar.html'
            //         }
            //     }
            // });
    .controller('navBarCtrl', function ($scope, $interval) {
        $scope.date = new Date();
        $interval(function () {
            $scope.date = new Date();
        }, 1000);
        $scope.userGroup = 'System Admin';
        $scope.productName = 'BulletForms';
    });
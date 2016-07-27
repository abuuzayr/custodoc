(function () {
    'use strict';

    angular
        .module('app.core')
        .run(auth);

    auth.$inject = ['$rootScope', '$state', '$window', '$location', 'authServices'];

    // Block access if user is not logged in
    function auth($rootScope, $state, $window, $location, authServices) {
        $rootScope.$on('$stateChangeError', function (e, toState, toParams, fromState, fromParams, error) {
            var token = authServices.getToken();
            if (error === false) {
                $state.go('login');
            }
        });
        // $rootScope.$on('$stateChangeStart', function (event, toState) {
        //     if (toState.name === 'login') {
        //         if (authServices.getToken()) { // Check if user allowed to transition                  
        //             event.preventDefault();   // Prevent migration to default state                  
        //             $state.go('forms');
        //         }
        //     }
        // });
    }
})();
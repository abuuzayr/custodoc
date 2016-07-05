angular
    .module('app.core', ['ui.router', 'ui.grid', 'ui.grid.autoResize', 'ui.grid.pagination', 'ui.grid.resizeColumns', 'ui.grid.moveColumns', 'ngTouch', 'ui.grid.selection', 'app.formBuilder', 'app.formMgmt', 'app.autofill', 'app.newEntry', 'app.shared'])
    .config(['$urlRouterProvider', '$stateProvider', '$locationProvider', function ($urlRouterProvider, $stateProvider, $locationProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('login', {
                url: '/',
                templateUrl: 'app/Login/login.html',
                controller: 'loginCtrl',
                controllerAs: 'vm'
            })
            .state('newentry', {
                url: '/newentry/:groupName',
                templateUrl: 'app/NewEntry/newEntry.html', //TOFIX
                controller: 'newEntryCtrl',
                controllerAs: 'vm'
            })
            .state('users', {
                url: '/users',
                templateUrl: 'app/UserMgmt/usermgmt.html',
                controller: 'usersCtrl',
                controllerAs: 'vm'
            })
            .state('entries', {
                url: '/entries',
                templateUrl: 'views/entries.html', //TOFIX
                controller: 'entriesCtrl',
                controllerAs: 'entries'
            })
            .state('settings', {
                url: '/settings',
                templateUrl: 'app/Settings//settings.html',
                controller: 'settingsCtrl',
                controllerAs: 'vm'
            })
            .state('forms', {
                url: '/forms',
                templateUrl: 'app/FormMgmt/forms.html',
                controller: 'formsCtrl',
                controllerAs: 'vm'
            })
            .state('formBuilder', {
                url: '/formBuilder/:groupName/:formName',
                templateUrl: 'app/FormBuilder/formBuilder.html',
                controller: 'formBuilderCtrl',
                controllerAs: 'vm'
            })
            .state('formBuilderBase', {
                url: '/formBuilderBase',
                templateUrl: 'app/FormBuilder/FBBase.html',
                controller: 'formBuilderCtrl',
                controllerAs: 'vm'
            })
            .state('autofill', {
                url: '/autofill',
                templateUrl: 'app/Autofill/autofill.html',
                controller: 'autofillCtrl',
                controllerAs: 'vm'
            });
    }]);

angular
    .module("user-interface")
    .controller("sideNavCtrl", ['$scope', '$q', '$interval', '$location', '$timeout', function ($scope, $q, $interval, $location, $timeout) {
    var sideNav = this;
    sideNav.date = new Date();
    $interval(function () {
        console.log('Date function working');
        sideNav.date = new Date();}, 1000);
    sideNav.userGroup = 'Admin';
    sideNav.email = 'hello@example.com';
}]);
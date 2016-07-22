angular
    .module('app.shared')
    .controller('topNavCtrl', topNavCtrl);

topNavCtrl.$inject = ['authServices', '$scope', '$interval'];

function topNavCtrl(authServices, $scope, $interval) {
    var vm = this;
    vm.openNav = openNav;
    vm.closeNav = closeNav;
    vm.logout = logout;

    vm.date = new Date();

    $interval(function () {
        vm.date = new Date();
    }, 1000);

    vm.username = authServices.getUserInfo().username;
    vm.userType = authServices.getUserInfo().usertype;

    function logout() {
        authServices.logout();
    }

    /* Open the sidenav */
    function openNav() {
        console.log('OPEN SESAME');
        document.getElementById("mySidenav").style.width = "100%";
    }

    /* Close/hide the sidenav */
    function closeNav() {
        console.log('CLOSEEE SESAME');
        document.getElementById("mySidenav").style.width = "0";
    }
}
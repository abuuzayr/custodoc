angular.module('app')
    .service('dialogServices', dialogServices)

//dialogServices.$inject = [];

function dialogServices() {

    this.openDialog = function (dialogId) {
        var dialog = document.querySelector('#' + dialogId);
        if (!dialog.showModal) {
            dialogPolyfill.registerDialog(dialog);
        }
        dialog.showModal();
    }

    this.closeDialog = function (dialogId) {
        var dialog = document.querySelector('#' + dialogId);
        dialog.close();
    }
}

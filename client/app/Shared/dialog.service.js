angular.module('app.shared')
    .service('dialogServices', dialogServices);


function dialogServices() {

    this.openDialog = function (dialogId) {
        var dialog = document.querySelector('#' + dialogId);
        if (!dialog.showModal) {
            dialogPolyfill.registerDialog(dialog);
        }
        dialog.showModal();
    };

    this.closeDialog = function (dialogId) {
        var dialog = document.querySelector('#' + dialogId);
        if(dialog.open)
            dialog.close();
    };
}

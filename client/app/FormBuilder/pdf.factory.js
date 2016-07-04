angular
    .module("app.formBuilder")
    .factory('pdfFactory', pdfFactory);

function pdfFactory() {
    var pageData = [];

    return {
        getData: function () {
            //You could also return specific attribute of the form data instead
            //of the entire data
            return pageData;
        },
        addData: function (newPageData) {
            //You could also set specific attribute of the form data instead
            pageData.push(newPageData);
        },
        resetData: function () {
            //To be called when the data stored needs to be discarded
            pageData = [];
        }
    };
}
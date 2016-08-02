(function() {
    'use strict';

    angular
        .module('app.formMgmt')
        .factory('formServices', formServices);

    formServices.$inject = ['$http', 'appConfig'];

    function formServices($http, appConfig) {
        var service = {
            getNewPage: getNewPage,
            getGroups: getGroups,
            createGroup: createGroup,
            deleteGroup: deleteGroup,
            updateGroup: updateGroup,
            getForms: getForms,
            deleteForm: deleteForm,
            updateForm: updateForm,
            createForm: createForm,
            getOneForm: getOneForm,
            formsFactory: formsFactory
        };

        function formsFactory() {
            var whiteDiv = document.createElement("div");
            whiteDiv.style.backgroundColor = "white";
            whiteDiv.style.width = "794px";
            whiteDiv.style.height = "1123px";
            whiteDiv.style.zIndex = "-1";
            whiteDiv.style.position = "relative";
            whiteDiv.style.top = "-7px";
            whiteDiv.style.left = "-7px";
        }

        function getNewPage() {
            var whiteDiv = document.createElement("div");
            whiteDiv.style.backgroundColor = "white";
            whiteDiv.style.width = "794px";
            whiteDiv.style.height = "1123px";
            whiteDiv.style.zIndex = "-1";
            whiteDiv.style.position = "relative";
            whiteDiv.style.top = "-7px";
            whiteDiv.style.left = "-7px";
            var newPage = document.createElement("div");
            newPage.appendChild(whiteDiv.cloneNode(true));
            newPage.style.width = "794px";
            newPage.style.height = "1123px";
            newPage.setAttribute("class", "page");
            return newPage;
        }

        function getGroups() {
            return $http.get(appConfig.API_URL + "/protected/groups");
        }

        function createGroup(groupName) {
            return $http.post(appConfig.API_URL + "/protected/groups", {
                groupName: groupName
            });
        }

        function deleteGroup(groupId) {
            return $http.delete(appConfig.API_URL + "/protected/groups/" + groupId);
        }

        function updateGroup(groupName, groupData) {
            $http.put(appConfig.API_URL + "/protected/groups/" + groupName, {
                groupData: groupData
            });
        }

        function getForms() {
            return $http.get(appConfig.API_URL + "/protected/forms/");
        }

        function getOneForm(formId){
            return $http.get(appConfig.API_URL + "/protected/forms/" + formId);
        }

        function deleteForm(formId) {
            return $http.delete(appConfig.API_URL + "/protected/forms/" + formId);
        }

        function updateForm(formData) {
            return $http.put(appConfig.API_URL + "/protected/forms/" + formData._id, {
                formData: formData
            });
        }

        function createForm(formData){
            return $http.post(appConfig.API_URL + "/protected/forms/" , {
                formData: formData
            });
        }

        return service;
    }
})();

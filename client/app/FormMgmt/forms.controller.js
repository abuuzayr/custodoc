(function() {
    'use strict';

    angular
        .module('app.formMgmt')
        .controller('formsCtrl', formsCtrl);

    formsCtrl.$inject = ['$compile', '$scope', '$q', '$location', '$timeout', '$http', 'formServices', '$state', 'usSpinnerService', 'appConfig', 'feedbackServices',
        'dialogServices'
    ];

    function formsCtrl($compile, $scope, $q, $location, $timeout, $http, formServices, $state, usSpinnerService, appConfig, feedbackServices,
        dialogServices) {
        /* jshint validthis: true */
        var vm = this;

        var forms = document.getElementById('forms');
        var snackbarContainer = document.getElementById("snackbarContainer");
        var originalData = [];

        vm.gridOptions = {};
        vm.gridOptions.enableDelete = true;
        vm.gridOptions.enableSearch = true;
        vm.gridOptions.enablePagination = true;
        vm.gridOptions.columnDefs = [{
            type: 'default',
            fieldName: 'groupName',
            displayName: 'Group Name',
        }, {
            type: 'link',
            fieldName: 'formName',
            displayName: 'Form Name',
            action: goEditForm,
        }, {
            type: 'toggle',
            fieldName: 'isImportant',
            displayName: 'Important',
            iconTrue: 'bookmark',
            iconFalse: 'bookmark_border',
            true: 'Important',
            false: 'Normal',
            action: toggleImportance
        }, {
            type: 'date',
            fieldName: 'creationDate',
            displayName: 'Creation Date',
            format: 'EEEE MMM d, y h:mm:ss a'
        }, {
            type: 'default',
            fieldName: 'creator',
            displayName: 'Create By'
        }, {
            type: 'date',
            fieldName: 'lastRecord',
            displayName: 'Last Record',
            format: 'EEEE MMM d, y h:mm:ss a'
        }, {
            type: 'date',
            fieldName: 'lastModified',
            displayName: 'Last Modified',
            format: 'EEEE MMM d, y h:mm:ss a'
        }, {
            type: 'default',
            fieldName: 'lastModifiedBy',
            displayName: 'Last Modified By'
        }];
        getFormData();
        vm.gridOptions.deleteFunc = deleteForms;

        vm.addNewGroup = addNewGroup;
        vm.deleteGroup = deleteGroup;
        vm.renameGroup = renameGroup;
        vm.addNewForm = addNewForm;
        vm.renameForm = renameForm;
        vm.duplicateForm = duplicateForm;
        vm.showRecent = showRecent;
        vm.showImportant = showImportant;
        vm.showNewEntry = showNewEntry;
        vm.goNewEntry = goNewEntry;
        vm.downloadAsOne = downloadAsOne;
        vm.downloadSeparate = downloadSeparate;


        //view controll
        function showNewEntry() {
            var rows = vm.gridOptions.selection ? vm.gridOptions.selection.selected : 0;
            for (var i = 0; i < rows.length - 1; i++) {
                if (rows[i].groupName !== rows[i + 1].groupName) return false;
            }
            return rows.length > 0;
        }

        //go to formbuilder
        function goEditForm(row) {
            $state.go('formBuilder', {
                groupName: row.groupName,
                formName: row.formName,
                formId: row._id
            });
        }

        //go to newentry
        function goNewEntry() {
            var groupName = vm.gridOptions.selection.selected[0].groupName;
            $state.go('newentry', {
                groupName: groupName
            });
        }

        //group management
        getGroupData();

        function getGroupData() {
            vm.groups = [];
            formServices.getGroups().then()
                .then(SuccessCallback)
                .catch(ErrorCallback);

            function SuccessCallback(res) {
                for (var i = 0; i < res.data.length; i++) {
                    vm.groups.push(res.data[i].groupName);
                }
                if (vm.groups.length) {
                    vm.newFormGroup = vm.groups[0];
                    vm.deleteGroupName = vm.groups[0];
                    vm.renameGroupOld = vm.groups[0];
                    vm.duplicateTo = vm.groups[0];
                }
            }

            function ErrorCallback(err) {
                //TODO body...
            }
        }

        function addNewGroup() {
            formServices.createGroup(vm.newGroupName)
                .then(SuccessCallback)
                .catch(ErrorCallback);

            function SuccessCallback(res) {
                if (res.data === "Existed") {
                    alert("This group name already exists");
                } else {
                    getGroupData();
                    snackbarContainer.MaterialSnackbar.showSnackbar({
                        message: "Added new group"
                    });
                }
            }

            function ErrorCallback(argument) {
                // body...
            }
        }

        function deleteGroup() {
            if (confirm("Do you really want to delete this group? All the forms and entries data of this group will be deleted?")) {
                return formServices.deleteGroup(vm.deleteGroupName)
                    .then(SuccessCallback)
                    .catch(ErrorCallback);
            }

            function SuccessCallback() {
                getGroupData();
                getFormData();
            }

            function ErrorCallback(argument) {
                // TODO body...
            }
        }

        function renameGroup() {
            $http.put(appConfig.API_URL + "/protected/groups", {
                    originalName: vm.renameGroupOld,
                    newName: vm.renameGroupNew
                })
                .then(function(res) {
                    if (res.data === "Existed") {
                        alert("This group name already exists");
                    } else {
                        getGroupData();
                        getFormData();
                        snackbarContainer.MaterialSnackbar.showSnackbar({
                            message: "Renamed the group"
                        });
                    }
                });
        }

        //form management
        function addNewForm(){
            var formData = {
                groupName: vm.newFormGroup,
                formName: vm.newFormName
            };
            createForm(formData);
        }

        function duplicateForm() {
            var formId = vm.gridOptions.selection.selectedId[0];
            var formData = null;
            getOneForm(formId).then(resolve);
            console.log(formData);


            function resolve(result) {
                formData = result;
                if (formData) {
                    delete formData._id;
                    formData.formName = vm.duplicateName;
                    formData.groupName = vm.duplicateTo;
                    formData.isDuplicate = true;
                    console.log(formData);
                    return createForm(formData);
                }
            }
        }

        function renameForm() {
            var formData = {
                _id: vm.gridOptions.selection.selected[0]._id,
                formName: vm.renameFormNew
            };
            updateForm(formData);
            
        }




        function getFormData() {
            return formServices.getForms().then(SuccessCallback).catch(ErrorCallback);

            function SuccessCallback(res) {
                vm.gridOptions.data = [];
                for (var i = 0; i < res.data.length; i++) {
                    var formData = res.data[i];
                    vm.gridOptions.data.push(res.data[i]);
                }
            }

            function ErrorCallback(err) {
                console.log("error: ", err); //TOFIX
            }
        }

        function createForm(formData) {
            return formServices.createForm(formData)
                .then(SuccessCallback)
                .catch(ErrorCallback);

            function SuccessCallback(res) {
                if (res.data === "Existed") {
                    alert("This form name already exists in the selected group.");
                } else {
                    $state.go('formBuilder', {
                        groupName: res.data.groupName,
                        formName: res.data.formName,
                        formId: res.data._id
                    });
                }
            }

            function ErrorCallback(err) {
                //TOFIX
            }
        }





        function deleteForms(rgRows) {
            if (confirm("This will delete all the entries record of the selected forms. Do you want to continue?")) {
                var deferred = $q.defer();
                var deletePromises = [];
                for (var i = 0; i < rgRows.length; i++) {
                    deletePromises.push(deleteOne(rgRows[i]));
                }

                $q.all(deletePromises).then(SuccessCallback).catch(ErrorCallback);

                return deferred.promise;

            }

            function SuccessCallback() {
                deferred.resolve();
            }

            function ErrorCallback(err) {
                deferred.reject(err);
            }
        }

        function deleteOne(formData) {
            console.log(formData);
            var deferred = $q.defer();

            formServices.deleteForm(formData).then(SuccessCallback).catch(ErrorCallback);
            return deferred.promise;

            function SuccessCallback(res) {
                vm.gridOptions.data.splice(vm.gridOptions.data.lastIndexOf(formData), 1);
                deferred.resolve();
            }

            function ErrorCallback(err) {
                deferred.reject(err);
            }
        }


        function updateForm(formData){
            formServices.updateForm(formData).then(SuccessCallback)
                .catch(ErrorCallback);

            function SuccessCallback(res) {

                vm.closeDialog('renameForm');
                getFormData();
                snackbarContainer.MaterialSnackbar.showSnackbar({
                    message: "Renamed the form"
                });
            }

            function ErrorCallback(err) {
                //TOFIX
            }
        }



        function getOneForm(formId) {
            var deferred = $q.defer();
            formServices.getOneForm(formId).then(SuccessCallback).catch(ErrorCallback);
            return deferred.promise;


            function SuccessCallback(res) {
                deferred.resolve(res.data);
            }

            function ErrorCallback(err) {
                deferred.reject(err);
                //TODO
            }
        }



        function toggleImportance(row) {
            var formData = {
                _id: row._id,
                isImportant: row.isImportant.toLowerCase() === 'important' ? 'Normal' : 'Important'
            };
            return formServices.updateForm(formData).catch(ErrorCallback);

            function ErrorCallback(err) {
                getFormData();
            }
        }

        function showRecent() {
            var filteredData = [];
            originalData = vm.gridOptions.data;
            vm.gridOptions.data = [];
            for (var i = 0; i < originalData.length; i++) {
                //604800000 = 1 week in milisec
                if (Date.now() - new Date(originalData[i].lastModified).getTime() < 604800000)
                    filteredData.push(originalData[i]);
            }
            vm.gridOptions.data = filteredData;
        }

        function showImportant() {
            var filteredData = [];
            originalData = vm.gridOptions.data;
            vm.gridOptions.data = [];
            for (var i = 0; i < originalData.length; i++) {
                if (originalData[i].isImportant.toLowerCase() === 'important')
                    filteredData.push(originalData[i]);
            }
            vm.gridOptions.data = filteredData;
        }

        /* =========================================== Dialog =========================================== */

        // Check if form name is duplicated. If yes, display feedback. Else, change name and close dialog.
        vm.openDialog = function(dialogName) {
            var dialog = document.querySelector('#' + dialogName);
            if (!dialog.showModal) {
                dialogPolyfill.registerDialog(dialog);
            }
            dialog.showModal();
        };

        vm.closeDialog = function(dialogName) {
            var dialog = document.querySelector('#' + dialogName);
            dialog.close();
        };

        var pagesImage = [];
        var rows = [];

        function downloadSeparate() {
            var pdf,
                deferred,
                p;

            usSpinnerService.spin('spinner-1');
            rows = vm.gridOptions.selection.selected;
            deferred = $q.defer();
            deferred.resolve(1);
            p = deferred.promise;
            for (var i = 1; i <= rows.length; i++) {
                p = p.then(generateFormTask);
                p = p.then(generateImageTask);
            }
            p.then(lastTask);


            function generateFormTask(formNumber) {
                return generateForm(formNumber);
            }

            function generateImageTask(formNumber) {
                return generateImage(formNumber);
            }

            function lastTask() {
                for (var j = 0; j < pagesImage.length; j++) {
                    pdf = new jsPDF();
                    for (var k = 0; k < pagesImage[j].length; k++) {
                        if (k !== 0) {
                            pdf.addPage();
                        }
                        pdf.addImage(pagesImage[j][k], "JPEG", 0, 0);
                    }
                    pdf.save();
                }
                usSpinnerService.stop('spinner-1');
                var pages = Array.from(document.getElementsByClassName('page'));
                pages.forEach(function(item, index) {
                    item.parentNode.removeChild(item);
                });
                pagesImage = [];
                rows = [];
            }
        }

        function downloadAsOne() {
            var pdf,
                pages,
                deferred,
                p;

            usSpinnerService.spin('spinner-1');
            rows = vm.gridOptions.selection.selected;
            pdf = new jsPDF();
            deferred = $q.defer();
            deferred.resolve(1);
            p = deferred.promise;
            for (var i = 1; i <= rows.length; i++) {
                p = p.then(generateFormTask);
                p = p.then(generateImageTask);
            }
            p.then(lastTask);

            function generateFormTask(formNumber) {
                return generateForm(formNumber);
            }

            function generateImageTask(formNumber) {
                return generateImage(formNumber);
            }

            function lastTask() {
                for (var j = 0; j < pagesImage.length; j++) {
                    for (var k = 0; k < pagesImage[j].length; k++) {
                        if (j !== 0 || k !== 0) {
                            pdf.addPage();
                        }
                        pdf.addImage(pagesImage[j][k], "JPEG", 0, 0);
                    }
                }
                usSpinnerService.stop('spinner-1');
                pdf.save();
                pages = Array.from(document.getElementsByClassName('page'));
                pages.forEach(function(item, index) {
                    item.parentNode.removeChild(item);
                });
                pagesImage = [];
                rows = [];
            }
        }

        function generateImage(formNumber) {
            var deferred = $q.defer();
            var pageNumber = 1;
            pagesImage.push([]);
            var deferred2 = $q.defer();
            deferred2.resolve(1);
            var p2 = deferred2.promise;
            while (document.getElementById('form' + formNumber + "page" + pageNumber)) {
                p2 = p2.then(generateImagePromise);
                pageNumber++;
            }

            return deferred.promise;

            function generateImagePromise(pageNumber) {
                var deferred2 = $q.defer();
                var canvas = document.createElement("canvas");
                canvas.width = 794;
                canvas.height = 1123;
                canvas.style.width = '794px';
                canvas.style.height = '1123px';
                var context = canvas.getContext('2d');
                var code = document.getElementById('form' + formNumber + "page" + pageNumber).innerHTML;
                rasterizeHTML.drawHTML(code).then(function(renderResult) {
                    context.drawImage(renderResult.image, 0, 0);
                    var

                        imgurl = canvas.toDataURL('image/jpeg', 1);
                    pagesImage[formNumber - 1].push(imgurl);
                    if (!document.getElementById('form' + formNumber + "page" + (pageNumber + 1))) {
                        deferred.resolve(formNumber + 1);
                        return;
                    }
                    deferred2.resolve(pageNumber + 1);
                });
                return deferred2.promise;
            }
        }

        function generateForm(formNumber) {
            var key,
                formData,
                newPage,
                element,
                j;
            var deferred = $q.defer();
            var groupName = rows[formNumber - 1].groupName;
            var formName = rows[formNumber - 1].formName;
            var formId = rows[formNumber - 1]._id
            $http.get(appConfig.API_URL + "/protected/forms/" + formId)
                .then(function(res) {
                    var node,
                        page,
                        option,
                        options,
                        checkbox,
                        span,
                        label,
                        display,
                        i, j;
                    formData = res.data;
                    var elements = formData.elements;
                    vm.numberOfPages = formData.numberOfPages;
                    for (j = 1; j <= vm.numberOfPages; j++) {
                        newPage = formServices.getNewPage().cloneNode(true);
                        newPage.setAttribute("id", 'form' + formNumber + "page" + j);
                        newPage.style.display = "none";
                        forms.appendChild(newPage);
                    }
                    for (key in elements) {
                        element = elements[key];
                        if (element.name.startsWith('background_')) {
                            node = document.createElement('img');
                            node.src = element.src;
                            node.style.zIndex = "0";
                        } else if (element.name.startsWith('label_')) {
                            node = document.createElement('div');
                            node.innerHTML = element.content;
                            node.style.whiteSpace = "pre-wrap";
                            node.style.color = element.color;
                            node.style.backgroundColor = element.backgroundColor;
                            node.style.fontFamily = element.fontFamily;
                            node.style.fontSize = element.fontSize;
                            node.style.textDecoration = element.textDecoration;
                            node.style.zIndex = "1";
                        } else if (element.name.startsWith('text_') || element.name.startsWith('auto_text_')) {
                            node = document.createElement('input');
                            node.type = 'text';
                            node.placeholder = element.default;
                            node.style.color = element.color;
                            node.style.backgroundColor = element.backgroundColor;
                            node.style.fontFamily = element.fontFamily;
                            node.style.fontSize = element.fontSize;
                            node.style.textDecoration = element.textDecoration;
                            node.style.zIndex = "1";
                        } else if (element.name.startsWith('auto_dropdown') || element.name.startsWith('dropdown_')) {
                            node = document.createElement('select');
                            options = element.options;
                            for (i = 0; i < options.length; i++) {
                                option = document.createElement('option');
                                option.innerHTML = options[i];
                                if (options[i] === element.default) option.setAttribute("selected", true);
                                node.appendChild(option);
                            }
                            node.style.color = element.color;
                            node.style.backgroundColor = element.backgroundColor;
                            node.style.fontFamily = element.fontFamily;
                            node.style.fontSize = element.fontSize;
                            node.style.textDecoration = element.textDecoration;
                            node.style.zIndex = "1";
                        } else if (element.name.startsWith('auto_radio') || element.name.startsWith('radio')) {
                            node = document.createElement('form');
                            options = element.options;
                            if (element.display === "radioInline") display = "inline";
                            else display = "block";
                            if (options.length > 0) {
                                for (i = 0; i < options.length; i++) {
                                    label = document.createElement("label");
                                    option = document.createElement("input");
                                    option.type = "radio";
                                    option.name = element.name;
                                    option.value = options[i];
                                    if (options[i] === element.default) option.setAttribute("checked", true);
                                    span = document.createElement("span");
                                    span.innerHTML = options[i] + " ";
                                    label.style.display = display;
                                    label.appendChild(option);
                                    label.appendChild(span);
                                    node.appendChild(label);
                                }
                            }
                            node.className = element.display;
                            node.style.color = element.color;
                            node.style.backgroundColor = element.backgroundColor;
                            node.style.fontFamily = element.fontFamily;
                            node.style.fontSize = element.fontSize;
                            node.style.textDecoration = element.textDecoration;
                            node.style.zIndex = "1";
                        } else if (element.name.startsWith('signature_')) {
                            node = document.createElement('canvas');
                            node.style.backgroundColor = element.backgroundColor;
                            node.style.zIndex = "1";
                        } else if (element.name.startsWith('image_')) {
                            node = document.createElement('canvas');
                            node.style.backgroundColor = element.backgroundColor;
                            node.style.zIndex = "1";
                        } else if (element.name.startsWith('auto_checkbox') || element.name.startsWith('checkbox_')) {
                            node = document.createElement('label');
                            span = document.createElement('span');
                            checkbox = document.createElement('input');
                            checkbox.type = "checkbox";
                            if (element.default) checkbox.setAttribute("checked", true);
                            checkbox.setAttribute("ng-checked", element.default);
                            $compile(checkbox)($scope);
                            span.innerHTML = element.label;
                            node.appendChild(checkbox);
                            node.appendChild(span);
                            node.style.color = element.color;
                            node.style.backgroundColor = element.backgroundColor;
                            node.style.fontFamily = element.fontFamily;
                            node.style.fontSize = element.fontSize;
                            node.style.textDecoration = element.textDecoration;
                            node.style.zIndex = "1";
                        }
                        node.style.opacity = element.opacity;
                        node.style.border = element.border;
                        node.style.borderRadius = element.borderRadius;
                        node.style.overflow = "hidden";
                        node.style.lineHeight = "100%";
                        node.style.position = "absolute";
                        node.style.overflow = "hidden";
                        node.style.width = element.width + 'px';
                        node.style.height = element.height + 'px';
                        node.style.top = element.top + 'px';
                        node.style.left = element.left + 'px';
                        node.style.position = "absolute";
                        page = document.getElementById('form' + formNumber + 'page' + element.page);
                        page.appendChild(node);
                    }
                    deferred.resolve(formNumber);

                }, function(res) {
                    snackbarContainer.sanSnackbar.showSnackbar({
                        message: "Failed to load the form"
                    });
                });
            return deferred.promise;
        }


    }
})();

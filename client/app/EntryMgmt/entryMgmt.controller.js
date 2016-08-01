(function(){
	"use strict";
angular.module('app.entryMgmt')
.controller('entryMgmtCtrl',entryMgmtCtrl);

	entryMgmtCtrl.$inject = ['$scope','$q', '$compile', '$timeout','entryMgmtServices'];
	function entryMgmtCtrl($scope, $q, $compile, $timeout, entryMgmtServices){
		var vm = this;
		var fieldArray = ['groupName','formName','createdAt','createdBy','lastModifiedAt','lastModifiedBy','_id'];
		vm.tableOptions = {};
		vm.tableOptions.data = [];
		vm.tableOptions.columnDefs = [];
		vm.tableOptions.enableMultiSelect = true;
		vm.tableOptions.enablePagination = true;
		vm.tableOptions.enableEdit = true;
		vm.tableOptions.enableDelete = true;
		vm.tableOptions.enableExport = true;
		vm.tableOptions.enableImport = true;

		vm.tableOptions.importFunc = importFunc;
		vm.tableOptions.saveFunc = updateRow;

		// PDF Variables
		vm.currentPageNumber = 1;
		vm.numberOfPages = 1;
		vm.totalNumberOfPages = [];
		vm.currentFormNumber = 1;
		vm.numberOfForms = 1;
		
		vm.selectedRows = {};

		getData();

		/****************** Initialize first page *******************/

		var whiteDiv=document.createElement("div");
		whiteDiv.style.backgroundColor="white";
		whiteDiv.style.width="794px";
		whiteDiv.style.height="1123px";
		whiteDiv.style.zIndex="-1";
		whiteDiv.style.position="relative";
		whiteDiv.style.top="-7px";
		whiteDiv.style.left="-7px";

		var newPage2 = document.createElement("div");
		newPage2.appendChild(whiteDiv.cloneNode(true));
		newPage2.style.width="794px";
		newPage2.style.height="1123px";	
		newPage2.setAttribute("class","page");

		var newPageTemplate = newPage2;

		/************************************************************/

		function slugify(text) {
		  	return text.toString().toLowerCase()
		    .replace(/\s+/g, '_')           // Replace spaces with -
		    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
		    .replace(/\-\-+/g, '_')         // Replace multiple - with single -
		    .replace(/^-+/, '')             // Trim - from start of text
		    .replace(/-+$/, '');            // Trim - from end of text
		}

		function getData(){
			return entryMgmtServices.getData()
			.then(SuccessCallback)
			.catch(ErrorCallback);

			function SuccessCallback(res){
				vm.tableOptions.data = [];
				vm.tableOptions.data = res.data;
				vm.tableOptions.columnDefs = [];
				vm.tableOptions.columnDefs.push({type:'default', displayName:'Group Name', fieldName: 'groupName'});
				vm.tableOptions.columnDefs.push({type:'default', displayName:'Form Name', fieldName: 'formName'});
				vm.tableOptions.columnDefs.push({type:'date', displayName:'Created at', fieldName: 'createdAt', format:'MMM d, y'});
				vm.tableOptions.columnDefs.push({type:'default', displayName:'Created by', fieldName: 'createdBy'});
				vm.tableOptions.columnDefs.push({type:'date', displayName:'Last edit', fieldName: 'lastModifiedAt', format:'MMM d, y'});
				vm.tableOptions.columnDefs.push({type:'default', displayName:'Edited by', fieldName: 'lastModifiedBy'});
				for(var i = 0 ; i  < vm.tableOptions.data.length; i++){
					for(var fieldName in vm.tableOptions.data[i].data){
						vm.tableOptions.data[i][fieldName] = vm.tableOptions.data[i].data[fieldName];
						if(!fieldName.startsWith('image_') && !fieldName.startsWith('signature_')){
							vm.tableOptions.columnDefs.push({
								type:'default', 
								displayName: getDisplayName(fieldName),
								fieldName: fieldName,
								enableEdit: true
							});
						}
					}
					delete vm.tableOptions.data[i].data;
				}
				
				vm.tableOptions.columnDefs.push({type:'action', icon:'get_app', action:downLoadAsOne});
			}
			function ErrorCallback(err){
				console.log(err);
			}

			function getDisplayName(fieldName) {
				if(fieldName.startsWith('text_')){
					return fieldName.replace('text_','');
				}else if (fieldName.startsWith('checkbox_')){
					return fieldName.replace('checkbox_','');
				}else if (fieldName.startsWith('dropdown_')){
					return fieldName.replace('dropdown_','');
				}else if (fieldName.startsWith('radio')){
					return fieldName.replace('radio','');
				}else
					return fieldName;
			}
		}

		//TODO: doesnt work for forms that have more than 1 page!!!

		function downLoadAsOne() {
            var pages,
                deferred,
                p;

            var pdf = new jsPDF();
            vm.pagesImage = [];
            //usSpinnerService.spin('spinner-1');
            vm.formData = {};
            vm.numberOfPages = 0;
            vm.numberOfForms = 0;
            vm.selectedRows = vm.tableOptions.selection.selected[0];
            entryMgmtServices.getFormGroupData(vm.selectedRows.groupName)
            	.then(function(res){
            		vm.formData = res.data;
            		console.log('then length leh? ' + vm.formData.length);

            		for(var w = 0; w < vm.formData.length; w++) {
						vm.totalNumberOfPages[w] = vm.formData[w].numberOfPages;
						console.log('wtf is formdata pages ' + vm.formData[w].numberOfPages);
					}
					vm.numberOfForms = vm.totalNumberOfPages.length;
					vm.numberOfPages = vm.totalNumberOfPages[0];
					vm.numberOfPreviewPages = vm.totalNumberOfPages[0];            	

		            
		            deferred = $q.defer();
		            deferred.resolve(1);
		            p = deferred.promise;
		            console.log('wats forms ' + vm.numberOfForms);
		            console.log('wats pages ' + vm.numberOfPages);
		            for (var c = 1; c <= vm.numberOfForms; c++) {
			            
			                p = p.then(generateFormTask);
			                p = p.then(generateImageTask);

			        }
			        console.log('am i here then?');
		            p.then(lastTask);

		            function generateFormTask(formNumber) {
		                return generateForm(formNumber);
		            }

		            function generateImageTask(formNumber) {
		                return generateImage(formNumber);
		            }

		            function lastTask() {
		            	console.log('did i even come in here');
		                for (var j = 0; j < vm.pagesImage.length; j++) {
		                    for (var k = 0; k < vm.pagesImage[j].length; k++) {
		                        if (j !== 0 || k !== 0) {
		                            pdf.addPage();	                            
		                        }
		                        pdf.addImage(vm.pagesImage[j][k], "JPEG", 0, 0);
		                    }
		                }
		                //usSpinnerService.stop('spinner-1');
		                pdf.save();
		                pages = Array.from(document.getElementsByClassName('page'));
		                pages.forEach(function(item, index) {
		                    item.parentNode.removeChild(item);
		                });
		                vm.pagesImage = [];
		                vm.selectedRows = [];
		                vm.numberOfPages = 0;
		                vm.numberOfForms = 0;
		            }
		        })
		}

				

		/*************** DOWNLOAD PDF FUNCTIONS ***************/

		function generateImage(formNumber) {
            var deferred = $q.defer();
            var pageNumber = 1;
            vm.pagesImage.push([]);
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
                    var imgurl = canvas.toDataURL('image/jpeg', 1);
                    vm.pagesImage[formNumber - 1].push(imgurl);
                    if (!document.getElementById('form' + formNumber + "page" + (pageNumber + 1))) { // if page does not exist then switch form
                        deferred.resolve(formNumber + 1);
                        return;
                    }
                    deferred2.resolve(pageNumber + 1); 
                });
                return deferred2.promise;
            }
        }
        function generateForm(formNumber) {
        	var deferred = $q.defer();
        	var forms = document.getElementById('forms');
        	vm.formData = [];
			entryMgmtServices.getFormGroupData(vm.selectedRows.groupName)
			.then(function(res){
				vm.formData = res.data;
				var node,
					key,
                    page,
                    option,
                    options,
                    checkbox,
                    span,
                    label,
                    display,
                    k, j;

				for(k=1; k<=vm.formData.length; k++){ //k is the form number
					var form = vm.formData[k-1];
					var elements = form.elements;
					for (j = 1; j <= form.numberOfPages; j++) { //j is page number
						var newPage = newPageTemplate.cloneNode(true);
						newPage.setAttribute("id", 'form' + k + 'page' + j);
						newPage.style.display = "none";
						forms.appendChild(newPage);
					}
					for (key in elements){
						var element = elements[key];
						if(element.name.startsWith('background_')){
							node = document.createElement('img');
							node.src = element.src;	
							node.style.zIndex="0";
						}else if(element.name.startsWith('label_')){
							node = document.createElement('div');
							node.innerHTML = element.content;
							node.style.whiteSpace="pre-wrap";
							node.style.color = element.color;
							node.style.backgroundColor = element.backgroundColor;
							node.style.fontFamily = element.fontFamily;
							node.style.fontSize = element.fontSize;
							node.style.textDecoration = element.textDecoration;
							node.style.zIndex="1";
						}else if(element.name.startsWith('auto_text') || element.name.startsWith('text_')){
							node = document.createElement('input');
							var newName = slugify(element.name);
							var testing = 'vm.selectedRows.' + newName;
							//node.setAttribute('value', testing);	
							node.setAttribute('ng-model', testing);			
							node.type='text';
							node.style.color = element.color;
							node.style.backgroundColor = element.backgroundColor;
							node.style.fontFamily = element.fontFamily;
							node.style.fontSize = element.fontSize;
							node.style.textDecoration = element.textDecoration;
							node.style.zIndex="1";
						}else if(element.name.startsWith('auto_checkbox') || element.name.startsWith('checkbox_')){
							node = document.createElement('label');
							span = document.createElement('span');
							checkbox = document.createElement('input');
							checkbox.type="checkbox";
							//checkbox.setAttribute('checked', 'rows.' + element.name); //TODO: HERE										
							var newName = slugify(element.name);
							var testScope = 'vm.entryData.' + newName;
							checkbox.setAttribute("ng-model", testScope);
							span.innerHTML = element.label;
							node.appendChild(checkbox);
							node.appendChild(span);
							node.style.color = element.color;
							node.style.backgroundColor = element.backgroundColor;
							node.style.fontFamily = element.fontFamily;
							node.style.fontSize = element.fontSize;
							node.style.textDecoration = element.textDecoration;
							node.style.zIndex="1";
						}else if(element.name.startsWith('auto_dropdown') || element.name.startsWith('dropdown_')){
							node = document.createElement('select');
							var newName = slugify(element.name);
							var testScope = 'vm.entryData.' + newName;
							node.setAttribute('ng-value', testScope);
							options = element.options;
							if(options.length>0){
								for(var i = 0; i<options.length; i++){
									var option = document.createElement('option');
									option.innerHTML=options[i];
									option.setAttribute('ng-selected', testScope + "==" + JSON.stringify(options[i]));								
									node.appendChild(option);
								}
							}
							node.value = element.default;
							node.style.color = element.color;
							node.style.backgroundColor = element.backgroundColor;
							node.style.fontFamily = element.fontFamily;
							node.style.fontSize = element.fontSize;
							node.style.textDecoration = element.textDecoration;
							node.style.zIndex="1";
						}else if(element.name.startsWith('auto_radio') || element.name.startsWith('radio')){
							node = document.createElement('form');
							var newName = slugify(element.name);
							var testScope = 'vm.entryData.' + newName;						
							options = element.options;
							if(options.length>0){
								if (element.display==="radioInline") var display = "inline";
								else var display = "block";
								for(var i=0; i<options.length; i++){
									var label = document.createElement("label");
									var option = document.createElement("input");
									option.type = "radio";
									option.setAttribute('ng-value', testScope);
									option.setAttribute('ng-checked', testScope + "==" + JSON.stringify(options[i]));								
									option.name = element.name;
									option.value = options[i];
									if(options[i]===element.default) option.checked = true;
									var span = document.createElement("span");
									span.innerHTML=options[i]+" ";
									label.appendChild(option);
									label.appendChild(span);
									label.style.display=display;
									node.appendChild(label);
								}
								node.className +=" "+ element.display;
							}
							node.style.color = element.color;
							node.style.backgroundColor = element.backgroundColor;
							node.style.fontFamily = element.fontFamily;
							node.style.fontSize = element.fontSize;
							node.style.textDecoration = element.textDecoration;
							node.style.zIndex="1";
						}else if(element.name.startsWith('signature_')){
							node = document.createElement('img');
							var newName = slugify(element.name);
							var testScope = 'vm.entryData.' + newName;
							node.setAttribute('ng-model', testScope);
							var testImageString = 'data:image/png;base64,' + '{{' + testScope + '}}';
							node.setAttribute('ng-src', testImageString);
							node.setAttribute('ng-click', 'vm.openModal(' + '"' + newName + '"' + ')');
							node.style.backgroundColor = element.backgroundColor;
							node.style.zIndex="1";
						}else if (element.name.startsWith('image_')) {
							node = document.createElement('img');
							var newName = slugify(element.name);
							var testScope = 'vm.entryData.' + newName + '.base64';
							node.setAttribute('ng-model', testScope);
							var testImageString = 'data:image/png;base64,' + '{{' + testScope + '}}';
							node.setAttribute('ng-src', testImageString); 
							node.setAttribute('ng-click', 'vm.openImageModal(' + '"' + newName + '"' + ')');
							node.style.backgroundColor = element.backgroundColor;
							node.style.zIndex="1";
						}
						node.style.opacity = element.opacity;
						node.style.border = element.border;
						node.style.borderRadius = element.borderRadius;
						node.className +=" notSelectable";
						node.id = key;
						node.setAttribute('name',element.name);
						node.style.overflow = "hidden";
						node.style.lineHeight="100%";
						node.style.position="absolute";
						node.style.overflow = "hidden";
						node.style.width = element.width+'px';
						node.style.height = element.height+'px';
						node.style.top = element.top+'px';
						node.style.left = element.left+'px';
						node.style.position = "absolute";
						var newName = slugify(element.name);
						var testScope = 'vm.entryData.' + newName;
						node.setAttribute("ng-model", testScope);
						page = document.getElementById('form'+k+'page'+element.page);
						page.appendChild(node);
						$compile(node)($scope);
					}				
				}		
				deferred.resolve(formNumber);
			});
			return deferred.promise;
		}

		/******************************************************/



		function importFunc(rowArray){
			var deferred = $q.defer();
			var savePromises = [];
			//promise chaining
			for(var i = 0 ; i < rowArray.length; i++){
				var tempDataObject = {};
				for(var field in rowArray[i]){
					if(fieldArray.indexOf(field) === -1){
						tempDataObject[field] = rowArray[i][field];
						delete rowArray[i][field];
					}
				}
				rowArray[i].data = tempDataObject;
				savePromises.push(saveRow(rowArray[i]));
			}
			$q.all(savePromises).then(function resolve(){
			  deferred.resolve('all saved');
			}, function reject(err){
			  deferred.reject(err);
			});

			return deferred.promise;
		}

		function saveRow(row){
			console.log(row);
			var deferred = $q.defer();
			entryMgmtServices.saveData(row)
			.then(successCallback)
			.catch(errorCallback);
			return deferred.promise;

			function successCallback(msg){
				vm.tableOptions.data.unshift(row);
				deferred.resolve(msg);
			}
			
			function errorCallback(err){
				deferred.reject(err);
			}
		}

		function updateRow(row){
			var rowData = row;
			var data = {};
			var deferred = $q.defer();	
			for(var field in rowData){
				if(fieldArray.indexOf(field) === -1){
					data[field] = rowData[field];
					delete rowData[field];
				}
			}
			rowData.data = data;

			console.log(rowData);
			entryMgmtServices.updateData(rowData)
			.then(successCallback)
			.catch(errorCallback);
			return deferred.promise;

			function successCallback(msg){
				deferred.resolve(msg);
			}
			
			function errorCallback(err){
				deferred.reject(err);
			}
		}
	}
})();
(function(){
	"use strict";
angular.module('app.entryMgmt')
.controller('entryMgmtCtrl',entryMgmtCtrl);

	entryMgmtCtrl.$inject = ['$scope','$q','$timeout','entryMgmtServices'];
	function entryMgmtCtrl($scope, $q, $timeout,entryMgmtServices){
		var vm = this;
		var fieldArray = ['groupName','formName','createdAt','createdBy','lastModifiedAt','lastModifiedBy','_id'];
		var pdf = new jsPDF();
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
		var forms = document.getElementById('forms');
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

		function downLoadAsOne(){
			vm.selectedRows = vm.tableOptions.selection.selected[0];
			entryMgmtServices.getFormGroupData(vm.selectedRows.groupName)
			.then(function(res){
				vm.formData = res.data;

				for(var x = 0; x < vm.formData.length; x++) {
					vm.totalNumberOfPages[x] = vm.formData[x].numberOfPages;
				}
				vm.numberOfForms = vm.totalNumberOfPages.length;
				vm.numberOfPages = vm.totalNumberOfPages[0];
				vm.numberOfPreviewPages = vm.totalNumberOfPages[0];

				for(var k=1; k<=vm.formData.length; k++){ //k is the form number
					var form = vm.formData[k-1];
					var elements = form.elements;
					for (var j = 1; j <= form.numberOfPages; j++) { //j is page number
						var newPage = newPageTemplate.cloneNode(true);
						newPage.setAttribute("id", 'form' + k + 'page' + j);
						newPage.style.display = "none";
						forms.appendChild(newPage);
					}
					for (key in elements){
						var element = elements[key];
						if(element.name.startsWith('background_')){
							var node = document.createElement('img');
							node.src = element.src;	
							node.style.zIndex="0";
						}else if(element.name.startsWith('label_')){
							var node = document.createElement('div');
							node.innerHTML = element.content;
							node.style.whiteSpace="pre-wrap";
							node.style.color = element.color;
							node.style.backgroundColor = element.backgroundColor;
							node.style.fontFamily = element.fontFamily;
							node.style.fontSize = element.fontSize;
							node.style.textDecoration = element.textDecoration;
							node.style.zIndex="1";
						}else if(element.name.startsWith('auto_text') || element.name.startsWith('text_')){
							var node = document.createElement('input');
							var newName = slugify(element.name);
							node.setAttribute('ng-value', 'selectedRows.' + newName);				
							node.type='text';
							node.style.color = element.color;
							node.style.backgroundColor = element.backgroundColor;
							node.style.fontFamily = element.fontFamily;
							node.style.fontSize = element.fontSize;
							node.style.textDecoration = element.textDecoration;
							node.style.zIndex="1";
						}else if(element.name.startsWith('auto_checkbox') || element.name.startsWith('checkbox_')){
							var node = document.createElement('label');
							var span = document.createElement('span');
							var checkbox = document.createElement('input');
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
							var node = document.createElement('select');
							var newName = slugify(element.name);
							var testScope = 'vm.entryData.' + newName;
							node.setAttribute('ng-value', testScope);
							var options = element.options;
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
							var node = document.createElement('form');
							var newName = slugify(element.name);
							var testScope = 'vm.entryData.' + newName;						
							var options = element.options;
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
							var node = document.createElement('img');
							var newName = slugify(element.name);
							var testScope = 'vm.entryData.' + newName;
							node.setAttribute('ng-model', testScope);
							var testImageString = 'data:image/png;base64,' + '{{' + testScope + '}}';
							node.setAttribute('ng-src', testImageString);
							node.setAttribute('ng-click', 'vm.openModal(' + '"' + newName + '"' + ')');
							node.style.backgroundColor = element.backgroundColor;
							node.style.zIndex="1";
						}else if (element.name.startsWith('image_')) {
							var node = document.createElement('img');
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
						var page = document.getElementById('form'+k+'page'+element.page);
						page.appendChild(node);
						$compile(node)($scope);
					}
				}		
				document.getElementById("form1page1").style.display="block"; 
			})
			.then(function(){
				// get group name from rows
				var p = beforeGeneratePDF();
				for (var f = 1; f <= vm.numberOfForms; f++) {
					for (var i = 1; i <= vm.numberOfPages; i++) {
						p = p.then(function (pageNumber) { return addPagePromise(pageNumber) });
						p = p.then(function (pageNumber) { return generateImagePromise(pageNumber) });
						p = p.then(function (pageNumber) { return finishAddImagePromise(pageNumber) });
					}
				}

				vm.currentFormPreview = 1;
				vm.numberOfPreviewPages = vm.totalNumberOfPages[0];
				p.then(function (pageNumber) { return afterGeneratePDF(); });		
			})	
		}

		/*************** DOWNLOAD PDF FUNCTIONS ***************/

		function beforeGeneratePDF(){
			var deferred = $q.defer();
			for (var s = 0; s < vm.formData.length; s++) {
				var elements = vm.formData[s];

				for(key in elements){
					if (key.startsWith("auto_radio") || key.startsWith("radio")) {
						var radio = document.getElementById(key); //?
						if(radio.firstChild){
							for(var i=0; i<radio.childNodes.length;i++){
								if (radio.childNodes[i].firstChild.checked === true) radio.childNodes[i].firstChild.setAttribute("checked",true);
							}
						}
					}
					if (key.startsWith("auto_dropdown") || key.startsWith("dropdown")) {
						var dropdown = document.getElementById(key);
						if(dropdown.firstChild){
							for(var i=0; i<dropdown.childNodes.length;i++){
								if (dropdown.childNodes[i].value === dropdown.value) dropdown.childNodes[i].setAttribute("selected",true);
							}
						}
					}
					if (key.startsWith("auto_checkbox") || key.startsWith("checkbox")) {
						var label = document.getElementById(key);
						if (label.firstChild.checked) label.firstChild.setAttribute("checked",true);
					}
				}
			}		
			deferred.resolve(1);
			return deferred.promise;
		}

		function addPagePromise(pageNumber) {
			var deferred = $q.defer();
			if (vm.currentFormPreview != 1 || pageNumber != 1) {
				pdf.addPage();
			}
			deferred.resolve(pageNumber);
			return deferred.promise;
		}

		// drawing all the elements on a canvas, making it an image
		function generateImagePromise(pageNumber) {
			var deferred = $q.defer();
			var formNumber = vm.currentFormPreview;
			var canvas = document.createElement("canvas");
			canvas.width = 794;
			canvas.height = 1123;
			canvas.style.width = '794px';
			canvas.style.height = '1123px';
			var context = canvas.getContext('2d');
			var code = document.getElementById("form" + formNumber + "page" + pageNumber).innerHTML;
			code = code.replace(/ on\w+=".*?"/g, "");
			rasterizeHTML.drawHTML(code).then(function (renderResult) {
				context.drawImage(renderResult.image, 0, 0);
				deferred.resolve(pageNumber);
			});
			return deferred.promise;
		}

		// adds the image onto a page in html
		function finishAddImagePromise(pageNumber) {
			var deferred = $q.defer();
			formNumber = vm.currentFormPreview;
			imgurl = canvas.toDataURL('image/png');	
			pdf.addImage(imgurl, "JPEG", 0, 0);
			if (formNumber === vm.numberOfForms && pageNumber === vm.numberOfPreviewPages) { // finished everything
				pdf.save();
			} else if (pageNumber === vm.numberOfPreviewPages) { // reached the end of the form, switch to next form
				vm.currentFormPreview++;
				if (vm.currentFormPreview <= vm.numberOfForms) {
					vm.numberOfPreviewPages = vm.totalNumberOfPages[vm.currentFormPreview-1];
					deferred.resolve(1);
				}
			} else { // havent reached the end of the form yet
				deferred.resolve(pageNumber + 1);
			}
			return deferred.promise;
		}	

		function afterGeneratePDF(){
			var deferred = $q.defer(); 
			for (var t = 0; t < vm.formData.length; t++) {
				var elements = vm.formData[t];

				for(key in elements){
					if (key.startsWith("auto_radio") || key.startsWith("radio")) {
						var radio = document.getElementById(key);
						if(radio.firstChild){
							for(var i=0; i<radio.childNodes.length;i++){
								if (radio.childNodes[i].firstChild.hasAttribute("checked")) {
									radio.childNodes[i].firstChild.removeAttribute("checked");
									radio.childNodes[i].firstChild.checked = true;
								}
							}
						}
					}
					if (key.startsWith("auto_dropdown") || key.startsWith("dropdown")) {
						var dropdown = document.getElementById(key);
						if(dropdown.firstChild){
							for(var i=0; i<dropdown.childNodes.length;i++){
								if (dropdown.childNodes[i].hasAttribute("selected")) dropdown.childNodes[i].removeAttribute("selected");
							}
						}
					}
					if (key.startsWith("auto_checkbox") || key.startsWith("checkbox")) {
						var label = document.getElementById(key);
						if (label.firstChild.hasAttribute("checked")) {
							label.firstChild.removeAttribute("checked");
							label.firstChild.checked = true;
						}
					}
				}
			}
			deferred.resolve();
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

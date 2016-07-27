angular
    .module('app.newEntry')
    .controller("newEntryCtrl", [
    	'$stateParams', 
    	'entryService',
    	'autofillServices', 
    	'formsFactory',
    	'formBuilderFactory', 
    	'$scope', 
    	'$q',
    	'$compile', 
    	'pdfFactory',
    	'$rootScope',
    	'$location', 
    	'$timeout', 

    function (
    	$stateParams, 
    	entryService, 
    	autofillServices,
    	formsFactory, 
    	formBuilderFactory,
    	$scope, 
    	$q, 
    	$compile,
    	pdfFactory,
    	$rootScope,
    	$location, 
    	$timeout
    	) {

    var viewContentLoaded = $q.defer();
        
	var vm = this;
	var preview = document.getElementById('preview');
	var forms = document.getElementById('forms');
	var pdf = new jsPDF();

	/*****************************************************************/

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

	/*****************************************************************/

	var newPageTemplate = newPage2;

	// variables that contain base-64 encoding converted from user input
	vm.image = null;
	vm.text = null;
	vm.dropdown = null;
	vm.radio = null;

	vm.signatureId = [];

	vm.groupName = $stateParams.groupName;


	/*********** ARRAY VARIABLES THAT STORE FORM/ENTRY DATA **********/

	// this formData stores the current selected forms that are going to be used to create an entry
	vm.formData = [];

	// this parsedFormData stores objects that contain the type, name, label, data of the all the elements taken from formData
	vm.parsedFormData = [];

	/* this entryData stores the final data structure for an entry, which contains the groupName  
		and the relevant fields obtained from the form database	*/
	vm.entryData = {};  

	/********************** PREVIEW FUNCTIONS ************************/
	
	vm.previewStart = previewStart;
	vm.generateImagePromise = generateImagePromise;
	vm.addToPreviewPromise = addToPreviewPromise;
	vm.isESCDeletePreview = isESCDeletePreview;
	vm.openDialog = openDialog;
	vm.previewDeleteAll = previewDeleteAll;	
	vm.downloadPreview = downloadPreview;
	vm.downloadPDF = downloadPDF;
	vm.addPagePromise = addPagePromise;
	vm.finishAddImagePromise = finishAddImagePromise;
	

	/****************** PAGE NAGIVATION VARIABLES ********************/

	vm.goToPageNumber = 1;
	vm.currentPageNumber = 1;
	vm.numberOfPages = 1;
	vm.totalNumberOfPages = [];
	vm.currentFormNumber = 1;
	vm.numberOfForms = 1;

	/*****************************************************************/

	vm.currentFormPreview = 1;
	vm.numberOfPreviewPages = 1;

    $scope.$on('$viewContentLoaded', function () {
        $timeout(function () {
            viewContentLoaded.resolve();
            
        }, 0);
    });
    viewContentLoaded.promise.then(function () {
        $timeout(function () {
            componentHandler.upgradeDom();          
        }, 0);  
    });

    function slugify(text) {
	  	return text.toString().toLowerCase()
	    .replace(/\s+/g, '_')           // Replace spaces with -
	    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
	    .replace(/\-\-+/g, '_')         // Replace multiple - with single -
	    .replace(/^-+/, '')             // Trim - from start of text
	    .replace(/-+$/, '');            // Trim - from end of text
	}


	/* This long, core function gets the formData from the form database, then parse the formData to form key/value pair in parsedFormData, then
	create a proper entry data structure, then finally print out the preview of all the forms in the group*/

	vm.getFormData = entryService.getFormElements(vm.groupName)
		.then(function(res){
		    vm.formData = res.data;
			for(var x = 0; x < vm.formData.length; x++) {
				vm.totalNumberOfPages[x] = vm.formData[x].numberOfPages;
			}
			vm.numberOfForms = vm.totalNumberOfPages.length;
			vm.numberOfPages = vm.totalNumberOfPages[0];
			vm.numberOfPreviewPages = vm.totalNumberOfPages[0];
		})
		.then(function() {
				var arrayOfKeys = [];
					var key;
					for (var i = 0; i < vm.formData.length ; i++){
				 	   var data = vm.formData[i];
				  	  	var elements = data.elements;
				  	  	vm.entryData.formName = vm.formData[i].formName;
				   	 for (key in elements) {
						var element = elements[key];
						//console.log("how many times");
						var object = {};
						if (element.name.startsWith('text_')) {
							var slugName = slugify(element.name);
						    var index = element.name.indexOf('_');
					    	var fieldName = element.name.substring(index+1, element.name.length);
					    	var def = element.default;
						    var noDuplicate = true;
						    // check for duplication here
						    for(var j=0; j<arrayOfKeys.length; j++) {
								if (fieldName !== arrayOfKeys[j]) {
								    continue;
								} else {
								    noDuplicate = false;
								    break;
								}
						    }

						    if (noDuplicate) {
						    	object.type = 'text';
						        object.name = slugName;
						        object.label = fieldName;
						        object.data = def;

						    }

						    arrayOfKeys.push(object);

						} else if (element.name.startsWith('dropdown_')) {
							var slugName = slugify(element.name);
						    var index = element.name.indexOf('_');
					    	var fieldName = element.name.substring(index+1, element.name.length);
					    	var options = element.options;
					    	var def = element.default;
						    var noDuplicate = true;
						    // check for duplication here
						    for(var j=0; j<arrayOfKeys.length; j++) {
								if (fieldName !== arrayOfKeys[j]) {
								    continue;
								} else {
								    noDuplicate = false;
								    break;
								}
						    }						    

						    if (noDuplicate) {
						    	object.type = 'dropdown';
						        object.name = slugName;
						        object.label = fieldName;
						        object.options = options;
						        object.data = def;

						    }

						    arrayOfKeys.push(object);

						}  else if (element.name.startsWith('checkbox_')) {
							var slugName = slugify(element.name);
						    var index = element.name.indexOf('_');
					    	var fieldName = element.name.substring(index+1, element.name.length);
					    	var def = element.default;
						    var noDuplicate = true;
						    // check for duplication here
						    for(var j=0; j<arrayOfKeys.length; j++) {
								if (fieldName !== arrayOfKeys[j]) {
								    continue;
								} else {
								    noDuplicate = false;
								    break;
								}
						    }

						    if (noDuplicate) {
						    	object.type = 'checkbox';
						        object.name = slugName;
						        object.label = fieldName;
						        object.data = def;

						    }

						    arrayOfKeys.push(object);

						} else if (element.name.startsWith('radio_')) {
							var slugName = slugify(element.name);
						    var index = element.name.indexOf('_');
					    	var fieldName = element.name.substring(index+1, element.name.length);
					    	var options = element.options;
					    	var def = element.default;
						    var noDuplicate = true;
						    // check for duplication here
						    for(var j=0; j<arrayOfKeys.length; j++) {
								if (fieldName !== arrayOfKeys[j]) {
								    continue;
								} else {
								    noDuplicate = false;
								    break;
								}
						    }

						    if (noDuplicate) {
						    	object.type = 'radio';
						        object.name = slugName;
						        object.label = fieldName;
						        object.options = options;
						        object.data = def;
			        
						    }

						    arrayOfKeys.push(object);

						} else if (element.name.startsWith('image_')) {
							var slugName = slugify(element.name);
							var index = element.name.indexOf('_');
					    	var fieldName = element.name.substring(index+1, element.name.length);
							object.type = 'image';
					        object.name = slugName;
					        object.label = fieldName;
					        object.data = '';

					        arrayOfKeys.push(object);

						} else if (element.name.startsWith('signature_')) {
							vm.gotSignature = true;
							var slugName = slugify(element.name);
							var index = element.name.indexOf('_');
					    	var fieldName = element.name.substring(index+1, element.name.length);
							object.type = 'signature';
					        object.name = slugName;
					        object.label = fieldName;
					        object.data = '';
                            vm.signatureId.push(fieldName);

					        arrayOfKeys.push(object);
					    }
				    }
				}
				vm.parsedFormData = arrayOfKeys;
		})
		.then(function(){
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
						var testScope = 'vm.entryData.' + newName;
						node.setAttribute('ng-value', testScope);						
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
						checkbox.checked = element.default;
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
						node.style.backgroundColor = element.backgroundColor;
						node.style.zIndex="1";
					}else if (element.name.startsWith('image_')) {
						var node = document.createElement('img');
						var newName = slugify(element.name);
						var testScope = 'vm.entryData.' + newName + '.base64';
						node.setAttribute('ng-model', testScope);
						var testImageString = 'data:image/png;base64,' + '{{' + testScope + '}}';
						node.setAttribute('ng-src', testImageString); 
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

	/******************* PAGE & FORM NAVIGATION FUNCTIONS ********************/

	vm.toPreviousPage = function() {
		//toolbar.style.display = "none";
		if (vm.currentPageNumber == 1) {
			alert("This is the first page.");
		} else {
			document.getElementById("form" + vm.currentFormNumber + "page" + vm.currentPageNumber).style.display = "none";
			vm.currentPageNumber--;
			currentPage = document.getElementById("form" + vm.currentFormNumber+ "page" + vm.currentPageNumber);
			currentPage.style.display = "block";
		}
	}

	vm.toNextPage = function() {
		//toolbar.style.display = "none";
		if (vm.currentPageNumber == vm.numberOfPages) {
			alert("This is the last page.");
		} else {
			document.getElementById("form" + vm.currentFormNumber + "page" + vm.currentPageNumber).style.display = "none";
			vm.currentPageNumber++;
			currentPage = document.getElementById("form" + vm.currentFormNumber + "page" + vm.currentPageNumber);
			currentPage.style.display = "block";
		}
	}

	vm.goToPage = function() {
	    currentPage = document.getElementById("form" + vm.currentFormNumber + "page" + vm.currentPageNumber);
		//toolbar.style.display = "none";
		currentPage.style.display = "none";
		vm.currentPageNumber = vm.goToPageNumber;
		currentPage = document.getElementById("form" + vm.currentFormNumber + "page" + vm.currentPageNumber);
		currentPage.style.display = "block";
	}

	vm.toPreviousForm = function() {
		if (vm.currentFormNumber == 1) {
			alert("This is the first form.");
		} else {
			document.getElementById("form" + vm.currentFormNumber + "page" + vm.currentPageNumber).style.display = "none";
			vm.currentFormNumber--;
			vm.numberOfPages = vm.totalNumberOfPages[vm.currentFormNumber-1];
			vm.currentPageNumber = 1;
			currentPage = document.getElementById("form" + vm.currentFormNumber+ "page1");
			currentPage.style.display = "block";	
		}
	}

	vm.toNextForm = function() {
		if (vm.currentFormNumber == vm.numberOfForms) {
			alert("This is the last form.");
		} else {
			document.getElementById("form" + vm.currentFormNumber + "page" + vm.currentPageNumber).style.display = "none";
			vm.currentFormNumber++;
			vm.numberOfPages = vm.totalNumberOfPages[vm.currentFormNumber-1];
			vm.currentPageNumber = 1;
			currentPage = document.getElementById("form" + vm.currentFormNumber + "page1");
			currentPage.style.display = "block";
		}
	}

	/*************************************************************************/


	/*********************** SIGNATURE PAD FUNCTIONS *************************/

	vm.openModal = function(name) {
        vm.wrapper = angular.element(document.getElementById(name));
        vm.dialog = angular.element(vm.wrapper.find('dialog'))[0];
        vm.canvas = angular.element(vm.wrapper.find('canvas'))[0];
        vm.signaturePad = new SignaturePad(vm.canvas);  
        vm.dialog.showModal();  
    }
	
	vm.closeModal = function() {
		vm.dialog.close();	
	}

	/*vm.clear = function() {
		vm.signaturePad.clear();
	};*/

	vm.save = function() {
	 	var dataURL = vm.signaturePad.toDataURL('image/png',1);
		var data = dataURL.substr(dataURL.indexOf('base64') + 7)
		return data;
	}

	function showSnackbar(msg) {
		var msgSnackbar = {
			message: msg,
			timeout: 5000
		}
		var snackbarContainer = document.querySelector('#snackbar-div');
		console.log(snackbarContainer);
		snackbarContainer.MaterialSnackbar.showSnackbar(msgSnackbar);
	}

	/*************************************************************************/

	/*************************** PREVIEW FUNCTIONS ***************************/

	function previewStart() {
		while (preview.firstChild) {
			preview.removeChild(preview.firstChild);
		}
		var p = beforeGeneratePDF();
		for (var n = 1; n <= vm.numberOfForms; n++) {
			for (var i = 1; i <= vm.numberOfPages; i++) {
				p = p.then(function (pageNumber) { return generateImagePromise(pageNumber) });
				p = p.then(function (pageNumber) { return addToPreviewPromise(pageNumber) });
			}
		}	
		// re-initialize values
		vm.currentFormPreview = 1;
		vm.numberOfPreviewPages = vm.totalNumberOfPages[0];
		p.then(function (pageNumber) { return afterGeneratePDF(); });
	}

	function generateImagePromise(pageNumber) {
		var deferred = $q.defer();
		var formNumber = vm.currentFormPreview;
		canvas = document.createElement("canvas");
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

	function addToPreviewPromise(pageNumber) {
		var deferred = $q.defer();
		var formNumber = vm.currentFormPreview;
		imgurl = canvas.toDataURL('image/jpeg', 1);
		pdfFactory.addData(imgurl);
		var newImg = document.createElement("img");
		newImg.style.position = "relative";
		newImg.src = imgurl;
		preview.appendChild(newImg);
		newImg.style.margin = "5% 10% 5% 10%";
		newImg.style.width = "794px";
		newImg.style.height = "1123px";
		if (formNumber === vm.numberOfForms && pageNumber === vm.numberOfPreviewPages ) {
			openDialog('previewDialog');
		} else if (pageNumber === vm.numberOfPreviewPages) {
			vm.currentFormPreview++;
			if (vm.currentFormPreview <= vm.numberOfForms) {
				vm.numberOfPreviewPages = vm.totalNumberOfPages[vm.currentFormPreview-1];
				deferred.resolve(1);
				//TODO: DIDNT RETURN HERE
			} else {
				openDialog('previewDialog');
			}			
		} else {
			deferred.resolve(pageNumber + 1);
		}		
		return deferred.promise;
	}


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

	function isESCDeletePreview(e) {
		var pressedKeyValue = e.keyCode;
		if (pressedKeyValue === 27) {
			vm.previewDeleteAll();
		}
	}

	function openDialog(dialogName) {
		var dialog = document.querySelector('#' + dialogName);
		if (!dialog.showModal) {
			dialogPolyfill.registerDialog(dialog);
		}
		dialog.showModal();
	};

	function previewDeleteAll() {
		while (preview.firstChild) {
			preview.removeChild(preview.firstChild);
		}
		previewDialog.close();
		pdfFactory.resetData();
	}

	function downloadPreview() {
		var pageData = pdfFactory.getData();
		console.log('how many pages ' + pageData.length);
		pdf = new jsPDF();
		var page = vm.totalNumberOfPages[0];
		var count = 1;
		for (var f = 1; f <= vm.numberOfForms; f++) { 
			for (var i = 1; i <= page; i++) {
				if (i != 1) {
					pdf.addPage();
				}
				pdf.addImage(pageData[count - 1], "JPEG", 0, 0);
				count++;
				if (i === page) {
					page = vm.totalNumberOfPages[f];
				}
			}
			if (f === vm.numberOfForms) {
				pdf.save();
			}
		}
	}

	function downloadPDF() {
		pdf = new jsPDF();
		var p = beforeGeneratePDF();
		for (var f = 1; f <= vm.numberOfForms; f++) {
			for (var i = 1; i <= vm.numberOfPages; i++) {
				p = p.then(function (pageNumber) { return addPagePromise(pageNumber) });
				p = p.then(function (pageNumber) { return generateImagePromise(pageNumber) });
				p = p.then(function (pageNumber) { return finishAddImagePromise(pageNumber) });
			}
		}
		// re-initialize values
		vm.currentFormPreview = 1;
		vm.numberOfPreviewPages = vm.totalNumberOfPages[0];
		p.then(function (pageNumber) { return afterGeneratePDF(); });
	}

	function addPagePromise(pageNumber) {
		var deferred = $q.defer();
		if (vm.currentFormPreview != 1 || pageNumber != 1) {
			pdf.addPage();
		}
		deferred.resolve(pageNumber);
		return deferred.promise;
	}

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

	/*************************************************************************/

	// Function to create an entry
	vm.createEntry = function() {
		vm.finalData = {
			groupName    : vm.groupName,
			creationDate : Date(),
			lastModified : Date(),
			data         : vm.entryData
	    };
	    entryService.create(vm.finalData)  
	        .success(function(data) {
		    // clear the form
		    vm.formData = {};
		    vm.message = data.message;
		    location.reload()
	    });
	};

}]);
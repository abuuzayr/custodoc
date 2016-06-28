angular
	.module('formBuilderApp')
	.controller('formBuilderCtrl', [
		'$scope',
		'$http',
		'$window',
		'$rootScope',
		'$q',
		'$compile',
		'pdfFactory',
		'ngProgressFactory',
		'formBuilderFactory',
		'$timeout',
		'$stateParams',
		'$state',
		formBuilderCtrl
	]);
function formBuilderCtrl(
	$scope,
	$http,
	$window,
	$rootScope,
	$q,
	$compile,
	pdfFactory,
	ngProgressFactory,
	formBuilderFactory,
	$timeout,
	$stateParams,
	$state
	) {

	 var viewContentLoaded = $q.defer();
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

	//initialization
	var vm = this;
	vm.saved = true;
	vm.progressbar = ngProgressFactory.createInstance();
	vm.progressbar.setHeight("3px");
	var pdf = new jsPDF();
	var currentPage = document.getElementById("page1");
	vm.moveToPageNumber = 1;
	vm.goToPageNumber = 1;
	vm.numberOfPages = 1;
	vm.currentPageNumber = 1;
	vm.allowCreate = true;
	vm.availableFontsizes = formBuilderFactory.availableFontsizes;
	vm.availableBorderWidth = formBuilderFactory.availableBorderWidth;
	vm.availableBorderRadii = formBuilderFactory.availableBorderRadii;
	vm.colorsArray = formBuilderFactory.colorsArray;
	vm.fontsArray = formBuilderFactory.fontsArray;
	vm.labelContent = "";
	vm.signatureFieldName = "";
	vm.newAutofillElementId = "";
	var elements = {};
	var formData = {};
	vm.autofillElements = [];
	vm.options = [];
	vm.editOptions = [];
	vm.editNewOption = ""
	vm.newOption = "";
	vm.required = true;
	vm.imageFieldName = "";
	vm.textFieldName = "";
	vm.Fontsize = "16px";
	vm.FontType = 'Arial';
	vm.FontColor = "black";
	vm.TextDecoration = "none";
	vm.Opacity = 1;
	vm.BackgroundColor = "white";
	vm.BorderStyle = "solid";
	vm.BorderWidth = "1px";
	vm.BorderRadius = "0px";
	vm.BorderColor = "black";
	vm.file = null;
	vm.imageString = "";
	vm.imgChosen = false;
	vm.newElementType = "";
	var fontPanel = document.getElementById("fontPanel");
	var contentPanel = document.getElementById("contentPanel");
	var optionsPanel = document.getElementById("optionsPanel");
	var editBackgroundColorLabel = document.getElementById("editBackgroundColorLabel");
	var editRequiredLabel = document.getElementById("editRequiredLabel");
	var placeholder = null;
	var toolbar = document.getElementById("toolbar");
	var labelCreation = document.getElementById("labelCreation");
	var textFieldCreation = document.getElementById("textFieldCreation");
	var imageFieldCreation = document.getElementById("imageFieldCreation");
	var signatureFieldCreation = document.getElementById("signatureFieldCreation");
	var imgUpload = document.getElementById("imgUpload");
	var newElementPosition = { x: 0, y: 0 };
	var form = document.getElementById("form");
	var body = document.getElementById("body");
	var progressBar = document.getElementById("progressBar");
	var previewDialog = document.getElementById("previewDialog");
	var snackbarContainer = document.getElementById("snackbarContainer");
	vm.previewDialog = previewDialog;
	var preview = document.getElementById("preview");
	var imgurl = "";
	var canvas = null;
	vm.groupName = $stateParams.groupName;
	vm.formName = $stateParams.formName;
	if(vm.formName==''||vm.groupName==''){
			alert('Cannot find the form.');
			$state.go('forms');
	}
	//page node
	var newPageTemplate = formBuilderFactory.newPage;

	var defaultWidth = 300;
	var defaultHeight = 150;

	//drag icon initialization

	var dragIcon = document.createElement("img");
	dragIcon.src = 'images/image.jpg';

	//define all the functions
	vm.maxSizeWarning = maxSizeWarning;
	vm.getAutofillElements = getAutofillElements;
	vm.saveForm = saveForm;
	vm.downloadPDF = downloadPDF;
	vm.previewStart = previewStart;
	vm.downloadPreview = downloadPreview;
	vm.previewDeleteAll = previewDeleteAll;
	vm.isESCDeletePreview = isESCDeletePreview;
	vm.addPagePromise = addPagePromise;
	vm.generateImagePromise = generateImagePromise;
	vm.addToPreviewPromise = addToPreviewPromise;
	vm.finishAddImagePromise = finishAddImagePromise;
	vm.addPage = addPage;
	vm.deletePage = deletePage;
	vm.toPreviousPage = toPreviousPage;
	vm.toNextPage = toNextPage;
	vm.goToPage = goToPage;
	vm.movePage = movePage;
	vm.reset = reset;
	vm.dragStart = dragStart;
	vm.drop = drop;
	vm.allowDrop = allowDrop;
	vm.createPlaceholder = createPlaceholder;
	vm.hideToolbar = hideToolbar;
	vm.deleteElement = deleteElement;
	vm.elementOnclick = elementOnclick;
	vm.editAddNewOption = editAddNewOption;
	vm.editDeleteOption = editDeleteOption;
	vm.setNewElement = setNewElement;
	vm.addNewOption = addNewOption;
	vm.deleteOption = deleteOption;
	vm.addImg = addImg;
	vm.createDropdownList = createDropdownList;
	vm.createTextField = createTextField;
	vm.createImageField = createImageField;
	vm.createSignatureField = createSignatureField;
	vm.createLabel = createLabel;
	vm.getCrossBrowserElementCoords = getCrossBrowserElementCoords;
	vm.openDialog = openDialog;
	vm.closeDialog = closeDialog;
	vm.removePlaceholder = removePlaceholder;
	vm.addNewAutofillElement = addNewAutofillElement;

	//warn the user when changing state or refreshing without saving the form
	$scope.$on('$stateChangeStart', function( event ) {
		if(!vm.saved){
			var answer = confirm("Do you want to save the form before you leave this page?")
			if (answer) {
				saveForm();
			}
		}
	});
	
	window.onbeforeunload = function (event) {
		if(!vm.saved) return "Are you sure to reload?";
	}

	//remove place holder when close dialog
	document.getElementById('label').addEventListener("close", removePlaceholder);
	document.getElementById('text').addEventListener("close", removePlaceholder);
	document.getElementById('dropdown').addEventListener("close", removePlaceholder);
	document.getElementById('imageField').addEventListener("close", removePlaceholder);
	document.getElementById('signatureField').addEventListener("close", removePlaceholder);
	document.getElementById('imgUpload').addEventListener("close", removePlaceholder);

	formBuilderFactory.getFormData(vm.groupName,vm.formName)
		.then(function(res){
			var formData = res.data;
			elements = formData.elements;
			vm.numberOfPages = formData.numberOfPages;
			if (vm.numberOfPages >1){
				for(var i=2;i<=vm.numberOfPages;i++){
					var newPage = newPageTemplate.cloneNode(true);
					newPage.setAttribute("id","page"+i);
					newPage.style.display="none";
					form.appendChild(newPage);
				}
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
					node.type='text';
					node.setAttribute('readonly','readonly');
					node.style.color = element.color;
					node.style.backgroundColor = element.backgroundColor;
					node.style.fontFamily = element.fontFamily;
					node.style.fontSize = element.fontSize;
					node.style.textDecoration = element.textDecoration;
					node.required = element.required;
					node.style.zIndex="1";
				}else if(element.name.startsWith('auto_dropdown') || element.name.startsWith('dropdown_')){
					var node = document.createElement('button');
					var options = element.options;
					if(options.length>0){
						for(var i = 0; i<options.length; i++){
							var option = document.createElement('option');
							option.innerHTML=options[i];
							node.appendChild(option);
						}
					}
					node.style.color = element.color;
					node.style.backgroundColor = element.backgroundColor;
					node.style.fontFamily = element.fontFamily;
					node.style.fontSize = element.fontSize;
					node.style.textDecoration = element.textDecoration;
					node.style.zIndex="1";
				}else if(element.name.startsWith('signature_')){
					var node = document.createElement('canvas');
					node.style.backgroundColor = element.backgroundColor;
					node.style.zIndex="1";
				}else if (element.name.startsWith('image_')) {
					var node = document.createElement('canvas');
					node.style.backgroundColor = element.backgroundColor;
					node.style.zIndex="1";
				}
				node.style.opacity = element.opacity;
				node.style.border = element.border;
				node.style.borderRadius = element.borderRadius;
				node.setAttribute("data-x","0");
				node.setAttribute("data-y","0");
				node.setAttribute("class","resize-drag");
				node.setAttribute("ng-dblclick","vm.elementOnclick($event)");
				$compile(node)($scope);
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
				var page = document.getElementById('page'+element.page);
				page.appendChild(node);
			}
		},function(res){
			alert('Cannot find the form.');
			$state.go('forms');
		});

	vm.getAutofillElements();

	function maxSizeWarning(){
		if(vm.file && vm.file.filesize>2000000){
			return {color:'red'};
		}
	}

	//autofill element management

	function addNewAutofillElement(){
		$http.post("http://localhost:3000/autofill/element", 
			{fieldName:vm.newAutofillElementName,type:vm.newAutofillElementType},
			{headers: {'Content-Type': 'application/json'} })
			.then(function(res){
				vm.getAutofillElements();
				snackbarContainer.MaterialSnackbar.showSnackbar(
					{ message: "Added new element." });
			},function(res){
				if (res.status===409) alert('Autofill element already exists.');
				else alert('Failed to add new element.');
			});
	}

	function getAutofillElements(){
		$http.get("http://localhost:3000/autofill/element")
			.then(function(res){
				var data = res.data;
				vm.autofillElements=[];
				for(var i=0;i<data.length;i++) vm.autofillElements.push(data[i]);
			},function(res){
				alert('Failed to retrieve autofill elements.');
			});
	}

	//get all the elements data and save the form
	function saveForm() {
		formData.numberOfPages = vm.numberOfPages;
		for (var i = 1; i <= vm.numberOfPages; i++) {
			var page = document.getElementById("page" + i);
			for (var j = 1; j < page.childNodes.length; j++) {
				var node = page.childNodes[j];
				if((node.nodeType!==1)||(!node.hasAttribute('name'))) {
					continue;
				}
				var id = node.id;
				elements[id] = {};
				elements[id].name = node.getAttribute("name");
				elements[id].page = i;
				elements[id].width = parseInt(node.style.width);
				elements[id].height = parseInt(node.style.height);
				elements[id].border = node.style.border;
				elements[id].borderRadius = node.style.borderRadius;
				elements[id].opacity = node.style.opacity;
				elements[id].top = parseInt(node.style.top) + parseInt(node.getAttribute("data-y"));
				elements[id].left = parseInt(node.style.left) + parseInt(node.getAttribute("data-x"));
				if (id.startsWith("background")) {
					elements[id].type = "background";
					elements[id].src = node.getAttribute("src");
				} else {
					elements[id].backgroundColor = node.style.backgroundColor;
				}
				if(id.startsWith("signature")){
					elements[id].type = "signature";
				}
				if(id.startsWith("image")){
					elements[id].type = "image";
				}
				if (id.startsWith("dropdown") || id.startsWith("auto_dropdown") || id.startsWith("auto_text") || id.startsWith("text") || id.startsWith("label")) {
					elements[id].fontSize = node.style.fontSize;
					elements[id].color = node.style.color;
					elements[id].fontFamily = node.style.fontFamily;
					elements[id].textDecoration = node.style.textDecoration;
					if (id.startsWith("auto_text") || id.startsWith("text")) {
						elements[id].required = node.required;
						elements[id].type = "text";
					} else if(id.startsWith("label")){
						elements[id].content = node.innerHTML;
						elements[id].type = "label";
					}else if (id.startsWith("dropdown") || id.startsWith("auto_dropdown")) {
						elements[id].options=[];
						elements[id].type = "dropdown";
						if (node.lastChild) {
							for(var k=0; k<node.childNodes.length; k++){
								var option = node.childNodes[k];
								if(option.tagName && option.tagName ==='OPTION') elements[id].options.push(option.innerHTML);
							}
						}
					}
				}
			}
		}
		formData.elements = elements;
		formData.groupName = vm.groupName;
		formData.formName = vm.formName;
		formBuilderFactory.saveFormData(formData)
			.then(function (data, status, config, headers) {
				snackbarContainer.MaterialSnackbar.showSnackbar(
					{ message: "Saved the form" });
				vm.saved = true;
			}, function (data) {
				if(data.status===404){
					var formData = {groupName:vm.groupName,formName:vm.formName};
					$http.post("http://localhost:3000/forms", {formData:formData}, {headers: {'Content-Type': 'application/json'} })
						.then(function(res){
							saveForm();
						});
				} else{
					snackbarContainer.MaterialSnackbar.showSnackbar(
						{ message: "Failed to save the form. Please try again." });
				}
			});
	}

	function downloadPDF() {
		if (vm.allowCreate) {
			vm.hideToolbar();
			vm.progressbar.start();
			vm.progressbar.set(0);
			pdf = new jsPDF();
			var deferred = $q.defer();
			deferred.resolve(1);
			var p = deferred.promise;
			for (var i = 1; i <= vm.numberOfPages; i++) {
				p = p.then(function (pageNumber) { return addPagePromise(pageNumber) });
				p = p.then(function (pageNumber) { return generateImagePromise(pageNumber) });
				p = p.then(function (pageNumber) { return finishAddImagePromise(pageNumber) });
			}
		}
	}

	function previewStart() {
		if (vm.allowCreate) {
			vm.progressbar.start();
			vm.progressbar.set(0);
			while (preview.firstChild) {
				preview.removeChild(preview.firstChild);
			}
			vm.hideToolbar();
			var deferred = $q.defer();
			deferred.resolve(1);
			var p = deferred.promise;
			for (var i = 1; i <= vm.numberOfPages; i++) {
				p = p.then(function (pageNumber) { return generateImagePromise(pageNumber) });
				p = p.then(function (pageNumber) { return addToPreviewPromise(pageNumber) });
			}
		}
	}

	function downloadPreview() {
		var pageData = pdfFactory.getData();
		pdf = new jsPDF();
		for (var i = 1; i <= vm.numberOfPages; i++) {
			if (i != 1) {
				pdf.addPage();
			}
			pdf.addImage(pageData[i - 1], "JPEG", 0, 0);
			if (i === vm.numberOfPages) {
				pdf.save();
			}
		}
	}

	function previewDeleteAll() {
		while (preview.firstChild) {
			preview.removeChild(preview.firstChild);
		}
		previewDialog.close();
		pdfFactory.resetData();
	}

	function isESCDeletePreview(e) {
		var pressedKeyValue = e.keyCode;
		if (pressedKeyValue === 27) {
			vm.previewDeleteAll();
		}
	}

	function addPagePromise(pageNumber) {
		var deferred = $q.defer();
		if (pageNumber != 1) {
			pdf.addPage();
		}
		deferred.resolve(pageNumber);
		return deferred.promise;
	}

	function generateImagePromise(pageNumber) {
		var deferred = $q.defer();
		vm.progressbar.set(pageNumber * 100 / vm.numberOfPages);
		canvas = document.createElement("canvas");
		canvas.width = 794;
		canvas.height = 1123;
		canvas.style.width = '794px';
		canvas.style.height = '1123px';
		var context = canvas.getContext('2d');
		var code = document.getElementById("page" + pageNumber).innerHTML;
		code = code.replace(/ on\w+=".*?"/g, "");
		rasterizeHTML.drawHTML(code).then(function (renderResult) {
			context.drawImage(renderResult.image, 0, 0);
			deferred.resolve(pageNumber);
		});
		return deferred.promise;
	}

	function addToPreviewPromise(pageNumber) {
		var deferred = $q.defer();
		imgurl = canvas.toDataURL('image/jpeg', 1);
		pdfFactory.addData(imgurl);
		var newImg = document.createElement("img");
		newImg.style.position = "relative";
		newImg.src = imgurl;
		preview.appendChild(newImg);
		newImg.style.margin = "5% 10% 5% 10%";
		newImg.style.width = "794px";
		newImg.style.height = "1123px";
		if (pageNumber === vm.numberOfPages) {
			vm.progressbar.complete();
			openDialog('previewDialog');
		} else {
			deferred.resolve(pageNumber + 1);
			return deferred.promise;
		}
	}

	function finishAddImagePromise(pageNumber) {
		var deferred = $q.defer();
		imgurl = canvas.toDataURL('image/png');
		pdf.addImage(imgurl, "JPEG", 0, 0);
		if (pageNumber === vm.numberOfPages) {
			vm.progressbar.complete();
			pdf.save();
		} else {
			deferred.resolve(pageNumber + 1);
			return deferred.promise;
		}
	}

	function addPage(){
		if(vm.allowCreate){
			if(vm.element){
				vm.element.style.boxShadow="none";
			}
			vm.element=null;
			toolbar.style.display="none";
			for(var i=vm.numberOfPages; i>vm.currentPageNumber; i--){
				document.getElementById("page"+i).setAttribute("id","page"+(i+1).toString());
			}
			var newPage = newPageTemplate.cloneNode(true);
			newPage.setAttribute("id","page"+(vm.currentPageNumber+1));
			currentPage.style.display="none";
			newPage.style.display="block";
			form.appendChild(newPage);
			vm.currentPageNumber++;
			vm.numberOfPages++;
			currentPage=newPage;
			newPage=null;
		}
	}

	function deletePage(){
		if(vm.allowCreate){
			if(vm.element){
				vm.element.style.boxShadow="none";
			}
			vm.element=null;
			toolbar.style.display="none";
			if(confirm("Do you really want to delete this page?")){
				while(currentPage.firstChild){
					delete elements[currentPage.firstChild.id];
					currentPage.removeChild(currentPage.firstChild);
				}
				if (vm.numberOfPages==1) {
					var newPage = newPageTemplate.cloneNode(true);
					newPage.style.display="block";
					currentPage.parentNode.removeChild(currentPage);
					form.appendChild(newPage);
					currentPage=newPage;
					currentPage.setAttribute("id","page1");
					newPage=null;
					vm.numberOfPages=1;
					vm.currentPageNumber=1;
				}else{
					currentPage.parentNode.removeChild(currentPage);
					for(var i=vm.currentPageNumber+1;i<=vm.numberOfPages;i++){
						document.getElementById("page"+i.toString()).setAttribute("id","page"+(i-1).toString());
					}
					if (vm.currentPageNumber==vm.numberOfPages){
						vm.currentPageNumber--;
					}
					vm.numberOfPages--;
					currentPage=document.getElementById("page"+vm.currentPageNumber.toString());
					currentPage.style.display="block";
				}
			}
		}
	}

	function toPreviousPage() {
		if (vm.allowCreate) {
			if (vm.element) {
				vm.element.style.boxShadow = "none";
			}
			vm.element = null;
			toolbar.style.display = "none";
			if (vm.currentPageNumber == 1) {
				alert("This is the first page.");
			} else {
				document.getElementById("page" + vm.currentPageNumber).style.display = "none";
				vm.currentPageNumber--;
				currentPage = document.getElementById("page" + vm.currentPageNumber);
				currentPage.style.display = "block";
			}
		}
	}

	function toNextPage() {
		if (vm.allowCreate) {
			if (vm.element) {
				vm.element.style.boxShadow = "none";
			}
			vm.element = null;
			toolbar.style.display = "none";
			if (vm.currentPageNumber == vm.numberOfPages) {
				alert("This is the last page.");
			} else {
				document.getElementById("page" + vm.currentPageNumber).style.display = "none";
				vm.currentPageNumber++;
				currentPage = document.getElementById("page" + vm.currentPageNumber);
				currentPage.style.display = "block";
			}
		}
	}

	function goToPage() {
		if (vm.allowCreate) {
			if (vm.element) {
				vm.element.style.boxShadow = "none";
			}
			vm.element = null;
			toolbar.style.display = "none";
			currentPage.style.display = "none";
			vm.currentPageNumber = vm.goToPageNumber;
			currentPage = document.getElementById("page" + vm.currentPageNumber);
			currentPage.style.display = "block";
		}
	}

	function movePage() {
		if (vm.allowCreate) {
			if (vm.element) {
				vm.element.style.boxShadow = "none";
			}
			vm.element = null;
			toolbar.style.display = "none";
			if (vm.currentPageNumber > vm.moveToPageNumber) {
				for (var i = vm.currentPageNumber - 1; i >= vm.moveToPageNumber; i--) {
					document.getElementById("page" + i.toString()).setAttribute("id", "page" + (i + 1).toString());
				}
				vm.currentPageNumber = vm.moveToPageNumber;
				currentPage.id = "page" + vm.currentPageNumber;

			} else if (vm.currentPageNumber < vm.moveToPageNumber) {
				for (var i = vm.currentPageNumber + 1; i <= vm.moveToPageNumber; i++) {
					document.getElementById("page" + i.toString()).setAttribute("id", "page" + (i - 1).toString());
				}
				vm.currentPageNumber = vm.moveToPageNumber;
				currentPage.id = "page" + vm.currentPageNumber;
			}
		}
	}

	function reset() {
		vm.file = null;
		vm.options = [];
		vm.newOption = "";
		vm.newAutofillElementId = "";
		vm.selectedAutofillElement = null;
		vm.labelContent = "";
		vm.signatureFieldName = "";
		vm.required = true;
		vm.imageFieldName = "";
		vm.textFieldName = "";
		vm.dropdownListName = "";
		vm.Fontsize = "16px";
		vm.FontType = "Arial";
		vm.FontColor = "black";
		vm.TextDecoration = "none";
		vm.Opacity = 1;
		vm.BackgroundColor = "white";
		vm.BorderStyle = "solid";
		vm.BorderRadius = "0px";
		vm.BorderWidth = "1px";
		vm.BorderColor = "black";
		vm.imageString = "";
		vm.imgChosen = false;
		vm.newElementType = "";
		vm.allowCreate = true;
	}

	function dragStart(event, type) {
		event.dataTransfer.setData('text/plain', '');
		vm.newElementType = type;
		event.dataTransfer.setDragImage(dragIcon, 0, 0);
	}

	function drop(event) {
		if (vm.allowCreate && vm.newElementType!=='') {
			if(vm.newElementType==='auto'){
				var i = 0;
				while (elements.hasOwnProperty("auto_" +vm.selectedAutofillElement.type+'_'+vm.selectedAutofillElement.fieldName+ i)) {
					i++;
				}
				vm.newAutofillElementId = "auto_" + vm.selectedAutofillElement.type+'_'+vm.selectedAutofillElement.fieldName+i;
				elements[vm.newAutofillElementId] = {};
				if(vm.selectedAutofillElement.type==='text'){
					createTextField();
				}
				if (vm.selectedAutofillElement.type==='dropdown') {
					createDropdownList();
				}
			}else{
				createPlaceholder();
				openDialog(vm.newElementType);
			}
		}
	}

	function allowDrop(event) {
		event.preventDefault();
		if (vm.allowCreate) {
			newElementPosition.x = getCrossBrowserElementCoords(event).x;
			newElementPosition.y = getCrossBrowserElementCoords(event).y;
		}
	}

	function createPlaceholder() {
		if (vm.newElementType) {
			placeholder = document.createElement("div");
			placeholder.setAttribute("id", "placeholder");
			placeholder.setAttribute("style", "position:absolute");
			placeholder.style.left = newElementPosition.x + "px";
			placeholder.style.top = newElementPosition.y + "px";
			var formWidth = form.offsetWidth;
			var formHeight = form.offsetHeight;
			if ((newElementPosition.x + defaultWidth) >= formWidth) {
				placeholder.style.width = (formWidth - newElementPosition.x - 1) + "px";
			} else {
				placeholder.style.width = defaultWidth + "px";
			}
			if ((newElementPosition.y + defaultHeight) >= formHeight) {
				placeholder.style.height = (formHeight - newElementPosition.y - 1) + "px";
			} else {
				placeholder.style.height = defaultHeight + "px";
			}
			currentPage.appendChild(placeholder);
			vm.allowCreate = false;
		}
	}

	function hideToolbar() {
		if (vm.element) {
			vm.element.style.boxShadow = "none";
			vm.element = null;
			toolbar.style.display = "none";
		}
	}

	function deleteElement() {
		if (confirm("Do you really want to delete this element?")) {
			vm.element.parentNode.removeChild(vm.element);
			toolbar.style.display = "none";
			delete elements[vm.element.id];
		}
	}

	function editAddNewOption(){
		vm.editOptions.push(vm.editNewOption);
		var option = document.createElement("option");
		option.innerHTML=vm.editNewOption;
		option.value=vm.editNewOption;
		vm.element.appendChild(option);
		vm.editNewOption = "";
	}

	function editDeleteOption(){
		vm.editOptions.pop();
		if(vm.element.lastChild && vm.element.lastChild.tagName && vm.element.lastChild.tagName ==='OPTION') vm.element.removeChild(vm.element.lastChild);
	}

	function elementOnclick(event) {
		var element = event.currentTarget;
		if (element != vm.element) {
			if (vm.element) {
				vm.element.style.boxShadow = "none";
			}	
			vm.saved = false;
			document.getElementById("optionsPanel").classList.remove('is-active');
			document.getElementById("options-panel").classList.remove('is-active');
			document.getElementById("contentPanel").classList.remove('is-active');
			document.getElementById("content-panel").classList.remove('is-active');
			document.getElementById("backgroundPanel").classList.remove('is-active');
			document.getElementById("background-panel").classList.remove('is-active');
			document.getElementById("fontPanel").classList.remove('is-active');
			document.getElementById("borderPanel").classList.add('is-active');
			document.getElementById("font-panel").classList.remove('is-active');
			document.getElementById("border-panel").classList.add('is-active');
			document.getElementById("editRequired").checked=element.required;
			document.getElementById("editTextDecoration").value = element.style.textDecoration;
			document.getElementById("editFontColor").style.color = element.style.color;
			document.getElementById("editFontColor").value = element.style.color;
			document.getElementById("editFontFamily").style.fontFamily = element.style.fontFamily;
			document.getElementById("editFontFamily").value = element.style.fontFamily;
			document.getElementById("editFontSize").value = element.style.fontSize;
			document.getElementById("editBorderColor").style.color = element.style.color;
			document.getElementById("editBorderColor").value = element.style.borderColor;
			document.getElementById("editBorderRadius").value = element.style.borderRadius;
			document.getElementById("editBorderWidth").value = element.style.borderWidth;
			document.getElementById("editBorderStyle").value = element.style.borderStyle;
			document.getElementById("editOpacity").value = element.style.opacity;
			document.getElementById("editBackgroundColor").value = element.style.backgroundColor;
			document.getElementById("editBackgroundColor").style.backgroundColor = element.style.backgroundColor;
			vm.element = element;
			element.style.boxShadow = "10px 10px 30px #888888";
			fontPanel.style.display = "inline";
			editRequiredLabel.style.display = "none";
			contentPanel.style.display = "none";
			optionsPanel.style.display = 'none';
			editBackgroundColorLabel.style.display = "inline";
			if (element.getAttribute("name").startsWith("background")) {
				fontPanel.style.display = "none";
				editBackgroundColorLabel.style.display = "none";
				editRequiredLabel.style.display = "none";
			}
			if (element.getAttribute("name").startsWith("image") ||
				element.getAttribute("name").startsWith("signature")) {
				fontPanel.style.display = "none";
			}
			if(element.getAttribute('name').startsWith('dropdown') || element.getAttribute('name').startsWith('auto_dropdown_')){
				optionsPanel.style.display='inline';
				var childNodes = element.childNodes;
				vm.editOptions = [];
				vm.editNewOption = "";
				for(var i=0; i<childNodes.length; i++){
					console.log(childNodes[i].tagName);
					if(childNodes[i].tagName==='OPTION') vm.editOptions.push(childNodes[i].innerHTML);
				}
				console.log(vm.editOptions);
			}
			if (element.getAttribute("name").startsWith("text") || element.getAttribute("name").startsWith("auto_text")) {
				editRequiredLabel.style.display = "inline";
			}
			if (element.getAttribute("name").startsWith("label")) {
				contentPanel.style.display = "inline";
				document.getElementById("editContent").value = element.innerHTML;
			}
			toolbar.style.display = "block";
		} else {
			vm.hideToolbar();
		}
	}

	function setNewElement(newElement) {
		vm.saved = false;
		var formWidth = form.offsetWidth;
		var formHeight = form.offsetHeight;
		vm.allowCreate = true;
		if ((newElementPosition.x + defaultWidth) >= formWidth) {
			newElement.style.width = (formWidth - newElementPosition.x - 1) + "px";
		} else {
			newElement.style.width = defaultWidth + "px";
		}
		if ((newElementPosition.y + defaultHeight) >= formHeight) {
			newElement.style.height = (formHeight - newElementPosition.y - 1) + "px";
		} else {
			newElement.style.height = defaultHeight + "px";
		}
		newElement.setAttribute("data-x", "0");
		newElement.setAttribute("data-y", "0");
		newElement.setAttribute("class", "resize-drag");
		newElement.required=Boolean(vm.required);
		newElement.setAttribute("ng-dblclick", "vm.elementOnclick($event)");
		$compile(newElement)($scope);
		newElement.style.overflow = "hidden";
		newElement.style.lineHeight = "100%";
		newElement.style.position = "absolute";
		newElement.style.zIndex = "1";
		newElement.style.overflow = "hidden";
		newElement.style.fontSize = vm.Fontsize;
		newElement.style.fontFamily = vm.FontType;
		newElement.style.color = vm.FontColor;
		newElement.style.textDecoration = vm.TextDecoration;
		newElement.style.backgroundColor = vm.BackgroundColor;
		newElement.style.borderStyle = vm.BorderStyle;
		newElement.style.borderColor = vm.BorderColor;
		newElement.style.borderRadius = vm.BorderRadius;
		newElement.style.borderWidth = vm.BorderWidth;
		newElement.style.left = newElementPosition.x + "px";
		newElement.style.top = newElementPosition.y + "px";
		newElement.style.opacity = vm.Opacity;
		currentPage.appendChild(newElement);
		if(vm.newElementType!=='auto') vm.closeDialog();
	}

	function addNewOption(){
		vm.options.push(vm.newOption);
		vm.newOption = '';
	}

	function deleteOption(){
		vm.options.pop();
	}

	function addImg() {
		if(!vm.file){
			alert('Please upload an image');
		}else if (vm.file && vm.file.filesize>2000000) {
			alert('Maximum size allowed is 2Mb');
		}else{
			var img = document.createElement("img");
			var i = 0;
			while (elements.hasOwnProperty("background_" + i)) {
				i++;
			}
			img.setAttribute("id", "background_" + i);
			img.setAttribute("name", "background_" + i);
			elements["background_" + i] = {};
			vm.imageString = 'data:image/png;base64,' + vm.file.base64;
			img.setAttribute("src", vm.imageString);
			setNewElement(img);
			img.style.zIndex = "0";
			vm.file = null;
		}		
	}

	function createDropdownList(){
		var dropdown = document.createElement("button");
		vm.saved = false;
		for(var i=0; i<vm.options.length; i++){
			var option = document.createElement("option");
			option.setAttribute("onclick","function(e){e.preventDefault;}")
			option.innerHTML = vm.options[i];
			dropdown.appendChild(option);
		}
		if (vm.newElementType==='auto') {
			dropdown.setAttribute("name", 'auto_dropdown_'+vm.selectedAutofillElement.fieldName);
			dropdown.setAttribute("id", vm.newAutofillElementId);
		}else{
			if (elements.hasOwnProperty("dropdown_" + vm.dropdownListName)) {
				alert("Field name already exists, please change another one");
				vm.allowCreate = true;
				return ;
			} 
			elements["dropdown_" + vm.dropdownListName] = {};
			dropdown.setAttribute("name", "dropdown_" + vm.dropdownListName);
			dropdown.setAttribute("id", "dropdown_" + vm.dropdownListName);
		}
		setNewElement(dropdown);
	}

	function createTextField() {
		var textarea = document.createElement("input");
		textarea.setAttribute('type','text');
		textarea.setAttribute('readonly','readonly');
		if (vm.newElementType==='auto') {
			textarea.setAttribute("name", 'auto_text_'+vm.selectedAutofillElement.fieldName);
			textarea.setAttribute("id", vm.newAutofillElementId);
		}else{
			if (elements.hasOwnProperty("text_" + vm.textFieldName)) {
				alert("Field name already exists, please change another one");
				vm.allowCreate = true;
				return ;
			} 
			elements["text_" + vm.textFieldName] = {};
			textarea.setAttribute("name", "text_" + vm.textFieldName);
			textarea.setAttribute("id", "text_" + vm.textFieldName);
		}
		setNewElement(textarea);
	}

	function createImageField() {
		if (elements.hasOwnProperty("image_" + vm.imageFieldName)) {
			alert("Field name already exists, please change another one");
			vm.allowCreate = true;
		} else {
			var image = document.createElement("canvas");
			elements["image_" + vm.imageFieldName] = {};
			image.setAttribute("name", "image_" + vm.imageFieldName);
			image.setAttribute("id", "image_" + vm.imageFieldName);
			setNewElement(image);
		}
	}

	function createSignatureField() {
		if (elements.hasOwnProperty("signature_" + vm.signatureFieldName)) {
			alert("Field name already exists, please change another one");
			vm.allowCreate = true;
		} else {
			var image = document.createElement("canvas");
			elements["signature_" + vm.signatureFieldName] = {};
			image.setAttribute("id", "signature_" + vm.signatureFieldName);
			image.setAttribute("name", "signature_" + vm.signatureFieldName);
			setNewElement(image);
		}
	}

	function createLabel() {
		var label = document.createElement("div");
		var i = 0;
		while (elements.hasOwnProperty("label_" + i)) {
			i++;
		}
		label.setAttribute("id", "label_" + i);
		label.setAttribute("name", "label_" + i);
		elements["label_" + i] = {};
		label.style.whiteSpace = "pre-wrap";
		label.innerHTML = vm.labelContent;
		setNewElement(label);
	}

	//get the current position of mouse
	 function getCrossBrowserElementCoords(mouseEvent){
		var result = {
			x: 0,
			y: 0
		};

		if (!mouseEvent){
			mouseEvent = window.event;
		}

		if (mouseEvent.pageX || mouseEvent.pageY){
			result.x = mouseEvent.pageX;
			result.y = mouseEvent.pageY;
		}
		else if (mouseEvent.clientX || mouseEvent.clientY){
			result.x = mouseEvent.clientX + document.body.scrollLeft +
			document.documentElement.scrollLeft;
			result.y = mouseEvent.clientY + document.body.scrollTop +
			document.documentElement.scrollTop;
		}

		if (mouseEvent.target){
			var offEl = mouseEvent.target;
			var offX = 0;
			var offY = 0;
			if(offEl.id && !offEl.getAttribute('id').startsWith('page')){
				offEl = offEl.parentElement;
			}
			if (typeof(offEl.offsetParent) != "undefined"){
				while (offEl){
					 offX += offEl.offsetLeft;
					 offY += offEl.offsetTop;
					 offEl = offEl.offsetParent;
				}
			}
			else{
				offX = offEl.x;
				offY = offEl.y;
			}

			result.x -= offX;
			result.y -= offY;
		}

		return result;
	 }


	function openDialog(dialogName) {
		var dialog = document.querySelector('#' + dialogName);
		if (!dialog.showModal) {
			dialogPolyfill.registerDialog(dialog);
		}
		console.log(dialog.open);
		dialog.showModal();
	};

	function removePlaceholder(){
		if(placeholder && placeholder.parentNode===currentPage) currentPage.removeChild(placeholder);
		vm.allowCreate = true;
		reset();
	}

	function closeDialog() {
		var dialog = document.querySelector('#' + vm.newElementType);
		dialog.close();
		reset();
	};

	function dragMoveListener (event) {
		if(event.interaction.downEvent.button == 2) {
			return false;
		}
		var target = event.target,
			// keep the dragged position in the data-x/data-y attributes
			x = (parseInt(target.getAttribute('data-x')) ) + event.dx,
			y = (parseInt(target.getAttribute('data-y')) ) + event.dy;

		// translate the element
		target.style.webkitTransform =
		target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

		// update the posiion attributes
		target.setAttribute('data-x', x);
		target.setAttribute('data-y', y);
	}



	interact('.resize-drag')
		.draggable({
			onstart: function(event){
				if(event.interaction.downEvent.button == 2) {
					return false;
				}
				vm.saved = false;
				var target = event.target,
					// keep the dragged position in the data-x/data-y attributes
					x = (parseInt(target.getAttribute('data-x')) ) + event.dx,
					y = (parseInt(target.getAttribute('data-y')) ) + event.dy;
			},
			onmove: dragMoveListener,
			restrict: {
				elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
				restriction:"parent",
				endOnly:false
			},
			// enable autoScroll
			autoScroll: true
		})
		.resizable({
			edges: { left: true, right: true, bottom: true, top: true }
		})
		.on('resizemove', function (event) {
			if(event.interaction.downEvent.button == 2) {
				return false;
			}
			vm.saved = false;
			var target = event.target,
				x = (parseInt(target.getAttribute('data-x')) ),
				y = (parseInt(target.getAttribute('data-y')));
			horizontal();
			vertical();
				
			function horizontal(){
				if(event.edges.left && (parseInt(target.style.left)+x<0) && (event.dx<0)) return false;
				if (event.edges.right && (parseInt(target.style.left)+x+event.rect.width>parseInt(target.parentNode.style.width))&&event.dx>0) return false;
				if(event.edges.left && parseInt(target.style.width)===0 && event.dx>0) return false;
				if(event.edges.left && parseInt(target.style.width)-event.dx>=0) x += event.dx;
				if(event.edges.left && (parseInt(target.style.left)+x<30) && (event.dx<0)) {
					target.style.width=parseInt(target.style.width)+x+parseInt(target.style.left)+'px';
					x=-parseInt(target.style.left);
				}
				if (event.edges.right&&(parseInt(target.style.left)+x+event.rect.width>parseInt(target.parentNode.style.width)-30)&&event.dx>0) {
					target.style.width=(parseInt(target.parentNode.style.width)-parseInt(target.style.left)-parseInt(target.style.borderWidth)*2-x)+'px';
					return false;
				}
				if(event.edges.right) target.style.width  = parseInt(target.style.width)+event.dx + 'px';
				if(event.edges.left) target.style.width  = parseInt(target.style.width)-event.dx + 'px';
				target.setAttribute('data-x', x);
				target.style.webkitTransform = target.style.transform =
						'translate(' + x + 'px,' + y + 'px)';
			}

			function vertical(){
				if(event.edges.top && (parseInt(target.style.top)+y<0) && (event.dy<0)) return false;
				if (event.edges.bottom && (parseInt(target.style.top)+y+event.rect.height>parseInt(target.parentNode.style.height))&&event.dy>0) return false;
				if(event.edges.top && parseInt(target.style.height)===0 && event.dy>0) return false;
				if(event.edges.top && parseInt(target.style.height)-event.dy>=0) y += event.dy;
				if(event.edges.top && (parseInt(target.style.top)+y<30) && (event.dy<0)) {
					target.style.height=parseInt(target.style.height)+y+parseInt(target.style.top)+'px';
					y=-parseInt(target.style.top);
				}
				if (event.edges.bottom&&(parseInt(target.style.top)+y+event.rect.height>parseInt(target.parentNode.style.height)-30)&&event.dy>0) {
					target.style.height=(parseInt(target.parentNode.style.height)-parseInt(target.style.top)-parseInt(target.style.borderWidth)*2-y)+'px';
					return false;
				}
				if(event.edges.bottom) target.style.height  = parseInt(target.style.height)+event.dy + 'px';
				if(event.edges.top) target.style.height  = parseInt(target.style.height)-event.dy + 'px';
				target.setAttribute('data-y', y);
				target.style.webkitTransform = target.style.transform =
						'translate(' + x + 'px,' + y + 'px)';
			}
		});
}
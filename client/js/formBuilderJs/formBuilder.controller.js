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
	$timeout) {
	//initialization
	var vm = this;
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
	var elements = {};
	var formData = {};
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
	vm.groupName = "test";
	vm.formName = "test";

	//page node
	var newPageTemplate = formBuilderFactory.newPage;

	var defaultWidth = 300;
	var defaultHeight = 150;

	//drag icon initialization

	var dragIcon = document.createElement("img");
	dragIcon.src = 'images/logo.png';

	//define all the functions
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
	vm.toggleRequired = toggleRequired;
	vm.setNewElement = setNewElement;
	vm.addImg = addImg;
	vm.createTextField = createTextField;
	vm.createImageField = createImageField;
	vm.createSignatureField = createSignatureField;
	vm.createLabel = createLabel;
	vm.getCrossBrowserElementCoords = getCrossBrowserElementCoords;
	vm.openDialog = openDialog;
	vm.closeDialog = closeDialog;

	//get all the elements data and save the form
	function saveForm() {
		formData.numberOfPages = vm.numberOfPages;
		for (var i = 1; i <= vm.numberOfPages; i++) {
			var page = document.getElementById("page" + i);
			console.log(page);
			for (var j = 1; j < page.childNodes.length; j++) {
				var node = page.childNodes[j];
				console.log(node);
				var id = node.id;
				console.log(id);
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
					elements[id].src = node.getAttribute("src");
				} else {
					elements[id].backgroundColor = node.style.backgroundColor;
				}
				if (id.startsWith("text") || id.startsWith("label")) {
					elements[id].fontSize = node.style.fontSize;
					elements[id].color = node.style.color;
					elements[id].fontFamily = node.style.fontFamily;
					elements[id].textDecoration = node.style.textDecoration;
					if (id.startsWith("text")) {
						elements[id].required = node.getAttribute("required");
					} else {
						elements[id].content = node.innerHTML;
					}
				}
			}
		}
		formData.elements = elements;
		formData.group = vm.groupName;
		formData.name = vm.formName;
		formBuilderFactory.saveFormData(formData)
			.then(function (data, status, config, headers) {
				snackbarContainer.MaterialSnackbar.showSnackbar(
					{ message: "Saved the form" });
			}, function (data, status, config, headers) {
				snackbarContainer.MaterialSnackbar.showSnackbar(
					{ message: "Failed to save the form. Please try again." });
			});
		console.log(formData);
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
			previewDialog.showModal();
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
		vm.labelContent = "";
		vm.signatureFieldName = "";
		vm.required = true;
		vm.imageFieldName = "";
		vm.required = true;
		vm.textFieldName = "";
		vm.required = true;
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
		vm.newElementType = type;
		event.dataTransfer.setDragImage(dragIcon, 0, 0);
	}

	function drop(event) {
		event.preventDefault();
		if (vm.allowCreate) {
			createPlaceholder();
			openDialog(vm.newElementType);
			console.log('Open one: ' + vm.newElementType);
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

	function elementOnclick(event) {
		var element = event.currentTarget;
		if (element != vm.element) {
			if (vm.element) {
				vm.element.style.boxShadow = "none";
			}
			vm.element = element;
			document.getElementById("contentPanel").classList.remove('is-active');
			document.getElementById("content-panel").classList.remove('is-active');
			document.getElementById("backgroundPanel").classList.remove('is-active');
			document.getElementById("background-panel").classList.remove('is-active');
			document.getElementById("fontPanel").classList.remove('is-active');
			document.getElementById("borderPanel").classList.add('is-active');
			document.getElementById("font-panel").classList.remove('is-active');
			document.getElementById("border-panel").classList.add('is-active');
			document.getElementById("editRequired").checked = element.required;
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
			element.style.boxShadow = "10px 10px 30px #888888";
			fontPanel.style.display = "inline";
			editRequiredLabel.style.display = "none";
			contentPanel.style.display = "none";
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
			if (element.getAttribute("name").startsWith("text")) {
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
	
	function toggleRequired(){
		vm.element.setAttribute("required",document.getElementById("editRequired").checked); 
	}

	function setNewElement(newElement) {
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
		newElement.setAttribute("required", vm.required);
		newElement.setAttribute("ng-dblclick", "vm.elementOnclick($event)");
		$compile(newElement)($scope);
		newElement.style.overflow = "hidden";
		newElement.style.lineHeight = "100%";
		newElement.style.position = "absolute";
		newElement.style.zIndex = "3";
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
		vm.closeDialog();
	}

	function addImg() {
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
		img.style.zIndex = "2";
		vm.file = null;
		setNewElement(img);
	}

	function createTextField() {
		if (elements.hasOwnProperty("text_" + vm.textFieldName)) {
			alert("Field name already exists, please change another one");
			currentPage.removeChild(placeholder);
			vm.allowCreate = true;
		} else {
			var textarea = document.createElement("div");
			elements["text_" + vm.textFieldName] = {};
			textarea.setAttribute("name", "text_" + vm.textFieldName);
			textarea.setAttribute("id", "text_" + vm.textFieldName);
			setNewElement(textarea);
		}
	}

	function createImageField() {
		if (elements.hasOwnProperty("image_" + vm.imageFieldName)) {
			alert("Field name already exists, please change another one");
			currentPage.removeChild(placeholder);
			vm.allowCreate = true;
		} else {
			var image = document.createElement("canvas");
			elements["image_" + vm.imageFieldName] = {};
			image.setAttribute("name", "image_" + vm.imageFieldName);
			image.setAttribute("id", "image_" + vm.imageFieldName);
			setNewElement(image);
			console.log(elements);
		}
	}

	function createSignatureField() {
		if (elements.hasOwnProperty("signature_" + vm.signatureFieldName)) {
			alert("Field name already exists, please change another one");
			currentPage.removeChild(placeholder);
			vm.allowCreate = true;
		} else {
			var image = document.createElement("canvas");
			elements["signature_" + vm.signatureFieldName] = {};
			image.setAttribute("id", "signature_" + vm.signatureFieldName);
			image.setAttribute("name", "signature_" + vm.signatureFieldName);
			setNewElement(image);
			console.log(elements);
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
			if(!offEl.getAttribute('id').startsWith('page')){
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

	function openDialog(dialogName) {
        var dialog = document.querySelector('#' + dialogName);
        if (!dialog.showModal) {
            dialogPolyfill.registerDialog(dialog);
        }
		console.log(dialog);
		console.log(imageFieldCreation);
        dialog.showModal();
		console.log('Show one: ' + vm.newElementType);
    };

    function closeDialog() {
    	if(placeholder && placeholder.parentNode===currentPage) currentPage.removeChild(placeholder);
		console.log('Enter close function: ' + vm.newElementType);
        var dialog = document.querySelector('#' + vm.newElementType);
        dialog.close();
		console.log('Close one: ' + vm.newElementType);
		reset();
	};

	// TODO
	function submitDialogForm() {
		vm.closeDialog();
		switch (vm.newElementType) {
			case "label":
				labelCreation.style.display = "block";
				break;
			case "text":
				textFieldCreation.style.display = "block";
				break;
			case "imageField":
				imageFieldCreation.style.display = "block";
				break;
			case "signature":
				signatureFieldCreation.style.display = "block";
				break;
			case "image upload":
				imgUpload.style.display = "block";
				break;
		}
		vm.createPlaceholder();
		vm.newElementType = '';
		vm.createLabel();
	};
}

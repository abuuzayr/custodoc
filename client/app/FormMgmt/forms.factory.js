(function() {
	'use strict';

	angular
		.module('app.formMgmt')
		.factory('formsFactory', formsFactory);

	function formsFactory() {
		var service = {
			getNewPage: getNewPage,
		};
		
		function getNewPage(){
			var newPage = document.createElement("div");
			newPage.appendChild(whiteDiv.cloneNode(true));
			newPage.style.width = "794px";
			newPage.style.height = "1123px";
			newPage.setAttribute("class", "page");
			return newPage;	
		}
		

		return service;
	}
})();

(function() {
	"use strict";
angular.module('dataTable')
	.directive('customMdlDataTable',customMdlDataTable)
	.directive('postRepeatUpgrade', postRepeatUpgrade)
	.directive('upgradeDom',upgradeDom)
	.directive('fileUploadOnchange', fileUploadOnchange);
	
function customMdlDataTable(){
	var directive = {
			restrict: 'E',
			templateUrl: '/app/Shared/DataTable/dataTable.template.html',
			scope:{
				tableOptions: '=',
				dtRowPerPage: '=',
				dtRowPerPageOptions: '=',
				dtMultiSelect: '@',
			},
			controller: 'dataTableController',
	};
	return directive;
}

function postRepeatUpgrade(){
	return function(scope, element, attrs){
		if(scope.$last){
			componentHandler.upgradeDom();
		}
	};
}

function upgradeDom(){
	return function(scope, element, attrs){
		componentHandler.upgradeDom();
	};
}

function fileUploadOnchange() {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			var onChangeHandler = scope.$eval(attrs.fileUploadOnchange);
			element.bind('change', onChangeHandler);
		}
	};
}

})();




(function(){
angular.module('dataTable')
	.directive('customMdlDataTable',customMdlDataTable)
	.directive('postRepeatUpgrade', postRepeatUpgrade)
	.directive('upgradeDom',upgradeDom);
	
function customMdlDataTable(){
	var directive = {
			restrict: 'E',
			templateUrl: '/app/Shared/DataTable/dataTable.template.html',
			scope:{
				tableOptions: '=',
				dtRowPerPage: '=',
				dtRowPerPageOptions: '=',
				dtMultiSelect: '@',
				dtPagination:'@',
				dtEdit:'@',
				dtToolbar:'@',
				dtToolbarExport: '@',
				dtToolbarImport: '@',
				dtToolbarSearch: '@'
			},
			controller: 'dataTableController',
			compile: function(elem,attrs){
				return {
					pre: preLink,
					post: postLink
				};
			}
	};
	return directive;

	function preLink(scope,elem,attrs){
		attrs.$observe('dtMultiSelect', function(value) {
			scope.hasMultiSelection = attrs.hasOwnProperty('dtMultiSelect') && ( value==='' || value==='true' );
		});
		attrs.$observe('dtPagination', function(value) {
			scope.hasPagination = attrs.hasOwnProperty('dtPagination') && ( value==='' || value==='true' );
		});
		attrs.$observe('dtEdit', function(value) {
			scope.enableEdit = attrs.hasOwnProperty('dtEdit') && ( value==='' || value==='true' );
		});
		attrs.$observe('dtToolbar', function(value) {
			scope.hasToolbar = attrs.hasOwnProperty('dtToolbar') && ( value==='' || value==='true' );
		});
		attrs.$observe('dtToolbarExport', function(value) {
			scope.hasExport = attrs.hasOwnProperty('dtToolbarExport') && ( value ==='' || value==='true' );
		});
		attrs.$observe('dtToolbarImport', function(value) {
			scope.hasImport = attrs.hasOwnProperty('dtToolbarImport') && ( value ==='' || value==='true' );
		});
		attrs.$observe('dtToolbarSearch', function(value) {
			scope.hasSearch =  attrs.hasOwnProperty('dtToolbarSearch') && ( value ==='' || value==='true' );
		});
	}
	function postLink(){
	}
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


})();




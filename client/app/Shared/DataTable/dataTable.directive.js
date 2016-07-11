angular.module('dataTable')
	.directive('lhDataTable',lhDataTable)

	.directive('lhDataTablePagination',dataTablePagination)

	function lhDataTable () {
		var directive = {
			restrict : "A",
			template :
			scope: {
				  tableData: 'tableData='
				  tableHeader: 'tableHeader='
			}
		}
	}


	function lhDataTablePagination(){
		var directive = {
			restrict : "A",
			template :
			controller: dataTableCtrl,
			controllerAs: vm
		}

		return directive;
	})
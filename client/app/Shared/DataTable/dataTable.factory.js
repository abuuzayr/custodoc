(function() {
	"use strict";
	angular
	.module('dataTable')
	.factory('dataTableServices',dataTableServices);

	function dataTableServices(){
		var services = {
			getDataSchema: getDataSchema
		};
		return services;
		function getDataSchema(){
			return {
				tableData:{
					columnDefs:[],
					data: []
				},
				selection:{
					multiSelect: true,
					checked:{},
					selectedId:[],
					selected:[]
				},
				sorting:{
					sortBy: '',
					sortReverse: true
				},
				pagination:{
					hasPagination:true,
					currentPage: 1,
					totalPage: 0,
					itemPerPage: 10,
					totalItem: 0,
					limitOptions: [10,20,30],
					startingIndex: 0
				},
				exportOptions: {
					exportBy:['Selected','All'],
					ignoreProperty:[],
				},
				importOptions:{ 
					allowedExtension: '.csv',
					maxSize: '10MB'
				},
				dataServices: {
					save:null,
					delete: null
				}
			};
		 }
		}
		function setPagination(tableOptions){
			tableOptions.pagination.totalItem = tableOptions.tableData.data.length;
			tableOptions.pagination.currentPage = 1;
			if(tableOptions.pagination.hasPagination === true){
				tableOptions.pagination.rgPage = new Array(tableOptions.pagination.totalPage);
			}else{
				tableOptions.pagination.itemPerPage = tableOptions.pagination.totalItem;
			}
			tableOptions.pagination.totalPage = Math.ceil(tableOptions.pagination.totalItem/tableOptions.pagination.itemPerPage);
			return tableOptions;
		}
		//function 
})();
(function(){
angular.module('app.entryMgmt')
.controller('entryMgmtCtrl',entryMgmtCtrl);

	entryMgmtCtrl.$inject = ['$scope','$q','$timeout','entryMgmtServices'];
	function entryMgmtCtrl($scope, $q, $timeout, entryMgmtServices){
		var vm = this;

		vm.tableOptions = entryMgmtServices.tableDataConstructor();
		getData();

		function getData(){
			return entryMgmtServices.getData()
			.then(SuccessCallback)
			.catch(ErrorCallback);

			function SuccessCallback(res){
				vm.tableOptions.tableData.data = [];
				vm.tableOptions.tableData.data = res.data;
				vm.tableOptions.tableData.columnDefs = [];
				vm.tableOptions.tableData.columnDefs.push({type:'default', displayName:'Group name', fieldName: 'groupName'});
				vm.tableOptions.tableData.columnDefs.push({type:'default', displayName:'Create at', fieldName: 'creationDate'});
				var entryData = res.data;
				for(var i = 0 ; i  < entryData.length; i++){
					for(var fieldName in entryData[i].data){
						console.log(fieldName);
						if(!fieldName.startsWith('image_') && !fieldName.startsWith('signature_')){
							vm.tableOptions.tableData.columnDefs.push({
								type:'default', 
								displayName: getDisplayName(fieldName),
								fieldName: fieldName});
						}
					}
				}
				
				vm.tableOptions.tableData.columnDefs.push({type:'action', icon:'get_app', action:downLoadAsOne});
				vm.tableOptions.pagination = entryMgmtServices.getPagination(vm.tableOptions);
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


		function downLoadAsOne(row){
			var pdf = new jsPDF();
			var deferred = $q.defer();
			deferred.resolve(1);
			var p = deferred.promise;
			p = p.then(function (formNumber) { return generateForm(formNumber); });
			p = p.then(function (formNumber) { return generateImage(formNumber); });
			p.then(function () {
				for (var j = 0; j < pagesImage.length; j++) {
					for (var k = 0; k < pagesImage[j].length; k++) {
						if (j !== 0 || k !== 0){
							pdf.addPage();
						}
						pdf.addImage(pagesImage[j][k], "JPEG", 0, 0);
					}
				}
				usSpinnerService.stop('spinner-1');
				pdf.save();
				var pages = Array.from(document.getElementsByClassName('page'));
				pages.forEach(function (item, index) {
					item.parentNode.removeChild(item);
				});
				pagesImage = [];
				rows = [];
			});
		}


		//UPGRADE UI
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

}
})();
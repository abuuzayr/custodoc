angular.module('app.formBuilder',[])
.directive('myOnDragStart',myOnDragStart);

function myOnDragStart() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs){
			var onDragStartHandler = $scope.$eval(attrs.myOnDragStart);
			element.bind('ondragstart',onDragStartHandler);
		}
	};
}

angular.module('app.formBuilder',[])
.directive('onDragStart',onDragStart);

function onDragStart() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs){
			var onDragStartHandler = $scope.$eval(attrs.onDragStart);
			element.bind('ondragstart',onDragStartHandler);
		}
	};
}

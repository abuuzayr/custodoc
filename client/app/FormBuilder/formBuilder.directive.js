angular.module('app.formBuilder',[])
.directive('myOnDragStart',myOnDragStart)
.directive('myOnDragOver',myOnDragOver)
.directive('myOnDrop',myOnDrop);

function myOnDragStart() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs){
			var onDragStartHandler = $scope.$eval(attrs.myOnDragStart);
			element.bind('ondragstart',onDragStartHandler);
		}
	};
}

function myOnDragOver() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs){
			var onDragStartHandler = $scope.$eval(attrs.myOnDragOver);
			element.bind('ondragstart',onDragStartHandler);
		}
	};
}

function myOnDrop() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs){
			var onDragStartHandler = $scope.$eval(attrs.myOnDrop);
			element.bind('ondragstart',onDragStartHandler);
		}
	};
}

angular.module('app.formBuilder')
.directive('myOnDragStart',myOnDragStart)
.directive('myOnDragOver',myOnDragOver)
.directive('myOnDrop',myOnDrop);

function myOnDragStart() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs){
			var onDragStartHandler = scope.$eval(attrs.myOnDragStart);
			element.bind('ondragstart',onDragStartHandler);
		}
	};
}

function myOnDragOver() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs){
			var onDragOverHandler = scope.$eval(attrs.myOnDragOver);
			element.bind('ondragover',onDragOverHandler);
		}
	};
}

function myOnDrop() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs){
			var onDropHandler = scope.$eval(attrs.myOnDrop);
			element.bind('ondrop',onDropHandler);
		}
	};
}

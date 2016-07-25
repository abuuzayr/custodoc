angular.module('app.formBuilder')
.directive('myOnDragStart',myOnDragStart)
.directive('myOnDragOver',myOnDragOver)
.directive('myOnDrop',myOnDrop);
myOnDragStart.$inject = ['$parse'];
myOnDragOver.$inject = ['$parse'];
myOnDrop.$inject = ['$parse']; 

function myOnDragStart($parse) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs){
			element.on('dragstart',onDragStartHandler);

			function onDragStartHandler(event){
				var onDragStartFunc = $parse(attrs.myOnDragStart);                                 
    			onDragStartFunc(scope, { $event: event });
    			scope.$apply();
			}
		}
	};
}

function myOnDragOver($parse) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs){
			element.on('dragover', onDragOverHandler);

			function onDragOverHandler(event){
				var onDragOverFunc = $parse(attrs.myOnDragOver);                                 
    			onDragOverFunc(scope, { $event: event });
    			scope.$apply();
			}
		}
	};
}

function myOnDrop($parse) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs){
			element.on('drop',onDropHandler);
			function onDropHandler(event){
				var onDragFunc = $parse(attrs.myOnDrop);                                 
    			onDragFunc(scope, { $event: event });
    			scope.$apply();
			}
		}
	};
}

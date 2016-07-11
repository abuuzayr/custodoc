angular.module('app.autofill')
.directive('postRepeatUpgrade', postRepeatUpgrade);

function postRepeatUpgrade(){
	return function(scope, element, attrs){
		if(scope.$last){
			componentHandler.upgradeDom();
		}
	}
}
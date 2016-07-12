// service
angular
    .module("app.formBuilder")
    .factory('formBuilderFactory', formBuilderFactory);

formBuilderFactory.$inject = ['$http'];

function formBuilderFactory($http) {
	var serverURL = "https://10.4.1.204/req/api/protected";
	var colors = ["aliceblue","antiquewhite","aqua","aquamarine","azure","beige","bisque","black","blanchedalmond","blue","blueviolet","brown","burlywood","cadetblue","chartreuse","chocolate","coral","cornflowerblue","cornsilk","crimson","cyan","darkblue","darkcyan","darkgoldenrod","darkgray","darkgrey","darkgreen","darkkhaki","darkmagenta","darkolivegreen","darkorange","darkorchid","darkred","darksalmon","darkseagreen","darkslateblue","darkslategray","darkslategrey","darkturquoise","darkviolet","deeppink","deepskyblue","dimgray","dimgrey","dodgerblue","firebrick","floralwhite","forestgreen","fuchsia","gainsboro","ghostwhite","gold","goldenrod","gray","grey","green","greenyellow","honeydew","hotpink","indianred","indigo","ivory","khaki","lavender","lavenderblush","lawngreen","lemonchiffon","lightblue","lightcoral","lightcyan","lightgoldenrodyellow","lightgray","lightgrey","lightgreen","lightpink","lightsalmon","lightseagreen","lightskyblue","lightslategray","lightslategrey","lightsteelblue","lightyellow","lime","limegreen","linen","magenta","maroon","mediumaquamarine","mediumblue","mediumorchid","mediumpurple","mediumseagreen","mediumslateblue","mediumspringgreen","mediumturquoise","mediumvioletred","midnightblue","mintcream","mistyrose","moccasin","navajowhite","navy","oldlace","olive","olivedrab","orange","orangered","orchid","palegoldenrod","palegreen","paleturquoise","palevioletred","papayawhip","peachpuff","peru","pink","plum","powderblue","purple","red","rosybrown","royalblue","saddlebrown","salmon","sandybrown","seagreen","seashell","sienna","silver","skyblue","slateblue","slategray","slategrey","snow","springgreen","steelblue","tan","teal","thistle","tomato","turquoise","violet","wheat","white","whitesmoke","yellow","yellowgreen"];
	var fonts = ['Arial','"Comic Sans MS"','"Times New Roman"','"Courier New"'];
	var whiteDiv=document.createElement("div");
	whiteDiv.style.backgroundColor="white";
	whiteDiv.style.width="794px";
	whiteDiv.style.height="1123px";
	whiteDiv.style.zIndex="-1";
	whiteDiv.style.position="relative";
	whiteDiv.style.top="-7px";
	whiteDiv.style.left="-7px";

	var newPage = document.createElement("div");
	newPage.appendChild(whiteDiv.cloneNode(true));
	newPage.style.width="794px";
	newPage.style.height="1123px";	
	newPage.setAttribute("class","page");
	newPage.setAttribute("ondrop",
	"angular.element(document.getElementById('formBuilderBody')).scope().vm.drop(event)");
	newPage.setAttribute("ondragover",
	"angular.element(document.getElementById('formBuilderBody')).scope().vm.allowDrop(event)");

	var availableFontsizes=[]; 
	for (var i = 0; i < 30; i++) {
		availableFontsizes[i]=i+11+"px";
	}

	var availableBorderRadii=[];
	for (var i = 0; i < 51; i++) {
		availableBorderRadii[i]=i+"px";
	}

	var availableBorderWidth=[];
	for (var i = 0; i < 11; i++) {
		availableBorderWidth[i]=i+"px";
	}

	var saveFormData = function(formData){
		return $http.put(serverURL+"/forms", {formData:formData}, {headers: {'Content-Type': 'application/json'} });
	};

	var getFormData = function(groupName, formName){
		return $http.get(serverURL+"/forms/"+groupName+'/'+formName);
	};

	return {
		colorsArray: colors,
		fontsArray: fonts,
		newPage: newPage,
		whiteDiv: whiteDiv,
		availableFontsizes: availableFontsizes,
		availableBorderRadii: availableBorderRadii,
		availableBorderWidth: availableBorderWidth,
		saveFormData: saveFormData,
		getFormData: getFormData
	};
}

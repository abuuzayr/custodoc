// service
angular
    .module("app.formMgmt")
    .factory('formsFactory', formsFactory);

function formsFactory() {
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

	return {
		newPage: newPage,
		whiteDiv: whiteDiv,
	};
}

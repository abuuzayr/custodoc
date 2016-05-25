var keys = ["name","gender","age","email","HP","Tel","IC"];

var firstName = ["Linghan","Max","Gilbert","Angie","Isaac","Tim","Froz","Hellyna","Joan","Max","Nelson","James","Michael"];
var lastName = ["Zhang","Tio","Tan","Chua","Pan","Johnson","Jackson","Thompson","Jenkinson","Janson","Bond","Jordan"];
var domain = ["gmail","hotmail","email","xmail","example"];

var getRandomElement = function(arr){return arr[Math.floor(Math.random()*arr.length)];};
var shuffleString = function(str){return str.split("").sort(function(){return 0.5-Math.random()}).join("");};
var randomClamp = function(lower,higher){return Math.floor(Math.random()*(higher-lower)+lower);};

var randomName = function(){return getRandomElement(firstName)+" "+getRandomElement(lastName);};
var randomGender = function(){return (Math.random() > 0.5) ? "Male":"Female";}
var randomAge = function(){return randomClamp(20,60).toString();};

var randomEmail = function(){return shuffleString((getRandomElement(firstName)+getRandomElement(lastName)).toLowerCase())+"@"+getRandomElement(domain)+".com"};
var randomHP = function(){return randomClamp(90000000,100000000).toString()};
var randomTel = function(){return randomClamp(60000000,70000000).toString()};
var randomIC = function(){return "SG"+randomClamp(10000000,99999999).toString()};

var arr_f = [randomName,randomGender,randomAge,randomEmail,randomHP,randomTel,randomIC];

var generate1 = function(keys,arr_f,n){
	var jsonStr = "";
	for (;n>0;n--){
		jsonStr += "{";
		for(i=0;i<keys.length;i++){
			if(Math.random()<0.6){
				jsonStr += "\""+keys[i]+"\""+": "+"\""+arr_f[i]()+"\"";
				if(!(i == (keys.length - 1))){
					jsonStr += ","
				}
			}
		}
		if(jsonStr.slice(-1)==","){
			jsonStr = jsonStr.slice(0, -1);
		}
		jsonStr += "}"
		if(!(n==1)){
			jsonStr += "\n";
		}	
	}

	return JSON.parse(JSON.stringify(jsonStr));
};

var generate2 = function(keys){
	var jsonStr = "";
	for(i=0;i<keys.length;i++){
		jsonStr += "{\"fieldname\": "+"\""+keys[i]+"\""+"}";
		if(i!=keys.length-1){
			jsonStr += "\n";
		}
	}
	return JSON.parse(JSON.stringify(jsonStr));
}

var n = 10000;


console.log(generate2(keys));





////////////////////////////////////////////////////////////////////
// (function(console){
// console.save = function(data, filename){

//     if(!data) {
//         console.error('Console.save: No data')
//         return;
//     }

//     if(!filename) filename = 'console.json'

//     if(typeof data === "object"){
//         data = JSON.stringify(data, undefined, 4)
//     }

//     var blob = new Blob([data], {type: 'text/json'}),
//         e    = document.createEvent('MouseEvents'),
//         a    = document.createElement('a')

//     a.download = filename
//     a.href = window.URL.createObjectURL(blob)
//     a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
//     e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
//     a.dispatchEvent(e)
//  }
// })(console)
// console.save(generate(keys,arr_f,n),'test.json');
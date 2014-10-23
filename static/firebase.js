function putData()
{

console.log("putData initialialized")

var id = "getSomeid"
var imei = "getSomeime111i"

var hash = CryptoJS.SHA1(imei+id);

var baseUrl = "https://goldenhour.firebaseio.com/"
var finalUrl = baseUrl + hash
    		var myFirebaseRef = new Firebase(finalUrl);


    		myFirebaseRef.set({
				    		
    			imei : imei,
    			latitude : 12123,
			    longitude : 123123,
			    description : "optionaltest",
			    number : 123123,
			    timestamp : 1434343434323123,
			    country : "India",
			    area : "Delhi",
			    locality : "South India",
			    image : "placetextfornow",
			    id : id
				});

console.log("After Call")


}

function getData()
{

	console.log("getData initialialized")

	var myFirebaseRef = new Firebase("https://goldenhour.firebaseio.com");

	myFirebaseRef.on("value", function(snapshot) {

	var reportQueue = snapshot.val();

	for (var i in reportQueue){

		console.log(reportQueue[i]);
	}

});


}
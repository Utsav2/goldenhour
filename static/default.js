var app = angular.module("menu", []);  

var map;

var administrative_area;

var country;

var marker_array = [];

var _number_of_reports = 1;

var mines_array = [];

var currentMinePosition = 0;

app.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{[{');
  $interpolateProvider.endSymbol('}]}');
});

app.factory('data', function () {
  return { name:"YO" };
});


function resizeMapDiv(smaller, position){

	/*if(smaller){

		 $("#map-container").animate({
	        height: '90%',
	        width: "52.0875%"
	     }, 750, function () {
	          google.maps.event.trigger(map, 'resize');
	          map.panTo(position)
	     });

	} 

	else */{

		$("#map-container").animate({
		    height: '90%',
		    width: "83.4%"
		}, 750, function () {
		    google.maps.event.trigger(map, 'resize');

		});

	}

}

function reportController($scope, $http, data){

	$scope.myMapClass = "map-container-big";

	$scope.myFooterClass = "menuBar-bottom";

	$scope.reportClass = "report-hidden";

	$scope.LocationView = "locationChangerInvisible"

	$scope.data = data

	$scope.data.latitude = "";

	$scope.data.longitude = "";

	//initial Position Mumbai

	var position = new google.maps.LatLng(19.075955, 72.87631699999997);

	//creating an array of positions for USA India Afghanistan Somalia. This for demonstration purposes

	$scope.places = [];

	createGoogleMap(position);

	//centerMapToUser returns user position or initial position ^

	$scope.data.number_of_reports = 0;

	centerMapToUserPosition(position);

	$scope.openReport = function(report){

		$scope.closeLocationViewer();	

		$scope.myFooterClass = "menuBar-bottom-visible";

		$scope.reportClass = "report";

		$scope.data.description = report.Description

		$scope.data.type = report.Type;

		$scope.data.imei = report.IMEI;

		$scope.data.timestamp = report.Time

		$scope.data.latitude = "";

		$scope.data.longitude = "";

		$scope.data.time_formatted = report.time_formatted

		$scope.data.imageExists = false;

		if(typeof report.image !== "undefined" && report.image !== ""){

			$scope.data.imageExists = true;

			$scope.data.image = "data:image/png;base64," + report.image;

		}


		//Internet Report or modifed SMS report

		if(typeof report.Latitude !== "undefined"){

			$scope.lastMarker = $scope.marker;

			$scope.myMapClass = "map-container-small";

			var pos = new google.maps.LatLng(report.Latitude,
	                                       report.Longitude);

			resizeMapDiv(true, pos);

			if(typeof $scope.lastMarker !== "undefined")
				$scope.lastMarker.setMap(null);

			$scope.lastMarker = $scope.marker;

			$scope.marker = new google.maps.Marker({

		    	position: pos,
			    map: map,
		        title: report.description

		  	});

			map.panTo(pos);

			$scope.data.latitude = report.Latitude;

			$scope.data.longitude = report.Longitude;

		}
		else{

			if(typeof $scope.marker !== "undefined")
				$scope.marker.setMap(null);

			$scope.myMapClass = "map-container-big";

			resizeMapDiv(false);


		}
				
	};

	$scope.closeReport = function(){

		$scope.myMapClass = "map-container-big";

		$scope.myFooterClass = "menuBar-bottom";

		resizeMapDiv(false);

		$scope.reportClass = "report-hidden";

		if(typeof $scope.marker !== "undefined")
			$scope.marker.setMap(null);


	}

	$scope.toggleReport = function(){

		if($scope.myMapClass == "map-container-big")
			$scope.openReport();

		else
			$scope.closeReport();	

	}

	$scope.changeUserLocation = function(){

		$scope.closeReport();

		$('#map').addClass('blurred');

		$scope.LocationView = "locationChangerVisible"

	}

	$scope.changeTo = function(pos){


		$scope.UserPosition = $scope.places[pos];

	}

	$scope.closeLocationViewer = function(){

		$('#map').removeClass('blurred');

		$scope.LocationView = "locationChangerInvisible"
	}


	$scope.deleteReport = function(){

	var request = $http({

        method: "get",
        url: "/deleteMineData",
        params: {
          	IMEI: $scope.data.imei,
          	Time: $scope.data.timestamp
           	}
       	});

	request.then(

			function(){

				console.log('success');

				window.location.reload();
			}

			,

			function(){

				console.log('error');
			}

		);
	}

	$scope.addMarker = function(mine){

		if(mine.latitude == "undefined")
			return;

		var latlng = new google.maps.LatLng(mine.latitude, mine.longitude);

		var marker = new google.maps.Marker({

	      position: latlng,
	      map: map,
	      title: mine.description

	  	});

	}	

	$scope.currentlyDisabled = function(){

		alert("This feature is disabled for testing purposes");

	}

	$scope.alertPeople = function(){


	}

}

function newReportController($scope, $http, $compile, data){


	//This watches if the user position has changed. If it does, it gets the new administrative area and makes the ajax call to server

	$scope.workingOnRequest = false;

	$scope.logoNormal = "/static/loader.png";

	$scope.logo = $scope.logoNormal;

	$scope.logoAjax = "/static/loading_gif_new.gif";

	$scope.$watch('UserPosition', function() {

		if(typeof $scope.UserPosition === "undefined")
			return;

		reverseGeocode($scope.UserPosition);

		$scope.$watch('country', function(){

			if(typeof $scope.country === "undefined")
				return;

			$scope.createRequest();

		}); 

		map.panTo($scope.UserPosition);

		map.setZoom(10);

   	});

   	$scope.createRequest = function(){

		var myFirebaseRef = new Firebase("https://goldenhour.firebaseio.com/" + country);

		myFirebaseRef.on("value", function(snapshot) {

			var reportQueue = snapshot.val();

			$scope.addReports(reportQueue);

		});

   	}


	$scope.addReports = function(text){

		$scope.reports = text;

		var counter = 0;

		for(var i in $scope.reports){

			$scope.reports[i].time_formatted = formatTime($scope.reports[i]);

			counter++;

		}

		$scope.data.number_of_reports = counter;

		$scope.workingOnRequest = false;

	}

}

app.directive('ajax', function(){

	return{

		link: function (scope){

			scope.$watch('workingOnRequest', function(value){

				//console.log(value);

				if(value){

					scope.logo = scope.logoAjax;

					setTimeout(function(){scope.$apply();}, 3000);
				}

				else{

					scope.logo = scope.logoNormal;

					setTimeout(function(){scope.$apply();}, 3000);

				}


			});

		}

	}

});

function createGoogleMap(position) {

	var stylesArray = [{

	    "featureType": "landscape",
	    "stylers": [{
	        "saturation": -100
	    }, {
	        "lightness": 65
	    }, {
	        "visibility": "on"
	    }]
	}, {
	    "featureType": "poi",
	    "stylers": [{
	        "saturation": -100
	    }, {
	        "lightness": 51
	    }, {
	        "visibility": "simplified"
	    }]
	}, {
	    "featureType": "road.highway",
	    "stylers": [{
	        "saturation": -100
	    }, {
	        "visibility": "simplified"
	    }]
	}, {
	    "featureType": "road.arterial",
	    "stylers": [{
	        "saturation": -100
	    }, {
	        "lightness": 30
	    }, {
	        "visibility": "on"
	    }]
	}, {
	    "featureType": "road.local",
	    "stylers": [{
	        "saturation": -100
	    }, {
	        "lightness": 40
	    }, {
	        "visibility": "on"
	    }]
	}, {
	    "featureType": "transit",
	    "stylers": [{
	        "saturation": -100
	    }, {
	        "visibility": "simplified"
	    }]
	}, {
	    "featureType": "administrative.province",
	    "stylers": [{
	        "visibility": "off"
	    }]
	}, {
	    "featureType": "water",
	    "elementType": "labels",
	    "stylers": [{
	        "visibility": "on"
	    }, {
	        "lightness": -25
	    }, {
	        "saturation": -100
	    }]
	}, {
	    "featureType": "water",
	    "elementType": "geometry",
	    "stylers": [{
	        "hue": "#ffff00"
	    }, {
	        "lightness": -25
	    }, {
	        "saturation": -97
	    }]
	}]


	var mapOptions = {

        center: position,
        zoom: 15,
        //mapTypeId: google.maps.MapTypeId.HYBRID

    };

	map = new google.maps.Map(document.getElementById("map"), mapOptions);

	map.setOptions({styles: stylesArray});


}

function centerMapToUserPosition(initialPosition){


	var scope = angular.element($('#menu')).scope();

	if(navigator.geolocation) {
	    navigator.geolocation.getCurrentPosition(function(position) {

	    	var pos = new google.maps.LatLng(position.coords.latitude,
	                                       position.coords.longitude);

	    	map.panTo(pos);

	    	if(typeof initialPosition === "undefined")

	    		return;

	    	scope.$apply(function(){

	    		scope.UserPosition = pos;

	    	});

	    	/*

	    	if(getNumberOfReports(pos) == 0){

	    		move = confirm("There are no mines at your location. As this is a trial application, would you like to go to an area with sample mines?");
	    	}
			
	    	//To comment out after competition

			if(!move){


			}

			else{


			}

			*/

	    }, function() {

	      handleNoGeolocation(true);

	    });
	  } else {
	    // Browser doesn't support Geolocation
	    handleNoGeolocation(false);
	  }
	}

function handleNoGeolocation(errorFlag) {

	if (errorFlag) {
	    var content = 'Error: The Geolocation service failed.';
	} else {
	    var content = 'Error: Your browser doesn\'t support geolocation.';
	}

}


function reverseGeocode(latlng){

	var geocoder = new google.maps.Geocoder();

	geocoder.geocode({'latLng': latlng}, function(results, status) {

		if (status == google.maps.GeocoderStatus.OK) {

			if (results[0]) {

				return updateLocationAddressValue(results[0]);

			}
		}

	});

}

function updateLocationAddressValue(address){

	var builder = "";

	bigger_area = addAddressComponent(builder, "administrative_area_level_2", address)

	if(bigger_area.length == 0)
		bigger_area = addAddressComponent(builder, "locality", address);

	builder += bigger_area +  ", "

	administrative_area = addAddressComponent(builder, "administrative_area_level_1", address)

	builder += administrative_area + ", ";	

	country = addAddressComponent(builder, "country", address);

	builder += country

	var scope = angular.element($("#menu")).scope();

	scope.$apply(function(){

	    scope.location_data_text = builder;

	    scope.administrative_area = administrative_area;

	    scope.country = country;

	});

}

function addAddressComponent(builder, type_of_component, address){


	for(var i in address.address_components){

		var component = address.address_components[i];

		for(var j in component.types){

			var type = component.types[j];

			if(type == type_of_component){

				
				return component.long_name;

			}

		}

	}

	return "";

}

function formatTime(mine){

	console.log(mine);

	var t  = new Date(mine.Time * 1000);

	var today = new Date();

	var today_date = today.getDate();

	var date = t.getDate();

	var month = t.getMonth() + 1;

	var hours = t.getHours();

	var minutes = t.getMinutes();

	var seconds = t.getSeconds();

	var formattedTime;

	if(today_date == date){

		formattedTime = 'today, ' + hours + ':' + minutes;
	}

	else {

		formattedTime = 'on ' + month + '\/' + date + ', at ' + hours + ':' + minutes;

	}

	return formattedTime;

}

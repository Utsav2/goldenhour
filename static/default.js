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


function resizeMapDiv(smaller){

	if(smaller){

		 $("#map-container").animate({
	        height: '80%',
	        width: "41.75%"
	     }, 750, function () {
	          google.maps.event.trigger(map, 'resize');
	          centerMapToUserPosition();
	     });

	}

	else {

		$("#map-container").animate({
		    height: '90%',
		    width: "84%"
		}, 750, function () {
		    google.maps.event.trigger(map, 'resize');
		    centerMapToUserPosition();
		});

	}

}

function reportController($scope){

	$scope.myMapClass = "map-container-big";

	$scope.myFooterClass = "menuBar-bottom";

	$scope.reportClass = "report-hidden";

	//initial Position Mumbai

	var position = new google.maps.LatLng(19.075955, 72.87631699999997);

	createGoogleMap(position);

	//centerMapToUser returns user position or initial position ^

	centerMapToUserPosition(position);

	$scope.openReport = function(){

			$scope.myMapClass = "map-container-small";

			$scope.myFooterClass = "menuBar-bottom-visible";

			resizeMapDiv(true);

			$scope.reportClass = "report";
	};

	$scope.closeReport = function(){

		$scope.myMapClass = "map-container-big";

		$scope.myFooterClass = "menuBar-bottom";

		resizeMapDiv(false);

		$scope.reportClass = "report-hidden";

	}

	$scope.toggleReport = function(){

		if($scope.myMapClass == "map-container-big")
			$scope.openReport();

		else
			$scope.closeReport();	

	}

	$scope.changeUserLocation = function(){

		$scope.toggleReport();

	}

}

function newReportController($scope, $http, $compile){


	//This watches if the user position has changed. If it does, it gets the new administrative area and makes the ajax call to server


	$scope.$watch('UserPosition', function() {

		if(typeof $scope.UserPosition === "undefined")
			return;

		reverseGeocode($scope.UserPosition);

		$scope.$watch('country', function(){

			if(typeof $scope.country === "undefined")
				return;

			var request = $http({

            method: "get",
            url: "/getMineData",
            params: {
              	country: $scope.country,
               	area : $scope.administrative_area
               	}
           	});

			//It passes the function addMines on success of receiving data

			request.then($scope.addMines,

				function(){

					console.log('error');

				}

			);

		}); 

		map.panTo($scope.UserPosition);

   	});


	$scope.addMines = function(text){

		$scope.reports = text.data;

		for(var i in $scope.reports){

			$scope.reports[i].time_formatted = formatTime($scope.reports[i]);

			addMarker($scope.reports[i]);

		}

	}

}

function getNumberOfReports(position){

	return _number_of_reports;

}

function setNumberOfReports(newNumber){

	_number_of_reports = newNumber;


}

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

	builder += addAddressComponent(builder, "administrative_area_level_2", address) +", "

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


function addMarker(mine){

	if(mine.type == "SMS" && typeof mine.latitude == "undefined")
		return;

	var latlng = new google.maps.LatLng(mine.latitude, mine.longitude);

	var marker = new google.maps.Marker({

      position: latlng,
      map: map,
      title: mine.description

  	});

}

function formatTime(mine){

	var t  = new Date(mine.timestamp * 1000);

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

	//var html_string = '<a href = "#" ng-click="openReport()">' + formattedTime + '</a>'

	return formattedTime;

}


/*function addMines(json_data){

	for(i = currentMinePosition; i < json_data.length; i++){

		var mine = json_data[i];

		if(mine.type == "Internet"){

			addMarker(mine);

		}

		addToBar(mine);

	}

	currentMinePosition = json_data.length;


}*/


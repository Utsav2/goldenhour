var app = angular.module("menu", []);  

var map;

app.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{[{');
  $interpolateProvider.endSymbol('}]}');
});

window.onload = function (){

	createGoogleMap();

}
function number_of_reports_control($scope){

	var number_of_reports = getNumberOfReports();

	var builder = "";

	if(number_of_reports == 0){

		builder = "all done";

	}
	else{

		builder = number_of_reports + " unread";
	}

	$scope.data = {number_of_reports : builder};

}

function getNumberOfReports(position){

	return 5;

}

function createGoogleMap() {

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

	var position = new google.maps.LatLng(19.075955, 72.87631699999997)


	var mapOptions = {

        center: position,
        zoom: 15,
        //mapTypeId: google.maps.MapTypeId.HYBRID

    };

	map = new google.maps.Map(document.getElementById("map"), mapOptions);

	centerMapToUserPosition(position);

	map.setOptions({styles: stylesArray});
}

function centerMapToUserPosition(initialPosition){

	if(navigator.geolocation) {
	    navigator.geolocation.getCurrentPosition(function(position) {

	    	var pos = new google.maps.LatLng(position.coords.latitude,
	                                       position.coords.longitude);

	    	//To comment out after competition

	    	var move;

	    	if(getNumberOfReports(position) == 0){

	    		move = confirm("There are no mines at your location. As this is a trial application, would you like to go to an area with sample mines?");
	    	}
			
	    	//To comment out after competition

			if(!move)

				updateUserLocation(pos)

			else
				updateUserLocation(initialPosition);


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

//This is the initialization of the actual web app. 

function updateUserLocation(position){

	reverseGeocode(position);

	map.setCenter(position);

}

function reverseGeocode(latlng){

	var geocoder = new google.maps.Geocoder();

	geocoder.geocode({'latLng': latlng}, function(results, status) {

		if (status == google.maps.GeocoderStatus.OK) {

			if (results[0]) {

				updateLocationAddressValue(results[0]);

			}
		}

	});

}

function updateLocationAddressValue(address){

	var builder = "";

	builder += addAddressComponent(builder, "administrative_area_level_2", address, false);

	builder += addAddressComponent(builder, "administrative_area_level_1", address, false);

	builder += addAddressComponent(builder, "country", address, true);

	var scope = angular.element($("#menu")).scope();

	scope.$apply(function(){

	    scope.location_data_text = builder;

	});
}

function addAddressComponent(builder, type_of_component, address, end){

	console.log(address);

	for(var i in address.address_components){

		var component = address.address_components[i];

		for(var j in component.types){

			var type = component.types[j];

			if(type == type_of_component){

				if(!end)

					return component.long_name + ", ";

				else

					return component.long_name;

			}

		}

	}

	return "";

	

}
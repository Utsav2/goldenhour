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

window.onload = function (){

	createGoogleMap();
	

}

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


	$scope.openReport = function(){


		//if the report hasnt been opened or been closed before

		if($scope.myMapClass == "map-container-big"){

			$scope.myMapClass = "map-container-small";

			$scope.myFooterClass = "menuBar-bottom-visible";

			resizeMapDiv(true);

			$scope.reportClass = "report";

		}

		else{

			$scope.myMapClass = "map-container-big";

			$scope.myFooterClass = "menuBar-bottom";

			resizeMapDiv(false);

			$scope.reportClass = "report-hidden";

		}

		//resize google map

	};

}







function getNumberOfReports(position){

	return _number_of_reports;

}

function setNumberOfReports(newNumber){

	_number_of_reports = newNumber;


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

	map.panTo(position);

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

	builder += addAddressComponent(builder, "administrative_area_level_2", address) +", "

	administrative_area = addAddressComponent(builder, "administrative_area_level_1", address)

	builder += administrative_area + ", ";	

	country = addAddressComponent(builder, "country", address);

	builder += country

	var scope = angular.element($("#menu")).scope();

	scope.$apply(function(){

	    scope.location_data_text = builder;

	});

	getMineData();
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


	var latlng = new google.maps.LatLng(mine.latitude, mine.longitude);

	var marker = new google.maps.Marker({

      position: latlng,
      map: map,
      title: mine.description

  	});



}

function addToBar(mine){

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

		formattedTime = 'on ' + month + '\\' + date + ', at ' + hours + ':' + minutes;

	}

	$('#sideBar').append('<a href = "#" ng-click="openReport()">' + formattedTime + '</a>');

}




function getMineData(){

	var url = "getMineData?";

	if(administrative_area == "undefined" || country == "undefined")
		return;

	var builder = ("area="+encodeURIComponent(administrative_area)

					+ "&country="+encodeURIComponent(country));

	console.log(url+builder);

	$.ajax(url+builder)
		.done(function(text){

			var json_data = JSON.parse(text);

			setNumberOfReports(json_data.length);

			addMines(json_data);

			setTimeout(function(){getMineData()}, 10000);

		});

}

function addMines(json_data){

	for(i = currentMinePosition; i < json_data.length; i++){

		var mine = json_data[i];

		if(mine.type == "Internet"){

			addMarker(mine);

		}

		addToBar(mine);

	}

	currentMinePosition = json_data.length;


}
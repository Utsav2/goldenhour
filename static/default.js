var app = angular.module("menu", []);

app.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{[{');
  $interpolateProvider.endSymbol('}]}');
});

window.onload = function (){

	createGoogleMap();

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

	var position = new google.maps.LatLng(18.397, 72.644)

	var geocoder = new google.maps.Geocoder();

	if(google.loader.ClientLocation) {

		position.lat = google.loader.ClientLocation.latitude;

		position.lng = google.loader.ClientLocation.longitude;

	}


	var mapOptions = {

        center: position,
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.HYBRID

    };

	var map = new google.maps.Map(document.getElementById("map"), mapOptions);

	map.setOptions({styles: stylesArray});
}

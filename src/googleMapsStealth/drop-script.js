/*global $, FUELUX_EDITOR */
$(document).ready(function(){

	var view;
	var origDetails;
	var geoFlags = {
		browser: false,
		map: false,
		rev: false
	};
	var mapDefaults = {
		height: 300,
		width: 300,
		zoom: 12
	};


	FUELUX_EDITOR.on('receive', function(e, details) {
		var firstRun = details.gearData.firstRun;

		if (firstRun !== false) {
			view = details.viewType.value;

			if (navigator.geolocation) {
				geoFlags.browser = true;
				var timeoutVal = 10 * 1000 * 1000;
				navigator.geolocation.getCurrentPosition(
					showCurrentLocation,
					locationError,
					{ enableHighAccuracy: true, timeout: timeoutVal, maximumAge: 0 }
				);
			}
		}
	});

	FUELUX_EDITOR.trigger('fetch');

	/**
	 * couldn't find current location
	 *
	 * @method locationError
	 * @param {} error
	 */
	function locationError(error) {
		var errors = {
			1: 'Permission denied',
			2: 'Position unavailable',
			3: 'Request timeout'
		};
		if (error.code === 1) {
			geoFlags.browser = false;
		} else {
			geoFlags.map = false;
		}
		console.log("Error in geolocation: " + errors[error.code]);
	}


	/**
	 *	success callback for geolocation
	 *	display on the canvas
	 *
	 * @method showCurrentLocation
	 * @param {Object} position browser geolocation object
	 */
	function showCurrentLocation(position) {
		geoFlags.map = true;
		var gearData = {};
		var content;
		var params = position.coords.latitude + ',' + position.coords.longitude;

		// returned to the editor to render
		if (view === 'text/html; kind=viewaswebpage') {
			content = '<iframe width="' + mapDefaults.width + '" height="' + mapDefaults.height + '" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/?ll='+ params + '&amp;t=m&amp;z=16&amp;output=embed"></iframe><br /><small><a href="https://maps.google.com/maps?q=" target="_blank" style="color:#0000FF;text-align:left">View Larger Map</a></small>';
		} else if (view === 'text/html; kind=htmlemailbody' || view === 'text/html; kind=forwardtoafriend') {
			content =  '<a href="https://maps.google.com/maps?q='+ params +'" target="_blank"><img src="http://maps.googleapis.com/maps/api/staticmap?center=' + params + '&markers=' + params + '&zoom=' + mapDefaults.zoom + '&size=' + mapDefaults.width + 'x' + mapDefaults.height + '&sensor=false"' + ' /></a>';
		} else if (view === 'text/plain; kind=textemailbody') {
			content = params + ': https://maps.google.com/maps?q=' + params;
		} else {
			content = '<div class="well text-error">Message type not supported.</div>';
		}

		// pass back location to get closest address
		$.ajax({
			url: 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + position.coords.latitude + ',' + position.coords.longitude + '&sensor=false',
			type: 'GET',
			dataType: 'json',
			success: function(data, status, xhr) {
				geoFlags.rev = true;
				gearData.address = data.results[0]['formatted_address'];
				gearData.firstRunStealth = false;
				gearData.geoFlags = geoFlags;
			},
			error: function(xhr, status, error) {
				console.log(error);
			},
			complete: function() {
				FUELUX_EDITOR.trigger('update', { content: content, gearData: gearData });
				FUELUX_EDITOR.trigger('ready');
			}
		});
	}

});

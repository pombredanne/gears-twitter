/*global _, $, FUELUX_EDITOR */
$(document).ready(function(){

	var view, gearData;

	FUELUX_EDITOR.trigger('resize', { width: 310, height: 350 });
	FUELUX_EDITOR.trigger('fetch');

	FUELUX_EDITOR.on('receive', function(e, details) {
		gearData = details.gearData;
		view = (details && details.viewType && details.viewType.value ? details.viewType.value : null);

		// set spinner options
		$('#mapWidth').spinner({step:10});
		$('#mapHeight').spinner({step:10});

		// set spinner values
		$('#mapWidth').spinner('value', gearData.width);
		$('#mapHeight').spinner('value', gearData.height);
		$('#mapZoom').spinner('value', gearData.zoom);
		$('#mapAddress').val(gearData.address);

		// auto-update
		$('#mapWidth, #mapHeight, #mapZoom').on('changed', _.debounce(updateEditor, 100));
		$('#mapAddress').on('change', _.debounce(updateEditor, 100));

		FUELUX_EDITOR.trigger('ready');
	});

	FUELUX_EDITOR.on('accept', function(e, details){
		// with auto-updating, this event should just close the palette
		FUELUX_EDITOR.trigger('done');
	});

	function updateEditor() {
		gearData = {
			address: $('#mapAddress').val(),
			width: $('#mapWidth').spinner('value'),
			height: $('#mapHeight').spinner('value'),
			zoom: $('#mapZoom').spinner('value')
		};
		gearData.urlAddress = gearData.address.replace(/\s/g, '+');

		var content = getDesignView(gearData);
		FUELUX_EDITOR.trigger('update', { design:content, content: content, gearData: gearData });
	}

	// geolocation
	if (navigator.geolocation) {
		// enable if supported in the browser
		$('#locationBtn').on('click', function() {
			var timeoutVal = 10 * 1000 * 1000;
			navigator.geolocation.getCurrentPosition(
				locationSuccess,
				locationError,
				{ enableHighAccuracy: true, timeout: timeoutVal, maximumAge: 0 }
			);
		});
	}
	else {
		// hide if not supported
		$('#locationBtn').hide();
	}

	/**
	 *	success callback for geolocation
	 *	display on the canvas
	 *
	 * @method locationSuccess
	 * @param {Object} position browser geolocation object
	 */
	function locationSuccess(position) {
		var address = '';

		// pass back location to get closest address
		$.ajax({
			url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + position.coords.latitude + ',' + position.coords.longitude + '&sensor=false',
			type: 'GET',
			dataType: 'json',
			success: function(data, status, xhr) {
				address = data.results[0]['formatted_address'];
			},
			error: function(xhr, status, error) {
				console.log(error);
			},
			complete: function() {
				$('#mapAddress').val(address);
				updateEditor();
			}
		});
	}

	function getDesignView() {
		return '<img src="https://maps.googleapis.com/maps/api/staticmap?center=' + gearData.urlAddress + '&markers=' + gearData.urlAddress + '&zoom=' + gearData.zoom + '&size=' + gearData.width + 'x' + gearData.height + '&sensor=false"' + ' />';
	}

	// static representation
	function getStaticView() {
		return '<a href="https://maps.google.com/maps?q='+ gearData.urlAddress +'" target="_blank"><img src="https://maps.googleapis.com/maps/api/staticmap?center=' + gearData.urlAddress + '&markers=' + gearData.urlAddress + '&zoom=' + gearData.zoom + '&size=' + gearData.width + 'x' + gearData.height + '&sensor=false"' + ' /></a>';
	}

	// interactive representation
	function getInteractiveView() {
		return '<iframe width="'+ gearData.width +'" height="'+ gearData.height +'" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?q='+ gearData.urlAddress +'&amp;output=embed"></iframe><br /><small><a href="https://maps.google.com/maps?q='+ gearData.urlAddress +'" target="_blank" style="color:#0000FF;text-align:left">View Larger Map</a></small>';
	}

	// text representation
	function getTextView(gearData, jsonData) {
		return gearData.address + ': https://maps.google.com/maps?q=' + gearData.urlAddress;
	}



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

		console.log("Error in geolocation: " + errors[error.code]);
	}

	/**
	 * remove event bindings for autoupdate
	 *
	 * @method cleanup
	 */
	function cleanup() {
		$('#mapWidth, #mapHeight, #mapZoom, #mapAddress').off();
	}

	/**
	 * message user about browser geolocation
	 *
	 * @method locationMessage
	 * @param {Boolean} flag geolocated
	 */
	function msgGeoBrowser(flag) {
		flag = flag || false;
		var message = '';
		if (flag === true) {
			message = 'Your position was determined automatically via browser geolocation.';
		} else {
			message = 'Your position could not be automatically determined. If you would like to enable geolocation, please check your browser settings.';
		}
		$('#msgGeo').append('<li>' + message + '</li>');
	}

	/**
	 * message user about mapping service
	 *
	 * @method locationMessage
	 * @param {Boolean} flag geolocated
	 */
	function msgGeoMap(flag) {
		flag = flag || false;
		var message = '';
		if (flag === true) {
			message = 'Your position was located on the map as shown.';
		} else {
			message = 'Your position could not be located via the Google Maps service.';
		}
		$('#msgGeo').append('<li>' + message + '</li>');
	}

	/**
	 * message about reverse mapping geolocation to an address
	 *
	 * @method revMapAddressMessage
	 * @param {Boolean} flag
	 */
	function msgGeoRev(flag) {
		flag = flag || false;
		var message = '';
		if (flag === true) {
			message = 'Your address was reverse mapped from your location. Please verify for accuracy.';
		} else {
			message = 'Your address could not be reverse mapped from your location.';
		}
		$('#msgGeo').append('<li>' + message + '</li>');
	}

});

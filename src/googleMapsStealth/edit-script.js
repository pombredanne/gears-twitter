/*global $, FUELUX_EDITOR */
$(document).ready(function(){

	var view;
	var origDetails;
	var mapDefaults = {
		height: 300,
		width: 300,
		zoom: 12
	};
	var geoFlags = {
		browser: false,
		map: false,
		rev: false
	};


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


	// interactive map
	function getWebView(gearData) {
		return '<iframe width="'+ gearData.width +'" height="'+ gearData.height +'" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?q='+ gearData.urlAddress +'&amp;output=embed"></iframe><br /><small><a href="https://maps.google.com/maps?q='+ gearData.urlAddress +'" target="_blank" style="color:#0000FF;text-align:left">View Larger Map</a></small>';
	}

	// static map, no controls, image only, zoomable
	function getHtmlView(gearData) {
		return '<a href="https://maps.google.com/maps?q='+ gearData.urlAddress +'" target="_blank"><img src="http://maps.googleapis.com/maps/api/staticmap?center=' + gearData.urlAddress + '&markers=' + gearData.urlAddress + '&zoom=' + gearData.zoom + '&size=' + gearData.width + 'x' + gearData.height + '&sensor=false"' + ' /></a>';
	}

	function getTextView(gearData) {
		return gearData.address + ': https://maps.google.com/maps?q=' + gearData.urlAddress;
	}

	// what content to message back to the editor
	function getContent(view, gearData) {
		var content;
		if (view === 'text/html; kind=viewaswebpage') {
			content = getWebView(gearData);
		} else if (view === 'text/html; kind=htmlemailbody' || view === 'text/html; kind=forwardtoafriend') {
			content = getHtmlView(gearData);
		} else if (view === 'text/plain; kind=textemailbody') {
			content = getTextView(gearData);
		} else {
			content = '<div class="well text-error">Message type not supported.</div>';
		}
		return content;
	}

	function getDataForEditor(view) {
		var address = $('#mapAddress').val(),
			urlAddress = address.replace(/\s/g, "+"),
			width = $('#mapWidth').spinner('value'),
			height = $('#mapHeight').spinner('value'),
			zoom = $('#mapZoom').spinner('value'),
			content = '',
			gearData = {
				address: address,
				urlAddress: urlAddress,
				width: width,
				height: height,
				zoom: zoom
			};
		if ((address === '') || (width === '') || (height === '') || (zoom === '')) {
			// validation here instead of allowing messaging to continue
			content = '<div class="well text-error">Please verify that you have supplied an address, width, height, and/or zoom.</div>';
			return false;
		} else {
			content = getContent(view, gearData);
		}
		return { content: content, gearData: gearData };
	}

	// autoupdate
	function updateEditor() {
		var data = getDataForEditor(view);
		FUELUX_EDITOR.trigger('update', data);
	}

	$('#locationWarning').hide();

	FUELUX_EDITOR.trigger('fetch');

	FUELUX_EDITOR.trigger('resize', { height: 350, width: 310 });

	FUELUX_EDITOR.on('receive', function(e, details){
		var gearData = details.gearData;
		origDetails = details;
		geoFlags = (typeof gearData.geoFlags !== 'undefined' ? gearData.geoFlags : geoFlags);

		$('#locationDone').show();

		// create spinners on page
		$('#mapWidth').spinner({
			'value': mapDefaults.width,
			'min': 200,
			'speed': 'fast',
			'step': 10
		});
		$('#mapHeight').spinner({
			'value': mapDefaults.height,
			'min': 200,
			'speed': 'fast',
			'step': 10
		});

		$('#mapZoom').spinner({
			'value': mapDefaults.zoom,
			'min': 0,
			'max': 21,
			'speed': 'slow',
			'step': 1
		});

		if (gearData.firstRun !== false) {
			msgGeoBrowser(geoFlags.browser);

			if (geoFlags.browser === true) {
				msgGeoMap(geoFlags.map);
				if (geoFlags.map === true) {
					msgGeoRev(geoFlags.rev);
				}
			}
		} // if firstR

		view = (details && details.viewType && details.viewType.value ? details.viewType.value : null);

		if (typeof gearData.width !== 'undefined') {
			$('#mapWidth').spinner('value', gearData.width);
		}
		if (typeof gearData.height !== 'undefined') {
			$('#mapHeight').spinner('value', gearData.height);
		}
		if (typeof gearData.zoom !== 'undefined') {
			$('#mapZoom').spinner('value', gearData.zoom);
		}
		if (typeof gearData.address !== 'undefined') {
			$('#mapAddress').val(gearData.address);
		}

		// use for autoupdating
		$('#mapWidth, #mapHeight, #mapZoom').on('changed', _.debounce(updateEditor, 100));
		$('#mapAddress').on('change', _.debounce(updateEditor, 100));

		FUELUX_EDITOR.trigger('ready');
	});

	FUELUX_EDITOR.on('cancel', function(e, details){
		FUELUX_EDITOR.trigger('done');
	});

	// only update if we've changed
	FUELUX_EDITOR.on('accept', function(e, details){
		cleanup();
		view = ( details && details.viewType && details.viewType.value ? details.viewType.value : view);
		var data = getDataForEditor(view);
		// prevent another geolocation
		data.gearData.firstRun = false;
		data.gearData.geoFlags = geoFlags;
		if (data.gearData !== details.gearData || data.content !== details.content) {
			FUELUX_EDITOR.trigger('done', data);
		} else {
			FUELUX_EDITOR.trigger('done');
		}
	});

});

/*global $, FUELUX_EDITOR */
$(document).ready(function(){
	// store for later
	var view;

	var origDetails;

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
		if (
			view === 'text/html; kind=viewaswebpage' || view === 'text/html; kind=htmlemailbody') {
			content = getWebView(gearData);
		} else if (view === 'text/html; kind=forwardtoafriend') {
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

	FUELUX_EDITOR.trigger('fetch');

	FUELUX_EDITOR.trigger('resize', { height: 258, width: 310 });

	FUELUX_EDITOR.on('receive', function(e, details){
		var gearData = details.gearData;
		origDetails = details;

		view = (details && details.viewType && details.viewType.value ? details.viewType.value : null);

		if (gearData.address && gearData.width && gearData.height && gearData.zoom) {
			$('#mapWidth').spinner('value', gearData.width);
			$('#mapHeight').spinner('value', gearData.height);
			$('#mapZoom').spinner('value', gearData.zoom);
			$('#mapAddress').val(gearData.address);
		} else {
			// geolocation here?
		}

		FUELUX_EDITOR.trigger('ready');
	});

	FUELUX_EDITOR.on('cancel', function(e, details){
		FUELUX_EDITOR.trigger('done', { content: details.content, gearData: details.gearData });
	});

	FUELUX_EDITOR.on('accept', function(e, details){
		// view can be stored from receive event or read now
		view = ( details && details.viewType && details.viewType.value ? details.viewType.value : view);
		FUELUX_EDITOR.trigger('done', getDataForEditor(view));
	});

	// click handlers for accept/cancel buttons
	$('.editor-dialog-cancel').on('click', function(e) {
		e.preventDefault();
		FUELUX_EDITOR.trigger('done', { content: origDetails.content, gearData: origDetails.gearData });
	});

	$('.editor-dialog-accept').on('click', function(e) {
		e.preventDefault();
		FUELUX_EDITOR.trigger('done', getDataForEditor(view));
	});

	// create spinners on page
	$('#mapWidth').spinner({
		'value': 267,
		'min': 200,
		'speed': 'fast',
		'step': 10
	});
	$('#mapHeight').spinner({
		'value': 200,
		'min': 200,
		'speed': 'fast',
		'step': 10
	});

	$('#mapZoom').spinner({
		'value': 12,
		'min': 0,
		'max': 21,
		'speed': 'slow',
		'step': 1
	});

});

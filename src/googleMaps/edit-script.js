/*global $, FUELUX_EDITOR */
$(document).ready(function(){
	var view;
	function getWebView(gearData, urlAddress) {
		return '<iframe width="'+ gearData.width +'" height="'+ gearData.height +'" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?q='+ urlAddress +'&amp;output=embed"></iframe><br /><small><a href="https://maps.google.com/maps?q='+ urlAddress +'" target="_blank" style="color:#0000FF;text-align:left">View Larger Map</a></small>';
	}

	function getHtmlView(gearData, urlAddress) {
		return '<a href="https://maps.google.com/maps?q='+ urlAddress +'" target="_blank"><img src="http://maps.googleapis.com/maps/api/staticmap?center=' + urlAddress + '&markers=' + urlAddress + '&zoom=14&size=' + gearData.width + 'x' + gearData.height + '&sensor=false"' + ' /></a>';
	}

	function getTextView(gearData, urlAddress) {
		return gearData.address + ': https://maps.google.com/maps?q=' + urlAddress;
	}

	FUELUX_EDITOR.trigger('fetch');

	FUELUX_EDITOR.trigger('resize', { height: 258, width: 310 });

	FUELUX_EDITOR.on('receive', function(e, details){
		var address = '',
			gearData = details.gearData;

		view = (details && details.viewType && details.viewType.value ? details.viewType.value : null);

		$('#mapWidth').spinner('value', gearData.width);
		$('#mapHeight').spinner('value', gearData.height);
		$('#mapZoom').spinner('value', gearData.zoom);

		if (gearData.address !== undefined){
			address = gearData.address.replace(/\+/g," ");
		}
		$('#mapAddress').val(address);

		FUELUX_EDITOR.trigger('ready');
	});

	FUELUX_EDITOR.on('cancel', function(e, details){
		FUELUX_EDITOR.trigger('done', { content: details.content, gearData: details.gearData });
	});

	FUELUX_EDITOR.on('accept', function(e, details){
		// view can be stored from receive event or read now
		view = ( details && details.viewType && details.viewType.value ? details.viewType.value : view);

		var address = $('#mapAddress').val(),
			urlAddress = address.replace(/\s/g, "+"),
			width = $('#mapWidth').spinner('value'),
			height = $('#mapHeight').spinner('value'),
			zoom = $('#mapZoom').spinner('value'),
			content = '',
			gearData = {
				address: address,
				width: width,
				height: height,
				zoom: zoom
			};

		if ((address === '') || (width === '') || (height === '') || (zoom === '')) {

			content = '<div class="well text-error">Please verify that you have supplied an address, width, height, and/or zoom.</div>';

			FUELUX_EDITOR.trigger('done', { content: content, gearData: gearData });

		} else {

			if (
				view === 'text/html; kind=viewaswebpage' || view === 'text/html; kind=htmlemailbody') {
				content = getHtmlView(gearData, urlAddress);
			} else if (view === 'text/html; kind=forwardtoafriend') {
				content = getHtmlView(gearData, urlAddress);
			} else if (view === 'text/plain; kind=textemailbody') {
				content = getTextView(gearData, urlAddress);
			} else {
				content = '<div class="well text-error">Message type not supported.</div>';
			}


			FUELUX_EDITOR.trigger('done', { content: content, gearData: gearData });
		}
	});

	$('#mapWidth').spinner({
		'value': 267,
		'min': 200,
		'speed': 'fast'
	});
	$('#mapHeight').spinner({
		'value': 200,
		'min': 200,
		'speed': 'fast'
	});
	$('#mapZoom').spinner({
		'value': 12,
		'min': 0,
		'max': 21,
		'speed': 'slow'
	});
});

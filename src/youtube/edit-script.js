/*global $, FUELUX_EDITOR */
$(document).ready(function(){
	// store for later
	var view;

	function getWebView(gearData, jsonData) {
		return '<iframe width="' + gearData.width + '" height="' + gearData.height + '" src="http://www.youtube.com/embed/' + gearData.vId + '" frameborder="0" title="' + jsonData.data.title + '"></iframe>';
	}

	function getHtmlView(gearData, jsonData) {
		return '<a href="http://www.youtube.com/watch?v=' + gearData.vId + '" target="_blank" title="Watch Video: ' + jsonData.data.title + '"><img src="' + jsonData.data.thumbnail.hqDefault + '" width="' + gearData.width + '" alt="' + jsonData.data.title + '" /></a>';
	}

	function getTextView(gearData, jsonData) {
		return jsonData.data.title + ': http://www.youtube.com/watch?v=' + gearData.vId;
	}

	FUELUX_EDITOR.trigger('fetch');

	FUELUX_EDITOR.trigger('resize', { height: 240, width: 310 });

	FUELUX_EDITOR.on('receive', function(e, details){
		// view can be stored from receive event or read now
		view = ( details && details.viewType && details.viewType.value ? details.viewType.value : null);

		var gearData = details.gearData;

		$('#playerHeight').spinner('value', gearData.height);
		$('#vidId').val(gearData.vId);
		$('#playerWidth').spinner('value', gearData.width);

		FUELUX_EDITOR.trigger('ready');
	});

	FUELUX_EDITOR.on('cancel', function(e, details){
		FUELUX_EDITOR.trigger('done', { content: details.content, gearData: details.gearData });
	});

	FUELUX_EDITOR.on('accept', function(e, details){
		// view can be stored from receive event or read now
		view = ( details && details.viewType && details.viewType.value ? details.viewType.value : view);

		var vId = $('#vidId').val(),
			width = $('#playerWidth').spinner('value'),
			height = $('#playerHeight').spinner('value'),
			content = '',
			gearData = {
				width: width,
				height: height,
				vId: vId
			};

		if ((vId === '') || (width === '') || (height ===  '')) {
			content = '<div class="well text-error">Missing or incorrect info.</div>';

			FUELUX_EDITOR.trigger('done', { content: content, gearData: gearData });

		} else {
			$.getJSON('http://gdata.youtube.com/feeds/api/videos/'+vId+'?v=2&alt=jsonc',function(jsonData,status,xhr){
				if (status !== 'success') { // json error
					content += '<div class="well text-error">JSON Error</div>';
				} else {
					if (
						view === 'text/html; kind=viewaswebpage' ||
							view === 'text/html; kind=htmlemailbody' ||
							view === 'text/html; kind=web' ||
							view === 'text/html; kind=forwardtoafriend'
					) {
						content = getHtmlView(gearData, jsonData);
					} else if (view === 'text/plain; kind=textemailbody') {
						content = getTextView(gearData, jsonData);
					} else {
						content = '<div class="well text-error">Message type not supported.</div>';
					}
				}

				FUELUX_EDITOR.trigger('done', { content: content, gearData: gearData });
			});
		}
	});

	$('#playerWidth').spinner({
		'value': 267,
		'min': 200,
		'speed': 'fast'
	});
	$('#playerHeight').spinner({
		'value': 200,
		'min': 200,
		'speed': 'fast'
	});
});

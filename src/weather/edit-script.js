/*global $, FUELUX_EDITOR */
$(document).ready(function() {
	var zipcode = '';

	$('#searchField').on('searched', function(event, searchText) {
		zipcode = searchText;

		$.ajax({
			url : 'https://api.wunderground.com/api/a9098e8c1b9fb593/geolookup/conditions/q/IA/' + zipcode + '.json',
			dataType : 'jsonp',
			success : function(data) {
				var location = data.location.city + ', ' + data.location.state;
				var temp = data.current_observation.temp_f;

				$('#output').html('current temperature in ' + location + ' is: ' + temp + '&deg;<br/>' + data.current_observation.weather + ' <img src="' + data.current_observation.icon_url + '" />');
			}
		});
	});

	$('#searchField').on('cleared', function() {
		$('#output').html('');
	});

	FUELUX_EDITOR.trigger('resize', { height:200, width:200 });
	FUELUX_EDITOR.trigger('fetch');

	// load gear, fires on response to the 'fetch' event
	FUELUX_EDITOR.on('receive', function(e, details) {
		FUELUX_EDITOR.trigger('ready');
	});

	// close and populate editor with gear data
	FUELUX_EDITOR.on('accept', function(e, details) {

		var html = $('#output').html();
		var json = {
			zip: zipcode
		};

		FUELUX_EDITOR.trigger('done', {
			content: html,
			design: html,
			gearData: json
		});
	});
});

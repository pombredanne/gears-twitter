/*global $, FUELUX_EDITOR */
var _gearData;

$(document).ready(function(){
	FUELUX_EDITOR.trigger('resize', { height: 150 });
	FUELUX_EDITOR.trigger('fetch');

	FUELUX_EDITOR.on('receive', function(e, details) {
		console.log('receive', details);
		FUELUX_EDITOR.trigger('ready');
	});

	FUELUX_EDITOR.on('accept', function(e, details) {
		console.log('accept', details);
		FUELUX_EDITOR.trigger('done');
	});

});

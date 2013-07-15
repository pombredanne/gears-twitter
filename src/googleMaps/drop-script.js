/*global $, FUELUX_EDITOR */
$(document).ready(function(){

	var defaults = {
		address: '20 N. Meridian St, Indianapolis, IN 46204',
		width: 300,
		height: 300,
		zoom: 12
	};

	function getDesignView() {
		var address = defaults.address.replace(/\s/g, '+');

		return '<img src="http://maps.googleapis.com/maps/api/staticmap?center=' + address + '&markers=' + address + '&zoom=' + defaults.zoom + '&size=' + defaults.width + 'x' + defaults.height + '&sensor=false"' + ' />';
	}

	FUELUX_EDITOR.trigger('done', {
		content: 'default content',
		design: getDesignView(),
		gearData: {
			address: defaults.address,
			urlAddress: defaults.address.replace(/\s/g, "+"),
			width: defaults.width,
			height: defaults.height,
			zoom: defaults.zoom
		}
	});

});

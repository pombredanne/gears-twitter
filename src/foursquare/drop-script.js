/*global $, FUELUX_EDITOR */
var defaults = {
	username: 'ExactTarget',
	showCount: true
};

var lat = $('#lat').val(),
	lng = $('#lng').val(),
	radius = $('#radius').spinner('value'),
	limit = $('#limit').spinner('value'),
	categories = $('#categories').pillbox('items'),
	exCategories = $('#exCategories').pillbox('items'),
	showData = {
		showCategory : $('#showCategory').is(':checked'),
		showPhone : $('#showPhone').is(':checked'),
		showDistance : $('#showDistance').is(':checked'),
		showAddress : $('#showAddress').is(':checked'),
		showVerified : $('#showVerified').is(':checked'),
		showCheckins : $('#showCheckins').is(':checked'),
		showUsers : $('#showUsers').is(':checked'),
		showTips : $('#showTips').is(':checked'),
		showUrl : $('#showUrl').is(':checked'),
		showLikes : $('#showLikes').is(':checked'),
		showSpecials : $('#showSpecials').is(':checked')
	},
	categoryStr = '',
	content = '',
	gearData = {
		lat: lat,
		lng: lng,
		radius: radius,
		limit: limit,
		showData: showData,
		categories: categories,
		exCategories: exCategories
	};

if (categories !== null) {
	$.each(categories, function( key, value ) {
		categoryStr += value.value + ',';
	});
}

if ((lat === '') || (lng === '')) {

	content = '<div class="well text-error">Missing or incorrect info.</div>';

	FUELUX_EDITOR.trigger('done', { content: content, gearData: gearData });

} else {
	$.getJSON(
		"https://api.foursquare.com/v2/venues/search?",
		{
			"ll": lat + ',' + lng,
			"intent": "browse",
			"radius": radius,
			"limit": limit,
			"categoryId": categoryStr,
			"oauth_token": "Q4ADTMWI3W0DYRZK4CPRK4WCJOBR1FSPMMAPT4AGDTVFEFP4",
			"v": "20121016"
		},
		function(jsonData) {
			if (jsonData && jsonData.response && jsonData.response.venues) {
				if (jsonData.response.venues.length === 0) {
					content = 'No venues found for your criteria. Please edit your search and try again.';
				} else {
					// if (
					// 	view === 'text/html; kind=viewaswebpage' || view === 'text/html; kind=htmlemailbody') {
					// 	content = getHtmlView(jsonData, showData, content);
					// } else if (view === 'text/html; kind=forwardtoafriend') {
					// 	content = getHtmlView(jsonData, showData, content);
					// } else if (view === 'text/plain; kind=textemailbody') {
					// 	content = getTextView(jsonData, showData, content);
					// } else {
					// 	content = '<div class="well text-error">Message type not supported.</div>';
					// }

				} // length check

			} else {
				// API fail
				content = 'Error getting data back from Foursquare. Please try again.';
			}

			FUELUX_EDITOR.trigger('done', { content: content, gearData: gearData });
		}
	);
}

$(document).ready(function(){

	FUELUX_EDITOR.trigger('done', {
		content: 'default content',
		design: content,
		gearData: defaults
	});
});

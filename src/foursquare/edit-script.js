/*global $, FUELUX_EDITOR */
$(document).ready(function(){
	// store for later
	var view;

	function getHtmlView(jsonData, showData, content) {
		content += '<ul class="clearfix">';

		$.each(jsonData.response.venues, function(i,venue){
			content += '<li>';
			content += '<strong>Name: </strong><a href="' + venue.canonicalUrl + '">' + venue.name + '</a><br />';

			if (showData.showCategory) {
				$.each(this.categories, function(i,category){
					content += '<strong>Category: </strong>' + category.name + '<br />';
				});
			}
			if ( venue.contact.formattedPhone && showData.showPhone ) {
				content += '<strong>Phone: </strong>' + venue.contact.formattedPhone + '<br />';
			}
			if (showData.showDistance) {
				content += '<strong>Distance: </strong>' + venue.location.distance + ' meters<br />';
			}
			if (showData.showAddress) {
				content += '<strong>Address: </strong>' + venue.location.address + ', ' + venue.location.city + ', ' + venue.location.state + ' ' + venue.location.postalCode + ' ' + venue.location.cc + '<br />';
			}
			if (showData.showVerified) {
				if ( venue.verified) {
					content += '<strong>Verified?: </strong>Yes<br />';
				} else {
					content += '<strong>Verified?: </strong>No<br />';
				}
			}
			if (showData.showCheckins) {
				content += '<strong>Checkins: </strong>' + venue.stats.checkinsCount + '<br />';
			}
			if (showData.showUsers) {
				content += '<strong>Users: </strong>' + venue.stats.usersCount + '<br />';
			}
			if (showData.showTips) {
				content += '<strong>Tips: </strong>' + venue.stats.tipCount + '<br />';
			}
			if ( showData.showUrl && venue.url ) {
				content += '<strong>Url: </strong><a href="' + venue.url + '">' + venue.url + '</a><br />';
			}
			if (showData.showLikes) {
				content += '<strong>Likes: </strong>' + venue.likes.count + '<br />';
			}
			if (showData.showSpecials) {
				content += '<strong>Specials: </strong>' + venue.specials.count + '<br />';
			}

			content += '</li>';

		});

		content += '</ul>';

		return content;
	}

	function getTextView(jsonData, showData, content) {

		$.each(jsonData.response.venues, function(i,venue){
			content += 'Name: ' + venue.name + '\r\n';
			content += 'Page Url: ' + venue.canonicalUrl + '\r\n';

			if (showData.showCategory) {
				$.each(this.categories, function(i,category){
					content += 'Category: ' + category.name + '\r\n';
				});
			}
			if ( venue.contact.formattedPhone && showData.showPhone ) {
				content += 'Phone: ' + venue.contact.formattedPhone + '\r\n';
			}
			if (showData.showDistance) {
				content += 'Distance: ' + venue.location.distance + '\r\n';
			}
			if (showData.showAddress) {
				content += 'Address: ' + venue.location.address + ', ' + venue.location.city + ', ' + venue.location.state + ' ' + venue.location.postalCode + ' ' + venue.location.cc + '\r\n';
			}
			if (showData.showVerified) {
				if ( venue.verified) {
					content += 'Verified?: Yes\r\n';
				} else {
					content += 'Verified?: No\r\n';
				}
			}
			if (showData.showCheckins) {
				content += 'Checkins: ' + venue.stats.checkinsCount + '\r\n';
			}
			if (showData.showUsers) {
				content += 'Users: ' + venue.stats.usersCount + '\r\n';
			}
			if (showData.showTips) {
				content += 'Tips: ' + venue.stats.tipCount + '\r\n';
			}
			if ( showData.showUrl && venue.url ) {
				content += 'Url: ' + venue.url + '\r\n';
			}
			if (showData.showLikes) {
				content += 'Likes: ' + venue.likes.count + '\r\n';
			}
			if (showData.showSpecials) {
				content += 'Specials: ' + venue.specials.count + '\r\n';
			}

			content += '\r\n';

		});

		content += '</ul>';

		return content;
	}

	FUELUX_EDITOR.trigger('fetch');

	FUELUX_EDITOR.trigger('resize', { height: 580, width: 480 });

	FUELUX_EDITOR.on('receive', function(e, details){
		var gearData = details.gearData;
		var categories = gearData.categories || [{"text":"Arts & Entertainment","value":"4d4b7104d754a06370d81259"},{"text":"Food","value":"4d4b7105d754a06374d81259"},{"text":"Nightlife Spot","value":"4d4b7105d754a06376d81259"},{"text":"Outdoors & Recreation","value":"4d4b7105d754a06377d81259"}];
		var exCategories = gearData.exCategories || [{"text":"College & University","value":"4d4b7105d754a06372d81259"},{"text":"Professional & Other Places","value":"4d4b7105d754a06375d81259"},{"text":"Residence","value":"4e67e38e036454776db1fb3a"},{"text":"Shop & Service","value":"4d4b7105d754a06378d81259"},{"text":"Travel & Transport","value":"4d4b7105d754a06379d81259"}];
		var showData = gearData.showData || {"showCategory":true,"showPhone":false,"showDistance":true,"showAddress":false,"showVerified":false,"showCheckins":false,"showUsers":false,"showTips":false,"showUrl":false,"showLikes":false,"showSpecials":false};

		var jqCategories = $('#categories ul');
		var jqExCategories = $('#exCategories ul');

		$.each(categories, function(index, element) {
			jqCategories.append('<li data-value="' + categories[index].value + '">' + categories[index].text + '</li>');
		});
		$.each(exCategories, function(index, element) {
			jqExCategories.append('<li data-value="' + exCategories[index].value + '">' + exCategories[index].text + '</li>');
		});

		$.each(showData, function(index, element) {
			$('#' + showData[index]).attr('checked', showData[index] === true ? 'checked' : '');
		});

		// which view to show
		view = (details && details.viewType && details.viewType.value ? details.viewType.value : null);

		$('#lat').val(gearData.lat);
		$('#lng').val(gearData.lng);
		$('#radius').spinner('value', gearData.radius);
		$('#limit').spinner('value', gearData.limit);

		$('#categories').on('click', 'li', function(){
			$('#exCategories ul').append('<li data-value="' + $(this).attr('data-value') + '">' + $(this).html() + '</li>');
		});
		$('#exCategories').on('click', 'li', function(){
			$('#categories ul').append('<li data-value="' + $(this).attr('data-value') + '" class="status-success">' + $(this).html() + '</li>');
		});

		FUELUX_EDITOR.trigger('ready');
	});

	FUELUX_EDITOR.on('accept', function(e, details){

		// view can be stored from receive event or read now
		view = ( details && details.viewType && details.viewType.value ? details.viewType.value : view);

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
							if (
								view === 'text/html; kind=viewaswebpage' || view === 'text/html; kind=htmlemailbody') {
								content = getHtmlView(jsonData, showData, content);
							} else if (view === 'text/html; kind=forwardtoafriend') {
								content = getHtmlView(jsonData, showData, content);
							} else if (view === 'text/plain; kind=textemailbody') {
								content = getTextView(jsonData, showData, content);
							} else {
								content = '<div class="well text-error">Message type not supported.</div>';
							}

						} // length check

					} else {
						// API fail
						content = 'Error getting data back from Foursquare. Please try again.';
					}

					FUELUX_EDITOR.trigger('done', { content: content, gearData: gearData });
				}
			);
		}
	});
	$('#radius').spinner({
		'value': 100,
		'min': 1,
		'max': 100000,
		'speed': 'fast'
	});
	$('#limit').spinner({
		'value': 4,
		'min': 1,
		'max': 50,
		'speed': 'slow'
	});
});

/*global $, FUELUX_EDITOR */
$(document).ready(function() {
	var url = 'http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=d6d798f51bbd5ec0a1f9e9f1e62c43ab&format=json';
	var searchTerm = '';
	var selectedImageUrl = '';

	$('#searchField').on('searched', function(event, searchText) {
		searchTerm = searchText;
		var options = {
			search: searchText,
			pageSize: 9,
			pageIndex: 1
		};

		findImage(options);
	});

	$('#searchField').on('cleared', function() {
		$('#gallery').html('');
	});

	$('body').on('click', '.thumbnail', function() {
		$('.thumbnail').removeClass('thumbnail-active');
		$(this).addClass('thumbnail-active');

		selectedImageUrl = $(this).data('url');
	});

	function findImage(options) {
		// Search active.  Add URL parameters for Flickr API.
		url += '&tags=' + options.search;
		url += '&per_page=' + options.pageSize;
		url += '&page=' + (options.pageIndex + 1);

		$.ajax(url, {

			// Set JSONP options for Flickr API
			dataType: 'jsonp',
			jsonpCallback: 'jsonFlickrApi',
			jsonp: false,
			type: 'GET'

		}).done(function (response) {

			// Prepare data to return to Datagrid
			var data = response.photos.photo;
			var count = response.photos.total;
			var startIndex = (response.photos.page - 1) * response.photos.perpage;
			var endIndex = startIndex + response.photos.perpage;
			var end = (endIndex > count) ? count : endIndex;
			var pages = response.photos.pages;
			var page = response.photos.page;
			var start = startIndex + 1;

			// Allow client code to format the data
			//if (self._formatter) self._formatter(data);

			var html = '';
			for(var i=0; i<data.length; i++) {
				var image = data[i];
				var url = 'http://farm' + image.farm + '.staticflickr.com/' + image.server +  '/' + image.id + '_' + image.secret + '_t.jpg';
				html += '<div class="thumbnail" data-url="' + url + '"><div class="inner" style="background:url(' + url + ') center center no-repeat;"></div></div>';
			}

			$('#gallery').html(html);
		});
	}

	FUELUX_EDITOR.trigger('resize', { height: 378, width:365 });
	FUELUX_EDITOR.trigger('fetch');

	// load gear, fires on response to the 'fetch' event
	FUELUX_EDITOR.on('receive', function(e, details) {

		var term = details.gearData.search;
		var url = details.gearData.url;

		$('#searchTerm').val(term);

		if (url) {
			var html = '<div class="thumbnail" data-url="' + url + '"><div class="inner" style="background:url(' + url + ') center center no-repeat;"></div>';
			$('#gallery').html(html);
		}

		FUELUX_EDITOR.trigger('ready');
	});

	// close and populate editor with gear data
	FUELUX_EDITOR.on('accept', function(e, details) {

		var html = '<img src="' + selectedImageUrl + '" alt="" />';
		var json = {
			search: searchTerm,
			url: selectedImageUrl
		};

		FUELUX_EDITOR.trigger('done', {
			content: html,
			design: html,
			gearData: json
		});
	});
});

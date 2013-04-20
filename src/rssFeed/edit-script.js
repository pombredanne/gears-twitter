/*global $, FUELUX_EDITOR */
$(document).ready(function(){
	var view;

	function isUrl(s) {
		// previous regex crashed chrome, just going with simple protocol check
		var regexp = /^https?:\/\/.+/;
		return regexp.test(s);
	}

	function getWebView(gearData) {
		return '<div id="gearRecentBlogPosts"><img style="margin:8px auto 8px auto; display:block;" width="43" height="11" title="" alt="Loading&#8230;" src="data:image/gif;base64,R0lGODlhKwALAPEAAP///8zMzOXl5czMzCH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAKwALAAACMoSOCMuW2diD88UKG95W88uF4DaGWFmhZid93pq+pwxnLUnXh8ou+sSz+T64oCAyTBUAACH5BAkKAAAALAAAAAArAAsAAAI9xI4IyyAPYWOxmoTHrHzzmGHe94xkmJifyqFKQ0pwLLgHa82xrekkDrIBZRQab1jyfY7KTtPimixiUsevAAAh+QQJCgAAACwAAAAAKwALAAACPYSOCMswD2FjqZpqW9xv4g8KE7d54XmMpNSgqLoOpgvC60xjNonnyc7p+VKamKw1zDCMR8rp8pksYlKorgAAIfkECQoAAAAsAAAAACsACwAAAkCEjgjLltnYmJS6Bxt+sfq5ZUyoNJ9HHlEqdCfFrqn7DrE2m7Wdj/2y45FkQ13t5itKdshFExC8YCLOEBX6AhQAADsAAAAAAAAAAAA=" /></div> <script>(function(){function loadjQuery(url,success){if(typeof jQuery=="undefined"){var script=document.createElement("script");script.src=url;var head=document.getElementsByTagName("head")[0],done=false;script.onload=script.onreadystatechange=function(){if(!done&&(!this.readyState||this.readyState=="loaded"||this.readyState=="complete")){done=true;success();script.onload=script.onreadystatechange=null;head.removeChild(script);}};head.appendChild(script);}else if(typeof jQuery=="function"){runGear();}}loadjQuery(document.location.protocol+"//ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js",function(){return runGear();});function runGear(){window.setTimeout(function(){if(typeof jQuery=="undefined"||typeof jQuery=="function"){}else{jQuery.noConflict();}loadRSS();},2500);}function loadRSS(){jQuery.getJSON(document.location.protocol+"//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num='+ gearData.postcount +'&callback=?&q="+encodeURIComponent("'+ gearData.feedurl +'"),{},function(data){content="<ul>";jQuery.each(data.responseData.feed.entries,function(key,val){content+="<li><a href="+val.link+">"+val.title+"</a></li>";});content+="</ul>";jQuery("#gearRecentBlogPosts").html(content);});}})();<\/script>';
	}

	function getHtmlView(jsonData) {
		var content = "<ul>";

		$.each(jsonData.responseData.feed.entries,function(key,val){
			content += "<li><a href='"+val.link+"' target='_blank'>"+val.title+"</a></li>";
		});

		content += "</ul>";
		return content;
	}

	function getTextView(jsonData) {
		var content = '';

		$.each(jsonData.responseData.feed.entries,function(key,val){
			content += val.title + ': ' + val.link + '\r\n';
		});

		return content;
	}

	FUELUX_EDITOR.trigger('fetch');

	FUELUX_EDITOR.trigger('resize', { height: 230, width: 330 });

	FUELUX_EDITOR.on('receive', function(e, details){

		var gearData = details.gearData;
		view = (details && details.viewType && details.viewType.value ? details.viewType.value : null);

		$('#txtFeedUrl').val(gearData.feedurl);
		$('#postCount').spinner('value', gearData.postcount);


		FUELUX_EDITOR.trigger('ready');
	});

	FUELUX_EDITOR.on('accept', function(e, details){
		// view can be stored from receive event or read now
		view = ( details && details.viewType && details.viewType.value ? details.viewType.value : view);

		var feedurl = $('#txtFeedUrl').val(),
			postcount = $('#postCount').spinner('value'),
			content = '',
			gearData = {
				feedurl: feedurl,
				postcount: postcount
			};

		if (isUrl(feedurl) === false) {

			content = '<div class="well text-error">Missing or incorrect info.</div>';

			FUELUX_EDITOR.trigger('done', { content: content, gearData: gearData });

		} else {
			//Test the the URL given returns a valid feed
			$.getJSON(document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num='+ postcount +'&callback=?&q=' + encodeURIComponent(feedurl),{},function(jsonData){


				if (jsonData.responseData == null) {

					content = '<div class="well text-error">JSON Error</div>';

					FUELUX_EDITOR.trigger('done', { content: content, gearData: gearData });

				} else {
					if (jsonData && jsonData.responseData && jsonData.responseData.feed && jsonData.responseData.feed.entries) {
						if (jsonData.responseData.feed.entries.length === 0) {
							content = 'No entries currently.';
						} else {
							if (
								view === 'text/html; kind=viewaswebpage' || view === 'text/html; kind=htmlemailbody') {
								content = getHtmlView(jsonData);
							} else if (view === 'text/html; kind=forwardtoafriend') {
								content = getHtmlView(jsonData);
							} else if (view === 'text/plain; kind=textemailbody') {
								content = getTextView(jsonData);
							} else {
								content = '<div class="well text-error">Message type not supported.</div>';
							} //
						} // 0 check
					} else {
						content = 'Error getting data from feed URL.';
					} // object checks

					FUELUX_EDITOR.trigger('done', { content: content, gearData: gearData });
				}
			});
		}

	});
	$('#postCount').spinner({
		'value': 3,
		'min': 1,
		'speed': 'slow'
	});
});

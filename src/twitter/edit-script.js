/*global $, FUELUX_EDITOR */
$(document).ready(function(){
	// store view for later
	var view;

	function formatFollowersCount(followersCount) {
		var followersCountDisplay = '';

		if (followersCount > 10000000) { // greater than 10 million
			followersCountDisplay = '10M+ followers';
		} else if (followersCount > 1000000) { // greater than 1 million
			followersCountDisplay = '1M+ followers';
		} else if (followersCount > 100000) { // greater than 100 thousand
			followersCountDisplay = '100K+ followers';
		} else if (followersCount > 10000) { // greater than 10 thousand
			followersCountDisplay = followersCount / 1000;
			followersCountDisplay = followersCountDisplay.toFixed(1);
			followersCountDisplay += 'K followers';
		} else if (followersCount > 1000) { // greater than 1 thousand
			followersCountDisplay = followersCount / 1000;
			followersCountDisplay = followersCountDisplay.toFixed(1);
			followersCountDisplay += 'K followers';
		} else { // less than 1 thousand
			followersCountDisplay = followersCount + ' followers';
		}

		return followersCountDisplay;
	}

	function getWebView(gearData) {
		return '<iframe allowtransparency="true" frameborder="0" scrolling="no" src="//platform.twitter.com/widgets/follow_button.html?screen_name=' + gearData.username + '&show_count=' + gearData.showCount + '" style="width:250px; height:20px;"></iframe>';
	}

	function getHtmlView(gearData, jsonData) {
		// follow control wrapper html
		var content = '<div style="color:#333333;font:11px/18px Helvetica,Arial,sans-serif;overflow:hidden;text-align:left;white-space:nowrap;">';

		// follow button html
		content += '	<div contextmenu="menu" style="display:inline-block;vertical-align:top;max-width:100%;">';
		content += '		<a target="_blank" title="Follow @' + gearData.username + ' on Twitter" href="https://twitter.com/intent/follow?region=follow_link&amp;screen_name=' + gearData.username + '&amp;tw_p=followbutton&amp;variant=2.0" style="outline:medium none;text-decoration:none;display:inline-block;vertical-align:top;display:inline-block;vertical-align:top;background-color:#f8f8f8;background-image:-webkit-linear-gradient(top, #FFFFFF, #DEDEDE);background-image:-moz-linear-gradient(top, #FFFFFF, #DEDEDE);background-image:-ms-linear-gradient(top, #FFFFFF, #DEDEDE);background-image:-o-linear-gradient(top, #FFFFFF, #DEDEDE);border:1px solid #CCCCCC;border-radius:3px;color:#333333;cursor:pointer;font-weight:bold;height:18px;max-width:98%;overflow:hidden;position:relative;text-shadow:0 1px 0 rgba(255, 255, 255, 0.5);max-width:100%;">';
		content += '			<i style="background:url(\'data:image/png;base64,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\') no-repeat scroll 0 0 transparent;height:13px;left:2px;margin-top:-5px;position:absolute;top:50%;width:16px;background-size:45px 40px;margin-top:-6px;"></i>';
		content += '			<span style="background-color:transparent;color:#333333;cursor:pointer;font-weight:bold;text-shadow:0 1px 0 rgba(255, 255, 255, 0.5);display:inline-block;vertical-align:top;padding:0 3px 0 19px;white-space:nowrap;">Follow <b style="font-weight:bold;white-space:nowrap;">@' + gearData.username + '</b></span>';
		content += '		</a>';
		content += '	</div>';

		if (gearData.showCount) {
			// follower count html
			content += '	<div style="display:inline-block;vertical-align:top;background:#FFFFFF;border:1px solid #BBBBBB;border-radius:3px;min-height:18px;min-width:15px;position:relative;">';
			content += '		<i style="border-color:transparent #AAA transparent #333;border-image:none;border-style:solid solid solid none;border-width:4px 4px 4px 0;height:0;left:0;line-height:0;margin:-4px 0 0 -4px;position: absolute;top:50%;width:0;"></i>';
			content += '		<u style="border-color:transparent #fff transparent #333;border-image:none;border-style:solid solid solid none;border-width:4px 4px 4px 0;height:0;left:0;line-height:0;margin:-4px 0 0 -3px;position: absolute;top:50%;width:0;"></u>';
			content += '		<a target="_blank" href="https://twitter.com/intent/user?region=count_link&amp;screen_name=' + gearData.username + '&amp;tw_p=followbutton&amp;variant=2.0" style="outline:medium none;text-decoration:none;display:inline-block;vertical-align:top;color:#333333;text-align:center;white-space:nowrap;padding:0 3px;">' + formatFollowersCount(jsonData.followers_count) + '</a>';
			content += '	</div>';
		}

		// close follow control wrapper
		content += '</div>';

		return content;
	}

	function getTextView(gearData, jsonData) {
		if (gearData.showCount) {
			return 'Follow @' + gearData.username + ' [' + formatFollowersCount(jsonData.followers_count) + '] on Twitter: https://twitter.com/intent/follow?screen_name=' + gearData.username;
		} else {
			return 'Follow @' + gearData.username + ' on Twitter: https://twitter.com/intent/follow?screen_name=' + gearData.username;
		}
	}

	FUELUX_EDITOR.trigger('fetch');

	FUELUX_EDITOR.trigger('resize', { height: 250, width: 310 });

	FUELUX_EDITOR.on('receive', function(e, details){
		var gearData = details.gearData;
		view = (details && details.viewType && details.viewType.value ? details.viewType.value : null);

		$('#txtUsername').val(gearData.username);
		$('#chkShowFollowerCount').attr('checked', gearData.showCount);

		$('#chkShowFollowerCount').checkbox();

		FUELUX_EDITOR.trigger('ready');
	});

	FUELUX_EDITOR.on('cancel', function(e, details){
		FUELUX_EDITOR.trigger('done', { content: details.content, gearData: details.gearData });
	});

	FUELUX_EDITOR.on('accept', function(e, details){
		var username = $('#txtUsername').val(),
			showCount = $('#chkShowFollowerCount').is(':checked'),
			content = '',
			gearData = {
				username: username,
				showCount: showCount
			};


		// view can be stored from receive event or read now
		view = ( details && details.viewType && details.viewType.value ? details.viewType.value : view);

		if (username === '') {
			content = '<div class="well text-error">Must supply a username.</div>';

			FUELUX_EDITOR.trigger('done', { content: content, gearData: gearData });

		} else {
			$.getJSON('https://twitter.com/users/' + gearData.username + '.json?callback=?', function(jsonData,status,xhr) {

				if (status !== 'success') {
					content += '<div class="well text-error">JSON Error</div>';
				} else {
					if (
						view === 'text/html; kind=viewaswebpage' || view === 'text/html; kind=htmlemailbody') {
						content = getHtmlView(gearData, jsonData);
					} else if (view === 'text/html; kind=forwardtoafriend') {
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
});
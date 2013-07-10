/*global $, FUELUX_EDITOR, Handlebars */
Handlebars.registerHelper('ifNotEquals', function(v1, v2, options) {
	if(v1 !== v2) {
		return options.fn(this);
	}
	return options.inverse(this);
});

$(document).ready(function() {
	// for the gear palette markup
	var gearSource   = $("#gear-template").html();
	var gearTemplate = Handlebars.compile(gearSource);

	// for the gear output markup
	var outputSource   = $("#output-template").html();
	var outputTemplate = Handlebars.compile(outputSource);

	FUELUX_EDITOR.trigger('resize', { height: 250, width:400 });
	FUELUX_EDITOR.trigger('fetch', {});

	// load gear, fires on response to the 'fetch' event
	FUELUX_EDITOR.on('receive', function(e, details) {

		// get the markup
		var html = gearTemplate(details.gearData || {});
		$('#form').html(html);

		FUELUX_EDITOR.trigger('ready');
	});

	// close and populate editor with gear data
	FUELUX_EDITOR.on('accept', function(e, details) {

		// get all the answers
		var answers = [];
		$('#answers').find('input[type=text]').each(function(index, el) {
			answers.push($(this).val());
		});

		// define the data/json
		var data = {
			question: $('#question').val(),
			answers: answers
		};

		// get the markup
		var html = outputTemplate(data);

		FUELUX_EDITOR.trigger('done', {
			content: html,
			design: html,
			gearData: data
		});
	});

	$('body').on('click', '.remove-answer', function() {
		$(this).parent().remove();
	}).on('click', '#addBtn', function() {
		$('#answers').append('<div class="input-append"><input type="text" /><span class="add-on remove-answer"><i class="icon-trash"></i></span></div>');
	});
});

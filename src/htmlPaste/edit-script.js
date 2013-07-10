/*global $, FUELUX_EDITOR, CodeMirror */
$(document).ready(function() {

  // configure CodeMirror
  var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
    lineNumbers: true,
    mode: {name: "xml", alignCDATA: true},
    theme: 'ambiance'
  });

  FUELUX_EDITOR.trigger('resize', { height: 250, width:400 });
  FUELUX_EDITOR.trigger('fetch', {});

  // load gear, fires on response to the 'fetch' event
  FUELUX_EDITOR.on('receive', function(e, details) {

    console.log(details.content);
    editor.setValue(details.content);

    FUELUX_EDITOR.trigger('ready');
  });

  // close and populate editor with gear data
  FUELUX_EDITOR.on('accept', function(e, details) {

    var html = editor.getValue();

    FUELUX_EDITOR.trigger('done', {
      content: html,
      design: html,
      gearData: {}
    });
  });
});

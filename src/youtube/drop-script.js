/*global $, FUELUX_EDITOR */
var defaults = {
  vId: 'JjJMfwZOy54',
  width: 200,
  height: 200
};

$(document).ready(function(){

  $.getJSON('http://gdata.youtube.com/feeds/api/videos/'+ defaults.vId + '?v=2&alt=jsonc', function(jsonData, status, xhr){

    console.log(jsonData);

    var content = '<img src="' + jsonData.data.thumbnail.hqDefault + '" width="' + defaults.width + '" alt="' + jsonData.data.title + '" />';

    FUELUX_EDITOR.trigger('done', {
      content: 'default content',
      design: content,
      gearData: defaults
    });
  });

});

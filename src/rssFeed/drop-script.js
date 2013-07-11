/*global _, $, FUELUX_EDITOR */
var defaults = {
  feedurl: 'http://blog.exacttarget.com/blog/the-exacttarget-blog/rss',
  postcount: 5
};

$(document).ready(function(){

  $.getJSON(document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num='+ defaults.postcount +'&callback=?&q=' + encodeURIComponent(defaults.feedurl),{},function(jsonData){

    var entries = jsonData.responseData.feed.entries;
    var content = '';

    _.each(entries, function(entry) {
      content += '<div>' + entry.title + '</div>';
    });

    FUELUX_EDITOR.trigger('done', {
      content: 'default content',
      design: content,
      gearData: defaults
    });
  });

});

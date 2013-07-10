/*global $, FUELUX_EDITOR */
var content;

$(document).ready(function(){
    FUELUX_EDITOR.trigger('fetch', {
        htmlEditing: true,
        inlineEditing: {
            plugins: ['timestamp', 'scayt'],
            toolbar: [
                { name: 'fonts', items : [ 'Font'] },
                { name: 'fontSizes', items : [ 'FontSize' ] },
                { name: 'fontColors', items : [ 'TextColor', 'BGColor' ] },
                { name: 'bold', items : [ 'Bold' ] },
                { name: 'italic', items : [ 'Italic' ] },
                { name: 'underline', items : [ 'Underline' ] },
                { name: 'orderedList', items : [ 'NumberedList' ] },
                { name: 'unorderedList', items : [ 'BulletedList' ] },
                { name: 'alignment', items : [ 'JustifyLeft', 'JustifyCenter', 'JustifyRight' ] },
                { name: 'linking', items : [ 'Link', 'Unlink' ] },
                { name: 'image', items : [ 'Image' ] },
                { name: 'stupid', items : [ 'Smiley', 'Timestamp', 'Scayt' ] }
            ]
        }
    });

    FUELUX_EDITOR.trigger('resize', { height: 0 });

    FUELUX_EDITOR.on('receive', function(e, details){
        var content = details.content;

        $('#content').val(content);

        FUELUX_EDITOR.trigger('ready');
    });

    FUELUX_EDITOR.on('accept', function(e, details){
        var content = details.content;

        FUELUX_EDITOR.trigger('done', content);
    });
});

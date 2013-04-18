define( function( require ) {
    var Backbone = require( 'backbone' );
    var Config = require( 'config' );
    var dashboardTemplate = require( 'tmpl!templates/dashboard.html' );

    return Backbone.View.extend({
        initialize: function() {
            _.bindAll( this );

            // TODO: Example bind loading of collection fetch success
            // to this view's render
            this.el = $('#' + Config.cssPrefix + 'DashboardMain');
            this.render();
        },

        clean: function() {
        },

        render: function() {
            $('#' + Config.cssPrefix + 'Loading').remove();

            var templateObj = {
                appName: Config.appDisplayName,
                mainMarketingMessage: 'Super Cool Marketing Message!'
            };

            $(this.el).html( dashboardTemplate( templateObj ) );
        }
    });
});

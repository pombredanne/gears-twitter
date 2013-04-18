"use strict";

// Application Dependencies
var config		= require('config');
//var dbLib		= require('./lib/database'); // Trying to get this
//loading on Stackato
var express		= require('express');
var fs			= require('fs');
var http		= require('http');
var https		= require('https');
var hbs			= require('hbs');
var path		= require('path');
var mongoose	= require('mongoose');
var query		= require('querystring');

// Import REST Handlers
var routes = require( './routes' );

// Application variables
var app				= express();

// Helpers
var helpers			= require( './lib/app-helpers' );
var hbsHelpers		= require( './lib/hbs-helpers' );
var packageJSON		= require( './package.json' );

// Initialize first once
var init = function( blocks ) {
	// Application's OAuth2 token, for unauthenticated requests
	// if( config.environment.requestToken ) {
	//	helpers.getUnauthenticatedToken();
	// }

	// Determine base endpoint for static assets
	config.staticBase = config.endpoints.defaultStaticBase + ( config.endpoints.versionedDir ? packageJSON.version + '/' : '' );
	config.cssPrefix = packageJSON.cssPrefix;
	config.appDisplayName = packageJSON.appDisplayName;

	// Webfonts need mime types, too!
	express.static.mime.define({'application/x-font-woff':		['woff']});
	express.static.mime.define({'application/x-font-ttf':		['ttf']});
	express.static.mime.define({'application/vnd.ms-fontobject':['eot']});
	express.static.mime.define({'font/opentype':				['otf']});
	express.static.mime.define({'image/svg+xml':				['svg']});

	// Configure app to use the port from process or 3000
	app.set('port', process.env.PORT || 3000);
	// Favicon
	app.use(express.favicon());
	// Use static middleware
	app.use(express['static'](__dirname + config.endpoints.uiBaseDir));
	// Implement logging
	app.use(express.logger());
	// Use the bodyParser middleware.
	app.use(express.bodyParser());
	// Allow Express to behave like a RESTful app
	app.use(express.methodOverride());
	// Set the view engine
	app.set('view engine', 'hbs');
	// Set the directory that contains the views
	app.set('views', __dirname + '/views');
	// Use the cookie-based session	 middleware
	app.use(express.cookieParser());
	app.use(express.cookieSession({
		secret: "MyLittleSecret"
	}));
	// Use the router middleware
	app.use(app.router);
	// Setup gzip distribution
	app.use( express.compress() );
	// Permit CORS
	app.use('/' + (config.endpoints.versionedDir ? packageJSON.version + '/' : '') + 'fonts', helpers.allowCrossDomain);

	// Express should do this stuff in development environment
	app.configure('development', function() {
		app.use( express.errorHandler({ dumpException: true, showStack: true }));
	});

	// Express should do this stuff in production environment
	app.configure('production', function() {
	});

	hbs.registerHelper('block', hbsHelpers.block);
	hbs.registerHelper('dateFormat', hbsHelpers.dateFormat);
	hbs.registerHelper('extend', hbsHelpers.extend);
	hbs.registerHelper('toLowerCase', hbsHelpers.toLowerCase);
};

init();


// Route Configuration
app.get('/', routes.getIndex );

app.post('/', routes.login );

// Create HTTP server with your app and listen
http.createServer(app).listen(app.get('port'), function () {
	console.log("Express server listening on port " + app.get('port'));
});

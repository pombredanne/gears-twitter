"use strict";

var helpers = require( '../lib/app-helpers' );
var Config  = require( 'config' );
var _       = require( 'underscore' );

var getIndex = function( req, res ) {
    var clientConfig = helpers.clientConfig( req.session );
    var options = _.extend({
        config: JSON.stringify( clientConfig ),
        title: 'Dashboard',
        appName: Config.appDisplayName,
        cssPrefix: Config.cssPrefix,
        appDisplayName: Config.appDisplayName 
    }, clientConfig);
    res.render( 'index', options );
};

module.exports = {
    getIndex: getIndex,
    login: function( req, res ) {
        var jwt = req.session.jwt = req.body.jwt;
        helpers.decodeToken( req.session, jwt );

        // TODO: Implement fuel-node here and tie into the request
        // object. Instance of fuel-node associated to Express
        // sessionID

        helpers.appCenterToken( req, res, getIndex );
        // TODO: Need to figure out callback scheme to make sure we
        // can render the login page using res.render( 'index'..)
    },

    logout: function( req, res ) {
        req.session.jwt             = undefined;
        req.session.accessToken     = {};
        req.session.refreshToken    = undefined;
        req.session.casToken        = undefined;
    }
};

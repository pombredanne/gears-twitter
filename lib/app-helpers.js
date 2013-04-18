"use strict";

var request = require('request');
var	config = require('config');
var	jwtLib = require('jwt-simple');
var	packageJson = require('../package.json');
var	_ = require('underscore');

module.exports = {
	requestToken: function (json, callback) {
		request({
			uri: config.environment.requestToken,
			method: 'post',
			json: json
		}, function (error, response, body) {
			if (_.isFunction(callback)) { callback(error, response, body); }
		});
	},

	getUnauthenticatedToken: function () {
		var that = this,
			callback = function (error, response, body) {

			var expiresIn = 10000;
			
			if (error || !body.accessToken) {
				console.error('\n==Error getting token==\n\nRequest Error:', error, '\n\nResponse Headers:', response && response.headers, '\n\nResponse Body:', body, '\n');
			} else {
				config.unauthenticatedToken = body.accessToken;
				if (body.expiresIn && !isNaN(body.expiresIn)) { expiresIn = (body.expiresIn * 1000) - 60000; }
				console.log('Token response', body);
			}
			
			that.unauthenticatedTimeout = setTimeout(function () { that.getUnauthenticatedToken(); }, expiresIn);
		};
		
		if (that.unauthenticatedTimeout) { clearTimeout(that.unauthenticatedTimeout); }
		that.requestToken(config.environment.oAuth, callback);
	},
	
	getAuthenticatedToken: function (req, res, json, callback) {
		this.requestToken(json, function (error, response, body) {
			if (error || !body.accessToken) {
				console.error('\n==Error getting token==\n\nRequest Error:', error, '\n\nResponse Headers:', response && response.headers, '\n\nResponse Body:', body, '\n');
				req.session.accessToken = {};
			} else if (body.expiresIn) {
				req.session.accessToken = {
					token: body.accessToken,
					expires: Date.now() + (body.expiresIn * 1000) - 60000
				};

				req.session.refreshToken = body.refreshToken;
			}
	
			if (_.isFunction(callback)) {callback(req, res);}
		});
	},
	
	refreshToken: function (req, res, callback) {
		var json = {
				clientId: config.environment.oAuth.clientId,
				clientSecret: config.environment.oAuth.clientSecret,
				accessType: 'offline',
				refreshToken: req.session.refreshToken
			};

		this.getAuthenticatedToken(req, res, json, callback);
	},
	
	appCenterToken: function (req, res, callback) {
		var json = {
				clientId: config.environment.appCenter.clientId,
				clientSecret: config.environment.appCenter.clientSecret,
				scope: config.environment.appCenter.scope.replace('{casToken}', req.session.casToken)
			};
		
		this.getAuthenticatedToken(req, res, json, callback);
	},
	
	casToken: function (req, res, callback) {
		var json = {
				clientId: config.environment.oAuth.clientId,
				clientSecret: config.environment.oAuth.clientSecret,
				accessType: 'offline',
				scope: 'cas:' + req.session.casToken
			};
		
		this.getAuthenticatedToken(req, res, json, callback);
	},
	
	decodeToken: function (session, jwt) {
		var decoded,
			token,
			refreshToken,
			casToken,
			expires;
		if (jwt) {
			try {
				decoded = jwtLib.decode(jwt, config.environment.applicationSecret);
				token = decoded.request.user.oauthToken;
				refreshToken = decoded.request.user.refreshToken;
				casToken = decoded.request.user.internalOauthToken;
				expires = (decoded.exp * 1000) - 60000;
			} catch (ex) {
				console.log('Decoding failed for jwt: ' + jwt);
				console.log('Exception: ' + ex);
			}

			session.accessToken = {
				token: token,
				expires: expires
			};
			
			session.refreshToken = refreshToken;
			session.casToken = casToken;
		}
	},
	
	getAllowedPath: function (match, baseKey, pathKey, ID) {
		var allowedPath = {url: config.rest.base || '/'},
			path = pathKey && config.routes[pathKey],
			isAuthenticated = (baseKey === 'private');

		if (path && isAuthenticated === path.isAuthenticated) {
			allowedPath.url += path.url;
			allowedPath.isAuthenticated = path.isAuthenticated;
			
			if (ID) {allowedPath.url = allowedPath.url.replace('{ID}',ID);}
		} else {
			allowedPath = false;
		}

		return allowedPath;
	},
	
	isAuthenticated: function (session) {
		var accessToken = session.accessToken || {},
			hasToken = !!accessToken.token,
			hasExpires = _.isNumber(accessToken.expires),
			notExpired = Date.now() < accessToken.expires;

		return hasToken && hasExpires && notExpired;
	},

	clientConfig: function (session) {
		return {
			rest: config.endpoints.rest,
			//authenticatedRest: config.endpoints.authenticatedRest,
			staticBase: config.staticBase,
			//assetBase: config.endpoints.assetBase,
			loginUrl: config.environment.loginUrl,
			authenticated: this.isAuthenticated(session),
			version: packageJson.version,
			appDisplayName: packageJson.app_display_name,
			cssPrefix: packageJson.css_prefix
		};
	},
	
	// Firefox has cross domain problems with web fonts so we need a little middleware to help with that
	// This is applied to the fonts directory when we set up Express below
	allowCrossDomain: function(req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
		res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');
		
		next();
	}
};

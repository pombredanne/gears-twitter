module.exports = {
	environment: {
		loginUrl: "https://imh.s2.qa2.exacttarget.com/",
		requestToken: "https://auth-qa2s2.exacttargetapis.com/v1/requestToken",
		applicationName: "AppName",
		applicationId: "AppId",
		applicationSecret: "AppSignature",
		oAuth: {
			clientId: "",
			clientSecret: ""
		},
		appCenter: {
			clientId: "",
			clientSecret: "",
			scope: "cas:{casToken} jwt:[JWTGoesHere]"
		}
	},
	routes: {
		/*
		application: {
			url: 'hubexchange/listings/{ID}',
			isAuthenticated: false
		}
		*/
	},
	endpoints: {
		rest: "/public/",
		//authenticatedRest: "/private/",
		uiBaseDir: "/public/",
		versionedDir: false,
		defaultStaticBase: "/",
		//assetBase: "//s3.amazonaws.com/hubexchange/assets/"
	},
	rest: {
		base: "/internal/v1/",
		proxy: {
			host: "www.exacttargetapis.com",
			port: 443,
			https: true
		},
		headers: {
		},
		allowedHeaders: [
			'accept',
			'accept-charset',
			'accept-encoding',
			'accept-language',
			'referrer',
			'user-agent',
			'content-type',
			'content-length'
		]
	},
	cache: {
		// Set cacheTimeout to a falsey value to disable cache. Default is 24 hours
		timeout: 86400
	},
	mongodb: {
		host: 'localhost',
		port: ''
	}
};

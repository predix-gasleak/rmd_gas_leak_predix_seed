var auth = require('../helpers/auth');
var proxy = require('../helpers/proxy');

var config = {
	/**
	 * --------- ADD YOUR UAA CONFIGURATION HERE ---------
	 *
	 * This uaa helper object simulates NGINX uaa integration using Grunt allowing secure cloudfoundry service integration in local development without deploying your application to cloudfoundry.
	 * Please update the following uaa configuration for your solution
	 * You'll need to update clientId, serverUrl, and base64ClientCredential.
	 */
	uaa : {
		clientId : 'rmd_gas_leak_client',
		serverUrl : 'https://e96209ad-2e7b-4b17-a38c-7b9e023bef25.predix-uaa.run.aws-usw02-pr.ice.predix.io',
		defaultClientRoute : '/about',
		base64ClientCredential : 'cm1kX2dhc19sZWFrX2NsaWVudDp0ZXN0MTIzdGVzdA=='
	},
	/**
	 * --------- ADD YOUR SECURE ROUTES HERE ------------
	 *
	 * Please update the following object add your secure routes
	 *
	 * Note: Keep the /api in front of your services here to tell the proxy to add authorization headers.
	 * You'll need to update the url and instanceId.
	 */

	
	proxy: {
	  '/api/view-service(.*)': {
	    url: 'https://predix-views.run.aws-usw02-pr.ice.predix.io/v1$1',
	    instanceId: 'c1819880-2fc0-47bd-b88e-808dcb8876cb'
	  },
	  '/services(.*)': {
	      url: 'http://localhost:9092/',
	      instanceId: '880c582c-1212-429f-848b-b22633cfb746',
	  }
	}
	 

	
};

module.exports = {
	server : {
		options : {
			port : 9000,
			base : 'public',
			open : true,
			hostname : 'localhost',
			middleware : function(connect, options) {
				var middlewares = [];

				//add predix services proxy middlewares
				middlewares = middlewares.concat(proxy.init(config.proxy));

				//add predix uaa authentication middlewaress
				middlewares = middlewares.concat(auth.init(config.uaa));

				if (!Array.isArray(options.base)) {
					options.base = [ options.base ];
				}

				var directory = options.directory
						|| options.base[options.base.length - 1];
				options.base.forEach(function(base) {
					// Serve static files.
					middlewares.push(connect.static(base));
				});

				// Make directory browse-able.
				middlewares.push(connect.directory(directory));

				return middlewares;
			}
		}
	}
};

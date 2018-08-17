/**
 * Auto-generated comment stub
 *
  * @inpaas.key inpaas.httpclient.packer.services
 * @inpaas.name HTTPClientServicesPacker
 * @inpaas.module inpaas.httpclient.core
 * @inpaas.type patterntype.packer
 * @inpaas.engine Nashorn
 * @inpaas.anonymous false
*/

/*
 * HTTPClientServicesPacker
 * inpaas.httpclient.packer.services
 * 
 */
/*global require*/
(function(scope) {
	'use strict';
	
	/*
	 * Must return all authorization-strategies for that moduleId
	 */
	function pack(module) {
		// logger.info("HTTPClientServicesPacker::pack - {}", module.id);
		
		return null;
		
		// return require("inpaas.httpclient.service.client").find(module.id);		
	}

	/*
	 * Must deploy listed strategies in that module
	 */
	function deploy(module, data) {
		if (data == null) return;
		
		/*
		logger.info("HTTPClientServicesPacker::deploy - {}", module["key"]);
		var httpBd = require("inpaas.httpclient.service.client");

		for(var k in data) {
			logger.info("HTTPClientServicesPacker::deploy - deploying: {}", data[k]);		
			
			var service = httpBd.get(data[k].key);
			if (service != null)  data[k].id = service.id;
				
			httpBd.set(data[k]);
		}
		*/
	}

  	/* exports */
  	scope["deploy"] = deploy;
  	scope["pack"] = pack;
	scope["getFileName"] = function() { return "httpclient-services.data"; };

  	return scope;		
	
})(this);
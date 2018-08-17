/**
 * Auto-generated comment stub
 *
  * @inpaas.key inpaas.httpclient.rest.http-client
 * @inpaas.name http-client
 * @inpaas.module inpaas.httpclient.core
 * @inpaas.type patterntype.service
 * @inpaas.engine Nashorn
 * @inpaas.anonymous false
*/

/*
 * http-client
 * inpaas.httpclient.rest.http-client
 * 
 */
/*global require*/
(function() {
	'use strict';
	
	
	function doEcho(params) {
		var req = {
			"headers": {}
		}
		
		/*global scriptContext*/
		var reqHeaders = scriptContext.getRequest().getHeaderNames();
		while(reqHeaders.hasMoreElements()) {
			var hdr = reqHeaders.nextElement();
			req.headers[hdr] = scriptContext.getRequest().getHeader(hdr);
		}
		
		/*global Java*/
		var IOUtils = Java.type("org.apache.commons.io.IOUtils");
		req["body"] = IOUtils.toString(scriptContext.getRequest().getInputStream());	

		return JSON.stringify(req, null, 3);
	}	
	
	function findServices(params) {
		var moduleId = params["module"];
		
		return require("inpaas.httpclient.service.client").find(moduleId);
	}
	
	function getService(params) {
		var serviceId = params["service"];
		
		return require("inpaas.httpclient.service.client").get(serviceId, true);
	}
	
	function setService(params) {
		var serviceId = params["service"]
		
		if (params.id == null) throw new Error("error.httpservice.update.missingid");
		if (params.key == null) throw new Error("error.httpservice.update.missingkey");
		if (params.module == null) throw new Error("error.httpservice.update.missingmodule");
		
		var service = require("inpaas.httpclient.service.client").get(serviceId, false);
		if (service.id != params.id)
			throw new Error("error.httpservice.badrequest");
			
		return require("inpaas.httpclient.service.client").set(params, params["def"]);
	}

	
	function invokeService(params) {
		var serviceId = params["service"];
		var endpointId = params["endpoint"]
		var data = params["data"];
		
		return require("inpaas.http.client").invokeService(serviceId, endpointId, data);		
	}

	
	function parseWSDL(params) {
		var url = params["url"];
	
		return require("inpaas.http.client").importWSDL(url);
	}
	
	function importWSDL(params) {
		var url = params["url"];	
		var key = params["key"];
		var module = params["module"];
		
		if (url == null) throw new Error("error.httpservice.import.missingurl");
		if (key == null) throw new Error("error.httpservice.import.missingkey");
		if (module == null) throw new Error("error.httpservice.import.missingmodule");
		
		var def = require("inpaas.http.client").importWSDL(url);
		
		var httpService = {
			"key": key,
			"module": module,
			"type": "S"			
		}
		
		return require("inpaas.httpclient.service.client").set(httpService, def);				
	}
	
	function setServiceSSL(params) {
		var service = params["service"];

		return require("inpaas.httpclient.service.client").setSSL(service, params);		
	}

		
	function getHTTPService(params) {
		var serviceId = params["id"];
		
		var httpService = require("inpaas.httpclient.service.client").get(serviceId, true);		
		return httpService;		
	}
	
	function invokeHTTPEndpoint(params) {
		var serviceId = params["id"];
		var endpoint  = params["endpoint"];
		
		params.remove("id");
		params.remove("endpoint");
		
		var SOAPClient = require("inpaas.http.client");
		
		return new SOAPClient(serviceId)[endpoint](params);		
	}

	
	/*global RESTService*/
	RESTService.addEndpoint({ "name": "doEcho", "method": "POST", "path": "/echo" }, doEcho);
	
	RESTService.addEndpoint({ "name": "findServices", "method": "GET", "path": "/services" }, findServices);	
	RESTService.addEndpoint({ "name": "getService", "method": "GET", "path": "/services/{service}" }, getService);	
	RESTService.addEndpoint({ "name": "setService", "method": "PUT", "path": "/services/{service}" }, setService);	

	RESTService.addEndpoint({ "name": "setServiceSSL", "method": "PUT", "path": "/services/{service}/ssl" }, setServiceSSL);	
	RESTService.addEndpoint({ "name": "invokeService", "method": "POST", "path": "/services/{service}/{endpoint}" }, invokeService);	

	RESTService.addEndpoint({ "name": "parseWSDL", "method": "GET", "path": "/soap/definition" }, parseWSDL);	
	RESTService.addEndpoint({ "name": "importHTTPClient", "method": "GET", "path": "/soap/import" }, importWSDL);
	

	// RESTService.addEndpoint({ "name": "getHTTPService", "method": "GET", "path": "/{id}" }, getHTTPService);
	// RESTService.addEndpoint({ "name": "invokeHTTPEndpoint", "method": "POST", "path": "/{id}/{endpoint}" }, invokeHTTPEndpoint);
	
	// check out REST Services docs at:
	// https://inpaas.atlassian.net/wiki/display/inpaasdevelopers/REST+Services
	
})();
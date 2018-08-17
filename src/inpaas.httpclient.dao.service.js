/**
 * Auto-generated comment stub
 *
  * @inpaas.key inpaas.httpclient.dao.service
 * @inpaas.name HTTPClientDao
 * @inpaas.module inpaas.httpclient.core
 * @inpaas.type patterntype.businessdelegate
 * @inpaas.engine Nashorn
 * @inpaas.anonymous false
*/

/*
 * HTTPClientDao
 * inpaas.httpclient.dao.service
 * 
 */
(function(scope) {
	'use strict';
	
	function getHTTPServiceDao() {
		/*global require*/
		return require("inpaas.core.entity.dao").getDao("CORE_HTTPSERVICE");
	}
	
	function getHTTPEndpointDao() {
		/*global require*/
		return require("inpaas.core.entity.dao").getDao("CORE_HTTPENDPOINT");
	}

	function getHTTPDefinitionDao() {
		/*global require*/
		return require("inpaas.core.entity.dao").getDao("CORE_HTTPSERVICEDEF");
	}
	
	function find(module) {
		var httpServices = [];
		getHTTPServiceDao().filter({ "id_module": module }).find().forEach(function(data) {
			httpServices.push(encodeHTTPService(data, true));
		});

		return httpServices;
	}

	function get(id, withDefs) {
		var httpService;
		
		if (isNaN(id)) {
			httpService = encodeHTTPService(getHTTPServiceDao().findByUniqueKey(id));
		} else {
			httpService = encodeHTTPService(getHTTPServiceDao().findByPrimaryKey(id));
		}

		if (httpService == null) return httpService;
		
		httpService["operations"] = {};
		getHTTPEndpointDao().filter({ "id_httpservice": httpService.id }).find().forEach(function(data) {
			var endpoint = encodeHTTPEndpoint(data);
			httpService.operations[endpoint.name] = endpoint;
		});
		
		if (withDefs) {
			httpService["imports"] = {};
			
			getHTTPDefinitionDao().filter({ "id_httpservice": httpService.id }).find().forEach(function(data) {
				httpService.imports[data["ds_path"]] = data["tx_wsdl"];
			});
				
		}


		return httpService;
	}
	
	function encodeHTTPService(data, simple) {
		if (data == null) return null;
		
		var httpService = {};
		httpService["id"] = data["id_httpservice"];
		httpService["key"] = data["ds_key"];
		httpService["name"] = data["ds_name"];
		
		if (simple) return httpService;
		httpService["schema"] = data["ds_schema"];
		httpService["host"] = data["ds_host"];
		httpService["path"] = data["ds_path"];
		httpService["type"] = data["do_type"];
		httpService["text"] = data["tx_comment"];
		httpService["wsa"] = data["do_wsaddressing"] == "Y";		
		
		httpService["url"] = httpService.schema + "://" + httpService.host + httpService.path;
		
		if (data["id_sslcertificate"]) {
			httpService["ssl"] = {
				"cer": data["id_sslcertificate"],
				"pfx": data["id_sslauthpfk"],
				"alias": data["ds_sslauthalias"],
				"secret": data["ds_sslauthsecret"]
			}
		}

		
		return httpService;
	}
	
	function encodeHTTPEndpoint(data) {
		if (data == null) return null;
		
		var httpEndpoint = {};
		httpEndpoint["name"] = data["ds_endpoint"];
		httpEndpoint["type"] = data["ds_type"];
		httpEndpoint["port"] = data["ds_port"];

		httpEndpoint["path"] = data["ds_path"];
		httpEndpoint["method"] = data["ds_method"];
		httpEndpoint["rest"] = "Y"===data["do_rest"];
		
		return httpEndpoint;
	}
	
	function decodeHTTPService(httpService) {
		var data = {};
		data["id_httpservice"] = httpService["id"];
		data["ds_key"] = httpService["key"];
		
		if (httpService["module"] != null)
			data["id_module"] = httpService["module"];
		
		data["ds_name"] = httpService["name"];
		data["tx_comment"] = httpService["text"]
		data["do_type"] = httpService["type"];
		data["ds_schema"] = httpService["schema"];
		data["ds_host"] = httpService["host"];
		data["ds_path"] = httpService["path"]; 

		if (httpService["ssl"]) {
			data["id_sslcertificate"] = httpService["ssl"].cer;
			data["id_sslauthpfx"] = httpService["ssl"].pfx;
			data["ds_sslauthalias"] = httpService["ssl"].alias;
			data["ds_sslauthsercret"] = httpService["ssl"].secret;
		}

		
		return data;
	}

	function decodeHTTPDefinition(httpServiceId, def, wsdl) {
		var data = {};
		data["id_httpservice"] = httpServiceId;
		data["ds_path"] = def;
		data["tx_wsdl"] = wsdl;  
		
		return data;
	}
	
	function decodeHTTPEndpoint(httpServiceId, httpEndpoint) {
		var data = {};
		data["id_httpservice"] = httpServiceId;
		
		data["ds_endpoint"] = httpEndpoint["name"];
		data["ds_type"] = httpEndpoint["type"];
		data["ds_port"] = httpEndpoint["port"];
		data["ds_path"] = httpEndpoint["path"] || httpEndpoint["action"];
		data["ds_method"] = httpEndpoint["method"] || "SOAP";
		
		data["do_rest"] = httpEndpoint["rest"] ? "Y" : "N";
		
		return data;
	}
	
	function set(httpService) {
		var data = decodeHTTPService(httpService);
		
		if (httpService.id) {
			getHTTPServiceDao().update(data);
			
		} else {			
			var keydata = getHTTPServiceDao().findByUniqueKey(httpService.key);
			if ( keydata != null ) {
				httpService.id = keydata["id_httpservice"];
				data["id_httpservice"] = keydata["id_httpservice"];
				
				keydata = null;
				
				getHTTPServiceDao().update(data);
			
			} else {
				getHTTPServiceDao().insert(data);		
				httpService.id = data["id_httpservice"];
				
			}

			
		}
		
		if (httpService["imports"]) {
			getHTTPDefinitionDao().filter({ "id_httpservice": httpService.id }).delete();
		
			var defs = httpService["imports"];
			for(var k in defs) {
				getHTTPDefinitionDao().insert(decodeHTTPDefinition(httpService.id, k, defs[k]));
			}
		}

		
		if (httpService["operations"]) {
			getHTTPEndpointDao().filter({ "id_httpservice": httpService.id }).delete();
			
			var eps = httpService["operations"];
			for(var k in eps) {
				getHTTPEndpointDao().insert(decodeHTTPEndpoint(httpService.id, eps[k]));
			}
		}
		
		return httpService;
	}
	
	function remove(id) {
		getHTTPEndpointDao().filter({ "id_httpservice": id }).remove();
		return getHTTPServiceDao().remove(id);		
	}

	scope["find"] = find;
	scope["get"] = get;
	scope["set"] = set;
	scope["remove"] = remove;
	
   	/*global module:false*/
  	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined'){
		module.exports = scope;
    }

	return scope;
	
})({ });
/**
 * Auto-generated comment stub
 *
  * @inpaas.key inpaas.httpclient.service.client
 * @inpaas.name HTTPClientService
 * @inpaas.module inpaas.httpclient.core
 * @inpaas.type patterntype.businessdelegate
 * @inpaas.engine Nashorn
 * @inpaas.anonymous false
*/

/*
 * HTTPClientService
 * inpaas.httpclient.service.client
 * 
 */
(function(scope) {
	'use strict';
	
	function encode(data) {
		/*global Java:false*/
		return Java.asJSONCompatible(data);
	}
	
	function getServiceDao() {
		/*global require:false*/
		return require("inpaas.core.entity.dao").getDao("HTTP_HTTPSERVICE");
	}
	
	function getServiceModel() {
		return require("inpaas.core.entity.dao").getModel("HTTP_HTTPSERVICE");
	}

	function find(moduleId) {
		var dbo = [];
		
		
		getServiceDao().filter("id_module").equalsTo(moduleId).find().forEach(function(data) {
			dbo.push( getServiceModel().encode(data) );
		});

		
		return Java.asJSONCompatible(dbo);
	}
	
	function get(id, withDefs) {
	
		var data;
		
		if (isNaN(id)) {
			data = getServiceDao().findByUniqueKey(id);
		} else {
			data = getServiceDao().findByPrimaryKey(id);
		}
		
		var o = getServiceModel().encode(data);
		
		if (withDefs) {
			//o["def"] = JSON.parse(data["tx_data"]);
			
			var Mapper = Java.type("com.fasterxml.jackson.databind.ObjectMapper");
			o["def"] = new Mapper().readValue(data["tx_data"], Java.type("com.inpaas.http.model.HttpService").class);
			
		} 
		
		

		return o;
	}
	
	function getSSL(id) {
		var sslData = getServiceDao().filter("id_http_httpservice").equalsTo(id).find("SELECT BL_PFX, BL_JKS, BL_PFXSECRET from HTTP_HTTPSERVICE #CRITERIA#").first();
		
		var ssl = {
			"pfx": sslData["bl_pfx"],
			"jks": sslData["bl_jks"],
			"secret": new java.lang.String(sslData["bl_pfxsecret"])
		}
		
		return ssl;
	}


	function set(object, def) {
		var data = getServiceModel().decode(object);
		
		var dbd = getServiceDao().findByUniqueKey(object.key);
		
		if (def != null) {
			data["tx_data"] = Java.type("br.com.inpaas.fw.serialization.JSON").stringify(def);
		}

		
		if (dbd != null) {
			data["id_http_httpservice"] = dbd["id_http_httpservice"];
			
			getServiceDao().update(data);
		} else {
			getServiceDao().insert(data);
		}

		object["id"] = data["id_http_httpservice"];
		
		return {
			"message": require("inpaas.core.l10n").translate("label.httpservice.updated"),
			"id": object.id
		};
	}
	
	function setSSL(key, ssl) {
		var o = get(key, false);
		
		var Base64 = Java.type("com.migcomponents.migbase64.Base64");
		
		getServiceDao().update({
			"id_http_httpservice": o.id,
			"do_auth": true,
			"bl_jks": ssl["keystore"].data,
			"bl_pfx": ssl["pfx"].data,
			"bl_pfxsecret": ssl["secret"].getBytes()
		});
		
		return o;
	}


	function remove(id) {
		return encode(getServiceDao().remove(id));
	}
		
	scope["find"] = find;
	
	scope["get"] = get;
	scope["getSSL"] = getSSL;
	
	scope["set"] = set;
	scope["setSSL"] = setSSL;
	
	scope["remove"] = remove;
	
   	/*global module:false*/
  	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined'){
		module.exports = scope;
    }

	return scope;
	
})({ });
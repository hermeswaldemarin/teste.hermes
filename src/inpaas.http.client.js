/**
 * Auto-generated comment stub
 *
  * @inpaas.key inpaas.http.client
 * @inpaas.name HttpClient
 * @inpaas.module inpaas.httpclient.core
 * @inpaas.type patterntype.businessdelegate
 * @inpaas.engine Nashorn
 * @inpaas.anonymous false
*/

/*
 * HttpClient
 * inpaas.http.client
 * 
 */
(function(scope) {
	"use strict";
	/*global require Java*/
	var HttpClientInvocation = Java.type("com.inpaas.http.model.HttpClientInvocation");
  	var HttpClientServiceFactory = Java.type("com.inpaas.http.HttpClientServiceFactory");

	var ServiceType = Java.type("com.inpaas.http.model.ServiceType");

  	function importWSDL(url) {
  		return HttpClientServiceFactory.getImporter(ServiceType.SOAP).importService(url);
  	}
  	
  	function executionLogger(hci) {
  		var svc = this || {};
  		var JavaDate = Java.type("java.util.Date");
  		
      	if (!hci.id) return;
      
      	var id = hci.id;
      	if (typeof id !== "string") id = id.toString();
      
  		var data = {
			"id_httpclientlog": id,
			"ds_service": svc.service,
			"ds_endpoint": svc.endpoint,
			"ds_method": hci.method,
			"ds_url": hci.url,
			"dt_started": new JavaDate(hci.startedAt),
			"dt_end": hci.endedAt > 0 ? new JavaDate(hci.endedAt) : null,
			"nr_elapsed": hci.endedAt > 0 ? hci.endedAt - hci.startedAt : null,
			"nr_status": hci.statusCode			
		}
		
		if (hci.data != null) { 
			data["tx_request"] = hci.data;
		}
		if (hci.response != null) { 
			data["tx_response"] = hci.response;
		}		

		
		var dao = require("inpaas.core.entity.dao").getDao("HTTP_CLIENTLOG");
  		if (dao.filter("id_httpclientlog").equalsTo(id).find().isEmpty()) {
  			dao.insert(data);
  		} else {
  			dao.update(data);
  		}
  	}
  	
  	function invokeService(serviceId, endpointId, data) {
  		var service;
  		if (serviceId.startsWith("http://") || serviceId.startsWith("https://")) {
  			service = importWSDL(serviceId);
		} else {
			var serviceData = require("inpaas.httpclient.service.client").get(serviceId, true);		
			service = serviceData.def;
			
		}

		var endpoint = service.getEndpoint(endpointId);
		endpoint.service = service;			
		
		var invoker = HttpClientServiceFactory.getInvocationBuilder(service.getType()).buildRequest(service, endpointId, data);
		
		
		if (serviceData && serviceData.auth == "Y") {
			var ssl = require("inpaas.httpclient.service.client").getSSL(serviceData.id);
			
			invoker.withSSLAuthentication(ssl["pfx"], ssl["jks"], ssl["secret"]);
		}
		
		return invoker.withLogging(executionLogger.bind({
			"service": serviceData ? serviceData.key : "on-demand",
			"endpoint": endpointId
		})).invoke().response();		
  	}

  	function fnGet(url) {
  		return executeWithLogging(HttpClientInvocation.fromURL(url));
  	}
  	
  	function fnPost(url, data) {
  		return executeWithLogging(HttpClientInvocation.fromOptions("POST", url, data));
  	}
  	
  	function fnPut(url, data) {
  		return executeWithLogging(HttpClientInvocation.fromOptions("PUT", url, data));
  	}
  	
  	function fnDelete(url) {
  		return executeWithLogging(HttpClientInvocation.fromOptions("DELETE", url, null));
  	}
  	
  	function fnExecute(opts) {
  		return executeWithLogging(HttpClientInvocation.fromMap(opts));
  	}  	
  
  	function executeWithLogging(hci) {
      
      	if (hci.withMarker)
			hci.withMarker(scriptContext.getMarker());
      
      	if (hci.withLogging)
      		hci.withLogging(executionLogger);
      
      	return hci.invoke().response()
      
    }

  	scope["get"] = fnGet;
	scope["post"] = fnPost;
	scope["put"] = fnPut;
	scope["delete"] = fnDelete;
	scope["execute"] = fnExecute;

	scope["importWSDL"] = importWSDL;
	scope["invokeService"] = invokeService;

	return scope;
	
})(/*global module*/ typeof module !== 'undefined' ? module.exports : {});
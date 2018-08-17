/**
 * Auto-generated comment stub
 *
  * @inpaas.key inpaas.httpclient.test.clent
 * @inpaas.name HttpClientTest
 * @inpaas.module inpaas.httpclient.core
 * @inpaas.type patterntype.businessdelegate
 * @inpaas.engine Nashorn
 * @inpaas.anonymous false
*/

/*
 * HttpClientTest
 * inpaas.httpclient.test.clent
 * 
 */
/*global require*/
(function(scope) {
	'use strict';
	
	
	function findOmniCepCountries() {
		return require("inpaas.http.client").get("https://omni-cep.plusoftomni.com.br/api/map/countries");
	}

	function getOmniCepCep(params) {
		var postalCode = params["cep"];		
		if (postalCode == null) throw Error("error.omnicep.ceprequired");
		
		return require("inpaas.http.client").execute({
			"type": "GET",
			"url": "https://omni-cep.plusoftomni.com.br/api/cep/" + postalCode
		});
	}
	
	function getTww() {
		var fullUrl = "https://webservices.twwwireless.com.br/reluzcap/wsreluzcap.asmx/EnviaSMS?NumUsu=OMNIDEV1&Senha=esf0811ab&SeuNum=15&Celular=5511991375651&Mensagem=TESTE_OMNI_POSTMAN";
		 
		var xml = require("inpaas.http.client").execute({
			"url": fullUrl,
			"method": "GET",
			"headers": {
				"Accept-Charset": "UTF-8",
				"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
			}
		});
		
		return xml;
	}



	scope["findOmniCepCountries"] = findOmniCepCountries;
	scope["getOmniCepCep"] = getOmniCepCep;
	scope["getTww"] = getTww;
	
	return scope;
	
})(/*global module*/module.exports);
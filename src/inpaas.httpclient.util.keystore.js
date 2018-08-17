/**
 * Auto-generated comment stub
 *
  * @inpaas.key inpaas.httpclient.util.keystore
 * @inpaas.name KeyStoreUtils
 * @inpaas.module inpaas.httpclient.core
 * @inpaas.type patterntype.businessdelegate
 * @inpaas.engine Nashorn
 * @inpaas.anonymous false
*/

/*
 * KeyStoreUtils
 * inpaas.httpclient.util.keystore
 * 
 */
/*global require*/
(function() {
	/*global Java*/
	'use strict';

	function getSSLContext(ssl) {
		var KeyStore = Java.type("java.security.KeyStore");

		var pfx = require("inpaas.core.files").download(ssl.pfx);
		var cer = require("inpaas.core.files").download(ssl.cer);
		
		var ts = KeyStore.getInstance("PKCS12");
		ts.load(pfx.getInputStream(), ssl.secret.toCharArray());
		
		var ks = createKeyStore(ts, cer, ssl.alias, ssl.secret);

		return {
			"truststore": ts,
			"keystore": ks,
			"secret": ssl.secret
		}

	}
	
	function createKeyStore(pfx, cer, alias, secret) {
		try {
			var KeyStore = Java.type("java.security.KeyStore");
			var CertificateFactory = Java.type("java.security.cert.CertificateFactory");

			var cf = CertificateFactory.getInstance("X.509");
			var cert = cf.generateCertificate(cer.getInputStream());
			
			var pfxalias = pfx.aliases().nextElement();
			var pfxKey = pfx.getKey(pfxalias, secret.toCharArray());
			var pfxchain = pfx.getCertificateChain(pfxalias);
			
			var jks = KeyStore.getInstance("JKS");
			jks.load(null, secret.toCharArray());	
			jks.setKeyEntry(pfxalias, pfxKey, secret.toCharArray(), pfxchain);
			jks.setCertificateEntry(alias, cert);
			
			return jks;

		} catch (e) {
			throw e;

		}
	}



	var scope = {};
	scope["getSSLContext"] = getSSLContext;


   	/*global module:false*/
  	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined'){
		module.exports = scope;
    }

	return scope;
	
})();
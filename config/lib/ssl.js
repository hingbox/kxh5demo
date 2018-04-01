'use strict';

let isEmpty = require('lodash/fp/isEmpty');
let url = require('url');
let config = require('../config');

module.exports = function ssl(options) {
  options = options || {};

  let enabled = options.hasOwnProperty('disabled') ?
    !options.disabled : process.env.NODE_ENV === 'production';

  return sslMiddleware;


  /* jshint validthis: true */
  function* sslMiddleware(next) {
    if (!enabled) return yield next;

    let verifiedResult = this.reqVerifiedResult||{};
    if(isEmpty(verifiedResult)){
      console.log("url middleware need use before ssl");
    }

    let isSSL = verifiedResult.ssl || false;
    let isSecure = this.secure;

    if (!isSecure && options.trustProxy) {
      isSecure = this.get('x-forwarded-proto') === 'https';
    }

    let urlObject = url.parse('http://' + this.request.header.host);

    let httpsPort = config.SSL_PORT || 443;
    let httpProt = config.port;
    let httpsHost = urlObject.hostname;

    if(isSSL){
      if (isSecure) {
        yield next;
      } else if (typeof options.disallow === 'function') {
        options.disallow(this);
      } else {
        this.response.redirect('https://' + httpsHost + ':' + httpsPort + this.request.url);
      }
    }else{
      if (isSecure) {
        this.response.redirect('http://' + httpsHost + ':' + httpProt + this.request.url);
      } else {
        yield next;
      }
    }
  }
};

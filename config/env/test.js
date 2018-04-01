'use strict';

var defaultEnvConfig = require('./default');

module.exports = {
  db: {
    host: '192.168.0.23',
    port: 27017,
    user: 'dbuser',
    pass: 'elab123',
    db: 'logdb',
    max: 100,
    min: 1,
    timeout: 30000,
    log: false
  },
  port: process.env.PORT || 3001,
  app: {
    title: defaultEnvConfig.app.title + ' - Test Environment'
  },
  templateEngine: 'swig',
  requestCacheMaxage: 300000,
  cookies:{
    keys:{
      uid          :'uid',
      lid          :'lid',
      token        :'t',
      verifycode   :'vc',
      openid       :'openid',
      province     :'province',
      city         :'city',
      lon          :'lon',
      lat          :'lat',
      cart         :'cart',
      cartcount    :'cartcount',
      dzparams     :'dzparams',
      settlement   :'settlement',
      firstshow    :'firstshow'
    },
    secret: process.env.SESSION_SECRET || 'ELAB',
    options:{
      // session expiration is set by default to 24 hours
      maxAge: 24 * (60 * 60 * 1000),
      //path of the cookie (/ by default).
      path: '/',
      //domain of the cookie (no default).
      domain: '.elab-plus.com',
      // httpOnly flag makes sure the cookie is only accessed
      // through the HTTP protocol and not JS/browser
      httpOnly: true,
      // secure cookie should be turned to true to provide additional
      // layer of security so that the cookie is set only when working
      // in HTTPS mode.
      secure: false,
      // whether the cookie is to be signed (false by default). If this is true,
      // another cookie of the same name with the .sig suffix appended will also
      // be sent, with a 27-byte url-safe base64 SHA1 value representing the hash
      // of cookie-name=cookie-value against the first Keygrip key. This signature
      // key is used to detect tampering the next time a cookie is received.
      signed:false,
      // whether to overwrite previously set cookies of the same name (false by default).
      // If this is true, all cookies set during the same request with the same name
      // (regardless of path or domain) are filtered out of the Set-Cookie header
      // when setting this cookie.
      overwrite:true
    }
  },
  seedDB: process.env.MONGO_SEED || false
};

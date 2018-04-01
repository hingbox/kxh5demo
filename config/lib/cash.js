'use strict';

let isEmpty = require('lodash/lang/isEmpty');
let config = require('../config');
let cache = require('lru-cache')({
  maxAge: config.requestCacheMaxage||0 // global max age
});

module.exports = function (app){
  app.use(require('koa-cash')({
    get: function* (key, maxAge) {
      return cache.get(key)
    },
    set: function* (key, value) {
      cache.set(key, value)
    }
  }));

  app.use(function* (next) {
    // this response is already cashed if `true` is returned,
    // so this middleware will automatically serve this response from cache
    let verifiedResult = this.reqVerifiedResult||{};
    if(isEmpty(verifiedResult)){
      console.log("url middleware need use before cash");
    }

    // judge request whether need cache or not
    if (app.env !=='production' && verifiedResult.cache){
      if(yield* this.cashed()) return;
    }

    // set the response body here,
    // and the upstream middleware will automatically cache it
    yield next;
  });

  app.use(require('koa-html-minifier')({
    collapseWhitespace: true,
    removeComments:true,
    minifyJS:true,
    minifyCSS:true
  }));
};

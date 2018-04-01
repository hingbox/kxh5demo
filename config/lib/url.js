'use strict';

let isEmpty = require('lodash/fp/isEmpty');
let isRegExp = require('lodash/fp/isRegExp');
let values = require('lodash/fp/values');
let config = require('../config');

module.exports = function(){
  let cache = require('lru-cache')({
    maxAge: config.requestCacheMaxage||0 // global max age
  });

  let paths = values(config.routers);

  let route = require('path-match')({
    strict: false,
    end: false,
    sensitive: false
  });

  let prefix = 'url_cache_';

  // match a route
  let parse = require('url').parse;

  /**
   * check whether request's referer is valid or not
   * private
   */
  let checkReferer = function(req,referer){
    var valid = false;
    if(isEmpty(referer)&& !isRegExp(referer)){
      return true;
    }

    var reqreferer = req.headers.referer;
    if(!isEmpty(reqreferer) &&  (!isEmpty(referer) || isRegExp(referer))){
      var s1 = parse(req.url), s2 = parse(reqreferer), path = s2.pathname;
      if(s1.hostname == req.headers.hostname && s1.port == req.headers.port){
        valid = true;
      }else{
        return false;
      }

      if(isRegExp(referer)){
        valid = referer.test(path);
      }else{
        var match = route(referer), params = match(s2.pathname);
        valid = (params == false) ? false : valid;
      }
    }
    return valid;
  };

  /**
   * check request valid or not
   * @param req
   * @returns {exist:true|false, auth:true|false,referer:true|false,ajax:false, secure: false}
   */
  let verify = function(req){
    var out = {exist:false, auth:false, referer:true, cache:false, ajax:false, ssl: false, max:false};

    if(isEmpty(paths)){
      return false;
    }

    var element, eurl, auth, referer, match, params = false ,path;

    path = parse(req.url).pathname;

    for(var i = 0; i < paths.length; i++){
      element = paths[i];
      eurl = element.url || '';
      auth = element.auth || false;
      referer = element.referer || '';

      if(isRegExp(eurl) && eurl.test(path)){
        out.exist = true;
        out.cache  = element.cache || false;
        out.ssl  = element.ssl || false;
        out.auth    = element.auth || false;
        out.referer = (isEmpty(referer) && !isRegExp(referer)) ? true : checkReferer(req,referer);
        out.ajax    = element.ajax ? element.ajax : out.ajax;
        out.max     = element.max || out.max;
        break;
      }else{
        match = route(eurl);
        params = match(path);
        if(path == eurl || (params !== false && !isEmpty(params))){
          out.exist = true;
          out.cache  = element.cache || false;
          out.ssl  = element.ssl || false;
          out.auth    = element.auth || false;;
          out.referer = (isEmpty(referer) && !isRegExp(referer)) ? true : checkReferer(req,referer);
          out.ajax    = element.ajax ? element.ajax : out.ajax;
          out.max     = element.max || out.max;
          break;
        }
      }
    }
    return out;
  };

  return urlMiddleware;

  function* urlMiddleware(next) {
    let key = prefix + this.url;
    let out = cache.get(key);
    if(out){
      this.reqVerifiedResult = out;
    }else{
      this.reqVerifiedResult = verify(this.request);
      cache.set(key, this.reqVerifiedResult);
    }
    yield next;
  }
};

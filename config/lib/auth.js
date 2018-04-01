'use strict';

let isEmpty = require('lodash/fp/isEmpty');
let config = require('../config');
let path = require('path');
let UID = require(path.resolve('util/uid.js'));
let assign = require('object-assign');
let ModelError = require(path.resolve('models/modelerror'));
let errorenum = require(path.resolve('models/errorenum'));
let env = process.env.NODE_ENV || 'development';
let prefix = 'auth_cache_';

module.exports = function auth(options) {
  let cache = require('lru-cache')({
    maxAge: config.requestCacheMaxage|| 180000  // global max age
  });

  return authMiddleware;

  /* jshint validthis: true */
  function* authMiddleware(next) {
    if('development' === env){
       return yield next;
    }

    let uid   = this.cookies.get(config.cookies.keys['uid']);
    let token = this.cookies.get(config.cookies.keys['token']);
    let lid   = this.cookies.get(config.cookies.keys['lid']);

    this.UID = UID.decode(uid);
    this.LID = UID.decode(lid);
    this.TOKEN = token;
    this.isAuth = !isEmpty(lid);

    let opts = assign({},config.cookies.options,{
      maxAge: 0,
      httpOnly: false
    });

    //for see user wether or not logined
    if(this.isAuth){
      this.cookies.set(config.cookies.keys['isauth'], '1', opts);
    }else{
      this.cookies.set(config.cookies.keys['isauth'], '0', opts);
    }

    let verifiedResult = this.reqVerifiedResult||{};
    if(isEmpty(verifiedResult)){
      console.log("url middleware need use before auth");
    }

    let needAuth = verifiedResult.auth || false;
    let max      = verifiedResult.max  || 0;
    let en = errorenum['Common_Out_Of_Access_Limit'];

    if(needAuth && (isEmpty(lid) || isEmpty(token))){
      if('GET' === this.method){
        let rto = config.routers['auth-login-index'].url + "?returnurl=" + encodeURIComponent(this.href);
        this.response.redirect(rto);
      }else{
        this.status = 403;
      }
    }else if(max>0 && !isEmpty(uid)){
      let key = [prefix, uid, this.url].join('-');
      //number of current user access current url
      let accessedNum = cache.get(key) || 0;

      if(accessedNum >= max){
        // var en = errorenum['Common_Out_Of_Access_Limit'];
        // throw ModelError('middleware:auth',en[0],en[1]);
        cache.set(key, max);

        if('application/json' === this.request.type){
          this.type = 'json';
          this.body = JSON.stringify({
            success: false,
            code: en[0],
            message: en[1]
          });
        }else{
          this.type = 'html';
          this.body = yield render('5xx', en[1]);
        }
      }else{
        cache.set(key, accessedNum+1);
        yield next;
      }
    }else{
      yield next;
    }
  }
};

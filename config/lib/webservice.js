'use strict';

let isEmpty  = require('lodash').isEmpty;
let contains = require('lodash').includes;
let pathToRegexp = require('path-to-regexp');
let config = require('../config');
let path = require('path');
let ModelError = require(path.resolve('models/modelerror'));
let errorenum = require(path.resolve('models/errorenum'));
let rp = require('request-promise');
let env = process.env.NODE_ENV || 'development';

let options = {
  method: 'GET',
  headers: {
    'user-agent': 'www.elab-plus.com'
  }
  ,json: true
};

module.exports = function(){
  return ws;
  function* ws(next){
    this.webservice = function*(method, uri, params){
      method = method.toLowerCase();
      if(contains(['get','post','delete','put'],method)){
        try{
          options.method = method;
          options.uri = uri;
          if('get' === method){
            options.qs = params;
          }else{
            options.body = params;
          }
          var response = yield rp(options);
          if(env =='development'){
            console.log("request data:");
            console.log(JSON.stringify(params));
            console.log("reponse data:");
            console.log(JSON.stringify(response));
          }
          return response;
        }catch(e){
          if(e.status){
            throw e;
          }else{
            var en = errorenum['Common_Network_Error'];
            return {'success':false, 'code':en[0],'message':en[1]};
          }
        }
      }else{
        var en = errorenum['Common_Method_Not_Allowed'];
        return {'success':false, 'code':en[0],'message':en[1]};
      };
    };

    this.ws = function*(path, params){
      params = isEmpty(params) ? {} : params;
      let conf = config.wsRouters[path];
      if(isEmpty(conf)){
        var en = errorenum['Common_Param_Invalid'];
        throw ModelError('middleware:ws',en[0],en[1]);
      }

      var toPathRegexp = pathToRegexp.compile(conf['url']);
      var path = toPathRegexp(params||{});

      var method = conf['method'] || 'get'
      , uri = config.wsHost + path
      ;

      method = method.toLowerCase();
      if(contains(['get','post','delete','put'],method)){
        try{
          options.method = method;
          options.uri = uri;
          if('get' === method){
            options.qs = params;
          }else{
            options.body = params;
          }
          var response = yield rp(options);
          if(env =='development'){
            console.log("request data:");
            console.log(JSON.stringify(params));
            console.log("reponse data:");
            console.log(JSON.stringify(response));
          }
          return response;
        }catch(e){
          if(e.status){
            throw e;
          }else{
            var en = errorenum['Common_Network_Error'];
            return {'success':false, 'code':en[0],'message':en[1]};
          }
        }
      }else{
        var en = errorenum['Common_Method_Not_Allowed'];
        return {'success':false, 'code':en[0],'message':en[1]};
      };
    };

    yield next;
  }
}

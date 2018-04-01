'use strict';

let path = require('path');
let render = require(path.resolve('app/util/render.js'));
let errorenum = require(path.resolve('models/errorenum'));
let config = require('../config.js');
let status = require('./status.js');
let env = process.env.NODE_ENV || 'development';
let uuid = require('node-uuid');

module.exports = function error() {
  return errorMiddleware;

  /* jshint validthis: true */
  function* errorMiddleware(next) {
    try {
      yield next;
    } catch (e) {
      let code = e.status;
      e.success = false;
      e.message = e.message || status[code];

      let context = env=='development' ? { e: e }:{};

      if('application/json' === this.request.type){
        this.type = 'json';
        if(status.auth[code]){
          let en = errorenum['Common_Unauthorized'];
          this.body = JSON.stringify({
            success: false,
            code: en[0],
            message: en[1]
          });
        }else{
          this.body = JSON.stringify(e);
        }
      }else{
        if(status.auth[code]){
          this.response.redirect(config.routers['auth-login-index'].url);
        }else{
          this.type = 'html';
          this.body = yield render('5xx', context);
        }
      }

      try{
        this.mongo.collection('Client').insert({
          'logid'  : uuid.v1(),
          'success': false,
          'context': e.stack || status[code],
          'logdate': Date.now()
        });
      }catch(o){}

      this.app.emit('error', e, this);
    }
  }
};

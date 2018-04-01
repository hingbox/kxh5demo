'use strict';

let MongoClient = require('mongodb').MongoClient;
let debug = require('debug')('koa-mongo');

module.exports = mongo;

function mongo(options) {
  options = options || {};
  var host = options.host || 'localhost';
  var port = options.port || 27017;
  var max = options.max || 100;
  var min = options.min || 1;
  var timeout = options.timeout || 30000;
  var log = options.log || false;
  var db = options.db;
  var mongoUrl = options.uri || options.url;
  if(!mongoUrl) {
    if (options.user && options.pass) {
      options.pass = encodeURIComponent(options.pass);
      mongoUrl = 'mongodb://' + options.user + ':' + options.pass + '@' + host + ':' + port;
    } else {
      mongoUrl = 'mongodb://' + host + ':' + port;
    }
    if (db) {
      mongoUrl = mongoUrl + '/' + db;
    }
  }

  return function* mongo(next) {
    this.mongo = yield MongoClient.connect(mongoUrl);
    if (!this.mongo) this.throw('Fail to acquire one mongo connection')
    debug('Acquire one connection (min: %s, max: %s)', min, max);

    try {
      yield* next;
    } catch (e) {
      throw e;
    } finally {
      this.mongo.close();
      debug('Release one connection (min: %s, max: %s)', min, max);
    }
  }
}

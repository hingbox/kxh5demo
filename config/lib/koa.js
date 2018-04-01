'use strict';

let path = require('path');
let conditional = require('koa-conditional-get');
let etag = require('koa-etag');
let koa = require('koa');
let cors = require('koa-cors');
let compress = require('koa-compress');
let bodyParser = require('koa-bodyparser');
let staticCache = require('koa-static-cache');
let env = process.env.NODE_ENV || 'development';

let render = require(path.resolve('app/util/render'));

let mongo = require('./mongo');
let fs = require('fs');

let config = require('../config');

let app = module.exports = koa();

app.use(conditional());
app.use(etag());

//error middleware
app.use(require('./err')());

// HTML compression
app.use(compress({}));

// serve static files (html, css, js); allow browser to cache for 365 day
app.use(staticCache(path.resolve('./public'), {
  maxAge: 365 * 24 * 60 * 60
}));

//url middleware
app.use(require('./url')());

//auth middleware
//app.use(require('./auth')());

//SSL middleware
app.use(require('./ssl')({
 disabled:!(config.secure && config.secure.ssl === true)
}));

// load request cache
if(env !== "development"){
  require('./cash')(app);
}
app.use(cors());
app.use(bodyParser());

//app.use(mongo(config.db));

// load controllers
require('./boot')(app);

// end of the line: 404 status for any resource not found
app.use(function* notFound(next) {
  yield next;
  if('json' === this.is('json')){
    this.type = 'json';
    var res = {
      'success': false,
      'code'   : 404,
      'message':'not found'
    };
    this.body = JSON.stringify(res);
  }else{
    this.type = 'html';
    this.body = yield render('404');
  }
});

app.on('error', function(err){
  delete err['success'];
  //logger.error(err);
  if(env === "development"){
    console.log(err.stack || JSON.stringify(err));
  }
});

if (!module.parent) {
  var port = process.env.PORT||config.port;
  app.listen(port);
  console.log(process.version+' listening on port '+ port);
}

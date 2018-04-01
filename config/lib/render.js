'use strict';

let views = require('co-views');
let path = require('path');
let assign = require('object-assign');
let isEmpty = require('lodash/isEmpty');
let config = require('../config.js');
let env = process.env.NODE_ENV || 'development';

let locals = {
  title: config.app.title,
  description: config.app.description,
  version: env === 'development' ? new Date().getTime() :  config.elab.version,
  secure: config.secure && config.secure.ssl === true,
  keywords: config.app.keywords,
  jsFiles: config.files.client.js,
  cssFiles: config.files.client.css,
  livereload: config.livereload,
  logo: config.logo,
  favicon: config.favicon,
  host:'',
  url:'',
  pictureServer: '',
  noHead:false,
  noFoot:false,
  noMenu:true,
  isAuth:false,
  loginId: '',
  hideTitle: false
};

module.exports = function(options){
  options = options || {};
  let vd = options.viewsDir || 'views';
  let rvd = vd;
  vd = path.join(process.cwd(),vd);

  // setup views mapping .html to the swig template engine
  let render = views(vd, {
    map: { html: 'swig' }
  });

  return function*(next){
    //set host & url for each request
    locals.host = this.protocol + '://' + this.request.hostname;
    locals.url  = this.protocol + '://' + this.request.host + this.request.originalUrl;
    locals.isAuth = isEmpty(this.LID) ? false : true;
    locals.loginId = this.LID||'';

    let backUrl = this.headers['referer'];
    backUrl = isEmpty(backUrl) ? false: backUrl;

    let max = config.pictureServers.length;
    let r = Math.floor(Math.random()* max);

    locals.pictureServer = config.pictureServers[r];

    this.render = function*(dir, opts){
      opts = assign({backUrl: false},
        locals,
        opts||{}
      );

      var key = rvd + '/' + dir, keywords = null;
      key = key.replace(new RegExp("/", 'g'), "-");
      keywords = config.keywords[key];
      if(keywords){
        opts.keywords  += "," + keywords;
      }

      this.type = 'html';
      this.body = yield render(dir, opts);
    };

    this.json = function*(params){
      this.type = 'json';
      this.body = params;
    }

    this.log = function*(o){
      try{
        this.mongo.collection('Client').insert(o);
      }catch(e){}
    }

    yield next;
  }
}

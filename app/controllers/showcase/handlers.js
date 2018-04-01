'use strict';

let handlers = module.exports = {};
let multipart = require('co-multipart')

handlers.helloworld = function*(){
  var res = yield this.webservice('get', 'http://192.168.0.14:8000/helloworld/get',{});
  yield this.json(res);
};

handlers.refresher = function*(){
  yield this.render('refresher',{
    noFoot: true,
    title: 'refresher'
  });
};

handlers.lazyload = function*(){
  yield this.render('lazyload',{
    noFoot: true,
    title: 'lazyload'
  });
};

handlers.upload = function*(){
  let parts = yield* multipart(this);
  let arr = [];
  parts.files.forEach(function(file){
    arr.push(file.path);
    console.log(file.path);
  });
  yield this.json({success: true,files: arr});
};

handlers.json = function*(){
  yield this.json({success: true});
};

'use strict';

let fs = require('fs');
let render = require('./render');
let path = require('path');
let ws = require('./webservice.js');

module.exports = function (app){
  app.use(ws());
  fs.readdirSync(path.resolve('app/controllers')).forEach(function(name){
    app.use(render({viewsDir: 'app/controllers/' + name+'/views'}));
    app.use(require(path.resolve('app/controllers/'+ name +'/routes.js')));
  });
};

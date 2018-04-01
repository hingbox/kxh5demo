'use strict';

let config = require('../config');
let chalk = require('chalk');
let app = require('./koa');
let http = require('http');
let https = require('https');
let fs = require('fs');
let path = require('path');
let cofs = require('co-fs');

// SSL options
let sslOptions = {
  key : fs.readFileSync(path.resolve(config.secure.privateKey)),
  cert: fs.readFileSync(path.resolve(config.secure.certificate))
};

module.exports.start = function() {
  var _this = this;
  http.createServer(app.callback()).listen(config.port, function () {
    // Logging initialization
    console.log('--');
    console.log(chalk.green(config.app.title));
    console.log(chalk.green('Environment:\t\t\t' + process.env.NODE_ENV));
    console.log(chalk.green('Port:\t\t\t\t' + config.port));
    console.log(chalk.green('Database:\t\t\t' + config.db.host + ':'+config.db.port+'/'+config.db.db));
    console.log(chalk.green('App version:\t\t\t' + config.elab.version));
    console.log('--');
  });

  if(config.secure && config.secure.ssl === true){
    https.createServer(sslOptions, app.callback()).listen(config.sslPort,function(){
      // Logging initialization
      console.log(chalk.green('HTTPs:\t\t\t\ton '+ config.sslPort));
      console.log('--');
    });
  }

  _this.init();
};

module.exports.init = function(){
  let elab = {
    config:{}
  };

  elab.config.routers = config.routers;

  let out = [];
  out.push(';(function(){var elab = window.elab = window.elab || ');
  out.push(JSON.stringify(elab));

  require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    out.push(';elab.config.addr="');
    out.push(add);
    out.push('";})();');
    cofs.writeFile('public/js/config.js',out.join(''));
  });
}

'use strict';

let config = require('../config');
let cofs = require('co-fs');

module.exports = function(){

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
  })
};

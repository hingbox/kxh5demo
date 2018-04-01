'use strict';

let config = require('../config');
let path = require('path');
let ws = require('./webservice.js');

module.exports = function (app){
  // middleware for socket.io's connect and disconnect
  app.io.use(function* (next) {
    // on connect
    yield* next;
    // on disconnect
  });

  app.io.use(ws());

  config.files.server.sockets.forEach(function (socketConfiguration) {
    app.io.use(require(path.resolve(socketConfiguration)));
  });
};

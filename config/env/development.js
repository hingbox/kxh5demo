'use strict';

var defaultEnvConfig = require('./default');

module.exports = {
  secure: {
    ssl: false,
    privateKey: './config/sslcerts/elab.key',
    certificate: './config/sslcerts/elab.crt'
  },
  db: {
    host: '192.168.0.23',
    port: 27017,
    user: 'dbuser',
    pass: 'elab123',
    db: 'logdb',
    max: 100,
    min: 1,
    timeout: 30000,
    log: false
  },
  log: {
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: 'dev',
    // Stream defaults to process.stdout
    // Uncomment to enable logging to a log on the file system
    options: {
      //stream: 'access.log'
    }
  },
  app: {
    title: defaultEnvConfig.app.title + ' - Development Environment'
  },
  requestCacheMaxage: 5000,
  livereload: true,
  seedDB: process.env.MONGO_SEED || false,
  keywords:{
    'modules-demo-views-bbs-list'          :'bbs, list',
    'modules-demo-views-bbs-view'          :'bbs, view',
    'modules-demo-views-card-list'         :'card, list',
    'modules-demo-views-card-view'         :'card, view',
    'modules-demo-views-demo-index'        :'demo, index',
    'modules-demo-views-demo-steps'        :'demo, steps',
    'modules-demo-views-demo-breadcrumb'   :'demo, breadcrumb'
  }
};

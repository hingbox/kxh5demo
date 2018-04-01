'use strict';

module.exports = {
  secure: {
    ssl: false,
    privateKey: './config/sslcerts/elab.key',
    certificate: './config/sslcerts/elab.crt'
  },
  port: process.env.PORT || 8443,
  db: {
    host: '10.174.150.206',
    port: 27017,
    user: 'frontdbuser',
    pass: 'elab123',
    db: 'logdb',
    max: 100,
    min: 1,
    timeout: 30000,
    log: false
  },
  log: {
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: 'combined',
    // Stream defaults to process.stdout
    // Uncomment to enable logging to a log on the file system
    options: {
      stream: 'access.log'
    }
  },
  requestCacheMaxage: 300000,
  seedDB: process.env.MONGO_SEED || false,
  keywords:{
    'modules-demo-views-bbs-list'          :'bbs,list',
    'modules-demo-views-bbs-view'          :'bbs,view',
    'modules-demo-views-card-list'         :'card,list',
    'modules-demo-views-card-view'         :'card,view',
    'modules-demo-views-demo-index'        :'demo,index',
    'modules-demo-views-demo-steps'        :'demo,steps',
    'modules-demo-views-demo-breadcrumb'   :'demo,breadcrumb'
  }
};

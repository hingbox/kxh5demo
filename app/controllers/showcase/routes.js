'use strict';

let router = require('koa-router')();
let showcase = require('./handlers.js');

router.get( '/showcase/helloworld',          showcase.helloworld);
router.get( '/showcase/refresher',           showcase.refresher);
router.get( '/showcase/lazyload',            showcase.lazyload);
router.post('/showcase/json',                showcase.json);
router.post('/showcase/upload',              showcase.upload);
module.exports = router.middleware();

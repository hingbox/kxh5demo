'use strict';

let router = require('koa-router')();
let index = require('./handlers.js');
router.get( '/index/shizhi',           index.shizhi);
router.get( '/index/other',           index.other);
router.get( '/index/others',           index.others);
router.get( '/index/zhidao',           index.zhidao);
router.get( '/index/test',           index.test);
module.exports = router.middleware();

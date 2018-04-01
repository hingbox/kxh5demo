'use strict';

module.exports = {
  client: {
    lib: {
      css: [
        'public/lib/js/Swiper/dist/css/swiper.min.css'
      ],
      js: [
        'public/lib/js/lodash/lodash.js',
        'public/lib/js/Detect.js/detect.min.js',
        'public/lib/js/zepto/zepto.js',
        'public/lib/js/zeptojs/src/fx.js',
        'public/lib/js/zeptojs/src/fx_methods.js',
        'public/lib/js/store/store.min.js',
        'public/lib/js/lazyload/build/lazyload.min.js',
        'public/lib/js/Swiper/dist/js/swiper.min.js',
        'public/lib/js/fileapi/dist/FileAPI.min.js',
        'public/lib/js/iscroll/build/iscroll-probe.js',
        'public/js/FileAPI.exif.js'
      ],
      tests: []
    },
    css: [
      'public/css/base.css',
      'public/css/style.css',
      'public/css/elab.css'
    ],
    less: [

    ],
    sass: [

    ],
    js: [
      'public/js/polyfill.js',
      'public/js/config.js',
      'public/js/messenger.js',
      'public/js/zepto.cookie.js',
      'public/js/elab.js',
      'public/js/zepto.refresher.js',
      'public/js/zepto.qrcode.js',
      'public/js/zepto.currencyformat.js',
      'public/js/zepto.imgreview.js',
      'public/js/zepto.commentinput.js',
      'public/js/zepto.imageupload.js',
      'public/js/zepto.datepicker.js',
      'public/js/zepto.stepselector.js',
      'public/js/zepto.slider.js',
      'public/js/zepto.imgcompare.js',
      'public/js/console-security-message.js'
    ],
    views: [],
    templates: ['build/templates.js']
  },
  server: {
    allJS: ['server.js', 'config/**/*.js', 'modules/*/*.js'],
    models: 'modules/*/server/models/**/*.js',
    routes: ['modules/*/routes-*.js'],
    sockets:['modules/*/sockets/routes-*.js'],
    // config: 'modules/*/server/config/*.js',
    // policies: 'modules/*/server/policies/*.js',
    views: ['modules/*/views/*.html','views/*.html']
  }
};

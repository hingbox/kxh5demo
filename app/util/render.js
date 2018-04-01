'use strict';

/**
 * Module dependencies.
 */
let views = require('co-views');

// setup views mapping .html
// to the swig template engine

module.exports = views(__dirname + '/../views', {
  map: { html: 'swig' }
});

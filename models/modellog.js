'use strict';let uuid = require('node-uuid');function ModelLog (success, message) {  this.success= success || false;  this.context = message;  this.logdate = Date.now();  this.logid = uuid.v1();}module.exports = ModelLog;
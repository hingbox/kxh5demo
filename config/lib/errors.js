'use strict';

let status = require('./status.js');

function RequestError(cause) {
  this.name = 'RequestError';
  this.message = String(cause);
  this.cause = cause;

  if (Error.captureStackTrace) { // if required for non-V8 envs - see PR #40
    Error.captureStackTrace(this);
  }
}

RequestError.prototype = Object.create(Error.prototype);
RequestError.prototype.constructor = RequestError;


function StatusCodeError(statusCode, message) {
  message = message || status[statusCode];
  this.name = 'StatusCodeError';
  this.status = statusCode;
  this.message = statusCode + ' - ' + message;

  if (Error.captureStackTrace) { // if required for non-V8 envs - see PR #40
    Error.captureStackTrace(this);
  }
}
StatusCodeError.prototype = Object.create(Error.prototype);
StatusCodeError.prototype.constructor = StatusCodeError;

module.exports = {
  RequestError: RequestError,
  StatusCodeError: StatusCodeError
};

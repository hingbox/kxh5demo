'use strict';

// Rename this file to local.js for having a local configuration variables that
// will not get commited and pushed to remote repositories.
// Use it for your API keys, passwords, etc.

module.exports = {
  sessionSecret: process.env.SESSION_SECRET || 'youshouldchangethistosomethingsecret'
};

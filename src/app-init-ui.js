'use strict';

if (process.env.NODE_ENV === 'production') {
  require('../es/index.css');
  module.exports = require('../es/app-init.min.js');
} else {
  require('../es/index.css');
  module.exports = require('../es/app-init.js');
}
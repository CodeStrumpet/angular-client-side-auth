'use strict';

// Utilize Underscore utility library
var _ = require('underscore');

// Extend the base configuration in all.js with environment
// specific configuration
module.exports = _.extend(
    require(__dirname + '/../config/env/all.js'),
    require(__dirname + '/../config/env/' + process.env.NODE_ENV + '.js') || {}
);
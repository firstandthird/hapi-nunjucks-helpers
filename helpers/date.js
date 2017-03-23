'use strict';

const moment = require('moment');

module.exports = function(timestamp, format, done) {
  const parsed = moment(timestamp);
  let output = '';

  if (typeof format === 'function') {
    done = format;
    output = parsed.fromNow();
  } else {
    output = parsed.format(format);
  }

  done(null, output);
};

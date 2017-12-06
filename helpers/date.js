'use strict';

const moment = require('moment');

module.exports = function(timestamp, format, inputFormat, done) {
  const input = timestamp || undefined;
  let parsed;
  let output = '';

  if (typeof format === 'function') {
    done = format;
    format = null;
    inputFormat = null;
  }

  if (typeof inputFormat === 'function') {
    done = inputFormat;
    inputFormat = null;
  }

  if (inputFormat) {
    parsed = moment(input, inputFormat);
  } else {
    parsed = input ? moment(new Date(input)) : moment();
  }

  if (format) {
    output = parsed.format(format);
  } else {
    output = parsed.fromNow();
  }

  done(null, output);
};

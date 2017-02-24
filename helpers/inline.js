'use strict';

const fs = require('fs');
const path = require('path');

module.exports = function(server, asset, done) {
  const file = path.join(process.cwd(), asset);
  const type = path.extname(file);
  let wrapperStart = '<script>';
  let wrapperEnd = '<script>';

  if (type === 'css') {
    wrapperStart = '<style>';
    wrapperEnd = '</style>';
  }

  fs.access(file, fs.constants.R_OK, err => {
    if (err) {
      server.log(['nunjucks-helpers', 'inline'], `Cannot read file ${asset}`);
      return done();
    }

    fs.readFile(file, 'utf-8', (error, data) => {
      if (err) {
        server.log(['nunjucks-helpers', 'inline'], `Cannot read file ${asset}`);
        return done();
      }

      return done(null, `${wrapperStart}${data}${wrapperEnd}`);
    });
  });
};

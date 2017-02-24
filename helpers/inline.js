'use strict';

const fs = require('fs');
const path = require('path');

module.exports = function(server, asset, done) {
  const settings = this.options.inline || {};
  const realm = server.realm.plugins['hapi-nunjucks-helpers'];
  const file = path.join(process.cwd(), asset);

  if (!settings.cache) {
    realm.inline = {};
  }

  if (realm.inline[file]) {
    return done(null, realm.inline[file]);
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

      realm.inline[file] = data;

      return done(null, data);
    });
  });
};

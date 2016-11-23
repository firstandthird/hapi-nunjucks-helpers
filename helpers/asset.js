'use strict';

const fs = require('fs');

module.exports = function(server, asset, done) {
  const settings = this.options.assets || {};
  const dist = settings.dist || '';
  const mappingFile = settings.mappingFile;
  const endpoint = settings.endpoint || '';

  const defaultFile = () => done(null, `${endpoint}/${dist}${asset}`);

  if (!mappingFile) {
    return defaultFile();
  }

  fs.access(mappingFile, fs.constants.R_OK, err => {
    if (err) {
      server.log(['nunjucks-helpers', 'assets'], err);
      return defaultFile();
    }

    fs.readFile(mappingFile, (err2, data) => {
      if (err2) {
        server.log(['nunjucks-helpers', 'assets'], err2);
        return defaultFile();
      }

      return done(null, `${endpoint}/${dist}${data[asset]}`);
    });
  });
};

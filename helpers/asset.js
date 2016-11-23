'use strict';

const fs = require('fs');

module.exports = (server, asset, done) => {
  const settings = server.settings.app;
  const dist = settings.assets.dist || '';
  const mappingFile = settings.assets.mapping;

  const defaultFile = () => done(null, `${settings.assets.endpoint}/${dist}${asset}`);

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

      return done(null, `${settings.assets.endpoint}/${dist}${data[asset]}`);
    });
  });
};

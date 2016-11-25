'use strict';

const fs = require('fs');

module.exports = function(server, asset, done) {
  const settings = this.options.assets || {};
  const dist = settings.dist || '';
  const mappingFile = settings.mappingFile;
  const endpoint = settings.endpoint || '';
  const realm = server.realm.plugins['hapi-nunjucks-helpers'];

  if (!settings.cache) {
    realm.assetMap = false;
  }

  const defaultFile = () => done(null, `${endpoint}/${dist}${asset}`);
  const mappedFile = () => {
    const data = realm.assetMap;

    if (!data) {
      return defaultFile();
    }

    return done(null, `${endpoint}/${dist}${data[asset]}`);
  };

  if (!mappingFile) {
    return defaultFile();
  }

  if (realm.assetMap) {
    return mappedFile();
  }

  fs.access(mappingFile, fs.constants.R_OK, err => {
    if (err) {
      server.log(['nunjucks-helpers', 'assets'], 'mapping file not found, skipping.');
      return defaultFile();
    }

    fs.readFile(mappingFile, (err2, data) => {
      if (err2) {
        server.log(['nunjucks-helpers', 'assets'], err2);
        realm.assetMap = false;
      } else {
        realm.assetMap = JSON.parse(data);
      }

      mappedFile();
    });
  });
};

'use strict';

const fs = require('fs');

module.exports = function(asset, version, done) {
  const server = this.server;
  const settings = this.options.assets || {};
  const dist = settings.dist || '';
  const mappingFile = settings.mappingFile;
  const endpoint = settings.endpoint || '';
  const realm = this.cache;
  if (!settings.cache) {
    realm.assetMap = false;
  }

  if (typeof version === 'function') {
    done = version;
    version = '';
  } else {
    version = `?v=${version}`;
  }

  const defaultFile = () => done(null, `${endpoint}/${dist}${asset}${version}`);
  const mappedFile = () => {
    const data = realm.assetMap;

    if (!data) {
      return defaultFile();
    }

    return done(null, `${endpoint}/${dist}${data[asset]}${version}`);
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

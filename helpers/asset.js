'use strict';

const path = require('path');

module.exports = (server, asset, done) => {
  const settings = server.settings.app;

  const dist = settings.assets.dist || '';

  try {
    const mapping = require(path.resolve(process.cwd(), settings.assets.path, 'assets.json'));
    return done(null, `${settings.assets.endpoint}/${dist}${mapping[asset]}`);
  } catch (e) {
    return done(null, `${settings.assets.endpoint}/${dist}${asset}`);
  }
};

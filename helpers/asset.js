'use strict';

const path = require('path');

module.exports = (server, asset, done) => {
  const settings = server.settings.app;

  try {
    const mapping = require(path.resolve(process.cwd(), settings.assets.path, 'assets.json'));
    return done(null, `${settings.assets.endpoint}/${mapping[asset]}`);
  } catch (e) {
    return done(null, `${settings.assets.endpoint}/${asset}`);
  }
};

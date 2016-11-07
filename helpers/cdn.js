'use strict';

const path = require('path');

module.exports = (server, asset, done) => {
  const settings = server.settings.app;

  const cdn = settings.assets.cdn || '';

  return done(null, `${settings.assets.cdn}/${asset}`);
};

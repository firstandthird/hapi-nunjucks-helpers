'use strict';

module.exports = (server, asset, done) => {
  const settings = server.settings.app;

  const cdn = settings.assets.cdn || '';

  return done(null, `${cdn}${asset}`);
};

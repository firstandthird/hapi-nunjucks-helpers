'use strict';

module.exports = (server, asset, done) => {
  const settings = this.options.assets || {};

  const cdn = settings.cdn || '';

  return done(null, `${cdn}${asset}`);
};

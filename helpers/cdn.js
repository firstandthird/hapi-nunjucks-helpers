'use strict';

module.exports = function(server, asset, done) {
  const settings = this.options.assets || {};

  const cdn = settings.cdn || '';

  return done(null, `${cdn}${asset}`);
};

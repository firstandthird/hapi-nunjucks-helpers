'use strict';

const cdn = require('./cdn');
const asset = require('./asset');

module.exports = function(str, done) {
  const assetUrl = asset.call(this, str, '');
  const url = cdn.call(this, assetUrl);

  return done(null, `<link rel="stylesheet" href="${url}">`);
};

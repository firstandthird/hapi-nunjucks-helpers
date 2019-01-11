'use strict';

const cdn = require('./cdn');
const asset = require('./asset');
const util = require('util');

module.exports = async function(str, done) {
  const assetUrl = await util.promisify(asset.bind(this))(str);
  const url = await util.promisify(cdn.bind(this))(assetUrl);

  return done(null, `<link rel="stylesheet" href="${url}">`);
};

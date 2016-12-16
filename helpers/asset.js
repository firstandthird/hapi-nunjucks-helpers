'use strict';
const AssetMap = require('clientkit-assets');

module.exports = function(server, asset, done) {
  const assetMap = new AssetMap(this.options.assets);
  assetMap.lookupAsset(asset, done);
};

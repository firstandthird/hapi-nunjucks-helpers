'use strict';

const cdn = require('./cdn');
const asset = require('./asset');
const util = require('util');

module.exports = async function(str, defer, done) {
  const settings = this.options.assets || {};
  const assetUrl = await util.promisify(asset.bind(this))(str);
  const url = await util.promisify(cdn.bind(this))(assetUrl);
  let template = `<script src="${url}"></script>`;

  if (typeof defer === 'function') {
    done = defer;
    defer = false;
  }

  if (settings.cdn) {
    template = template.replace('">', '" crossorigin="anonymous">');
  }

  if (defer) {
    template = template.replace('">', '" defer>');
  }

  return done(null, template);
};

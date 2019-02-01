'use strict';

const cdn = require('./cdn');
const asset = require('./asset');

module.exports = function(str, defer, done) {
  const settings = this.options.assets || {};
  const assetUrl = asset.call(this, str, '');
  const url = cdn.call(this, assetUrl);
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

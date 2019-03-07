'use strict';

module.exports = function(copy, cls, done) {
  if (typeof copy === 'string') {
    copy = [copy];
  }

  if (typeof cls === 'function') {
    done = cls;
    cls = '';
  }

  const out = Array.isArray(copy) ?
    copy.map((c) => `<p${cls ? ` class="${cls}"` : ''}>${c}</p>`).join('') :
    '';

  done(null, out);
};

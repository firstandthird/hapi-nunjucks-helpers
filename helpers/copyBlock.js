'use strict';

module.exports = function(server, copy, cls, done) {
  if (typeof copy === 'string') {
    copy = [copy];
  }
  if (typeof cls === 'function') {
    done = cls;
    cls = '';
  }
  const out = copy.map((c) => `<p ${cls ? `class="${cls}"` : ''}>${c}</p>`);
  done(null, out.join(''));
};

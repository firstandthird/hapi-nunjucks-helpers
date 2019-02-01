module.exports = function(url, done) {
  const useSecure = this.options.secureLinks;

  if (!useSecure) {
    return done(null, url);
  }

  // make sure url is set
  if (!url) {
    return done(null, '');
  }

  const output = url.replace(/^http:/, 'https:');

  done(null, output);
};

module.exports = function(url, done) {
  const useSecure = this.options.secureLinks;

  if (!useSecure) {
    return done(null, url);
  }

  const output = url.replace(/^http:/, 'https:');

  done(null, output);
};

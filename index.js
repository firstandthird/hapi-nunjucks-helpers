exports.register = (server, options, next) => {
  const cache = {};
  server.ext({
    type: 'onPostStart',
    method(serv, done) {
      if (!serv.root.realm.plugins.vision) {
        return done(new Error('Vision not loaded'));
      }

      const viewManager = serv.root.realm.plugins.vision.manager;
      const helpers = require('require-all')(`${__dirname}/helpers`);

      Object.keys(helpers).forEach(prop => {
        const fn = helpers[prop].bind({
          server: serv,
          options,
          cache
        });
        viewManager.registerHelper(prop, fn);
      });

      done();
    }
  });

  next();
};

exports.register.attributes = {
  pkg: require('./package.json')
};

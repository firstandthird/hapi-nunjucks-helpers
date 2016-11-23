exports.register = (server, options, next) => {
  server.ext({
    type: 'onPostStart',
    method(serv, done) {
      if (!serv.root.realm.plugins.vision) {
        return done(new Error('Vision not loaded'));
      }

      const viewManager = serv.root.realm.plugins.vision.manager;
      const helpers = require('require-all')(`${__dirname}/helpers`);

      Object.keys(helpers).forEach(prop => {
        viewManager.registerHelper(prop, (cb) => {
          cb.bind({
            server: serv,
            helper: helpers[prop],
            options
          })();
        });
      });

      done();
    }
  });

  next();
};

exports.register.attributes = {
  pkg: require('./package.json')
};

const register = function(server, options) {
  const cache = {};

  server.ext({
    type: 'onPostStart',
    method(serv) {
      if (!serv.realm.parent.plugins.vision) {
        throw new Error('Vision not loaded');
      }

      const viewManager = serv.realm.parent.plugins.vision.manager;
      const helpers = require('require-all')(`${__dirname}/helpers`);

      Object.keys(helpers).forEach(prop => {
        const fn = helpers[prop].bind({
          server: serv,
          options: Object.assign({}, options),
          cache
        });
        viewManager.registerHelper(prop, fn);
      });
    }
  });
};

exports.plugin = {
  once: true,
  pkg: require('./package.json'),
  register
};

'use strict';
const tap = require('tap');
const fs = require('fs');
const Hapi = require('hapi');

let server;
tap.beforeEach((done) => {
  server = new Hapi.Server();
  server.connection();

  server.register(require('vision'), (err) => {
    if (err) {
      return done(err);
    }
    server.views({
      engines: {
        njk: require('vision-nunjucks')
      },
      path: `${__dirname}/views`,
      compileMode: 'async'
    });
    server.route({
      path: '/{view}',
      method: 'get',
      handler(request, reply) {
        console.log('req');
        console.log(request.params.view);
        reply.view(request.params.view);
      }
    });
    done();
  });
});

tap.test('slugify', (test) => {
  server.register({
    register: require('../'),
    options: {
    }
  }, (err) => {
    test.equal(err, null);
    server.start((serverErr) => {
      test.equal(serverErr, null);
      server.inject({
        url: '/slugify'
      }, (res) => {
        test.equal(res.statusCode, 200);
        const expected = fs.readFileSync(`${__dirname}/expected/slugify.html`, 'utf8');
        test.equal(res.payload, expected);
        test.end();
      });
    });
  });
});

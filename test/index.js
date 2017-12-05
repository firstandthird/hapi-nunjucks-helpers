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

function end(test) {
  server.stop({ timeout: 250 }, test.end);
}

const tests = [
  { path: 'date', options: {} },
  { path: 'slugify', options: {} },
  { path: 'securify', options: { secureLinks: true } },
  { path: 'securify-disabled', options: {} }
];

tests.forEach(testCase => {
  tap.test(testCase, test => {
    server.register({
      register: require('../'),
      options: testCase.options
    }, (err) => {
      test.error(err);
      server.start((serverErr) => {
        test.error(serverErr);
        server.inject({
          url: `/${testCase.path}`
        }, (res) => {
          test.equal(res.statusCode, 200);
          const expected = fs.readFileSync(`${__dirname}/expected/${testCase.path}.html`, 'utf8');
          test.equal(res.payload, expected);
          end(test);
        });
      });
    });
  });
});

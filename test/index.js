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

tap.test('slugify', (test) => {
  server.register({
    register: require('../'),
    options: {
    }
  }, (err) => {
    test.error(err);
    server.start((serverErr) => {
      test.error(serverErr);
      server.inject({
        url: '/slugify'
      }, (res) => {
        test.equal(res.statusCode, 200);
        const expected = fs.readFileSync(`${__dirname}/expected/slugify.html`, 'utf8');
        test.equal(res.payload, expected);
        end(test);
      });
    });
  });
});

tap.test('securify', (test) => {
  server.register({
    register: require('../'),
    options: {
      secureLinks: true
    }
  }, (err) => {
    test.error(err);
    server.start((serverErr) => {
      test.error(serverErr);
      server.inject({
        url: '/securify'
      }, (res) => {
        test.equal(res.statusCode, 200);
        const expected = fs.readFileSync(`${__dirname}/expected/securify.html`, 'utf8');
        test.equal(res.payload, expected);
        end(test);
      });
    });
  });
});

tap.test('securify disabled', (test) => {
  server.register({
    register: require('../'),
    options: {
    }
  }, (err) => {
    test.error(err);
    server.start((serverErr) => {
      test.error(serverErr);
      server.inject({
        url: '/securify-disabled'
      }, (res) => {
        test.equal(res.statusCode, 200);
        const expected = fs.readFileSync(`${__dirname}/expected/securify-disabled.html`, 'utf8');
        test.equal(res.payload, expected);
        end(test);
      });
    });
  });
});

const fs = require('fs');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const code = require('code');
const hapi = require('hapi');
const hapiNunjucksHelpers = require('../index.js');
const visionNunjucksPlugin = require('vision-nunjucks');

let server;

lab.beforeEach(() => {
  visionNunjucksPlugin.clearEnvironment();
  server = new hapi.Server({ port: 8000 });
});

lab.afterEach(async () => {
  await server.stop();
});

lab.experiment('helpers', () => {
  lab.test('asset', async() => {
    await server.register(require('vision'));

    server.views({
      engines: {
        njk: require('vision-nunjucks')
      },
      path: `${__dirname}/views`,
      isCached: false,
      compileMode: 'async'
    });

    server.route({
      path: '/asset',
      method: 'get',
      handler(request, h) {
        return h.view('asset');
      }
    });

    await server.register(hapiNunjucksHelpers);

    await server.start();

    const res = await server.inject({
      url: '/asset'
    });

    const expected = fs.readFileSync(`${__dirname}/expected/asset.html`, 'utf8');

    code.expect(res.statusCode).to.equal(200);
    code.expect(res.payload).to.equal(expected);
  });

  lab.test('cdn', async() => {
    visionNunjucksPlugin.clearEnvironment();
    await server.register(require('vision'));

    server.views({
      engines: {
        njk: require('vision-nunjucks')
      },
      path: `${__dirname}/views`,
      isCached: false,
      compileMode: 'async'
    });

    server.route({
      path: '/cdn',
      method: 'get',
      handler(request, h) {
        return h.view('cdn');
      }
    });

    await server.register({
      plugin: hapiNunjucksHelpers,
      options: {
        assets: {
          cdn: 'http://localhost'
        }
      }
    });

    await server.start();

    const res = await server.inject({
      url: '/cdn'
    });

    const expected = fs.readFileSync(`${__dirname}/expected/cdn.html`, 'utf8');

    code.expect(res.statusCode).to.equal(200);
    code.expect(res.payload).to.equal(expected);
  });

  lab.test('copy-block', async() => {
    await server.register(require('vision'));

    server.views({
      engines: {
        njk: require('vision-nunjucks')
      },
      path: `${__dirname}/views`,
      isCached: false,
      compileMode: 'async'
    });

    server.route({
      path: '/copy-block',
      method: 'get',
      handler(request, h) {
        return h.view('copy-block', {
          paragraph: [
            'test1',
            'test2'
          ]
        });
      }
    });

    await server.register(hapiNunjucksHelpers);

    await server.start();

    const res = await server.inject({
      url: '/copy-block'
    });

    const expected = fs.readFileSync(`${__dirname}/expected/copy-block.html`, 'utf8');

    code.expect(res.statusCode).to.equal(200);
    code.expect(res.payload).to.equal(expected);
  });

  lab.test('date', async() => {
    await server.register(require('vision'));

    server.views({
      engines: {
        njk: require('vision-nunjucks')
      },
      path: `${__dirname}/views`,
      isCached: false,
      compileMode: 'async'
    });

    server.route({
      path: '/date',
      method: 'get',
      handler(request, h) {
        return h.view('date');
      }
    });

    await server.register(hapiNunjucksHelpers);

    await server.start();

    const res = await server.inject({
      url: '/date'
    });

    const expected = fs.readFileSync(`${__dirname}/expected/date.html`, 'utf8');

    code.expect(res.statusCode).to.equal(200);
    code.expect(res.payload).to.equal(expected);
  });

  lab.test('exclude', async() => {
    await server.register(require('vision'));

    server.views({
      engines: {
        njk: require('vision-nunjucks')
      },
      path: `${__dirname}/views`,
      isCached: false,
      compileMode: 'async'
    });

    server.route({
      path: '/exclude',
      method: 'get',
      handler(request, h) {
        return h.view('exclude', {
          items: [
            {
              name: 'test 1',
              slug: 'test1'
            },
            {
              name: 'test 2',
              slug: 'test2'
            },
            {
              name: 'test 3',
              slug: 'test3'
            }
          ],
          exclude: [
            {
              name: 'test 2',
              slug: 'test2'
            }
          ]
        });
      }
    });

    await server.register(hapiNunjucksHelpers);

    await server.start();

    const res = await server.inject({
      url: '/exclude'
    });

    const expected = fs.readFileSync(`${__dirname}/expected/exclude.html`, 'utf8');

    code.expect(res.statusCode).to.equal(200);
    code.expect(res.payload).to.equal(expected);
  });

  lab.test('inline', async() => {
    await server.register(require('vision'));

    server.views({
      engines: {
        njk: require('vision-nunjucks')
      },
      path: `${__dirname}/views`,
      isCached: false,
      compileMode: 'async'
    });

    server.route({
      path: '/inline',
      method: 'get',
      handler(request, h) {
        return h.view('inline');
      }
    });

    await server.register(hapiNunjucksHelpers);

    await server.start();

    const res = await server.inject({
      url: '/inline'
    });

    const expected = fs.readFileSync(`${__dirname}/expected/inline.html`, 'utf8');

    code.expect(res.statusCode).to.equal(200);
    code.expect(res.payload.trim()).to.equal(expected.trim());
  });

  lab.test('securify', async() => {
    visionNunjucksPlugin.clearEnvironment();
    await server.register(require('vision'));

    server.views({
      engines: {
        njk: require('vision-nunjucks')
      },
      path: `${__dirname}/views`,
      isCached: false,
      compileMode: 'async'
    });

    server.route({
      path: '/securify',
      method: 'get',
      handler(request, h) {
        return h.view('securify');
      }
    });

    await server.register({
      plugin: hapiNunjucksHelpers,
      options: {
        secureLinks: true
      }
    });

    await server.start();

    const res = await server.inject({
      url: '/securify'
    });

    const expected = fs.readFileSync(`${__dirname}/expected/securify.html`, 'utf8');

    code.expect(res.statusCode).to.equal(200);
    code.expect(res.payload).to.equal(expected);
  });

  lab.test('securify disabled', async() => {
    visionNunjucksPlugin.clearEnvironment();
    await server.register(require('vision'));

    server.views({
      engines: {
        njk: require('vision-nunjucks')
      },
      path: `${__dirname}/views`,
      isCached: false,
      compileMode: 'async'
    });

    server.route({
      path: '/securify-disabled',
      method: 'get',
      handler(request, h) {
        return h.view('securify-disabled');
      }
    });

    await server.register({
      plugin: hapiNunjucksHelpers,
      options: {
        secureLinks: false
      }
    });

    await server.start();

    const res = await server.inject({
      url: '/securify-disabled'
    });

    const expected = fs.readFileSync(`${__dirname}/expected/securify-disabled.html`, 'utf8');

    code.expect(res.statusCode).to.equal(200);
    code.expect(res.payload).to.equal(expected);
  });

  lab.test('slugify', async() => {
    await server.register(require('vision'));

    server.views({
      engines: {
        njk: require('vision-nunjucks')
      },
      path: `${__dirname}/views`,
      isCached: false,
      compileMode: 'async'
    });

    await server.register({
      plugin: hapiNunjucksHelpers,
      options: {
        secureLinks: false
      }
    });

    server.route({
      path: '/slugify',
      method: 'get',
      handler(request, h) {
        return h.view('slugify');
      }
    });

    await server.start();

    const res = await server.inject({
      url: '/slugify'
    });

    const expected = fs.readFileSync(`${__dirname}/expected/slugify.html`, 'utf8');

    code.expect(res.statusCode).to.equal(200);
    code.expect(res.payload).to.equal(expected);
  });

  lab.test('script', async() => {
    await server.register(require('vision'));

    server.views({
      engines: {
        njk: require('vision-nunjucks')
      },
      path: `${__dirname}/views`,
      isCached: false,
      compileMode: 'async'
    });

    server.route({
      path: '/script',
      method: 'get',
      handler(request, h) {
        return h.view('script');
      }
    });

    await server.register({
      plugin: hapiNunjucksHelpers,
      options: {
        assets: {
          cdn: 'http://localhost'
        }
      }
    });

    await server.start();

    const res = await server.inject({
      url: '/script'
    });

    const expected = fs.readFileSync(`${__dirname}/expected/script.html`, 'utf8');

    code.expect(res.statusCode).to.equal(200);
    code.expect(res.payload).to.equal(expected);
  });

  lab.test('style', async() => {
    await server.register(require('vision'));

    server.views({
      engines: {
        njk: require('vision-nunjucks')
      },
      path: `${__dirname}/views`,
      isCached: false,
      compileMode: 'async'
    });

    server.route({
      path: '/style',
      method: 'get',
      handler(request, h) {
        return h.view('style');
      }
    });

    await server.register({
      plugin: hapiNunjucksHelpers,
      options: {
        assets: {
          cdn: 'http://localhost'
        }
      }
    });

    await server.start();

    const res = await server.inject({
      url: '/style'
    });

    const expected = fs.readFileSync(`${__dirname}/expected/style.html`, 'utf8');

    code.expect(res.statusCode).to.equal(200);
    code.expect(res.payload).to.equal(expected);
  });
});

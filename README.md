# hapi-nunjucks-helpers

A library of useful [nunjucks](https://mozilla.github.io/nunjucks/) helpers and filters, with a wrapper for use with [hapi](https://hapi.dev/)

## Installation

```
npm install hapi-nunjucks-helpers
```

## Usage

hapi-nunjucks-helpers is designed to work with [vision](https://github.com/hapijs/vision) and
[vision-nunjucks](https://github.com/firstandthird/vision-nunjucks), you just need to make sure to tell nunjucks to compile the helpers in 'async' mode:

```js
await server.register(require('vision'));

server.views({
  engines: {
    njk: require('vision-nunjucks')
  },
  path: '/views',
  isCached: false,
  compileMode: 'async'
});

await server.register(require('hapi-nunjucks-helpers'));
```

Is all you need to do, all of the following helpers will then be available for use in your views:

## Asset Helper

  When you register the plugin you can pass options to configure how your assets filter will work:

```js
await server.register({
  plugin: require('hapi-nunjucks-helpers'),
  options: {
    assets: {
      endpoint: 'http://localhost:8080/',
      cdn: 'http://localhost',
      mappingFile: 'assets-map.json'
    }
  }
});
```
  These options are as follows:

  - `endpoint` The base asset directory, default is none.

  - `dist` The root directory under _endpoint_ where compiled asset files reside, so `assets` will look for compiled asset files in the directory specified by _${endpoint}/${dist}_. Default is none.

  - `mappingFile` A JSON file containing the map of source files to their corresponding hashed assets, this file should look like:
    ```JS
    {
      "common.js": "common.0d5714f897be66e21c18.js",
      "common.css": "common.f7f029f8ee35aec7a7f6.css",
      "script.js": "script.68e5e334aa4dcb31eece.js"
      ...
    }
    ```
  - `cdn` - Optional CDN domain for assets. Default: none.
  - `cache` - If `true`, caches contents of `mappingFile`. Default: `false` (you will generally want to leave cacheing off during development)

## Filters:

**asset**

Reads from the mapping file if available:

```html
<script src="{{ 'common.js' | asset }}"></script>
```

Also possible to pass a version to force new fetch from cache:

```html
<script src="{{ 'common.js' | asset(2) }}"></script>
<!-- /common.js?v=2 ?>
```



**cdn**

Prefixes asset with cdn path taken from the `assets.cdn` property:

```html
<img src="{{ 'logos/logo.png' | cdn }}">
```

With css/js

```html
<script src="{{ 'common.js' | asset | cdn }}"></script>
```

**copyBlock**

Will transform an array of text items into paragraph blocks, and optionally insert a css _class_ for the paragraphs:

If you have a context like:

```js
{ paragraphs: ['hello world', 'goodbye world'] }
```

and a view like:

```
{{ paragraph | copyBlock | safe }}
{{ paragraph | copyBlock('bold') | safe }}
```

This will result in:

```html
<p>hello world</p><p>goodbye world</p>
<p class="bold">hello world</p><p class="bold">goodbye world</p>
```

**date**

Formats a date-string with momentjs

```html
From Now: {{ new Date | date }}
Format String: {{ new Date | date("YYYY MM DD") }}
```

**exclude**

Allows you to filter items from an array based on whether they match a particular field or not.

If you have a context like:
```js
{
  items: [
    { name: 'mango', type: 'fruit' },
    { name: 'peach', type: 'fruit' },
    { name: 'lettuce', type: 'vegetable' }
    { name: 'pineapple', type: 'fruit' },
    { name: 'cucumber', type: 'vegetable' }
  ],
  exclude: [
    { type: 'vegetable' }
  ]
}
```

then you can call the exclude filter like this:
```
{% for entry in items | exclude(exclude, 'type') %}{{ entry.name }}{% endfor %}
```

and it will print out: ```mangopeachpineapple```.

**inline**

Takes a file and spits out the contents, very useful for when you want to have inline JS and CSS:

```html
<script>{{ 'common.js' | inline }}</script>
```

**securify**

If the plugin was registered with the `secureLinks: true` option, this will replace 'http' with 'https' in your embedded links, otherwise it will do nothing.  Useful for testing local links in a development environment.

```js
await server.register({
  plugin: require('hapi-nunjucks-helpers'),
  options: {
    secureLinks: true
  }
});
```

will cause:
```
{{ 'http://myhost.com' | securify }}
{{ 'http://myotherhost.com' | securify }}
```

to be rendered as:

```
https://myhost.com
https://myotherhost.com
```

**slugify**

Slugifies a string.  All chars are made lowercase, all spaces replaced with `-`, funny symbols are removed and the string is trimmed:

```
{{ '  hello@@  WORLD-!' | slugify }}
```

will render as `hello-world`

**script**

Renders script tags using the `cdn` value, you can also ask it to 'defer' loading the script:

```js
await server.register({
  plugin: require('hapi-nunjucks-helpers'),
  options: {
    assets: {
      cdn: 'http://localhost'
    }
  }
});
```

and

```
{{ 'test.js' | script | safe }}
{{ 'test2.js' | script(true) | safe }}
```

results in:
```html
<script src="http://localhost/test.js" crossorigin="anonymous"></script>
<script src="http://localhost/test2.js" crossorigin="anonymous" defer></script>
```


**style**

Just like `script`, except renders style tags:

```{{ 'test.css' | style }}```

will output:

```html
<link rel="stylesheet" href="http://localhost/test.css">
```

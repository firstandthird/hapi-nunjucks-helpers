# hapi-nunjucks-helpers
Helpers for hapi-nunjucks

### Usage

Use as you would a normal hapijs plugin.

### Options

 - `assets`
    - `dist` - Directories files are built to. Default: none.
    - `mappingFile` - File output by clientkit to map hashed assets.
    - `endpoint` - Base directory for assets. Default: none.
    - `cdn` - Optional domain for assets. Default: none.
    - `cache` - If `true`, caches contents of `mappingFile`. Default: `false`

### Filters:

**asset**

Reads from clientkit generated mapping file if available.

```html
<script src="{{ 'common.js' | asset }}"></script>
```

Also possible to pass a version to force new fetch from cache:

```html
<script src="{{ 'common.js' | asset(2) }}"></script>
<!-- /common.js?v=2 ?>
```

**cdn**

Prefixes asset with cdn path from `assets.cdn` property.

```html
<img src="{{ 'logos/logo.png' | cdn }}">
```

With css/js

```html
<script src="{{ 'common.js' | asset | cdn }}"></script>
```

**date**

Formats a date-string with momentjs

```html
From Now: {{ new Date | date }}
Format String: {{ new Date | date("YYYY MM DD") }}
```

**inline**

Takes a file and spits out the contents.

```html
<script>{{ 'common.js' | inline }}</script>
```

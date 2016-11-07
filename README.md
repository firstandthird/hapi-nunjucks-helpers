# clientkit-helpers
Helpers for clientkit

### Filters:

**asset**

Reads from clientkit generated mapping file if available.

```html
<script src="{{ 'common.js' | asset }}"></script>
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

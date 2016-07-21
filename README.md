## JSONDiffViewer

Library that generates structured HTML using [jsondiffpatcher](https://github.com/benjamine/jsondiffpatch) and output HTML that looks concise for viewing diffs.

![Screenshot](/resources/img/diff_basic.PNG?raw=true "Screenshot of Basic Diff Example")


#### Installation
using NPM:
```sh
npm install jsondiff-viewer --save
```

using Bower:
```sh
bower install jsondiff-viewer --save
```

#### Usage

```js
var left = {
  no_change: 10,
  value_change: 10,
  value_delete: 10,
  object_change: {
    value_change: 15
  },
  array_change: [{
    value_change: 15,
    _id: 'array_idx_1'
  }, {
    value_delete: 15,
    _id: 'array_idx_2'
  }, {
    _id: 'array_idx_2'
  }]
};

var right = {
  no_change: 10,
  value_change: 15,
  value_add: 20,
  object_change: {
    value_change: 20
  },
  array_change: [{
    value_change: 20,
    _id: 'array_idx_1'
  }, {
    _id: 'array_idx_2'
  }, {
    value_add: 15,
    _id: 'array_idx_2'
  }]
};

var html = window.JSONDiffViewer(left, right); // Defaults to Black Background - i.e. White font text
```

#### Options

You can supply options as:

```
var html = window.JSONDiffViewer(left, right, options);
```

* options.tab - int - Optional
  Tab spacing to be used per nesting. Defaults to `10`.

* options.light - boolean - Optional
  Print out HTML for Light Backgrounds (White background). Defaults to `false`

#### Developing
```bash
npm install
bower install

use http-server or equivalent for checking out the diffs in playground/ folder
```

#### Examples

![ScreenshotLarger](/resources/img/diff_complex.PNG?raw=true "Screenshot of Complex Diff Example")
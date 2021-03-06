# coffeekraken-import-glob
ES6 import with glob patterns (preloader for Webpack)

Expands globbing patterns for ES6 `import` statements.

---
```js
import modules from "./foo/**/*.js";
```
Expands into
```js
import * as module0 from "./foo/1.js";
import * as module1 from "./foo/bar/2.js";
import * as module2 from "./foo/bar/3.js";

modules = [module0, module1, module2]
```
---
__For side effects:__

```js
import "./foo/**/*.js";
```
Expands into
```js
import "./foo/1";
import "./foo/bar/2";
```
---
__With require:__

```js
require("./foo/**/*.js");
```
Expands into
```js
require("./foo/1");
require("./foo/bar/2");
```
---
__For sass:__

```scss
@import "./foo/**/*.scss";
```
Expands into
```scss
@import "./foo/1.scss";
@import "./foo/bar/2.scss";
```

---

## Install
```sh
npm install coffeekraken-import-glob --save-dev
```

## Usage
You can use it one of two ways, the recommended way is to use it as a preloader

```js
{
  module: {
    rules: [{
      test: /\.js/,
      enforce: 'pre',
      loader: 'coffeekraken-import-glob'
    }, {
      test: /\.scss/,
      enforce: 'pre',
      loader: 'coffeekraken-import-glob'
    }]
  }
}
```

Alternatively you can use it as a chained loader
```js
require('!coffeekraken-import-glob!foo/bar.js')
```
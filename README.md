# chainable.js
> Functional Property Sequences

[![npm version](https://badge.fury.io/js/chainable.js.svg)](https://badge.fury.io/js/chainable.js)

## Table of Contents

* [Quick Start](#quick-start)
* [Usage](#usage)
* [Installation](#installation)

## Quick Start
```js
const chainable = require("chainable.js");

let MyMath = chainable({
  add (a, b) { return a + (b || 1); },
  pow (a, b) { return Math.pow(a, (b || 2)); }
  sum (...args) { return args.reduce((a, b) => a + b, 0); }
});

let eq = MyMath.add(2).add.pow.pow(3).sum(1,2,3);

eq.value(1) === 4102; // true
eq.value(2) === 15631; // true
```

## Usage
``` js

```

[↑ Back to top](#table-of-contents)

## Installation
```bash
npm install --save chainable.js
```

# chainable.js
> Functional Property Sequences

[![npm version](https://badge.fury.io/js/chainable.js.svg)](https://badge.fury.io/js/chainable.js)

# NOT READY FOR USE YET! - Please check back soon

## Table of Contents

* [Quick Start](#quick-start)
* [Installation](#installation)

## Quick Start
```js
const MyChain = require("chainable.js")();

MyChain.register({
  multiply (value, multiplicand) { return value * (multiplicand || 2); }, // Default 2
  add (...args) { return args.reduce((a, b) => a + b, 0); },
  minusOne (value) { return value - 1; }
  say (value, prefix, suffix) { return (prefix || "") + value + (suffix || ""); }
});

var functionChain = MyChain.multiply(3).add(1,2,3,4).minusOne().say("hello ", "!");
var propertyChain = MyChain.multiply.add.minusOne.say;
var mixedChain = MyChain.multiply.add(2,3).minusOne.say("foo "," bar");

functionChain.value(1) === "hello 12!";
propertyChain.value(2) === "3";
mixedChain.value(3) === "foo 10 bar";

functionChain.definition(); 
// [
//   {name: "multiply", arguments: [3], parameters: {multiplicand: 3}}
//   {name: "add", arguments: [1,2,3,4], parameters: {}}
//   {name: "minusOne", arguments: [], parameters: {}}
//   {name: "say", arguments: ["hello", "!"], parameters: {prefix: "hello", suffix: "!"}}
// ]

functionChain.serialize() === "multiply(3).add(1,2,3,4).minusOne.say(\"hello \", \"!\")";

functionChain.value(1) === MyChain(functionChain.serialize()).value(1);

functionChain instanceOf MyChain === true;
```

[↑ Back to top](#table-of-contents)

## Installation
```bash
npm install --save chainable.js
```

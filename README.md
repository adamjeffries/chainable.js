# chainable.js
> Functional Property Sequences

[![npm version](https://badge.fury.io/js/chainable.js.svg)](https://badge.fury.io/js/chainable.js)

## Table of Contents

* [Quick Start](#quick-start)
* [Usage](#usage)
* [API](#api)
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

What sets Chainable.js apart from the rest?   The ability to `chain registered methods as properties or functions`.   Every chained method is always given the value as the first argument.   However, additional arguments can be supplied if called as a function.   Chainable.js is primarily used to construct libraries.   Example usages may include a chainable Math library, method schemas, svg creator, or query selector.

[↑ Back to top](#table-of-contents)

## API


### Chain Class
Setup a new Chain Class by executing chainable as a function.

``` js
const chainable = require("chainable.js");

let MyChain = chainable();
```

### Constructor()
A Chain Class can be instantiated in 4 ways:

``` js
// 1. Using "new"
new MyChain() instanceOf MyChain; // true

// 2. As a function (redirects to "new")
MyChain() instanceOf MyChain; // true

// 3. Via a registered method as a property
MyChain.someMethod instanceOf MyChain; // true

// 4. Via a registered method as a function
MyChain.someMethod() instanceOf MyChain; // true
```

### .register()
Register is static and adds new methods to a newly constructed Chain Class.

``` js
// Basic Format
MyChain.register("<name>", function (value) {
  return "modified value"; // or Throw
});

// Example
MyChain.register("add", function (a, b) {
  return a + b;
});

// Use the 
MyChain.add(2).value(3) === 5;

// Register multiple (as an object)
MyChain.register({
  multiply (a, b) { return a * b; },
  divide (a, b) { return a / b; }
});
```

> Note: Registered methods will only be available to instances created after they are defined.

### .registeredMethod
Registered methods can be accessed as properties or functions.   They always return the instance for further chaining.

``` js
MyChain.register("add", function (a, b, c) {
  if (arguments.length < 2) c = 3;
  if (arguments.length < 1) b = 2;
  return a + b + b;
});

MyChain.add.value(1); // 6
MyChain.add(1).value(1); // 5
MyChain.add(1, 2).value(1); // 4

MyChain.add.add.add.value(1); // 16
MyChain.add(3).add.add(4, 5).value(2); // 22
```

### .value()
Primary method to pass in a starting value, execute the chain, and return the result.

``` js
var chain = MyChain.someMethodA.someMethodB().someMethodC.someMethodD();

chain.value(someValue); // Returns newValue
```

### .definition()
Quantifies the definition of the chain.  Using "reflection"-ish, it can read the registered methods parameter names (excluding the first - which is provided at a later time using .value method).

``` js
MyChain.register("fancy", function (value, foo, bar) { return value + foo + bar; });

let chain = MyChain.fancy("Seattle", "WA").fancy.fancy("Chicago");

chain.definition();
// Returns:
// [
//   {name: "fancy", args: ["Seattle, "WA"], params: ["foo", "bar"], values: {foo: "Seattle", bar: "WA"}},
//   {name: "fancy", args: [], params: ["foo", "bar"], values: {}},
//   {name: "fancy", args: ["Chicago"], params: ["foo", "bar"], values: {foo: "Chicago"}},
// ]
```

### .serialize()
Any JSON "stringify"-able arguments can be serialized.

``` js
let chain = MyChain.fancy("Seattle",[1,2],true).fancy.fancy({a:1,b:["two"]});

chain.serialize() == "fancy(\"Seattle\",[1,2],true).fancy.fancy({a:1,b:[\"two\"]})";

// Deserialize by passing the string into the constructor
let chain2 = new MyChain(chain.serialize());

chain.value(anything) === chain2.value(anything);
```


[↑ Back to top](#table-of-contents)

## Installation
```bash
npm install --save chainable.js
```

[↑ Back to top](#table-of-contents)

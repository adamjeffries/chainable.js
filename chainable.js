"use strict";

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.returnExports = factory();
  }
}(this, function () {

  let setPrototypeOf = Object.setPrototypeOf || ({__proto__:[]} instanceof Array ? function (obj, proto) {
      obj.__proto__ = proto;
    } : function (obj, proto) {
      Object.keys(proto).forEach(name => obj[name] = proto[name]);
    });

  let getParameters = function (fn) {
    let params = fn.toString().match(/.*?\(([^)]*)\)/)[1];
    return params.split(",").map(o => o.replace(/\/\*.*\*\//, "").trim()).filter(o => o);
  };

  return function (initRegister) {

    var Chainable = function (serialized) {
      if (!(this instanceof Chainable)) return new Chainable(serialized);

      let fn = function () {
        if (fn._chain.length) fn._chain[fn._chain.length - 1][1] = Array.prototype.slice.call(arguments);
        return fn;
      };

      Object.assign(fn, {_chain: [], _context: {}}); // Shared context between the functions (contains the last value)
      setPrototypeOf(fn, Chainable.prototype);

      // Deserialize
      if (serialized && typeof serialized === "string") {
        let deserializeRegex = /(^(\w*)|\.(\w*))(?:\((.*?)\))*/g;
        let match;
        while (match = deserializeRegex.exec(serialized)) {
          let name = match[2] || match[3];
          let argString = "[" + (match[4] || "") + "]";

          if (!(name in Chainable.prototype)) throw "Missing method: " + name;
          fn[name]; // The getter will add the function to the chain
          try {
            fn._chain[fn._chain.length - 1][1] = JSON.parse(argString);
          } catch (e) {
            throw "Unable to deserialize arguments: " + argString;
          }
        }
      }

      return fn;
    };

    Chainable.prototype = {

      serialize () {
        return this._chain.map(c => {
          let str = c[0];
          if (c[1] && c[1].length) {
            str += "(" + c[1].map((v, i) => {
              try {
                return JSON.stringify(v);
              } catch (e) {
                throw "Unable to serialize argument " + (i + 1) + " of " + c[0];
              }
            }).join(",") + ")";
          }
          return str;
        }).join(".");
      },

      definition () {
        return this._chain.map(c => {

          let name = c[0];
          let args = c[1] || [];
          let params = Chainable._registrations[name].params;
          let values = {};

          if (args.length && params.length) {
            args.forEach((value, index) => {
              if (index < params.length) values[params[index]] = value;
            });
          }

          return {name, args, params, values};
        })
      },

      value (value) {
        this._context.value = value;
        this._chain.forEach(c => {
          this._context.value = Chainable._registrations[c[0]].fn.apply(this._context, [this._context.value].concat(c[1]));
        });
        return this._context.value;
      }

    };

    Chainable._registrations = {};

    Chainable.register = function (name, fn, params) { // Parameters excluding the first (value)

      if (name && typeof name === "string" && fn instanceof Function) {

        // Store the registration
        params = Object.prototype.toString.call(params) === "[object Array]" ? params : getParameters(fn).slice(1);
        Chainable._registrations[name] = {name, fn, params};

        // Instance Accessor
        Object.defineProperty(Chainable.prototype, name, {
          get () {
            this._chain.push([name]);
            return this;
          }
        });

        // Static Accessor
        Object.defineProperty(Chainable, name, { get: () => Chainable()[name]});

      } else if (arguments.length === 1 && typeof name === "object") {
        Object.keys(name).forEach(n => Chainable.register(n, name[n]));

      } else {
        throw "Unrecognized register format";
      }

      return Chainable;
    };

    if (initRegister) Chainable.register(initRegister);

    return Chainable;
  };
}));

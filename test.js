"use strict";

const expect = require("expect.js"),
  chainable = require("./chainable.js");



describe("Chainable", function() {

  let C1, C2;

  before(function () {
    C1 = chainable({
      add (value, addend) { return value + (addend || 1); },
      sum () { return Array.prototype.slice.call(arguments).reduce((a, b) => a + b, 0); },
      print (value, prefix, suffix) { return (prefix || "") + value + (suffix || ""); }
    });

    C2 = chainable({
      hello (value, planet) { return "hello " + value + " from " + planet; }
    });
  });

  it("Can create independent chain constructors", function () {
    expect(C1.register).to.be.a("function");
    expect(C2.register).to.be.a("function");

    expect(C1.add).to.be.a("function");
    expect(C2.add).to.not.be.ok();

    expect(C1.hello).to.not.be.ok();
    expect(C2.hello).to.be.a("function");

    expect(C1).to.not.be(C2);
    expect(C1.register).to.not.be(C2.register);
  });

  it("Should be an instance", function () {
    expect(C1.add instanceof C1).to.be.ok();
    expect(C1.add() instanceof C1).to.be.ok();
    expect(C1.add.add instanceof C1).to.be.ok();
    expect(C1.add.add() instanceof C1).to.be.ok();
    expect(C1.add().add instanceof C1).to.be.ok();
    expect(C1.add().add() instanceof C1).to.be.ok();

    expect(C2.hello instanceof C1).to.not.be.ok();
    expect(C2.hello() instanceof C1).to.not.be.ok();
  });

  it("Can register function definitions", function () {

    C1.register("subtract", function (value, subtrahend) {
      return value - (subtrahend || 1);
    });

    expect(C1.subtract.value(1)).to.be(0);
    expect(C1.subtract(2).value(1)).to.be(-1);
  });

  it("Can register object definitions", function () {

    C1.register({
      divide (value, divisor) {
        return value / divisor;
      },
      multiply (value, multiplicand) {
        return value * multiplicand;
      }
    });

    expect(C1.divide(2).multiply(3).value(4)).to.be(6);
    expect(C1.multiply(2).divide(3).value(6)).to.be(4);
  });

  it("Can get definitions", function () {

    let def = C1.add.multiply(2).print("hello", "!").definition();

    expect(def).to.have.length(3);

    expect(def[0].name).to.be("add");
    expect(def[0].args.length).to.be(0);
    expect(def[0].params.length).to.be(1);
    expect(def[0].values).to.eql({});

    expect(def[1].name).to.be("multiply");
    expect(def[1].args.length).to.be(1);
    expect(def[1].params.length).to.be(1);
    expect(def[1].values).to.eql({multiplicand: 2});

    expect(def[2].name).to.be("print");
    expect(def[2].args.length).to.be(2);
    expect(def[2].params.length).to.be(2);
    expect(def[2].values).to.eql({prefix: "hello", suffix: "!"});
  });

  it("Can serialize", function () {
    let def = C1.add.add([1, true, "a", {a: 1, b: true, c: "b"}]).multiply(2).print("hello", "!").serialize();

    expect(def).to.be('add.add([1,true,"a",{"a":1,"b":true,"c":"b"}]).multiply(2).print("hello","!")');
    expect(function () {
      var a = {}; a.a = a; // Create a circular dependency
      C1.add.add(1,2,a).serialize();
    }).to.throwError(/Unable to serialize argument 3 of add/);
  });

  it("Can deserialize", function () {
    let c1 = C1.add.multiply(2).print("hello", "!");
    let c2 = C1(c1.serialize());

    expect(c1.value(3)).to.be(c2.value(3));
  });

});
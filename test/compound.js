"use strict";

var CompoundSelector = require("../lib/object-select.js").CompoundSelector;

exports.simpleSelector = {
    /*"test": function(test) {
        var selector;

        selector = new CompoundSelector(":not(:matches(.test, .test2))");
        test.deepEqual(selector.find({
            "test": "abc",
            "test2": "abcd",
            "test3": "def"
        }), ["def"]);

        selector = new CompoundSelector("string:matches(.test, .test2)");
        test.deepEqual(selector.find({
            "test": "abc",
            "test2": "abcd",
            "test3": "def"
        }), ["abc", "abcd"]);

        selector = new CompoundSelector("string:not(.test, .test2)");
        test.deepEqual(selector.find({
            "test": "abc",
            "test2": "abcd",
            "test3": "def"
        }), ["def"]);

        selector = new CompoundSelector(":has(.test)");
        test.ok(selector.matches({
            "test": "whatever"
        }));

        test.done();
    },*/
    "pseudoElementCalc": function(test) {
        var selector = new CompoundSelector(".abc::calc(n*10):val(120)");

        test.ok(selector.matches(12, {
            "abc": 12
        }));
    }
};

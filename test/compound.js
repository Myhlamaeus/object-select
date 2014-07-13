"use strict";

var CompoundSelector = require("../lib/selectors/compound.js");

exports.simpleSelector = {
    "test": function(test) {
        test.doesNotThrow(function() {
            var selector = new CompoundSelector("string:matches(#test, #test2)");

            test.deepEqual(selector.find({
                "test": "abc",
                "test2": "abcd",
                "test3": "def"
            }), ["abc", "abcd"]);

            selector = new CompoundSelector("string:not(#test, #test2)");
            test.deepEqual(selector.find({
                "test": "abc",
                "test2": "abcd",
                "test3": "def"
            }), ["def"]);

            selector = new CompoundSelector(":has(#test)");
            test.ok(selector.matches({
                "test": "whatever"
            }));

            test.done();
        });
    }
};

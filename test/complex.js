"use strict";

var ComplexSelector = require("../lib/selectors/complex.js");

exports.simpleSelector = {
    "test": function(test) {
        var obj = {
                "test": {
                    "test2": ["abc"],
                    "test3": ["def"]
                }
            },
            selector;

        selector = new ComplexSelector("#test :matches(#test2, #test3)");
        test.deepEqual(selector.find({
            "test": {
                "test2": "abc",
                "test3": "def"
            }
        }), ["abc", "def"]);

        test.ok(selector.matches(obj));

        delete obj.test.test2;
        test.ok(selector.matches(obj));

        delete obj.test.test3;
        test.ok(!selector.matches(obj));

        test.done();
    }
};

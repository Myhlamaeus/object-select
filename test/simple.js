"use strict";

var SimpleSelector = require("../lib/json-select.js").SimpleSelector;

/*
    ======== A Handy Little Nodeunit Reference ========
    https://github.com/caolan/nodeunit

    Test methods:
        test.expect(numAssertions)
        test.done()
    Test assertions:
        test.ok(value, [message])
        test.equal(actual, expected, [message])
        test.notEqual(actual, expected, [message])
        test.deepEqual(actual, expected, [message])
        test.notDeepEqual(actual, expected, [message])
        test.strictEqual(actual, expected, [message])
        test.notStrictEqual(actual, expected, [message])
        test.throws(block, [error], [message])
        test.doesNotThrow(block, [error], [message])
        test.ifError(value)
*/

var typeTests = {
        "string": "42",
        "number": 42,
        "object": {
            "val": 42
        },
        "array": ["42"],
        "boolean": true,
        "undefined": undefined
    },
    types = Object.getOwnPropertyNames(typeTests),
    typeTestFactory = function(type, onlyIfSameType) {
        if(onlyIfSameType === undefined) {
            onlyIfSameType = true;
        }

        return function(test) {
            test.expect(types.length + 1);
            test.doesNotThrow(function() {
                var selector = new SimpleSelector(type);

                types.forEach(function(ele) {
                    test.ok((onlyIfSameType && ele !== type) ^ selector.matches(typeTests[ele], typeTests));
                });
            });

            test.done();
        };
    };

exports.simpleSelector = {
    "pseudoClassRoot": function(test) {
        var selector = new SimpleSelector(":root"),
            parent = false;

        test.ok(selector.matches({
            "test": "whatever"
        }, parent));

        parent = [{
            "test": "whatever"
        }];
        test.ok(!selector.matches(parent[0], parent));

        parent = {
            "notRoot": {
                "test": "whatever"
            }
        };
        test.ok(!selector.matches(parent.notRoot, parent));

        test.done();
    },
    "pseudoClassFirstChild": function(test) {
        var selector = new SimpleSelector(":first-child"),
            parent = ["i", 42, ["test"]];

        test.ok(selector.matches(parent[0], parent));
        test.ok(!selector.matches(parent[1], parent));
        test.ok(!selector.matches(parent[2], parent));

        parent = {
            "i": "am",
            "a": 42,
            0: false,
            1: false,
            "length": 2,
            "result": false
        };

        test.ok(!selector.matches(parent.i, parent));
        test.ok(!selector.matches(parent[0], parent));
        test.ok(!selector.matches(parent[1], parent));
        test.ok(!selector.matches(parent.result, parent));

        test.done();
    },
    "pseudoClassLastChild": function(test) {
        var selector = new SimpleSelector(":last-child"),
            parent = ["i", 42, ["test"]];

        test.ok(!selector.matches(parent[0], parent));
        test.ok(!selector.matches(parent[1], parent));
        test.ok(selector.matches(parent[2], parent));

        parent = {
            "i": "am",
            "a": 42,
            0: false,
            1: false,
            "length": 2,
            "result": false
        };

        test.ok(!selector.matches(parent.i, parent));
        test.ok(!selector.matches(parent[0], parent));
        test.ok(!selector.matches(parent[1], parent));
        test.ok(!selector.matches(parent.result, parent));

        test.done();
    },
    "pseudoClassOnlyChild": function(test) {
        var selector = new SimpleSelector(":only-child"),
            parent = [true];

        test.ok(selector.matches(parent[0], parent));

        parent = [true, false];
        test.ok(!selector.matches(parent[0], parent));
        test.ok(!selector.matches(parent[1], parent));

        parent = {
            "test": true
        };
        test.ok(selector.matches(parent.test, parent));

        parent = {
            "test": true,
            "another": false
        };
        test.ok(!selector.matches(parent.test, parent));
        test.ok(!selector.matches(parent.another, parent));

        test.done();
    },
    "pseudoClassNthChild": function(test) {
        var selector = new SimpleSelector(":nth-child(2)"),
            parent = ["i", 42, ["test"], "42", true, false, {}, undefined];

        test.ok(!selector.matches(parent[0], parent));
        test.ok(selector.matches(parent[1], parent));
        test.ok(!selector.matches(parent[2], parent));

        selector = new SimpleSelector(":nth-child(odd)");
        test.ok(selector.matches(parent[0], parent));
        test.ok(!selector.matches(parent[1], parent));
        test.ok(selector.matches(parent[2], parent));
        test.ok(!selector.matches(parent[3], parent));

        selector = new SimpleSelector(":nth-child(even)");
        test.ok(!selector.matches(parent[0], parent));
        test.ok(selector.matches(parent[1], parent));
        test.ok(!selector.matches(parent[2], parent));
        test.ok(selector.matches(parent[3], parent));

        selector = new SimpleSelector(":nth-child(3n)");
        test.ok(!selector.matches(parent[0], parent));
        test.ok(!selector.matches(parent[1], parent));
        test.ok(selector.matches(parent[2], parent));
        test.ok(!selector.matches(parent[3], parent));
        test.ok(!selector.matches(parent[4], parent));
        test.ok(selector.matches(parent[5], parent));
        test.ok(!selector.matches(parent[6], parent));

        selector = new SimpleSelector(":nth-child(3n+1)");
        test.ok(selector.matches(parent[0], parent));
        test.ok(!selector.matches(parent[1], parent));
        test.ok(!selector.matches(parent[2], parent));
        test.ok(selector.matches(parent[3], parent));
        test.ok(!selector.matches(parent[4], parent));
        test.ok(!selector.matches(parent[5], parent));
        test.ok(selector.matches(parent[6], parent));

        selector = new SimpleSelector(":nth-child(3n-1)");
        test.ok(!selector.matches(parent[0], parent));
        test.ok(selector.matches(parent[1], parent));
        test.ok(!selector.matches(parent[2], parent));
        test.ok(!selector.matches(parent[3], parent));
        test.ok(selector.matches(parent[4], parent));
        test.ok(!selector.matches(parent[5], parent));
        test.ok(!selector.matches(parent[6], parent));

        test.throws(function() {
            var selector = new SimpleSelector(":nth-child(even)"),
                parent = {
                    "i": "am",
                    "a": 42,
                    0: false,
                    1: false,
                    "length": 2,
                    "result": false
                };

            test.ok(!selector.matches(parent.i, parent));
            test.ok(!selector.matches(parent[0], parent));
            test.ok(!selector.matches(parent[1], parent));
            test.ok(!selector.matches(parent.result, parent));
        });

        test.done();
    },
    "pseudoClassNthLastChild": function(test) {
        var selector = new SimpleSelector(":only-child"),
            parent = [true];

        test.ok(selector.matches(parent[0], parent));

        parent = [true, false];
        test.ok(!selector.matches(parent[0], parent));
        test.ok(!selector.matches(parent[1], parent));

        parent = {
            "test": true
        };
        test.ok(selector.matches(parent.test, parent));

        parent = {
            "test": true,
            "another": false
        };
        test.ok(!selector.matches(parent.test, parent));
        test.ok(!selector.matches(parent.another, parent));

        test.done();
    },
    "pseudoClassEmpty": function(test) {
        var selector = new SimpleSelector(":empty"),
            ele = [];

        test.ok(selector.matches(ele));

        ele = {};
        test.ok(selector.matches(ele));

        ele = [true];
        test.ok(!selector.matches(ele));

        ele = {
            "test": {}
        };
        test.ok(!selector.matches(ele));

        test.done();
    }
};

types.forEach(function(type) {
    exports.simpleSelector["type" + type.charAt(0).toUpperCase() + type.substr(1)] = typeTestFactory(type);
});
exports.simpleSelector["asteriskTypeTests"] = typeTestFactory("*", false);

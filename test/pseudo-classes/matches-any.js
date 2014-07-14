"use strict";

var SimpleSelector = require("../../lib/object-select.js").SimpleSelector;

exports.matchesAny = {
    ":matches(s1, s2)": function(test) {
        var selector = new SimpleSelector(":matches(.test1, .test2)");

        test.deepEqual(selector.find({
            "test1": "whatever",
            "test2": "whatever2",
            "test3": "whatever3"
        }), ["whatever", "whatever2"]);

        test.done();
    }
};

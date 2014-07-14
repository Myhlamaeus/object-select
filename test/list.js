"use strict";

var SelectorList = require("../lib/object-select.js").SelectorList;

exports.selectorList = {
    "test": function(test) {
        var selector;

        selector = new SelectorList(".example :nth-child(odd), .test"); // create selector
        test.deepEqual(selector.find({
            "example": ["this is the first child", "some other child", "this is the last child"],
            "test": "whatever"
        }), ["this is the first child", "this is the last child", "whatever"]);

        test.done();
    }
};

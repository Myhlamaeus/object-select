"use strict";

var parseStr = require("../lib/tools").parseStr;

exports.simpleSelector = {
    "test": function(test) {
        test.deepEqual(parseStr("abc, def, \"ghi\", .test, .\"te st\", (abc, def)"), ["abc", "def", "ghi", ".test", ".\"te st\"", "(abc, def)"]);

        test.done();
    }
};

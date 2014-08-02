"use strict";

var parseStr = require("../lib/tools").parseStr;

exports.simpleSelector = {
    "test": function(test) {
        test.deepEqual(parseStr("abc, def, \"ghi\", .test, .\"te st\", (abc, def)"), ["abc", "def", "ghi", ".test", ".\"te st\"", "(abc, def)"]);
        test.deepEqual(parseStr("\"ghi\" .test .\"te st\"", [" "]), ["ghi", ".test", ".\"te st\""]);
        test.deepEqual(parseStr("abc.\"de f\":ghi", [".", ":"], true), ["abc", ".\"de f\"", ":ghi"]);

        test.done();
    }
};

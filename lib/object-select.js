/*
 * object-select
 * https://github.com/ileri/object-select
 *
 * Copyright (c) 2014 Malte-Maurice Dreyer
 * Licensed under the MIT license.
 */

"use strict";

if(typeof(Map) === "undefined") {
    global.Map = require("harmony-collections").Map;
}

exports.SimpleSelector = require("./selectors/simple");
exports.CompoundSelector = require("./selectors/compound");
exports.ComplexSelector = require("./selectors/complex");
exports.SelectorList = require("./selectors/list");

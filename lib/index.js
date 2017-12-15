'use strict';

const es6Exports = require('@std/esm')(module)('./index.mjs');

module.exports = es6Exports.default;

for (const name of Object.getOwnPropertyNames(es6Exports)) {
  module.exports[name] = es6Exports[name];
}

'use strict';

const assert = require('assert');
const { parseStr } = require('../tools');

describe('tools', () => {
  describe('parseStr', () => {
    it('should work for selector lists', () => {
      assert.deepEqual(parseStr('abc, def, "ghi", (abc, def)'), [
        'abc',
        'def',
        'ghi',
        '(abc, def)'
      ]);
    });
  });
});

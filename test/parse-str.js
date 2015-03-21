'use strict'

var parseStr = require('../lib/tools').parseStr

exports.simpleSelector = {
  test: function (test) {
    test.deepEqual(parseStr('abc, def, "ghi", (abc, def)'), ['abc', 'def', 'ghi', '(abc, def)'])

    test.done()
  }
}

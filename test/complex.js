'use strict'

var ComplexSelector = require('../lib/object-select.js').ComplexSelector

exports.simpleSelector = {
  test: function (test) {
    var obj = {
      test: {
        test2: ['abc'],
        test3: ['def']
      }
    }
    var selector

    selector = new ComplexSelector('.example :matches(:first-child, :last-child)') // create selector
    test.deepEqual(selector.find({
      example: ['this is the first child', 'some other child', 'this is the last child']
    }), ['this is the first child', 'this is the last child'])

    selector = new ComplexSelector('.test :matches(.test2, .test3)')
    test.deepEqual(selector.find({
      test: {
        test2: 'abc',
        test3: 'def'
      }
    }), ['abc', 'def'])

    test.ok(selector.matches(obj))

    delete obj.test.test2
    test.ok(selector.matches(obj))

    delete obj.test.test3
    test.ok(!selector.matches(obj))

    test.done()
  }
}

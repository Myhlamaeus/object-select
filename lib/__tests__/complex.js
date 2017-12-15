'use strict';

const assert = require('assert');
const { ComplexSelector } = require('../');

describe('ComplexSelector', () => {
  it('should work', () => {
    const obj = {
      test: {
        test2: ['abc'],
        test3: ['def']
      }
    };
    const selector = new ComplexSelector('.test :matches(.test2, .test3)');

    assert.deepEqual(selector.find(obj), [['abc'], ['def']]);

    assert(selector.matches(obj));

    delete obj.test.test2;
    assert(selector.matches(obj));

    delete obj.test.test3;
    assert(!selector.matches(obj));
  });

  it('should work for arrays', () => {
    const selector = new ComplexSelector('.example :matches(:first-child, :last-child)');

    assert.deepEqual(
      selector.find({
        example: ['this is the first child', 'some other child', 'this is the last child']
      }),
      ['this is the first child', 'this is the last child']
    );
  });
});

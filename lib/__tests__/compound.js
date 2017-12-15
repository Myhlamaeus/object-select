'use strict';

const assert = require('assert');
const { CompoundSelector } = require('../');

describe('CompoundSelector', () => {
  it('should work for simple pseudo-selectors', () => {
    const selector = new CompoundSelector(':has(.test)');

    assert(
      selector.matches({
        test: 'whatever'
      })
    );
  });

  it('should work for nested pseudo-selectors', () => {
    const selector = new CompoundSelector(':not(:matches(.test, .test2))');

    assert.deepEqual(
      selector.find({
        test: 'abc',
        test2: 'abcd',
        test3: 'def'
      }),
      ['def']
    );
  });

  it('should work for type selectors with :matches', () => {
    const selector = new CompoundSelector('string:matches(.test, .test2)');

    assert.deepEqual(
      selector.find({
        test: 'abc',
        test2: 'abcd',
        test3: 'def'
      }),
      ['abc', 'abcd']
    );
  });

  it('should work for type selectors with :not', () => {
    const selector = new CompoundSelector('string:not(.test, .test2)');

    assert.deepEqual(
      selector.find({
        test: 'abc',
        test2: 'abcd',
        test3: 'def'
      }),
      ['def']
    );
  });
});

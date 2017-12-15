'use strict';

const assert = require('assert');
const { SimpleSelector } = require('../');

const typeTests = {
  string: '42',
  number: 42,
  object: {
    val: 42
  },
  array: ['42'],
  boolean: true,
  undefined: undefined
};
const types = Object.getOwnPropertyNames(typeTests);

function typeTestFactory(type, onlyIfSameType) {
  if (onlyIfSameType === undefined) {
    onlyIfSameType = true;
  }

  return it(`should for work type selector '${type}'`, () => {
    assert.doesNotThrow(() => {
      const selector = new SimpleSelector(type);

      for (const ele of types) {
        assert(
          (onlyIfSameType && ele !== type) ^ selector.matches(typeTests[ele], typeTests)
        );
      }
    });
  });
}

describe('SimpleSelector', () => {
  it('should work for :root', () => {
    const selector = new SimpleSelector(':root');

    let parent = false;

    assert(
      selector.matches(
        {
          test: 'whatever'
        },
        parent
      )
    );

    parent = [
      {
        test: 'whatever'
      }
    ];
    assert(!selector.matches(parent[0], parent));

    parent = {
      notRoot: {
        test: 'whatever'
      }
    };
    assert(!selector.matches(parent.notRoot, parent));
  });

  it('should work for :first-child', () => {
    const selector = new SimpleSelector(':first-child');

    let parent = ['i', 42, ['test']];

    assert(selector.matches(parent[0], parent));
    assert(!selector.matches(parent[1], parent));
    assert(!selector.matches(parent[2], parent));

    parent = {
      i: 'am',
      a: 42,
      0: false,
      1: false,
      length: 2,
      result: false
    };

    assert.throws(() => {
      assert(!selector.matches(parent.i, parent));
    });
  });

  it('should work for :last-child', () => {
    const selector = new SimpleSelector(':last-child');

    let parent = ['i', 42, ['test']];

    assert(!selector.matches(parent[0], parent));
    assert(!selector.matches(parent[1], parent));
    assert(selector.matches(parent[2], parent));

    parent = {
      i: 'am',
      a: 42,
      0: false,
      1: false,
      length: 2,
      result: false
    };

    assert.throws(() => {
      assert(!selector.matches(parent.i, parent));
    });
  });

  it('should work for :only-child', () => {
    const selector = new SimpleSelector(':only-child');

    let parent = [true];

    assert(selector.matches(parent[0], parent));

    parent = [true, false];
    assert(!selector.matches(parent[0], parent));
    assert(!selector.matches(parent[1], parent));

    parent = {
      test: true
    };
    assert(selector.matches(parent.test, parent));

    parent = {
      test: true,
      another: false
    };
    assert(!selector.matches(parent.test, parent));
    assert(!selector.matches(parent.another, parent));
  });

  it('should work for :nth-child', () => {
    const parent = ['i', 42, ['test'], '42', true, false, {}, undefined];

    let selector = new SimpleSelector(':nth-child(2)');

    assert(!selector.matches(parent[0], parent));
    assert(selector.matches(parent[1], parent));
    assert(!selector.matches(parent[2], parent));

    selector = new SimpleSelector(':nth-child(odd)');
    assert(selector.matches(parent[0], parent));
    assert(!selector.matches(parent[1], parent));
    assert(selector.matches(parent[2], parent));
    assert(!selector.matches(parent[3], parent));

    selector = new SimpleSelector(':nth-child(even)');
    assert(!selector.matches(parent[0], parent));
    assert(selector.matches(parent[1], parent));
    assert(!selector.matches(parent[2], parent));
    assert(selector.matches(parent[3], parent));

    selector = new SimpleSelector(':nth-child(3n)');
    assert(!selector.matches(parent[0], parent));
    assert(!selector.matches(parent[1], parent));
    assert(selector.matches(parent[2], parent));
    assert(!selector.matches(parent[3], parent));
    assert(!selector.matches(parent[4], parent));
    assert(selector.matches(parent[5], parent));
    assert(!selector.matches(parent[6], parent));

    selector = new SimpleSelector(':nth-child(3n+1)');
    assert(selector.matches(parent[0], parent));
    assert(!selector.matches(parent[1], parent));
    assert(!selector.matches(parent[2], parent));
    assert(selector.matches(parent[3], parent));
    assert(!selector.matches(parent[4], parent));
    assert(!selector.matches(parent[5], parent));
    assert(selector.matches(parent[6], parent));

    selector = new SimpleSelector(':nth-child(3n-1)');
    assert(!selector.matches(parent[0], parent));
    assert(selector.matches(parent[1], parent));
    assert(!selector.matches(parent[2], parent));
    assert(!selector.matches(parent[3], parent));
    assert(selector.matches(parent[4], parent));
    assert(!selector.matches(parent[5], parent));
    assert(!selector.matches(parent[6], parent));

    assert.throws(() => {
      const selector = new SimpleSelector(':nth-child(even)');
      const parent = {
        i: 'am',
        a: 42,
        0: false,
        1: false,
        length: 2,
        result: false
      };

      assert(!selector.matches(parent.i, parent));
      assert(!selector.matches(parent[0], parent));
      assert(!selector.matches(parent[1], parent));
      assert(!selector.matches(parent.result, parent));
    });
  });

  it('should work for :nth-last-child', () => {
    const parent = ['i', 42, ['test'], '42', true, false, {}, undefined];

    let selector = new SimpleSelector(':nth-last-child(2)');

    assert(!selector.matches(parent[5], parent));
    assert(selector.matches(parent[6], parent));
    assert(!selector.matches(parent[7], parent));

    selector = new SimpleSelector(':nth-last-child(odd)');
    assert(selector.matches(parent[7], parent));
    assert(!selector.matches(parent[6], parent));
    assert(selector.matches(parent[5], parent));
    assert(!selector.matches(parent[4], parent));

    selector = new SimpleSelector(':nth-last-child(even)');
    assert(!selector.matches(parent[7], parent));
    assert(selector.matches(parent[6], parent));
    assert(!selector.matches(parent[5], parent));
    assert(selector.matches(parent[4], parent));

    selector = new SimpleSelector(':nth-last-child(3n)');
    assert(!selector.matches(parent[7], parent));
    assert(!selector.matches(parent[6], parent));
    assert(selector.matches(parent[5], parent));
    assert(!selector.matches(parent[4], parent));
    assert(!selector.matches(parent[3], parent));
    assert(selector.matches(parent[2], parent));
    assert(!selector.matches(parent[1], parent));

    selector = new SimpleSelector(':nth-last-child(3n+1)');
    assert(selector.matches(parent[7], parent));
    assert(!selector.matches(parent[6], parent));
    assert(!selector.matches(parent[5], parent));
    assert(selector.matches(parent[4], parent));
    assert(!selector.matches(parent[3], parent));
    assert(!selector.matches(parent[2], parent));
    assert(selector.matches(parent[1], parent));

    selector = new SimpleSelector(':nth-last-child(3n-1)');
    assert(!selector.matches(parent[7], parent));
    assert(selector.matches(parent[6], parent));
    assert(!selector.matches(parent[5], parent));
    assert(!selector.matches(parent[4], parent));
    assert(selector.matches(parent[3], parent));
    assert(!selector.matches(parent[2], parent));
    assert(!selector.matches(parent[1], parent));

    assert.throws(() => {
      const selector = new SimpleSelector(':nth-last-child(even)');
      const parent = {
        i: 'am',
        a: 42,
        0: false,
        1: false,
        length: 2,
        result: false
      };

      assert(!selector.matches(parent.i, parent));
      assert(!selector.matches(parent[0], parent));
      assert(!selector.matches(parent[1], parent));
      assert(!selector.matches(parent.result, parent));
    });
  });

  it('should work for :empty', () => {
    const selector = new SimpleSelector(':empty');

    let ele = [];

    assert(selector.matches(ele));

    ele = {};
    assert(selector.matches(ele));

    ele = [true];
    assert(!selector.matches(ele));

    ele = {
      test: {}
    };
    assert(!selector.matches(ele));
  });

  for (const type of types) {
    typeTestFactory(type);
  }

  typeTestFactory('*', false);
});

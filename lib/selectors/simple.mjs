import * as tools from '../tools';
import pseudoClasses from '../pseudo-classes';

import types from './types';

export default class Simple {
  constructor(selector) {
    selector = tools.normalise(selector, ['(', ',']);
    Object.assign(this, { selector, pseudoClass: false });

    if (selector !== '*') {
      const firstChar = selector.charAt(0);

      if (firstChar === ':') {
        const index = selector.indexOf('(');
        let pseudoClass = selector.slice(1);
        let pseudoClassArgs = [];

        if (index !== -1) {
          pseudoClassArgs = tools.parseStr(selector.slice(index + 1, -1));
          pseudoClass = selector.slice(1, index);
        }

        Object.assign(this, { pseudoClass, pseudoClassArgs });
      } else if (firstChar === '.') {
        Object.assign(this, {
          findMode: 'all',
          key: selector.substr(1)
        });
      } else if (/^[a-z]+$/i.test(selector)) {
        this.type = selector.toLowerCase();
      }
    }
  }

  findFirst(obj) {
    let ret;

    if (typeof obj !== 'object') {
      throw new Error('SimpleObject.prototype.find can only be used on objects');
    }

    if (Array.isArray(obj)) {
      if (
        !obj.some(ele => {
          if (this.matches(ele, obj)) {
            ret = ele;
          }

          return ret;
        })
      ) {
        obj.some(ele => {
          ret = this.findFirst(ele);

          return ret;
        });
      }
    } else {
      const props = Object.getOwnPropertyNames(obj);

      if (
        !props.some(key => {
          const ele = obj[key];

          if (this.matches(ele, obj)) {
            ret = ele;
          }

          return ret;
        })
      ) {
        props.some(key => {
          ret = this.findFirst(obj[key]);

          return ret;
        });
      }
    }

    return ret;
  }

  matches(obj, parent) {
    const { type, key, pseudoClass } = this;

    if (this.selector === '*') {
      return true;
    }

    if (type) {
      if (type in types) {
        return types[type](obj);
      }
    }

    if (key) {
      return (
        Object.getOwnPropertyNames(parent).indexOf(key) !== -1 && parent[key] === obj
      );
    }

    if (pseudoClass) {
      const pseudoClassArgs = [obj, parent].concat(this.pseudoClassArgs);

      if (pseudoClass in pseudoClasses) {
        return pseudoClasses[pseudoClass].apply(pseudoClasses, pseudoClassArgs);
      }
    }

    return false;
  }
}

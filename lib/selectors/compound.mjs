import * as tools from '../tools';
import SimpleSelector from './simple';

function mapSimpleSelectors(selector) {
  return new SimpleSelector(selector);
}

export default class {
  constructor(selector) {
    selector = tools.normalise(selector);
    const simpleSelectors = tools
      .parseStr(selector, ['.', ':'], true)
      .map(mapSimpleSelectors);

    Object.assign(this, { selector, simpleSelectors });
  }

  matches(obj, parent) {
    return this.simpleSelectors.every(function(ele) {
      return ele.matches(obj, parent);
    });
  }

  find(obj) {
    let ret = [];

    if (typeof obj !== 'object') {
      throw new TypeError('CompoundSelector.prototype.find only works on objects');
    }
    if (Array.isArray(obj)) {
      obj.forEach(ele => {
        if (this.matches(ele, obj)) {
          ret.push(ele);
        }

        if (typeof ele === 'object') {
          ret = ret.concat(this.find(ele));
        }
      });
    } else {
      Object.getOwnPropertyNames(obj).forEach(key => {
        const ele = obj[key];

        if (this.matches(ele, obj)) {
          ret.push(ele);
        }

        if (typeof ele === 'object') {
          ret = ret.concat(this.find(ele));
        }
      });
    }

    return ret;
  }

  findFirst(obj) {
    let ret;

    if (typeof obj !== 'object') {
      throw new TypeError('CompoundSelector.prototype.findFirst only works on objects');
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
}

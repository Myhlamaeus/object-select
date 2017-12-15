import * as tools from '../tools';
import CompoundSelector from './compound.js';

export const combinators = [' ', '+', '~'];

function mapCompoundSelectors(selector) {
  var combinator = selector.charAt(0);

  if (combinators.indexOf(combinator) === -1) {
    combinator = undefined;
  } else {
    selector = selector.substr(1);
  }

  return {
    combinator: combinator,
    selector: new CompoundSelector(selector)
  };
}

export default class ComplexSelector {
  constructor(selector) {
    selector = tools.normalise(selector, combinators);

    const compoundSelectors = tools
      .parseStr(selector, combinators, true)
      .map(mapCompoundSelectors);

    Object.assign(this, { selector, compoundSelectors });
  }

  matches(obj) {
    let current = obj;

    return this.compoundSelectors.every(ele => {
      if (!ele.combinator || ele.combinator === ' ') {
        current = ele.selector.findFirst(current);
      }

      return Boolean(current);
    });
  }

  find(obj) {
    const containers = new Map();

    let currents = [obj];

    if (
      this.compoundSelectors.every(function(ele) {
        const newCurrents = [];

        currents.forEach(function(current) {
          const container = containers.get(current);

          let found;
          let index;

          if (!ele.combinator || ele.combinator === ' ') {
            found = ele.selector.find(current, container);
          } else if (ele.combinator === '+') {
            if (Array.isArray(container)) {
              index = container.indexOf(current);

              if (index + 1 === container.length) {
                found = false;
              } else {
                found = ele.selector.find(
                  container.slice(index + 1, index + 2),
                  containers.get(container)
                );
              }
            }
          } else if (ele.combinator === '~') {
            if (Array.isArray(container)) {
              index = container.indexOf(current);

              if (index + 1 === container.length) {
                found = false;
              } else {
                found = ele.selector.find(
                  container.slice(index + 1),
                  containers.get(container)
                );
              }
            }
          }

          if (found) {
            found.forEach(ele => {
              newCurrents.push(ele);
              containers.set(ele, current);
            });
          }
        });
        currents = newCurrents;

        return Boolean(currents.length);
      })
    ) {
      return currents;
    }

    return false;
  }
}

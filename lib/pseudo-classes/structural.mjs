function aNPlusB(str, i) {
  if (str === 'even') {
    str = '2n';
  } else if (str === 'odd') {
    str = '2n+1';
  }

  if (aNPlusB.regExp.test(str)) {
    const matches = str.match(aNPlusB.regExp);

    if (matches[1]) {
      matches[1] = parseInt(matches[1], 10);
    }

    if (matches[3]) {
      matches[3] = parseInt(matches[3], 10);
    }

    if (matches[2]) {
      if (matches[2] === '+n') {
        matches[2] = 'n';
      }

      if (matches[1]) {
        if (matches[3]) {
          i -= matches[3];
        }

        if (i >= 0) {
          return i % matches[1] === 0;
        }
      } else {
        if (matches[2] === 'n') {
          return i >= matches[3];
        }
        return i <= matches[3];
      }
    } else {
      return i === matches[1];
    }
  }
}

aNPlusB.regExp = /^(?:even|odd|([+-]?\d+)?([+-]?n)?([+-]\d+)?)$/i;

function elesOfType(arr, type) {
  return arr.filter(function(ele) {
    const eleType = typeof ele;

    return eleType === type;
  });
}

export function root(ele, parent) {
  return !parent;
}

export function empty(ele) {
  if (typeof ele !== 'object' && typeof ele !== 'string') {
    throw new TypeError(':empty can only be used on objects and strings');
  }

  if (typeof ele === 'string' || Array.isArray(ele)) {
    return ele.length === 0;
  }

  return Object.getOwnPropertyNames(ele).length === 0;
}

export function blank(ele) {
  if (typeof ele !== 'object' && typeof ele !== 'string') {
    throw new TypeError(':whitespace-only can only be used on objects and strings');
  }

  if (typeof ele === 'string') {
    return ele.trim().length === 0;
  }

  if (Array.isArray(ele)) {
    return ele.every(function(val) {
      return typeof val === 'string' && val.trim().length === 0;
    });
  }

  Object.getOwnPropertyNames(ele).every(function(key) {
    var val = ele[key];

    return typeof val === 'string' && val.trim().length === 0;
  });
}

export function nthChild(ele, parent, n) {
  if (!parent) {
    throw new Error(':nth-child cannot be used on :root');
  }
  if (!Array.isArray(parent)) {
    throw new Error(':nth-child can only be used on array elements');
  }

  n = String(n);
  if (n && aNPlusB.regExp.test(n)) {
    return aNPlusB(n, parent.indexOf(ele) + 1);
  }

  throw new Error(
    ':nth-child(n) only accepts even, odd and formula containing positive integers, plus, minus or n as n'
  );
}

export function nthLastChild(ele, parent, n) {
  if (!parent) {
    throw new Error(':nth-last-child cannot be used on :root');
  }
  if (!Array.isArray(parent)) {
    throw new Error(':nth-last-child can only be used on array elements');
  }

  n = String(n);
  if (n && aNPlusB.regExp.test(n)) {
    return aNPlusB(n, parent.length - parent.indexOf(ele));
  }

  throw new Error(
    ':nth-last-child(n) only accepts even, odd and formula containing positive integers, plus, minus or n as n'
  );
}

export function firstChild(ele, parent) {
  if (!parent) {
    throw new Error(':first-child cannot be used on :root');
  }
  if (!Array.isArray(parent)) {
    throw new Error(':first-child can only be used on array elements');
  }

  return Array.isArray(parent) && parent[0] === ele;
}

export function lastChild(ele, parent) {
  if (!parent) {
    throw new Error(':last-child cannot be used on :root');
  }
  if (!Array.isArray(parent)) {
    throw new Error(':last-child can only be used on array elements');
  }

  return parent[parent.length - 1] === ele;
}

export function onlyChild(ele, parent) {
  if (!parent) {
    throw new Error(':only-child cannot be used on :root');
  }

  if (Array.isArray(parent)) {
    return parent.length === 1;
  }
  return Object.getOwnPropertyNames(parent).length === 1;
}

export function nthOfType(ele, parent, n) {
  var elesOfSameType;

  if (!parent) {
    throw new Error(':nth-of-type cannot be used on :root');
  }
  if (!Array.isArray(parent)) {
    throw new TypeError(':nth-of-type can only be used on array elements');
  }

  n = String(n);
  if (n && aNPlusB.regExp.test(n)) {
    elesOfSameType = elesOfType(parent, typeof ele);

    return aNPlusB(n, elesOfSameType.indexOf(ele) + 1);
  }

  throw new Error(
    ':nth-of-type(n) only accepts even, odd and formula containing positive integers, plus, minus or n as n'
  );
}

export function nthLastOfType(ele, parent, n) {
  var elesOfSameType;

  if (!parent) {
    throw new Error(':nth-last-of-type cannot be used on :root');
  }
  if (!Array.isArray(parent)) {
    throw new Error(':nth-last-of-type can only be used on array elements');
  }

  n = String(n);
  if (n && aNPlusB.regExp.test(n)) {
    elesOfSameType = elesOfType(parent, typeof ele);

    return aNPlusB(n, elesOfSameType - elesOfSameType.indexOf(ele));
  }

  throw new Error(
    ':nth-last-of-type(n) only accepts even, odd and formula containing positive integers, plus, minus or n as n'
  );
}

export function firstOfType(ele, parent) {
  if (!parent) {
    throw new Error(':first-of-type cannot be used on :root');
  }
  if (!Array.isArray(parent)) {
    throw new Error(':first-of-type can only be used on array elements');
  }

  return elesOfType(parent, typeof ele)[0] === ele;
}

export function lastOfType(ele, parent) {
  var elesOfSameType;

  if (!parent) {
    throw new Error(':last-of-type cannot be used on :root');
  }
  if (!Array.isArray(parent)) {
    throw new Error(':last-of-type can only be used on array elements');
  }

  elesOfSameType = elesOfType(parent, typeof ele);

  return elesOfSameType[elesOfSameType.length - 1] === ele;
}

export function onlyOfType(ele, parent) {
  if (!parent) {
    throw new Error(':only-of-type cannot be used on :root');
  }
  if (!Array.isArray(parent)) {
    throw new Error(':only-of-type can only be used on array elements');
  }

  return elesOfType(parent, typeof ele).length === 1;
}

export function normalise(selector, removeWhiteSpacesAround) {
  let str = selector.trim().replace(/\s+/g, ' ');

  if (removeWhiteSpacesAround) {
    removeWhiteSpacesAround.forEach(function(ele) {
      str = str.replace(new RegExp('\\s+\\' + ele + '\\s+', 'g'), ele);
    });
  }

  return str;
}

export function lastOccurenceOfAny(str, find) {
  return Math.max.apply(
    Math,
    find.map(function(ele) {
      return str.lastIndexOf(ele);
    })
  );
}

export function strToVal(str) {
  str = str.trim();

  if (str === 'true') {
    return true;
  }
  if (str === 'false') {
    return false;
  }
  if (str === 'null') {
    return null;
  }
  if (/^(?:\d+|(?:\d*\.\d+))$/.test(str)) {
    return parseFloat(str);
  }
  return str;
}

export function parseStr(str, delims, includeDelims) {
  const parsed = [];

  let parenthesesOpen = 0;
  let strOpen = false;
  let lastTokenPos = 0;
  let lastToken;
  let i;
  let length;
  let chr;
  let val;

  delims = delims || [','];

  str = normalise(str, delims);

  for (i = 0, length = str.length; i < length; ++i) {
    chr = str.charAt(i);

    if (!strOpen) {
      if (chr === '(') {
        ++parenthesesOpen;
      } else if (chr === ')') {
        --parenthesesOpen;
      }
    }

    if (!parenthesesOpen) {
      if (chr === '"' || chr === "'") {
        if (chr === strOpen) {
          parsed.push(str.slice(lastTokenPos, i));
          strOpen = false;
          lastTokenPos = i + 1;
        } else if (!strOpen) {
          strOpen = chr;
          lastTokenPos = i + 1;
        }
      }
    }

    if (!strOpen && !parenthesesOpen) {
      if (delims.indexOf(chr) !== -1) {
        if (i !== lastTokenPos + 1 || lastToken !== chr) {
          if (i) {
            val = str.slice(lastTokenPos, i).trim();

            if (val.length) {
              parsed.push(strToVal(val));
            }
          }

          lastTokenPos = i + !includeDelims;
          lastToken = chr;
        }
      }
    }
  }
  if (chr !== '"' && chr !== "'") {
    parsed.push(strToVal(str.slice(lastTokenPos)));
  }

  return parsed;
}

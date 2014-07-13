exports.normalise = function(selector, removeWhiteSpacesAround) {
    var str = selector.trim().replace(/\s+/g, " ");

    if(removeWhiteSpacesAround) {
        removeWhiteSpacesAround.forEach(function(ele) {
            str = str.replace(new RegExp("\\s+\\" + ele + "\\s+", "g"), ele);
        });
    }

    return str;
};

exports.lastOccurenceOfAny = function(str, find) {
    return Math.max.apply(Math, find.map(function(ele) {
        return str.lastIndexOf(ele);
    }));
};

exports.strToVal = function(str) {
    str = str.trim();

    if(str === "true") {
        return true;
    }
    if(str === "false") {
        return false;
    }
    if(str === "null") {
        return null;
    }
    if(/^(?:\d+|(?:\d*\.\d+))$/.test(str)) {
        return parseFloat(str);
    }
    return str;
};

exports.parseStr = function(str, delims, includeDelims) {
    var parenthesesOpen = 0,
        strOpen = false,
        parsed = [],
        lastToken = 0,
        i, length, chr, val;

    delims = delims || [","];

    str = exports.normalise(str, delims);

    for(i = 0, length = str.length; i < length; ++i) {
        chr = str.charAt(i);

        if(!strOpen) {
            if(chr === "(") {
                ++parenthesesOpen;
            } else if(chr === ")") {
                --parenthesesOpen;
            }
        }

        if(!parenthesesOpen) {
            if(chr === "\"" || chr === "'") {
                if(chr === strOpen) {
                    parsed.push(str.slice(lastToken, i));
                    strOpen = false;
                    lastToken = i + 1;
                } else if(!strOpen) {
                    strOpen = chr;
                    lastToken = i + 1;
                }
            }
        }

        if(!strOpen && !parenthesesOpen) {
            if(delims.indexOf(chr) !== -1) {
                if(i) {
                    val = str.slice(lastToken, i).trim();

                    if(val.length) {
                        parsed.push(exports.strToVal(val));
                    }
                }

                lastToken = i + !includeDelims;
            }
        }
    }
    if(chr !== "\"" && chr !== "'") {
        parsed.push(exports.strToVal(str.slice(lastToken)));
    }

    return  parsed;
};

exports.normalise = function(selector, removeWhiteSpacesAround) {
    var str = selector.trim().replace(/\s+/g, " ");

    if(removeWhiteSpacesAround && removeWhiteSpacesAround.length) {
        str.replace(new RegExp("\\s*(\\" + removeWhiteSpacesAround.join("|\\") + ")\\s*", "g"), "$1");
    }

    return str;
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
        lastTokenPos = 0,
        lastToken,
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
                    parsed.push(str.slice(lastTokenPos, i));
                    strOpen = false;
                    lastTokenPos = i + 1;
                } else if(!strOpen) {
                    strOpen = chr;
                    lastTokenPos = i + 1;
                }
            }
        }

        if(!strOpen && !parenthesesOpen) {
            if(delims.indexOf(chr) !== -1) {
                if(i !== lastTokenPos + 1 || lastToken !== chr) {
                    if(i) {
                        val = str.slice(lastTokenPos, i).trim();

                        if(val.length) {
                            parsed.push(exports.strToVal(val));
                        }
                    }

                    lastTokenPos = i + !includeDelims;
                    lastToken = chr;
                }
            }
        }
    }
    if(chr !== "\"" && chr !== "'") {
        parsed.push(exports.strToVal(str.slice(lastTokenPos)));
    }

    return  parsed;
};

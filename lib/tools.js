exports.normalise = function(selector, removeWhiteSpacesAround) {
    var str = selector.trim().replace(/\s+/g, " ");

    if(removeWhiteSpacesAround && removeWhiteSpacesAround.length) {
        str.replace(new RegExp("\\s*(\\" + removeWhiteSpacesAround.join("|\\") + ")\\s*", "g"), "$1");
    }

    return str;
};

exports.strToVal = function(str) {
    var firstChar, lastChar;

    str = str.trim();

    if(str.length > 1) {
        firstChar = str.charAt(0);
        lastChar = str.charAt(str.length - 1);

        if(firstChar === lastChar && (firstChar === "\"" || firstChar === "'")) {
            return str.slice(1, -1);
        }
    }

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
        lastToken, strEscapingSelector,
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
                    if(strEscapingSelector) {
                        parsed.push(str.substr(lastTokenPos, 1) + exports.strToVal(str.slice(lastTokenPos + 1, i + 1)));
                        strEscapingSelector = false;
                    } else {
                        parsed.push(exports.strToVal(str.slice(lastTokenPos, i + 1)));
                    }
                    strOpen = false;
                    lastTokenPos = i + 1;
                } else if(!strOpen) {
                    strOpen = chr;
                    if(lastToken === "," || delims.indexOf(lastToken) === -1) {
                        lastTokenPos = i;
                    } else {
                        strEscapingSelector = true;
                    }
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

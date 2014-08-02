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
        tmp = "",
        dontAddToTmp = false,
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
                    tmp += exports.strToVal(str.slice(lastTokenPos, i + 1));

                    strOpen = false;
                    lastTokenPos = i + 1;
                    dontAddToTmp = true;
                } else if(!strOpen) {
                    strOpen = chr;

                    if(i) {
                        if(typeof(lastToken) === "undefined") {
                            lastTokenPos = i - 1;
                        } else {
                            lastTokenPos = i - 1;
                        }
                    }
                }
            }

            if(!strOpen) {
                if(delims.indexOf(chr) !== -1 && (i !== lastTokenPos + 1 || lastToken !== chr)) {
                    if(i) {
                        val = str.slice(lastTokenPos, i).trim();

                        if(tmp.length) {
                            parsed.push(tmp + exports.strToVal(val));
                            tmp = "";
                        } else if(val.length) {
                            parsed.push(exports.strToVal(val));
                        }
                    }

                    lastTokenPos = i + !includeDelims;
                    lastToken = chr;
                } else if(!dontAddToTmp && tmp) {
                    tmp += chr;
                }
            }
        }

        dontAddToTmp = false;
    }

    if(tmp) {
        parsed.push(tmp);
        tmp = "";
    } else {
        parsed.push(exports.strToVal(str.slice(lastTokenPos)));
    }

    return  parsed;
};

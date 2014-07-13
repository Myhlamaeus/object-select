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

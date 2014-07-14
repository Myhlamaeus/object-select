var CompoundSelector,
    matchesAny = {};

module.exports = matchesAny;

matchesAny["matches"] = function(ele, parent) {
    var selectors = [].slice.call(arguments, 2);

    return selectors.some(function(selector) {
        var compoundSelector = new CompoundSelector(selector);

        return compoundSelector.matches(ele, parent);
    });
};

CompoundSelector = require("../selectors/compound");

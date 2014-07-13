var SimpleSelector = require("../selectors/simple");

module.exports = {
    "matches": function(ele, parent) {
        var selectors = [].slice.call(arguments, 2);

        return selectors.some(function(selector) {
            // should use CompoundSelector
            var simpleSelector = new SimpleSelector(selector);

            return simpleSelector.matches(ele, parent);
        });
    }
}

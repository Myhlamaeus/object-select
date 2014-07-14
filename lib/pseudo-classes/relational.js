var SimpleSelector = require("../selectors/simple");

module.exports = {
    "has": function(ele) {
        var selectors;

        if(typeof(ele) !== "object" || Array.isArray(ele)) {
            throw new TypeError(":has can only be used on non-array objects");
        }

        selectors = [].slice.call(arguments, 2);

        return selectors.some(function(selector) {
            // should probably be a ComplexSelector
            var simpleSelector = new SimpleSelector(selector);

            return !!simpleSelector.findFirst(ele);
        });
    }
};

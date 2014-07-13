var SimpleSelector = require("../selectors/simple");

module.exports = {
    "has": function(ele) {
        var selectors = [].slice.call(arguments, 2);

        if(typeof(ele) !== "object" || Array.isArray(ele)) {
            throw new TypeError(":has can only be used on non-array objects");
        }

        return selectors.some(function(selector) {
            // should probably be a ComplexSelector
            var simpleSelector = new SimpleSelector(selector);

            return !!simpleSelector.findFirst(ele);
        });
    }
};

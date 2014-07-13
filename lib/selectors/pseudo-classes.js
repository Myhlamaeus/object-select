var SimpleSelector = require("./simple");

module.exports = {
    "root": function(ele, parent) {
        return !parent;
    },
    "first-child": function(ele, parent) {
        if(!parent) {
            throw new Error(":first-child cannot be used on :root");
        }

        return Array.isArray(parent) && parent.length && parent[0] === ele;
    },
    "last-child": function(ele, parent) {
        var length;

        if(!parent) {
            throw new Error(":last-child cannot be used on :root");
        }

        if(!Array.isArray(parent)) {
            return false;
        }

        length = parent.length;

        return length && parent[length - 1] === ele;
    },
    "only-child": function(ele, parent) {
        var ownProps;

        if(!parent) {
            throw new Error(":only-child cannot be used on :root");
        }

        if(Array.isArray(parent)) {
            return parent.length === 1 && parent[0] === ele;
        } else {
            ownProps = Object.getOwnPropertyNames(parent);

            return ownProps.length === 1 && parent[ownProps[0]] === ele;
        }
    },
    "nth-child": function(ele, parent, n) {
        var matches, index;

        if(!parent) {
            throw new Error(":nth-child cannot be used on :root");
        }
        if(!Array.isArray(parent)) {
            throw new Error(":nth-child can only be used on array elements");
        }

        n = String(n);
        if(n) {
            if(n === "even") {
                n = "2n";
            } else if(n === "odd") {
                n = "2n+1";
            }

            if(typeof(n) === "string" && /^([\+\-]?\d+)?([\+\-]?n)?([\+\-]\d+)?$/i.test(n)) {
                matches = n.match(/^([\+\-]?\d+)?([\+\-]?n)?([\+\-]\d+)?$/i);

                index = parent.indexOf(ele) + 1;

                if(matches[2]) {
                    if(matches[1] && matches[3]) {
                        matches[1] = parseInt(matches[1], 10);
                        matches[3] = parseInt(matches[3], 10);

                        index -= parseInt(matches[3], 10);

                        if(index < 0 || (matches[3] > 0 && index < matches[1] && index !== 0)) {
                            return false;
                        }
                    }


                    if(matches[1]) {
                        return (index % parseInt(matches[1], 10)) === 0;
                    } else {
                        return true;
                    }
                } else {
                    return index === parseInt(matches[1], 10);
                }
            }

            return false;
        }

        throw new Error(":nth-child(n) only accepts even, odd and formula containing positive integers, plus, minus or n as n");
    },
    /*"nth-last-child": function(ele, parent, n) {
        if(!parent) {
            throw new Error(":nth-child cannot be used on :root");
        }

        n = parseInt(n, 10);
        if(isNaN(n) || n < 1 || n === Infinity || n === -Infinity) {
            throw new Error(":nth-last-child(n) only accepts positive integers as n");
        }

        return Array.isArray(parent) && parent.length - parent.indexOf(ele) - 1 === n;
    },*/
    "matches": function(ele, parent) {
        var selectors = [].slice.call(arguments, 2);

        return selectors.some(function(selector) {
            // should use CompoundSelector
            var simpleSelector = new SimpleSelector(selector);

            return simpleSelector.matches(ele, parent);
        });
    },
    "not": function() {
        return !this.matches.apply(this, arguments);
    },
    "has": function(ele, parent) {
        var selectors = [].slice.call(arguments, 2);

        if(typeof(ele) !== "object" || Array.isArray(ele)) {
            throw new TypeError(":has can only be used on non-array objects");
        }

        return selectors.some(function(selector) {
            // should probably be a ComplexSelector
            var simpleSelector = new SimpleSelector(selector);

            return !!simpleSelector.findFirst(ele);
        });
    },
    "empty": function(ele) {
        if(typeof(ele) !== "object" && typeof(ele) !== "string") {
            throw new TypeError(":empty can only be used on objects and strings");
        }

        if(typeof(ele) === "string" || Array.isArray(ele)) {
            return ele.length === 0;
        } else {
            return Object.getOwnPropertyNames(ele).length === 0;
        }
    },
    "val": function(ele, parent, val) {
        return ele === val;
    },
    "val-coerced": function(ele, parent, val) {
        return ele === val;
    },
    "contains": function(ele, parent, str) {
        return String(ele).indexOf(String(str)) !== -1;
    }
};

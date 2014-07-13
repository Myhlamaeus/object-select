var SimpleSelector = require("./simple.js"),
    normalise = require("../tools").normalise;

module.exports = function(selector) {
    var lastToken = 0,
        simpleSelectors = [],
        openedParen = false,
        i, length, chr;

    selector = this.selector = normalise(selector);

    for(i = 0, length = selector.length; i < length; ++i) {
        chr = selector.charAt(i);

        if(chr === "(") {
            openedParen = true;
        } else if(chr === ")") {
            openedParen = false;
        } else if(!openedParen && (chr === "#" || chr === ":") && i) {
            simpleSelectors.push(new SimpleSelector(selector.substr(lastToken, i)));
            lastToken = i;
        }
    }
    simpleSelectors.push(new SimpleSelector(selector.substr(lastToken)));
    this.simpleSelectors = simpleSelectors;
};

module.exports.prototype.matches = function(obj, parent) {
    return this.simpleSelectors.every(function(ele) {
        return ele.matches(obj, parent);
    });
};

module.exports.prototype.find = function(obj) {
    var ret = [];

    if(typeof(obj) !== "object") {
        throw new TypeError("CompoundSelector.prototype.find only works on objects");
    }
    if(Array.isArray(obj)) {
        obj.forEach(function(ele) {
            if(this.matches(ele, obj)) {
                ret.push(ele);
            }
            ret = ret.concat(this.find(ele));
        }.bind(this));
    } else {
        Object.getOwnPropertyNames(obj).forEach(function(key) {
            var ele = obj[key];

            if(this.matches(ele, obj)) {
                ret.push(ele);
            }

            if(typeof(ele) === "object") {
                ret = ret.concat(this.find(ele));
            }
        }.bind(this));
    }

    return ret;
};

module.exports.prototype.findFirst = function(obj) {
    var ret, props;

    if(typeof(obj) !== "object") {
        throw new TypeError("CompoundSelector.prototype.findFirst only works on objects");
    }

    if(Array.isArray(obj)) {
        if(!obj.some(function(ele) {
            if(this.matches(ele, obj)) {
                ret = ele;

                return true;
            }
        })) {
            obj.some(function(ele) {
                ret = this.findFirst(ele);

                return ret;
            });
        }
    } else {
        props = Object.getOwnPropertyNames(obj);

        if(!props.some(function(key) {
            var ele = obj[key];

            if(this.matches(ele, obj)) {
                ret = ele;

                return true;
            }
        })) {
            props.some(function(key) {
                ret = this.findFirst(obj[key]);

                return ret;
            });
        }
    }

    return ret;
};

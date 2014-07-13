var SimpleSelector = require("./simple.js"),
    mapSimpleSelectors = function(selector) {
        return new SimpleSelector(selector);
    },
    tools = require("../tools");

module.exports = function(selector) {
    selector = this.selector = tools.normalise(selector);

    this.simpleSelectors = tools.parseStr(selector, ["#", ":"], true).map(mapSimpleSelectors);
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
        }.bind(this))) {
            props.some(function(key) {
                ret = this.findFirst(obj[key]);

                return ret;
            }.bind(this));
        }
    }

    return ret;
};

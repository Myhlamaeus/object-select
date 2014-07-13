var tools = require("../tools");

module.exports = function(selector) {
    var firstChar, index, args;

    selector = this.selector = tools.normalise(selector, ["(", ","]);
    this.pseudoClass = false;

    if(selector !== "*") {
        firstChar = selector.charAt(0);

        if(firstChar === ":") {
            index = selector.indexOf("(");

            if(index === -1) {
                args = [];

                this.pseudoClass = selector.substr(1);
            } else {
                args = tools.parseStr(selector.slice(index + 1, -1));

                this.pseudoClass = selector.slice(1, index);
            }

            this.pseudoClassArgs = args;
        } else if(firstChar === ".") {
            this.findMode = "all";
            this.key = selector.substr(1);
        } else if(/^[a-z]+$/i.test(selector)) {
            this.type = selector.toLowerCase();
        }
    }
};

module.exports.prototype.findFirst = function(obj) {
    var ret, props;

    if(typeof(obj) !== "object") {
        throw new Error("SimpleObject.prototype.find can only be used on objects");
    }

    if(Array.isArray(obj)) {
        if(!obj.some(function(ele) {
            if(this.matches(ele, obj)) {
                ret = ele;
            }

            return ret;
        }.bind(this))) {
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
            }

            return ret;
        }.bind(this))) {
            props.some(function(key) {
                ret = this.findFirst(obj[key]);

                return ret;
            }.bind(this));
        }
    }

    return ret;
};

module.exports.prototype.matches = function(obj, parent) {
    var key, pseudoClass, type, pseudoClassArgs;

    if(this.selector === "*") {
        return true;
    }

    type = this.type;
    if(type) {
        if(type in module.exports.types) {
            return module.exports.types[type](obj);
        }
    }

    key = this.key;
    if(key) {
        return Object.getOwnPropertyNames(parent).indexOf(key) !== -1 && parent[key] === obj;
    }

    pseudoClass = this.pseudoClass;
    if(pseudoClass) {
        pseudoClassArgs = [obj, parent].concat(this.pseudoClassArgs);

        if(pseudoClass in module.exports.pseudoClasses) {
            return module.exports.pseudoClasses[pseudoClass].apply(module.exports.pseudoClasses, pseudoClassArgs);
        }
    }

    return false;
};

module.exports.types = require("./types");
module.exports.pseudoClasses = require("./pseudo-classes");

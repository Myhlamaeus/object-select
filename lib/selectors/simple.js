var tools, types, pseudoClasses;

function SimpleSelector(selector) {
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

            if(selector.charAt(1) === "\"" || selector.charAt(1) === "'") {
                this.key = selector.slice(2, -1);
            } else {
                this.key = selector.substr(1);
            }
        } else if(/^[a-z]+$/i.test(selector)) {
            this.type = selector.toLowerCase();
        }
    }
}
module.exports = SimpleSelector;

SimpleSelector.prototype.find = function(obj) {
    var ret;

    if(typeof(obj) !== "object") {
        throw new Error("SimpleSelector.prototype.find can only be used on objects");
    }

    try {
        JSON.stringify(obj);
    } catch(e) {
        throw new Error("SimpleSelector.prototype.find cannot be used on cyclic objects");
    }

    ret = [];
    if(Array.isArray(obj)) {
        obj.forEach(function(ele) {
            if(this.matches(ele, obj)) {
                ret.push(ele);
            }
            if(typeof(ele) === "object") {
                ret = ret.concat(this.find(ele));
            }
        }.bind(this));
    } else {
        Object.keys(obj).forEach(function(key) {
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

SimpleSelector.prototype.findFirst = function(obj) {
    var ret, props;

    if(typeof(obj) !== "object") {
        throw new TypeError("SimpleSelector.prototype.findFirst can only be used on objects");
    }

    try {
        JSON.stringify(obj);
    } catch(e) {
        throw new Error("SimpleSelector.prototype.findFirst cannot be used on cyclic objects");
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

SimpleSelector.prototype.matches = function(obj, parent) {
    var key, pseudoClass, type, pseudoClassArgs;

    if(this.selector === "*") {
        return true;
    }

    try {
        JSON.stringify(obj);
    } catch(e) {
        throw new Error("SimpleSelector.prototype.matches cannot be used on cyclic objects");
    }

    type = this.type;
    if(type) {
        if(type in types) {
            return types[type](obj);
        }
    }

    key = this.key;
    if(key) {
        return Object.keys(parent).indexOf(key) !== -1 && parent[key] === obj;
    }

    pseudoClass = this.pseudoClass;
    if(pseudoClass) {
        pseudoClassArgs = [obj, parent].concat(this.pseudoClassArgs);

        if(pseudoClass in pseudoClasses) {
            return pseudoClasses[pseudoClass].apply(pseudoClasses, pseudoClassArgs);
        }
    }

    return false;
};

tools = require("../tools");
types = require("./types");
pseudoClasses = require("../pseudo-classes");

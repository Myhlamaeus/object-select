var tools = require("../tools");

module.exports = function(selector) {
    var firstChar, index, args;

    selector = this.selector = tools.normalise(selector, ["(", ","]);
    this.pseudoClass = false;

    if(selector !== "*") {
        firstChar = selector.charAt(0);
        if(firstChar === ":") {
            console.log(selector);
            if(selector.charAt(1) === ":") {
                this.pseudoType = "element";

                selector = selector.substr(1);
            } else {
                this.pseudoType = "class";
            }

            index = selector.indexOf("(");

            if(index === -1) {
                args = [];

                this.pseudo = selector.substr(1);
            } else {
                args = tools.parseStr(selector.slice(index + 1, -1));

                this.pseudo = selector.slice(1, index);
            }

            this.pseudoArgs = args;
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
        throw new Error("SimpleObject.prototype.findFirst can only be used on objects");
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

    console.log(this.key);
    key = this.key;
    if(key) {
        return Object.getOwnPropertyNames(parent).indexOf(key) !== -1 && parent[key] === obj;
    }

    pseudo = this.pseudo;
    if(pseudo) {
        pseudoArgs = [obj, parent].concat(this.pseudoArgs);

        if(this.pseudoType === "element") {
            if(pseudo in module.exports.pseudoElements) {
                return module.exports.pseudoElements[pseudo].apply(module.exports.pseudoElements, pseudoArgs);
            }
        } else {
            if(pseudo in module.exports.pseudoClasses) {
                return module.exports.pseudoClasses[pseudo].apply(module.exports.pseudoClasses, pseudoArgs);
            }
        }
    }

    return false;
};

module.exports.types = require("./types");
module.exports.pseudoClasses = require("../pseudo-classes");
module.exports.pseudoElements = require("../pseudo-elements");

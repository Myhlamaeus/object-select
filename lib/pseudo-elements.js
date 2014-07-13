module.exports = {
    "substring": function(ele, parent, start, end) {
        ele = String(ele);

        return ele.substring(start, end);
    },
    "slice": function(ele, parent, sliceStart, sliceEnd) {
        if(!Array.isArray(ele)) {
            ele = String(ele);
        }

        return ele.slice(sliceStart, sliceEnd);
    },
    "substr": function(ele, parent, start, length) {
        ele = String(ele);

        return ele.substr(start, length);
    },
    "calc": function(ele, parent, expr) {
        var val;

        expr = expr.replace(/n/g, parseFloat(ele.value));

        if(/^[\d\+\-\*\/\(\)]$/.test(expr)) {
            try {
                /* jshint evil:true */
                val = eval(expr);
                /* jshint evil:false */
            } catch(e) {
                throw new Error("::calc expression contains an error");
            }
        } else {
            throw new Error("::calc expression contains invalid characters");
        }

        return val;
    },
    "clone": function(ele) {
        var ret, desc;

        if(typeof(ele) !== "object") {
            return ele;
        }

        if(Array.isArray(ele)) {
            return ele.slice();
        }

        ret = {};

        desc = {};
        Object.getOwnPropertyNames(ele).forEach(function(key) {
            desc[key] = Object.getOwnPropertyDescriptor(ele, key);
        });
        Object.defineProperties(ret, desc);

        return ret;
    },
    "clone-deep": function(ele) {
        var ret, desc;

        if(typeof(ele) !== "object") {
            return ele;
        }

        if(Array.isArray(ele)) {
            ret = [];

            ele.forEach(function(ele) {
                if(typeof(val) === "object") {
                    ret.push(this["clone-deep"](ele));
                }
            }.bind(this));

            return ret;
        }

        ret = {};

        desc = {};
        Object.getOwnPropertyNames(ele).forEach(function(key) {
            var val;

            desc[key] = Object.getOwnPropertyDescriptor(ele, key);

            val = desc[key].value;

            if(typeof(val) === "object") {
                desc[key].value = this["clone-deep"](val);
            }
        }.bind(this));
        Object.defineProperties(ret, desc);

        return ret;
    }
};

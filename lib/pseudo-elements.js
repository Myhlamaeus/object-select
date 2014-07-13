module.exports = {
    "calc": function(ele, parent, expr) {
        var val;

        expr = expr.replace(/n/g, parseFloat(ele.value));

        if(/^[\d\+\-\*\/\(\)]$/.test(expr)) {
            try {
                val = eval(expr);
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

        ret = {};

        desc = {};
        Object.getOwnPropertyNames(ele).forEach(function(key) {
            var val;

            desc[key] = Object.getOwnPropertyDescriptor(ele, key);

            val = desc[key].value;

            if(val !== Object && typeof(val) === "object") {
                desc[key].value = this["clone-deep"](val);
            }
        }.bind(this));
        Object.defineProperties(ret, desc);

        return ret;
    }
}

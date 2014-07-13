module.exports = {
    "contains": function(ele, parent, str) {
        return String(ele).indexOf(String(str)) !== -1;
    },
    "val": function(ele, parent, val) {
        return ele === val;
    },
    "val-coerced": function(ele, parent, val) {
        return ele === val;
    }
};

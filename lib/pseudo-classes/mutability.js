module.exports = {
    "read-only": function(ele, parent) {
        if(typeof(ele) === "object") {
            return Object.isFrozen(ele);
        } else {
            return Object.isFrozen(parent);
        }
    },
    "read-write": function(ele, parent) {
        return !this["read-only"](ele, parent);
    }
};

var ComplexSelector = require("./complex"),
    mapComplexSelector = function(selector) {
        return new ComplexSelector(selector);
    },
    normalise = require("../tools").normalise;

module.exports = function(selector) {
    this.selector = normalise(selector);
    this.complexSelectors = this.selector.split(",").map(mapComplexSelector);
};

module.exports.prototype.matches = function(object) {
    return this.complexSelectors.some(function(ele) {
        return ele.matches(object);
    });
};

module.exports.prototype.find = function(object) {
    var matches = [];

    this.complexSelectors.forEach(function(ele) {
        matches = matches.concat(ele.find(object));
    });

    return matches.filter(function(ele, i, arr) {
        return arr.indexOf(ele, i + 1) === -1;
    });
};

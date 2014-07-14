var fs = require("fs"),
    path = require("path"),
    pathPseudoClasses = path.join(__dirname, "pseudo-classes"),
    pseudoClasses = {};

// this module would be loaded without any of the pseudo-classes if this were async
fs.readdirSync(pathPseudoClasses).forEach(function(file) {
    var pseudoClassGroup = require(path.join(pathPseudoClasses, file));

    Object.keys(pseudoClassGroup).forEach(function(key) {
        if(pseudoClasses.hasOwnProperty(key)) {
            throw new Error("pseudo class `" + key + "` arleady registered");
        }

        pseudoClasses[key] = pseudoClassGroup[key];
    });
});

module.exports = pseudoClasses;

var fs = require("fs"),
    path = require("path"),
    pathPseudoClasses = path.join(__dirname, "pseudo-classes"),
    pseudoClasses = {},
    files;

files = fs.readdirSync(pathPseudoClasses);

files.forEach(function(file) {
    var pseudoClassGroup = require(path.join(pathPseudoClasses, file));

    Object.getOwnPropertyNames(pseudoClassGroup).forEach(function(pseudoClassName) {
        if(pseudoClassName in pseudoClasses) {
            throw new Error("pseudo class " + pseudoClassName + " arleady registered");
        }

        pseudoClasses[pseudoClassName] = pseudoClassGroup[pseudoClassName];
    });
});

module.exports = pseudoClasses;

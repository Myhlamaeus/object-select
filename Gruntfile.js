"use strict";

module.exports = function (grunt) {
    // Show elapsed time at the end
    require("time-grunt")(grunt);
    // Load all grunt tasks
    require("load-grunt-tasks")(grunt);

    // Project configuration.
    grunt.initConfig({
        "project": {
            "lib": "lib",
            "tmp": ".tmp",
            "dist": "dist"
        },
        "nodeunit": {
            "simple": ["test/simple.js"],
            "compound": ["test/compound.js"],
            "complex": ["test/complex.js"],
            "parse-str": ["test/parse-str.js"],
            "list": ["test/list.js"],
            "pseudo-classes": ["test/pseudo-classes/*.js"]
        },
        "jshint": {
            "options": {
                "jshintrc": ".jshintrc",
                "reporter": require("jshint-stylish")
            },
            "gruntfile": {
                "src": "Gruntfile.js"
            },
            "lib": {
                "src": ["<%= project.lib %>/**/*.js"]
            },
            "test": {
                "src": ["test/**/*.js"]
            }
        },
        "watch": {
            "gruntfile": {
                "files": "<%= jshint.gruntfile.src %>",
                "tasks": ["jshint:gruntfile"]
            },
            "lib": {
                "files": "<%= jshint.lib.src %>",
                "tasks": ["jshint:lib", "nodeunit"]
            },
            "test": {
                "files": "<%= jshint.test.src %>",
                "tasks": ["jshint:test", "nodeunit"]
            }
        },
        "browserify": {
            "main": {
                "src": ["<%= project.lib %>/object-select.js"],
                "dest": "<%= project.dist %>/browser.js",
                "options": {
                    "bundleOptions": {
                        "standalone": "browser"
                    }
                }
            }
        },
        "uglify": {
            "browser": {
                "src": ["<%= project.dist %>/browser.js"],
                "dest": "<%= project.dist %>/browser.min.js"
            }
        },
        "clean": {
            "tmp": ["<%= project.tmp %>"]
        }
    });

    // Default task.
    grunt.registerTask("default", ["jshint", "nodeunit"]);
    grunt.registerTask("browser", ["browserify", "uglify:browser"]);
};

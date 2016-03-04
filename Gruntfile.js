/*global require, module*/
"use strict";

module.exports = function(grunt) {
    require("time-grunt")(grunt);
    require("jit-grunt")(grunt, { "joiceAnnotate": "build/grunt-joice-annotate.js" });
    grunt.initConfig({
        clean: {
            dist: {
                files: [
                    {
                        dot: true,
                        src: [
                            ".tmp",
                            "dist/{,*/}*",
                            "!dist/.git{,*/}*"
                        ]
                    }
                ]
            }
        },
        jshint: {
            options: {
                jshintrc: ".jshintrc",
                reporter: require("jshint-stylish")
            },
            dist: {
                src: ["src/{,*/}*.js"]
            },
            test: {
                options: {
                    jshintrc: "tests/.jshintrc",
                    ignores: ["tests/karma.conf.js"]
                },
                src: ["tests/{,*/}*.js"]
            }
        },
        concat: {
            options: {
                separator: "\r\n"
            },
            dist: {
                src: [
                    "src/namespace.js",
                    "src/StringExtensions.js",
                    "src/FunctionExtensions.js",
                    "src/Exception.js",
                    "src/Resolver.js",
                    "src/ServiceDescriptor.js",
                    "src/{,*/}*.js"
                ],
                dest: "dist/joice.js"
            }
        },
        joiceAnnotate: {
            dist: {
                src: ["dist/joice.js"],
                dest: "dist/joice.js"
            }
        },
        uglify: {
            dist: {
                files: {
                    "dist/joice.min.js": ["dist/joice.js"]
}
            }
        },
        jsdoc: {
            dist: {
                jsdoc: "node_modules/grunt-jsdoc/node_modules/jsdoc/jsdoc.js",
                src: ["src/*.js"],
                options: {
                    destination: "doc",
                    recurse: true,
                    template: "node_modules/ink-docstrap/template"
                }
            }
        },
        copy: {
            dist: {
                files: [{
                    src: ["package.json", "LICENSE", "README.md"],
                    dest: "dist/"
                }, {
                    src: ["build/grunt-joice-annotate.js"],
                    dest: "dist/grunt-joice-annotate.js"
                }, {
                    src: ["build/joice-annotate.js"],
                    dest: "dist/joice-annotate.js"
                }]
            }
        },
        karma: {
            unit: {
                configFile: "tests/karma.conf.js",
                singleRun: true
            }
        }
    });
    
    grunt.loadNpmTasks("grunt-jsdoc");
    grunt.registerTask("test", [
        "karma:unit"
    ]);
    
    grunt.registerTask("build", [
        "clean:dist",
        "jshint:dist",
        "jshint:test",
        "concat:dist",
        "joiceAnnotate:dist",
        "uglify:dist",
        "jsdoc:dist",
        "copy:dist"
    ]);
    
    grunt.registerTask("default", [
        "test",
        "build"
    ]);
};
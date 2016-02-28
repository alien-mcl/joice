/*global require, module*/
"use strict";

module.exports = function (grunt) {
    require("time-grunt")(grunt);
    require("jit-grunt")(grunt);
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
                src: ["src/{,*/}*.js"],
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
                        src: ".build/package.json",
                        dest: "dist/package.json"
                    }, {
                        src: ["LICENSE", "README.md"],
                        dest: "dist/"
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
        "uglify:dist",
        "jsdoc:dist",
        "copy:dist"
    ]);
    
    grunt.registerTask("default", [
        "test",
        "build"
    ]);
};
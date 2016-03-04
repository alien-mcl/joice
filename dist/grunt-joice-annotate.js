/*global __dirname*/
module.exports = function(grunt) {
    "use strict";
    var path = require("path");
    grunt.registerMultiTask("joiceAnnotate", "Annotates classes so they can be used in JoICe dependency injection framework after minification.", function () {
        debugger;
        var joice = require(__dirname + path.sep + "joice-annotate.js");
        var codeProcessor = new joice.CodeProcessor();
        this.files.forEach(function(file) {
            var isExpandedPair = file.orig.expand || false;
            file.src.filter(function(filePath) {
                if (!grunt.file.exists(filePath)) {
                    grunt.warn("Source file \"" + filePath + "\" not found.");
                    return false;
                }
                
                return true;
            }).
            map(function(filePath) {
                if (grunt.file.isDir(filePath)) {
                    return;
                }
                
                var dest = file.dest;
                if (grunt.util._.endsWith(dest, "/") === "directory") {
                    dest = (isExpandedPair ? dest : path.join(dest, file.src));
                }
                
                
                var fileContent = grunt.file.read(filePath);
                fileContent = codeProcessor.process(fileContent);
                grunt.file.write(dest, fileContent);
            });
        });
    });
};
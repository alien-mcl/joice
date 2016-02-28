/*global global, module*/
(function() {
    "use strict";

    var isNode = ((typeof(process) === "object") && (typeof(process.versions) === "object") && (typeof(process.versions.node) !== "undefined"));
    if (isNode) {
        global.namespace = function() { return module.exports; };
    }
    else if (!window.namespace) {
        window.namespace = function(ns) {
            if ((ns === undefined) || (ns === null) || ((typeof (ns) !== "string") && (!(ns instanceof String)))) {
                return window;
            }
            
            ns = (ns instanceof String ? ns.toString() : ns);
            var parts = ns.split(".");
            var current = window;
            for (var index = 0; index < parts.length; index++) {
                if ((current[parts[index]] === undefined) || (current[parts[index]] === null)) {
                    current = current[parts[index]] = {};
                }
                else {
                    current = current[parts[index]];
                }
                
                current.__namespace = true;
            }
            
            return current;
        };
    }
}());
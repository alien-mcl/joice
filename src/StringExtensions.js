(function() {
    "use strict";

    String.format = function(format) {
        if ((format === undefined) || (format === null)) {
            return format;
        }
        
        var parameters = [];
        for (var index = 1; index < arguments.length; index++) {
            parameters.push(((arguments[index] === undefined) || (arguments[index] === null) ? "" : arguments[index].toString())
                .replace(/(\{|\})/g, function (match) { return "_\\" + match; }));
        }
        
        var result = format.replace(/(\{\{\d\}\}|\{\d\})/g, function (match) {
            if (match.substr(0, 2) === "{{") {
                return match;
            }
            
            var index = parseInt(match.substr(1, match.length - 2));
            return parameters[index];
        });
        
        return result.replace(/(_\\\{|_\\\})/g, function (match) {
            return match.substr(2, 1);
        });
    };
}());
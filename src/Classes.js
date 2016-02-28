/*global namespace, joice*/
(function(namespace) {
    "use strict";
    
    var _Classes = {};

    /**
     * Entry point for fluent API for service registrations by convention.
     * @memberof joice
     * @name Classes
     * @public
     * @static
     * @class
     */
    var Classes = namespace.Classes = {};
    /**
     * Returns a registration for given type.
     * @memberof joice.Classes
     * @public
     * @static
     * @member {joice.ConventionDescriptor} implementing
     * @param {Function} type Type of the service to find implementations for.
     */
    Classes.implementing = function(type) {
        Function.requiresArgument("type", type, Function);
        var result = new joice.ConventionDescriptor(type);
        result._implementationTypes = _Classes.resolve.call(this, type, window, [], 0);
        return result;
    };
    /**
     * Gets a max resolution depth, which is 4 by default.
     * @memberof joice.Classes
     * @public
     * @static
     * @member {number} maxResolutionDepth
     */
    Classes.maxResolutionDepth = 4;
    Classes.toString = function() { return "joice.Classes"; };
    _Classes.is = function(type) {
        if ((this.prototype === undefined) || (this.prototype === null)) {
            return false;
        }
        
        if (this.prototype instanceof type) {
            return true;
        }
        
        return _Classes.is.call(this.prototype, type);
    };
    _Classes.forbiddenProperties = [/^webkit.*/];
    _Classes.forbiddenProperties.matches = function(propertyName) {
        for (var index = 0; index < _Classes.forbiddenProperties.length; index++) {
            var forbiddenProperty = _Classes.forbiddenProperties[index];
            if ((forbiddenProperty === propertyName) || (forbiddenProperty.test(propertyName))) {
                return true;
            }
        }
        
        return false;
    };
    _Classes.resolve = function(type, target, result, depth) {
        if (depth > Classes.maxResolutionDepth) {
            return result;
        }
        
        for (var property in target) {
            if (!target.hasOwnProperty(property)) {
                continue;
            }

            if (_Classes.forbiddenProperties.matches(property)) {
                continue;
            }
            
            if ((target.hasOwnProperty(property)) && (target[property] !== undefined) && (target[property] !== null)) {
                if ((typeof (target[property]) === "object") && (target[property].__namespace)) {
                    _Classes.resolve.call(this, type, target[property], result, depth + 1);
                }
                else if ((typeof (target[property]) === "function") && (result.indexOf(target[property]) === -1) && (_Classes.is.call(target[property], type))) {
                    result.push(target[property]);
                }
            }
        }
        
        return result;
    };
}(namespace("joice")));
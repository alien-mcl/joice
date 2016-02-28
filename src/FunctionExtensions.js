/*global joice*/
(function() {
    "use strict";
    Object.defineProperty(Function.prototype, ":", { enumerable: false, configurable: false, value: function(superClass) {
        var givenClass = this;
        for (var property in superClass) {
            if (superClass.hasOwnProperty(property)) {
                givenClass[property] = superClass[property];
            }
        }
            
        function SuperClassAlias() {
            this.constructor = givenClass;
        }

        SuperClassAlias.prototype = superClass.prototype;
        givenClass.prototype = new SuperClassAlias();
        return givenClass;
    } });
    Object.defineProperty(Function, "requiresArgument", { enumerable: false, configurable: false, value: function(argumentName, argumentValue, argumentType) {
        if (argumentValue === undefined) {
            throw new joice.ArgumentException(argumentName);
        }
            
        if (argumentValue === null) {
            throw new joice.ArgumentNullException(argumentName);
        }
            
        if (!argumentType) {
            return;
        }
            
        if (!Function.is(argumentValue, argumentType)) {
            throw new joice.ArgumentOutOfRangeException(argumentName);
        }
    } });
    Object.defineProperty(Function, "requiresOptionalArgument", { enumerable: false, configurable: false, value: function(argumentName, argumentValue, argumentType) {
        if ((argumentValue !== undefined) && (argumentValue !== null) && (argumentType) && (!Function.is(argumentValue, argumentType))) {
            throw new joice.ArgumentOutOfRangeException(argumentName);
        }
    } });
    Object.defineProperty(Function, "is", { enumerable: false, configurable: false, value: function(instance, type) {
        if (!type) {
            return true;
        }
            
        if (typeof (type) === "string") {
            return (typeof (instance) === type);
        }
            
        if (type instanceof Function) {
            if ((instance === type) || (instance instanceof type) || ((instance.prototype) && (Function.is(instance.prototype, type)))) {
                return true;
            }
                
            if (Function.isInterface(type)) {
                return Function.implements(instance, type);
            }
                
            return false;
        }
            
        return true;
    } });
    Object.defineProperty(Function, "implements", { enumerable: false, configurable: false, value: function(instance, $interface) {
        for (var property in $interface) {
            if ($interface.hasOwnProperty(property)) {
                if (typeof (instance[property]) !== typeof ($interface[property])) {
                    return false;
                }
            }
        }
            
        return true;
    } });
    Object.defineProperty(Function, "isInterface", { enumerable: false, configurable: false, value: function(Type) {
        try {
            new Type();
            return false;
        }
        catch (exception) {
            return true;
        }
    } });
}());
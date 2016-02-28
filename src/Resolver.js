/*global namespace*/
(function(namespace) {
    "use strict";
    
    /**
     * An abstract of the type resolver.
     * @memberof joice
     * @name Resolver
     * @public
     * @abstract
     * @class
     */
    var Resolver = namespace.Resolver = function() { };
    /**
     * Checks if the resolver is applicable for a given dependency name.
     * @memberof joice.Resolver
     * @public
     * @instance
     * @member {boolean} isApplicableTo
     * @param {string} dependency Name of the dependency to check applicability.
     */
    Resolver.prototype.isApplicableTo = function(dependency) {
        Function.requiresArgument("dependency", dependency, "string");
        return false;
    };
    /**
     * Resolves an instance of a given depedency.
     * @memberof joice.Resolver
     * @public
     * @instance
     * @member {boolean} resolve
     * @param {string} dependency Name of the dependency to check applicability.
     * @param {Array<string>} dependencyStack Stack of dependencies in current context.
     */
    Resolver.prototype.resolve = function(dependency, dependencyStack) {
        Function.requiresArgument("dependency", dependency, "string");
        Function.requiresArgument("dependencyStack", dependencyStack, Array);
        return null;
    };
    /**
     * Contains a reference to the owning container.
     * @memberof joice.Resolver
     * @protected
     * @instance
     * @member {joice.Container} container
     */
    Object.defineProperty(Resolver.prototype, "container", { enumerable: false, configurable: false, writable: true, value: null });
    /**
     * Removes occurances of given names from the dependency name.
     * @memberof joice.Resolver
     * @protected
     * @instance
     * @member {string} normalize
     * @param {string} dependency Dependency name to be processed.
     * @param {Array<string>} names Names to be removed from dependency name.
     */
    Object.defineProperty(Resolver.prototype, "normalize", { enumerable: false, configurable: false, writable: false, value: function(dependency, names) {
        for (var nameIndex = 0; nameIndex < names.length; nameIndex++) {
            var name = new RegExp(names[nameIndex]).exec(dependency);
            if ((name !== null) && (name.length > 1)) {
                dependency = name[1];
                break;
            }
        }
        
        return dependency;
        }
    });
    Resolver.toString = function() { return "joice.Resolver"; };
}(namespace("joice")));
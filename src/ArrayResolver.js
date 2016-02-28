/*global namespace, joice*/
(function(namespace) {
    "use strict";
    
    /**
     * Resolves arrays of types.
     * @memberof joice
     * @name ArrayResolver
     * @public
     * @class
     * @extends joice.Resolver
     */
    var ArrayResolver = (namespace.ArrayResolver = function() { })[":"](joice.Resolver);
    ArrayResolver.prototype.isApplicableTo = function (dependency) {
        joice.Resolver.prototype.isApplicableTo.apply(this, arguments);
        var normalizedDependency = this.normalize.call(this, dependency, ArrayResolver.arrayIndicators);
        return (normalizedDependency !== dependency);
    };
    ArrayResolver.prototype.resolve = function(dependency, dependencyStack) {
        dependency = this.normalize.call(this, dependency, ArrayResolver.arrayIndicators);
        var result = [];
        var registrationTypes = this.container.findServices(dependency);
        for (var index = 0; index < registrationTypes.length; index++) {
            var instance = this.container.resolveInternal(registrationTypes[index], dependencyStack);
            if (instance !== null) {
                result.push(instance);
            }
        }
        
        return result;
    };
    ArrayResolver.arrayIndicators = ["^arrayOf(.*)", "^collectionOf(.*)", "^enumerationOf(.*)"];
    ArrayResolver.toString = function() { return "joice.ArrayResolver"; };
}(namespace("joice")));
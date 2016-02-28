/*global namespace, joice*/
(function(namespace) {
    "use strict";
    
    /**
     * Resolves types themselves.
     * @memberof joice
     * @name TypeResolver
     * @public
     * @class
     * @extends joice.Resolver
     */
    var TypeResolver = (namespace.TypeResolver = function() { })[":"](joice.Resolver);
    TypeResolver.prototype.isApplicableTo = function(dependency) {
        Function.requiresArgument("dependency", dependency, "string");
        var normalizedDependency = this.normalize.call(this, dependency, TypeResolver.typeIndicators);
        return (normalizedDependency !== dependency);
    };
    TypeResolver.prototype.resolve = function(dependency) {
        var normalizedDependency = this.normalize.call(this, dependency, joice.ArrayResolver.arrayIndicators);
        var isArray = dependency !== normalizedDependency;
        dependency = this.normalize.call(this, normalizedDependency, TypeResolver.typeIndicators);
        var serviceTypes = this.container.findServices(dependency);
        return (isArray ? serviceTypes : (serviceTypes.length > 0 ? serviceTypes[0] : null));
    };
    TypeResolver.typeIndicators = ["(.*)Type$", "(.*)Types$"];
}(namespace("joice")));
/*global namespace, joice*/
(function(namespace) {
    "use strict";
    
    /**
     * Resolves single instances of types.
     * @memberof joice
     * @name InstanceResolver
     * @public
     * @class
     * @extends joice.Resolver
     */
    var InstanceResolver = (namespace.InstanceResolver = function() { })[":"](joice.Resolver);
    InstanceResolver.prototype.isApplicableTo = function(dependency) {
        Function.requiresArgument("dependency", dependency, "string");
        var normalizedDependency = this.normalize.call(this, dependency, joice.ArrayResolver.arrayIndicators);
        normalizedDependency = this.normalize.call(this, normalizedDependency, joice.TypeResolver.typeIndicators);
        normalizedDependency = this.normalize.call(this, normalizedDependency, joice.FactoryResolver.factoryIndicators);
        return (normalizedDependency === dependency);
    };
    InstanceResolver.prototype.resolve = function(dependency, dependencyStack) {
        var argumentRegistration = this.container.findType(dependency);
        if (argumentRegistration !== null) {
            return this.container.resolveInternal(argumentRegistration, dependencyStack);
        }
        
        return null;
    };
}(namespace("joice")));
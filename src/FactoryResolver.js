/*global namespace, joice*/
(function(namespace) {
    "use strict";
    
    /**
     * Resolves component factories.
     * @memberof ursa
     * @name FactoryResolver
     * @public
     * @class
     * @extends joice.Resolver
     */
    var FactoryResolver = (namespace.FactoryResolver = function() { })[":"](joice.Resolver);
    FactoryResolver.prototype.isApplicableTo = function(dependency) {
        Function.requiresArgument("dependency", dependency, "string");
        var normalizedDependency = this.normalize.call(this, dependency, FactoryResolver.factoryIndicators);
        return (normalizedDependency !== dependency);
    };
    FactoryResolver.prototype.resolve = function(dependency) {
        dependency = this.normalize.call(this, dependency, FactoryResolver.factoryIndicators);
        var dependencyArray = "arrayOf" + dependency.substring(0, 1).toUpperCase() + dependency.substring(1);
        var instanceResolver = this.container.findResolver(dependency);
        var arrayResolver = this.container.findResolver(dependencyArray);
        if ((instanceResolver === null) && (arrayResolver === null)) {
            return null;
        }
        
        var factory = {};
        factory.resolve = function() {
            return instanceResolver.resolve(dependency, []);
        };
        
        factory.resolveAll = function() {
            return arrayResolver.resolve(dependencyArray, []);
        };
        
        return factory;
    };
    FactoryResolver.factoryIndicators = ["(.*)Factory$", "(.*)Factory$"];
}(namespace("joice")));
/*global namespace, joice*/
(function(namespace) {
    "use strict";
    
    /**
     * Defines an abstract of a service description facility.
     * @memberof joice
     * @name ServiceDescriptor
     * @public
     * @abstract
     * @class
     * @param {Function} serviceType Type of service to be registered.
     */
    var ServiceDescriptor = namespace.ServiceDescriptor = function(serviceType) {
        Function.requiresArgument("serviceType", serviceType, Function);
        this.serviceType = serviceType;
        this.scope = joice.Scope.Transient;
    };
    Object.defineProperty(ServiceDescriptor.prototype, "serviceType", { enumerable: false, configurable: false, writable: true, value: null });
    Object.defineProperty(ServiceDescriptor.prototype, "scope", { enumerable: false, configurable: false, writable: true, value: null });
    /**
     * Registers service implementations in the given container.
     * @memberof joice
     * @public
     * @instance
     * @member register
     * @param {joice.Container} container Target container to register in.
     */
    ServiceDescriptor.prototype.register = function(container) {
        Function.requiresArgument("container", container, joice.Container);
    };
    /**
     * Defines a singleton scope of the instances being resolved for this registration.
     * @memberof joice
     * @public
     * @instance
     * @member {joice.ServiceDescriptor} lifestyleSingleton
     */
    ServiceDescriptor.prototype.lifestyleSingleton = function() {
        this.scope = joice.Scope.Singleton;
        return this;
    };
    /**
     * Defines a transient scope of the instances being resolved for this registration.
     * @memberof joice
     * @public
     * @instance
     * @member {joice.ServiceDescriptor} lifestyleTransient
     */
    ServiceDescriptor.prototype.lifestyleTransient = function() {
        this.scope = joice.Scope.Transient;
        return this;
    };
    ServiceDescriptor.toString = function() { return "joice.ServiceDescriptor"; };
}(namespace("joice")));
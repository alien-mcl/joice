/*global namespace, joice*/
(function(namespace) {
    "use strict";
    
    /**
     * Defines a component descriptor.
     * @memberof joice
     * @name ComponentDescriptor
     * @public
     * @class
     * @param {Function} serviceType Type of service to be registered.
     * @extends joice.ServiceDescriptor
     */
    var ComponentDescriptor = (namespace.ComponentDescriptor = function() {
        joice.ServiceDescriptor.prototype.constructor.apply(this, arguments);
        this._implementationType = null;
        this._instance = null;
        this._factoryMethod = null;
        this._name = null;
        this._dependencies = null;
    })[":"](joice.ServiceDescriptor);
    Object.defineProperty(ComponentDescriptor.prototype, "_implementationType", { enumerable: false, configurable: false, writable: true, value: null });
    Object.defineProperty(ComponentDescriptor.prototype, "_instance", { enumerable: false, configurable: false, writable: true, value: null });
    Object.defineProperty(ComponentDescriptor.prototype, "_factoryMethod", { enumerable: false, configurable: false, writable: true, value: null });
    Object.defineProperty(ComponentDescriptor.prototype, "_name", { enumerable: false, configurable: false, writable: true, value: null });
    Object.defineProperty(ComponentDescriptor.prototype, "_dependencies", { enumerable: false, configurable: false, writable: true, value: null });
    /**
     * Defines a type to be registered as an implementation of the service type.
     * @memberof joice.ComponentDescriptor
     * @public
     * @instance
     * @member {joice.ComponentDescriptor} implementedBy
     * @param {Function} implementationType Type implementing a service.
     */
    ComponentDescriptor.prototype.implementedBy = function(implementationType) {
        Function.requiresArgument("implementationType", implementationType, this.serviceType);
        this._implementationType = implementationType;
        this._instance = null;
        this._factoryMethod = null;
        this._name = implementationType.toString();
        return this;
    };
    /**
     * Defines an instance to be registered as an implementation of the service type.
     * @memberof joice.ComponentDescriptor
     * @public
     * @instance
     * @member {joice.ComponentDescriptor} instance
     * @param {object} instance Instance implementing a service.
     */
    ComponentDescriptor.prototype.instance = function(instance) {
        Function.requiresArgument("instance", instance, this.serviceType);
        this._instance = instance;
        this._implementationType = instance.prototype;
        this._factoryMethod = null;
        this._name = instance.prototype.toString();
        return this;
    };
    /**
     * Defines an instance to be registered as an implementation of the service type.
     * @memberof joice.ComponentDescriptor
     * @public
     * @instance
     * @member {joice.ComponentDescriptor} usingFactoryMethod
     * @param {object} instance Instance implementing a service.
     */
    ComponentDescriptor.prototype.usingFactoryMethod = function(factoryMethod) {
        Function.requiresArgument("factoryMethod", factoryMethod, Function);
        this._instance = null;
        this._implementationType = null;
        this._factoryMethod = factoryMethod;
        return this;
    };
    /**
     * Defines a name for this component registration.
     * @memberof joice.ComponentDescriptor
     * @public
     * @instance
     * @member {joice.ComponentDescriptor} named
     * @param {string} name Name of the registration.
     */
    ComponentDescriptor.prototype.named = function(name) {
        Function.requiresArgument("name", name, "string");
        if (name.length === 0) {
            throw new joice.ArgumentOutOfRangeException("name");
        }
        
        this._name = name;
        return this;
    };
    ComponentDescriptor.prototype.register = function(container) {
        joice.ServiceDescriptor.prototype.register.apply(this, arguments);
        var registration = new joice.Registration(
            this.serviceType,
            (this._factoryMethod !== null ? this._factoryMethod : (this._instance || this._implementationType)),
            this._factoryMethod !== null,
            this.scope,
            this._name);
        container.register(registration);
    };
    ComponentDescriptor.toString = function() { return "joice.ComponentDescriptor"; };
}(namespace("joice")));
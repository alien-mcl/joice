/*global namespace, joice*/
(function(namespace) {
    "use strict";
    
    /**
     * Defines a class conventions descriptor.
     * @memberof joice
     * @name ConventionDescriptor
     * @public
     * @class
     * @param {Function} serviceType Type of service to be registered.
     * @extends joice.ServiceDescriptor
     */
    var ConventionDescriptor = (namespace.ConventionDescriptor = function() {
        joice.ServiceDescriptor.prototype.constructor.apply(this, arguments);
        this._implementationTypes = null;
    })[":"](joice.ServiceDescriptor);
    Object.defineProperty(ConventionDescriptor.prototype, "_implementationTypes", { enumerable: false, configurable: false, writable: true, value: null });
    ConventionDescriptor.prototype.register = function(container) {
        joice.ServiceDescriptor.prototype.register.apply(this, arguments);
        for (var index = 0; index < this._implementationTypes.length; index++) {
            container.register(new joice.Registration(this.serviceType, this._implementationTypes[index], false, this.scope));
        }
    };
    ConventionDescriptor.toString = function() { return "joice.ConventionDescriptor"; };
}(namespace("joice")));
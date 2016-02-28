/*global namespace, joice*/
(function(namespace) {
    "use strict";
    
    var _Registration = {};

    /**
     * Represents a service registration.
     * @memberof joice
     * @name Registration
     * @public
     * @class
     * @param {Function} serviceType Type of service to be registered.
     * @param {Function|object} implementation Class implementing a service or an instance to be used as implementation.
     * @param {boolean} [implementationIsFactoryMethod] Flag indicating whether the implementation is not a class but a factory method.
     * @param {joice.Scope} [scope] Instance lifestyle.
     * @param {string} [name] Name of the implementation.
     */
    var Registration = namespace.Registration = function(serviceType, implementation, implementationIsFactoryMethod, scope, name) {
        Function.requiresArgument("serviceType", serviceType, Function);
        Function.requiresArgument("implementation", implementation);
        Function.requiresOptionalArgument("implementationIsFactoryMethod", implementationIsFactoryMethod, "boolean");
        Function.requiresOptionalArgument("scope", scope, joice.Scope);
        Function.requiresOptionalArgument("name", name, "string");
        if ((!(implementation instanceof Function)) && (typeof (implementation) !== "object")) {
            throw new joice.ArgumentOutOfRangeException("implementation");
        }
        
        implementationIsFactoryMethod = (typeof (implementationIsFactoryMethod) === "boolean" ? implementationIsFactoryMethod : false);
        this._serviceType = serviceType;
        this._implementationType = (implementation instanceof Function ? (implementationIsFactoryMethod ? null : implementation) : implementation.prototype);
        this._instance = (implementation instanceof Function ? null : implementation);
        this._factoryMethod = ((implementation instanceof Function) && (implementationIsFactoryMethod) ? implementation : null);
        this._scope = scope || joice.Scope.Transient;
        this._name = (this._factoryMethod !== null ? name : (name || this._implementationType.toString()));
        this._dependencies = [];
        if (this._factoryMethod === null) {
            _Registration.initialize.call(this);
        }
    };
    Object.defineProperty(Registration.prototype, "_serviceType", { enumerable: false, configurable: false, writable: true, value: null });
    Object.defineProperty(Registration.prototype, "_implementationType", { enumerable: false, configurable: false, writable: true, value: null });
    Object.defineProperty(Registration.prototype, "_instance", { enumerable: false, configurable: false, writable: true, value: null });
    Object.defineProperty(Registration.prototype, "_factoryMethod", { enumerable: false, configurable: false, writable: true, value: null });
    Object.defineProperty(Registration.prototype, "_scope", { enumerable: false, configurable: false, writable: true, value: null });
    Object.defineProperty(Registration.prototype, "_name", { enumerable: false, configurable: false, writable: true, value: null });
    Object.defineProperty(Registration.prototype, "_dependencies", { enumerable: false, configurable: false, writable: true, value: null });
    Registration.toString = function() { return "joice.Registration"; };
    _Registration.initialize = function() {
        var index;
        if ((this._implementationType.dependencies) && (this._implementationType.dependencies instanceof Array)) {
            for (index = 0; index < this._implementationType.dependencies.length; index++) {
                this.dependencies.push(this._implementationType.dependencies[index]);
            }
        }
        else {
            var code = Function.prototype.toString.call(this._implementationType);
            var parameters = code.match(/\(([^)]*)\)/);
            if ((parameters !== null) && (parameters.length > 1)) {
                parameters = parameters[1].split(",");
                for (index = 0; index < parameters.length; index++) {
                    var parameter = parameters[index].trim();
                    if (parameter.length === 0) {
                        continue;
                    }
                    
                    this._dependencies.push(parameter);
                }
            }
        }
    };
}(namespace("joice")));
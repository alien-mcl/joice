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
     * @param {string} [name] Name of the implementation.
     * @param {joice.Scope} [scope] Instance lifestyle.
     */
    var Registration = namespace.Registration = function(serviceType, implementation) {
        Function.requiresArgument("serviceType", serviceType, Function);
        Function.requiresArgument("implementation", implementation);
        if ((!(implementation instanceof Function)) && (typeof(implementation) !== "object")) {
            throw new joice.ArgumentOutOfRangeException("implementation");
        }

        _Registration.ctor.call(this, _Registration.setupArguments.apply(this, arguments));
    };
    Object.defineProperty(Registration.prototype, "_serviceType", { enumerable: false, configurable: false, writable: true, value: null });
    Object.defineProperty(Registration.prototype, "_implementationType", { enumerable: false, configurable: false, writable: true, value: null });
    Object.defineProperty(Registration.prototype, "_instance", { enumerable: false, configurable: false, writable: true, value: null });
    Object.defineProperty(Registration.prototype, "_factoryMethod", { enumerable: false, configurable: false, writable: true, value: null });
    Object.defineProperty(Registration.prototype, "_scope", { enumerable: false, configurable: false, writable: true, value: null });
    Object.defineProperty(Registration.prototype, "_name", { enumerable: false, configurable: false, writable: true, value: null });
    Object.defineProperty(Registration.prototype, "_dependencies", { enumerable: false, configurable: false, writable: true, value: null });
    Registration.toString = function() { return "joice.Registration"; };
    _Registration.setupArguments = function(serviceType) {
        var args = { serviceType: serviceType };
        for (var index = 1; index < arguments.length; index++) {
            var argument = arguments[index];
            if ((argument === undefined) || (argument === null)) {
                continue;
            }
            
            if (argument instanceof joice.Scope) {
                args.scope = argument;
            }
            else if (typeof (argument) === "string") {
                args.name = argument;
            }
            else if (typeof (argument) === "boolean") {
                if ((argument) && (args.implementationType)) {
                    args.factoryMethod = args.implementationType;
                    delete args.implementationType;
                }
            }
            else if (argument instanceof Function) {
                args[args.implementationIsFactoryMethod ? "factoryMethod" : "implementationType"] = argument;
            }
            else if (typeof (argument) === "object") {
                args.instance = argument;
            }
        }

        return args;
    };
    _Registration.ctor = function(args) {
        if (args.instance) {
            _Registration.createInstanceImplementation.call(this, args.serviceType, args.instance, args.name, args.scope);
        }
        else if (args.factoryMethod) {
            _Registration.createFactoryMethod.call(this, args.serviceType, args.factoryMethod, args.name, args.scope);
        }
        else if (args.implementationType) {
            _Registration.createImplementationType.call(this, args.serviceType, args.implementationType, args.name, args.scope);
        }
        else {
            throw new joice.InvalidOperationException("Parameters provided are not suitable to create a joice.Registration instance.");
        }

        this._dependencies = [];
        if (this._factoryMethod === null) {
            _Registration.initialize.call(this);
        }
    };
    _Registration.createImplementationType = function(serviceType, implementation, name, scope) {
        this._serviceType = serviceType;
        this._implementationType = implementation;
        this._instance = null;
        this._factoryMethod = null;
        this._name = (name || this._implementationType.toString());
        this._scope = scope || joice.Scope.Transient;
    };
    _Registration.createFactoryMethod = function(serviceType, factoryMethod, name, scope) {
        Function.requiresArgument("name", name, "string");
        this._serviceType = serviceType;
        this._implementationType = null;
        this._instance = null;
        this._factoryMethod = factoryMethod;
        this._name = name;
        this._scope = scope || joice.Scope.Transient;
    };
    _Registration.createInstanceImplementation = function(serviceType, instance, name, scope) {
        this._serviceType = serviceType;
        this._implementationType = instance.prototype;
        this._instance = instance;
        this._factoryMethod = null;
        this._name = (name || this._implementationType.toString());
        this._scope = scope || joice.Scope.Transient;
    };
    _Registration.initialize = function() {
        var index;
        if ((this._implementationType.dependencies) && (this._implementationType.dependencies instanceof Array)) {
            for (index = 0; index < this._implementationType.dependencies.length; index++) {
                var dependency = this._implementationType.dependencies[index].trim();
                if (dependency.length === 0) {
                    continue;
                }

                this._dependencies.push(dependency);
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
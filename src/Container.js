/*global namespace, joice*/
(function(namespace) {
    "use strict";
    
    var forbiddenNames = ["provider", "factory"];
    var _Container = {};

    /**
     * Inverse of Control container for resolving instances of given types.
     * @memberof joice
     * @name Container
     * @public
     * @class
     */
    var Container = namespace.Container = function() {
        this._registrations = new joice.RegistrationsCollection(this);
        this._resolvers = [];
        this.withResolver(new joice.FactoryResolver())
            .withResolver(new joice.TypeResolver())
            .withResolver(new joice.ArrayResolver())
            .withResolver(new joice.InstanceResolver());
    };
    Object.defineProperty(Container.prototype, "_registrations", { enumerable: false, configurable: false, writable: true, value: null });
    Object.defineProperty(Container.prototype, "_resolvers", { enumerable: false, configurable: false, writable: true, value: null });
    /**
     * Allows to add a custom instance resolver into the pipeline.
     * @memberof joice.Container
     * @public
     * @instance
     * @member {joice.Container} withResolver
     * @param {joice.Resolver} resolver The resolver to be added.
     */
    Container.prototype.withResolver = function(resolver) {
        Function.requiresArgument("resolver", resolver, joice.Resolver);
        this._resolvers.push(resolver);
        resolver.container = this;
        return this;
    };
    /**
     * Adds a given registration.
     * @memberof joice.Container
     * @public
     * @instance
     * @member {joice.Container} register
     * @param {...(joice.Registration|joice.ServiceDescriptor)} registration Registrations to be added.
     */
    Container.prototype.register = function() {
        for (var index = 0; index < arguments.length; index++) {
            var registration = arguments[index];
            if (registration instanceof joice.Registration) {
                _Container.registerRegistration.call(this, registration);
            }
            else if (registration instanceof joice.ServiceDescriptor) {
                registration.register(this);
            }
            else {
                throw new joice.ArgumentOutOfRangeException("registration");
            }
        }
        
        return this;
    };
    /**
     * Resolves an instance(s) of a given type.
     * @memberof joice.Container
     * @public
     * @instance
     * @member {object} resolve
     * @param {Function|Array<Function>} type Type to resolve instance of. If argument is an array, array of types will be returned.
     * @returns {object|Array<object>}
     */
    Container.prototype.resolve = function(type) {
        Function.requiresArgument("type", type);
        var isArray = (type instanceof Array);
        if (isArray) {
            if (type.length !== 1) {
                throw new joice.ArgumentOutOfRangeException("type");
            }
            
            type = type[0];
        }
        else {
            if (!(type instanceof Function)) {
                throw new joice.ArgumentOutOfRangeException("type");
            }
        }
        
        var index;
        var result = [];
        for (index = 0; index < this._registrations.length; index++) {
            var currentRegistration = this._registrations[index];
            if ((currentRegistration._serviceType.prototype instanceof type) || (currentRegistration._serviceType === type)) {
                result.push(currentRegistration);
                if (!isArray) {
                    break;
                }
            }
        }
        
        if ((!isArray) && (result.length === 0)) {
            throw new joice.InvalidOperationException(String.format("There are no components registered for service type of '{0}'.", type.toString()));
        }
        
        for (index = 0; index < result.length; index++) {
            result[index] = this.resolveInternal(result[index], []);
        }
        
        return (isArray ? result : result[0]);
    };
    /**
     * Resolves type(s) implementing a given type.
     * @memberof joice.Container
     * @public
     * @instance
     * @member {object} resolveType
     * @param {Function|Array<Function>} type Type to resolve instance of. If argument is an array, array of types will be returned.
     * @returns {Function|Array<Function>}
     */
    Container.prototype.resolveType = function(type) {
        Function.requiresArgument("type", type);
        var isArray = (type instanceof Array);
        if (isArray) {
            if (type.length !== 1) {
                throw new joice.ArgumentOutOfRangeException("type");
            }
            
            type = type[0];
        }
        else {
            if (!(type instanceof Function)) {
                throw new joice.ArgumentOutOfRangeException("type");
            }
        }
        
        var result = [];
        for (var index = 0; index < this._registrations.length; index++) {
            var currentRegistration = this._registrations[index];
            if ((currentRegistration._implementationType !== null) && 
                ((currentRegistration._serviceType.prototype instanceof type) || (currentRegistration._serviceType === type))) {
                if (isArray) {
                    result.push(currentRegistration._implementationType);
                }
                else {
                    return currentRegistration._implementationType;
                }
            }
        }
        
        if (isArray) {
            return result;
        }
        
        throw new joice.InvalidOperationException(String.format("There are no components registered for service type of '{0}'.", type.toString()));
    };
    Container.toString = function() { return "joice.Container"; };
    /**
     * Searches registration for a given dependency name.
     * @memberof joice.Container
     * @protected
     * @instance
     * @member {joice.Registration} findType
     * @param {string} dependency Dependency name to find the registration for.
     */
    Object.defineProperty(Container.prototype, "findType", { enumerable: false, configurable: false, writeable: false, value: function(dependency) {
        dependency = dependency.toLowerCase();
        var result = _Container.findTypeByNames.call(this, dependency, function (registration) {
            var typeNames = [registration._name];
            if ((registration._implementationType !== null) && (typeNames[0] !== registration._implementationType.toString())) {
                typeNames.push(registration._implementationType.toString());
            }
                
            return typeNames;
        });
        if (result !== null) {
            return result;
        }
            
        return _Container.findTypeByNames.call(this, dependency, function (registration) { return [registration._serviceType.toString()]; });
    } });
    /**
     * Searches registration for a given service name.
     * @memberof joice.Container
     * @protected
     * @instance
     * @member {joice.Registration} findServices
     * @param {string} dependency Service name to find the registration for.
     */
    Object.defineProperty(Container.prototype, "findServices", { enumerable: false, configurable: false, writeable: false, value: function(dependency) {
        var result = [];
        dependency = dependency.toLowerCase();
        for (var index = 0; index < this._registrations.length; index++) {
            var registration = this._registrations[index];
            var typeName = registration._serviceType.toString();
            if (dependency === typeName) {
                result.push(registration);
                continue;
            }
                
            typeName = typeName.split(".");
            typeName = typeName[typeName.length - 1].toLowerCase();
            var matchingName = typeName.replace(dependency, "");
            if ((matchingName !== typeName) && ((matchingName.length === 0) || ((matchingName.length > 0) && (forbiddenNames.indexOf(matchingName) === -1)))) {
                result.push(registration);
            }
        }
            
        return result;
    } });
    /**
     * Resolves a given registration.
     * @memberof joice.Container
     * @protected
     * @instance
     * @member {object} resolveInternal
     * @param {joice.Registration} registration Registration to resolve.
     * @param {Array<string>} dependencyStack Stack of dependencies in current context.
     */
    Object.defineProperty(Container.prototype, "resolveInternal", { enumerable: false, configurable: false, writeable: false, value: function(registration, dependencyStack) {
        if (dependencyStack.indexOf(registration) !== -1) {
            throw new joice.InvalidOperationException(String.format("Dependency loop detected for type '{0}'.", registration._implementationType));
        }
            
        dependencyStack.push(registration);
        var args = _Container.resolveArguments.call(this, registration, dependencyStack);
        dependencyStack.pop();
        return _Container.resolveInstance.call(this, registration, args);
    } });
    /**
     * Searches for a suitable resolver.
     * @memberof joice.Container
     * @inner
     * @instance
     * @member {object} resolveInternal
     * @param {joice.Registration} registration Registration to resolve.
     * @param {Array<string>} dependencyStack Stack of dependencies in current context.
     */
    Object.defineProperty(Container.prototype, "findResolver",{ enumerable: false, configurable: false, writeable: false, value: function(dependency) {
        var resolver = null;
        for (var resolverIndex = 0; resolverIndex < this._resolvers.length; resolverIndex++) {
            if (this._resolvers[resolverIndex].isApplicableTo(dependency)) {
                resolver = this._resolvers[resolverIndex];
                break;
            }
        }
        
        return resolver;
    } });
    _Container.registerRegistration = function(registration) {
        Function.requiresArgument("registration", registration, joice.Registration);
        if (this._registrations.indexOf(registration._name) !== -1) {
            throw new joice.Exception(String.format("Registration with name of '{0}' already exists.", registration._name));
        }
        
        this._registrations.push(registration);
        return this;
    };
    _Container.resolveArguments = function(registration, dependencyStack) {
        var args = [];
        for (var index = 0; index < registration._dependencies.length; index++) {
            var argumentInstance = null;
            var dependency = registration._dependencies[index];
            var resolver = this.findResolver.call(this, dependency);
            if (resolver !== null) {
                argumentInstance = resolver.resolve(dependency, dependencyStack);
            }
            
            args.push(argumentInstance);
        }
        
        return args;
    };
    _Container.resolveInstance = function(registration, args) {
        if ((registration._scope === joice.Scope.Singleton) && (registration._instance !== null)) {
            return registration._instance;
        }
        
        var instance;
        if (registration._factoryMethod !== null) {
            instance = registration._factoryMethod(this);
        }
        else {
            args.splice(0, 0, null);
            instance = new (Function.prototype.bind.apply(registration._implementationType, args))();
        }
        
        if (registration._scope === joice.Scope.Singleton) {
            return (registration._instance = instance);
        }
        
        return instance;
    };
    _Container.findTypeByNames = function(dependency, typeNameSelector) {
        for (var index = 0; index < this._registrations.length; index++) {
            var registration = this._registrations[index];
            var typeNames = typeNameSelector(registration);
            for (var typeNameIndex = 0; typeNameIndex < typeNames.length; typeNameIndex++) {
                var typeName = typeNames[typeNameIndex];
                if (dependency === typeName) {
                    return registration;
                }
                
                typeName = typeName.split(".");
                typeName = typeName[typeName.length - 1];
                if (typeName.toLowerCase().indexOf(dependency) !== -1) {
                    return registration;
                }
            }
        }
        
        return null;
    };
}(namespace("joice")));
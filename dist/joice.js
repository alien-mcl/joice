/*global global, module*/
(function() {
    "use strict";

    var isNode = ((typeof(process) === "object") && (typeof(process.versions) === "object") && (typeof(process.versions.node) !== "undefined"));
    if (isNode) {
        global.namespace = function() { return module.exports; };
    }
    else if (!window.namespace) {
        window.namespace = function(ns) {
            if ((ns === undefined) || (ns === null) || ((typeof (ns) !== "string") && (!(ns instanceof String)))) {
                return window;
            }
            
            ns = (ns instanceof String ? ns.toString() : ns);
            var parts = ns.split(".");
            var current = window;
            for (var index = 0; index < parts.length; index++) {
                if ((current[parts[index]] === undefined) || (current[parts[index]] === null)) {
                    current = current[parts[index]] = {};
                }
                else {
                    current = current[parts[index]];
                }
                
                current.__namespace = true;
            }
            
            return current;
        };
    }
}());
(function() {
    "use strict";

    String.format = function(format) {
        if ((format === undefined) || (format === null)) {
            return format;
        }
        
        var parameters = [];
        for (var index = 1; index < arguments.length; index++) {
            parameters.push(((arguments[index] === undefined) || (arguments[index] === null) ? "" : arguments[index].toString())
                .replace(/(\{|\})/g, function(match) { return "_\\" + match; }));
        }
        
        var result = format.replace(/(\{\{\d\}\}|\{\d\})/g, function(match) {
            if (match.substr(0, 2) === "{{") {
                return match;
            }
            
            var index = parseInt(match.substr(1, match.length - 2));
            return parameters[index];
        });
        
        return result.replace(/(_\\\{|_\\\})/g, function(match) {
            return match.substr(2, 1);
        });
    };
}());
/*global joice*/
(function() {
    "use strict";
    Object.defineProperty(Function.prototype, ":", { enumerable: false, configurable: false, value: function(superClass) {
        var givenClass = this;
        for (var property in superClass) {
            if (superClass.hasOwnProperty(property)) {
                givenClass[property] = superClass[property];
            }
        }
            
        function SuperClassAlias() {
            this.constructor = givenClass;
        }

        SuperClassAlias.prototype = superClass.prototype;
        givenClass.prototype = new SuperClassAlias();
        return givenClass;
    } });
    Object.defineProperty(Function, "requiresArgument", { enumerable: false, configurable: false, value: function(argumentName, argumentValue, argumentType) {
        if (argumentValue === undefined) {
            throw new joice.ArgumentException(argumentName);
        }
            
        if (argumentValue === null) {
            throw new joice.ArgumentNullException(argumentName);
        }
            
        if (!argumentType) {
            return;
        }
            
        if (!Function.is(argumentValue, argumentType)) {
            throw new joice.ArgumentOutOfRangeException(argumentName);
        }
    } });
    Object.defineProperty(Function, "requiresOptionalArgument", { enumerable: false, configurable: false, value: function(argumentName, argumentValue, argumentType) {
        if ((argumentValue !== undefined) && (argumentValue !== null) && (argumentType) && (!Function.is(argumentValue, argumentType))) {
            throw new joice.ArgumentOutOfRangeException(argumentName);
        }
    } });
    Object.defineProperty(Function, "is", { enumerable: false, configurable: false, value: function(instance, type) {
        if (!type) {
            return true;
        }
            
        if (typeof(type) === "string") {
            return (typeof(instance) === type);
        }
            
        if (type instanceof Function) {
            if ((instance === type) || (instance instanceof type) || ((instance.prototype) && (Function.is(instance.prototype, type)))) {
                return true;
            }
                
            if (Function.isInterface(type)) {
                return Function.implements(instance, type);
            }
                
            return false;
        }
            
        return true;
    } });
    Object.defineProperty(Function, "implements", { enumerable: false, configurable: false, value: function(instance, $interface) {
        for (var property in $interface) {
            if ($interface.hasOwnProperty(property)) {
                if (typeof (instance[property]) !== typeof ($interface[property])) {
                    return false;
                }
            }
        }
            
        return true;
    } });
    Object.defineProperty(Function, "isInterface", { enumerable: false, configurable: false, value: function(Type) {
        try {
            new Type();
            return false;
        }
        catch (exception) {
            return true;
        }
    } });
}());
/*global namespace*/
(function(namespace) {
    "use strict";

    /**
     * Represents a general exception.
     * @memberof joice
     * @name Exception
     * @public
     * @class
     * @extends Error
     * @param {string} message Message of the exception.
     */
    var Exception = (namespace.Exception = function(message) {
        if (!this.message) {
            this.message = message;
        }

        var error = Error.prototype.constructor.call(this, this.message);
        error.name = this.name = this.constructor.toString();
        Object.defineProperty(this, "stack", { get: function() { return error.stack; } });
    })[":"](Error);
    namespace.Exception.dependencies = ["message"];
    Exception.toString = function() { return "joice.Exception"; };
}(namespace("joice")));
/*global namespace*/
(function(namespace) {
    "use strict";
    
    /**
     * An abstract of the type resolver.
     * @memberof joice
     * @name Resolver
     * @public
     * @abstract
     * @class
     */
    var Resolver = namespace.Resolver = function() { };
    /**
     * Checks if the resolver is applicable for a given dependency name.
     * @memberof joice.Resolver
     * @public
     * @instance
     * @member {boolean} isApplicableTo
     * @param {string} dependency Name of the dependency to check applicability.
     */
    Resolver.prototype.isApplicableTo = function(dependency) {
        Function.requiresArgument("dependency", dependency, "string");
        return false;
    };
    /**
     * Resolves an instance of a given depedency.
     * @memberof joice.Resolver
     * @public
     * @instance
     * @member {boolean} resolve
     * @param {string} dependency Name of the dependency to check applicability.
     * @param {Array<string>} dependencyStack Stack of dependencies in current context.
     */
    Resolver.prototype.resolve = function(dependency, dependencyStack) {
        Function.requiresArgument("dependency", dependency, "string");
        Function.requiresArgument("dependencyStack", dependencyStack, Array);
        return null;
    };
    /**
     * Contains a reference to the owning container.
     * @memberof joice.Resolver
     * @protected
     * @instance
     * @member {joice.Container} container
     */
    Object.defineProperty(Resolver.prototype, "container", { enumerable: false, configurable: false, writable: true, value: null });
    /**
     * Removes occurances of given names from the dependency name.
     * @memberof joice.Resolver
     * @protected
     * @instance
     * @member {string} normalize
     * @param {string} dependency Dependency name to be processed.
     * @param {Array<string>} names Names to be removed from dependency name.
     */
    Object.defineProperty(Resolver.prototype, "normalize", { enumerable: false, configurable: false, writable: false, value: function(dependency, names) {
        for (var nameIndex = 0; nameIndex < names.length; nameIndex++) {
            var name = new RegExp(names[nameIndex]).exec(dependency);
            if ((name !== null) && (name.length > 1)) {
                dependency = name[1];
                break;
            }
        }
        
        return dependency;
        }
    });
    Resolver.toString = function() { return "joice.Resolver"; };
}(namespace("joice")));
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
    namespace.ServiceDescriptor.dependencies = ["serviceType"];
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
/*global namespace, joice*/
(function(namespace) {
    "use strict";

    /**
     * Represents an expression where an argument was faulty for some reason.
     * @memberof joice
     * @name ArgumentException
     * @public
     * @class
     * @extends joice.Exception
     * @param {string} argumentName Name of the faulty argument.
     */
    var ArgumentException = (namespace.ArgumentException = function(argumentName) {
        if (!this.message) {
            this.message = String.format("Argument '{0}' is invalid.", argumentName);
        }
        
        joice.Exception.prototype.constructor.call(this, this.message);
    })[":"](joice.Exception);
    namespace.ArgumentException.dependencies = ["argumentName"];
    ArgumentException.toString = function() { return "joice.ArgumentException"; };
}(namespace("joice")));
/*global namespace, joice*/
(function(namespace) {
    "use strict";

    /**
     * Represents an expression where an argument was null.
     * @memberof joice
     * @name ArgumentNullException
     * @public
     * @class
     * @extends joice.ArgumentException
     * @param {string} argumentName Name of the argument that was null.
     */
    var ArgumentNullException = (namespace.ArgumentNullException = function(argumentName) {
        if (!this.message) {
            this.message = String.format("Argument '{0}' cannot be null.", argumentName);
        }
        
        joice.ArgumentException.prototype.constructor.call(this, this.message);
    })[":"](joice.ArgumentException);
    namespace.ArgumentNullException.dependencies = ["argumentName"];
    ArgumentNullException.toString = function() { return "joice.ArgumentNullException"; };
}(namespace("joice")));
/*global namespace, joice*/
(function(namespace) {
    "use strict";

    /**
     * Represents an expression where an argument was out of range of valid values.
     * @memberof joice
     * @name ArgumentOutOfRangeException
     * @public
     * @class
     * @extends joice.ArgumentException
     * @param {string} argumentName Name of the argument that was out of range.
     */
    var ArgumentOutOfRangeException = (namespace.ArgumentOutOfRangeException = function(argumentName) {
        if (!this.message) {
            this.message = String.format("Argument '{0}' is out of range.", argumentName);
        }
        
        joice.ArgumentException.prototype.constructor.call(this, this.message);
    })[":"](joice.ArgumentException);
    namespace.ArgumentOutOfRangeException.dependencies = ["argumentName"];
    ArgumentOutOfRangeException.toString = function() { return "joice.ArgumentOutOfRangeException"; };
}(namespace("joice")));
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
    ArrayResolver.prototype.isApplicableTo = function(dependency) {
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
/*global namespace, joice*/
(function(namespace) {
    "use strict";
    
    var _Classes = {};

    /**
     * Entry point for fluent API for service registrations by convention.
     * @memberof joice
     * @name Classes
     * @public
     * @static
     * @class
     */
    var Classes = namespace.Classes = {};
    /**
     * Returns a registration for given type.
     * @memberof joice.Classes
     * @public
     * @static
     * @member {joice.ConventionDescriptor} implementing
     * @param {Function} type Type of the service to find implementations for.
     */
    Classes.implementing = function(type) {
        Function.requiresArgument("type", type, Function);
        var result = new joice.ConventionDescriptor(type, _Classes.resolve.call(this, type, window, [], 0));
        return result;
    };
    /**
     * Gets a max resolution depth, which is 4 by default.
     * @memberof joice.Classes
     * @public
     * @static
     * @member {number} maxResolutionDepth
     */
    Classes.maxResolutionDepth = 4;
    Classes.toString = function() { return "joice.Classes"; };
    _Classes.is = function(type) {
        if ((this.prototype === undefined) || (this.prototype === null)) {
            return false;
        }
        
        if (this.prototype instanceof type) {
            return true;
        }
        
        return _Classes.is.call(this.prototype, type);
    };
    _Classes.forbiddenProperties = [/^webkit.*/];
    _Classes.forbiddenProperties.matches = function(propertyName) {
        for (var index = 0; index < _Classes.forbiddenProperties.length; index++) {
            var forbiddenProperty = _Classes.forbiddenProperties[index];
            if ((forbiddenProperty === propertyName) || (forbiddenProperty.test(propertyName))) {
                return true;
            }
        }
        
        return false;
    };
    _Classes.resolve = function(type, target, result, depth) {
        if (depth > Classes.maxResolutionDepth) {
            return result;
        }
        
        for (var property in target) {
            if (!target.hasOwnProperty(property)) {
                continue;
            }

            if (_Classes.forbiddenProperties.matches(property)) {
                continue;
            }
            
            if ((target.hasOwnProperty(property)) && (target[property] !== undefined) && (target[property] !== null)) {
                if ((typeof (target[property]) === "object") && (target[property].__namespace)) {
                    _Classes.resolve.call(this, type, target[property], result, depth + 1);
                }
                else if ((typeof (target[property]) === "function") && (result.indexOf(target[property]) === -1) && (_Classes.is.call(target[property], type))) {
                    result.push(target[property]);
                }
            }
        }
        
        return result;
    };
}(namespace("joice")));
/*global namespace, joice*/
(function(namespace) {
    "use strict";

    /**
     * Entry point for fluent API for explicit service registrations.
     * @memberof joice
     * @name Component
     * @public
     * @static
     * @class
     */
    var Component = namespace.Component = {};
    /**
     * Returns a registration for given type.
     * @memberof joice.Component
     * @public
     * @static
     * @member {joice.ComponentDescriptor} for
     * @param {Function} type Type of the service for which the registration is being defined.
     */
    Component.for = function(type) {
        Function.requiresArgument("type", type, Function);
        return new joice.ComponentDescriptor(type);
    };
    Component.toString = function() { return "joice.Component"; };
}(namespace("joice")));
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
            this._name,
            this.scope);
        container.register(registration);
    };
    ComponentDescriptor.toString = function() { return "joice.ComponentDescriptor"; };
}(namespace("joice")));
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
        var result = _Container.findTypeByNames.call(this, dependency, function(registration) {
            var typeNames = [registration._name];
            if ((registration._implementationType !== null) && (typeNames[0] !== registration._implementationType.toString())) {
                typeNames.push(registration._implementationType.toString());
            }
                
            return typeNames;
        });
        if (result !== null) {
            return result;
        }
            
        return _Container.findTypeByNames.call(this, dependency, function(registration) { return [registration._serviceType.toString()]; });
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
     * @param {Array<Function>} [implementationTypes] Implementation types.
     * @extends joice.ServiceDescriptor
     */
    var ConventionDescriptor = (namespace.ConventionDescriptor = function(serviceType, implementationTypes) {
        joice.ServiceDescriptor.prototype.constructor.apply(this, arguments);
        this._implementationTypes = (implementationTypes instanceof Array ? implementationTypes : null);
    })[":"](joice.ServiceDescriptor);
    namespace.ConventionDescriptor.dependencies = ["serviceType", "implementationTypes"];
    Object.defineProperty(ConventionDescriptor.prototype, "_implementationTypes", { enumerable: false, configurable: false, writable: true, value: null });
    ConventionDescriptor.prototype.register = function(container) {
        joice.ServiceDescriptor.prototype.register.apply(this, arguments);
        for (var index = 0; index < this._implementationTypes.length; index++) {
            container.register(new joice.Registration(this.serviceType, this._implementationTypes[index], false, this.scope));
        }
    };
    ConventionDescriptor.toString = function() { return "joice.ConventionDescriptor"; };
}(namespace("joice")));
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
/*global namespace, joice*/
(function(namespace) {
    "use strict";
    
    /**
     * Interface defining basic comoponent factory behaviour.
     * @memberof joice
     * @name IComponentFactory
     * @public
     * @static
     * @abstract
     * @class
     */
    var IComponentFactory = namespace.IComponentFactory = function() {
        throw new joice.InvalidOperationException("Cannot instantiate interface joice.IComponentFactory.");
    };
    IComponentFactory.resolve = function() { };
    IComponentFactory.resolveAll = function() { };
    IComponentFactory.toString = function() { return "joice.IComponentFactory"; };
}(namespace("joice")));
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
/*global namespace, joice*/
(function(namespace) {
    "use strict";

    /**
     * Represents an expression where an operation was invalid.
     * @memberof joice
     * @name InvalidOperationException
     * @public
     * @class
     * @extends joice.Exception
     * @param {string} message Message of the exception.
     */
    var InvalidOperationException = (namespace.InvalidOperationException = function() {
        joice.Exception.prototype.constructor.apply(this, arguments);
    })[":"](joice.Exception);
    InvalidOperationException.toString = function() { return "joice.InvalidOperationException"; };
}(namespace("joice")));
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
    namespace.Registration.dependencies = ["serviceType", "implementation"];
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
/*global namespace, joice*/
(function(namespace) {

    "use strict";
    /**
     * Collects registrations.
     * @memberof joice
     * @name RegistrationsCollection
     * @public
     * @class
     * @param {joice.Container} owner Owner of this collection.
     */
    var RegistrationsCollection = (namespace.RegistrationsCollection = function(owner) {
        Array.prototype.constructor.apply(this, Array.prototype.slice.call(arguments, 1));
        this._owner = owner || null;
    })[":"](Array);
    namespace.RegistrationsCollection.dependencies = ["owner"];
    Object.defineProperty(RegistrationsCollection.prototype, "_owner", { enumerable: false, configurable: false, writable: true, value: null });
    /**
     * Returns an index matching given criteria or -1.
     * @memberof joice.RegistrationsCollection
     * @public
     * @instance
     * @member {number} indexOf
     * @param {joice.Registration|string} item Name of the registration or the registration instance to be searched for.
     */
    RegistrationsCollection.prototype.indexOf = function(registrationOrName) {
        if (registrationOrName instanceof joice.Registration) {
            return Array.prototype.indexOf.apply(this, arguments);
        }
        
        if (typeof(registrationOrName) === "string") {
            for (var index = 0; index < this.length; index++) {
                var item = this[index];
                if (item._name === registrationOrName) {
                    return index;
                }
            }
            
            return -1;
        }
    };
    RegistrationsCollection.toString = function() { return "joice.RegistrationsCollection"; };
}(namespace("joice")));
/*global namespace*/
(function(namespace) {
    "use strict";

    /**
     * Enumerates possible instance scopes.
     * @memberof joice
     * @name Scope
     * @public
     * @class
     * @param {string} name Name of the scope.
     */
    var Scope = namespace.Scope = function(name) {
        Function.requiresArgument("name", name, "string");
        this.toString = function() { return name; };
    };
    namespace.Scope.dependencies = ["name"];
    Scope.toString = function() { return "joice.Scope"; };

    /**
     * Defines a singleton scope.
     * @memberof joice.Scope
     * @public
     * @static
     * @member {joice.Scope} Singleton
     */
    Scope.Singleton = new Scope("singleton");
    /**
     * Defines a transient scope. Instances are created on each resolution attempt.
     * @memberof joice.Scope
     * @public
     * @static
     * @member {joice.Scope} Transient
     */
    Scope.Transient = new Scope("transient");
}(namespace("joice")));
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
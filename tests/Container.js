﻿/// <reference path="../scripts/_references.js" />
//ReSharperReporter.prototype.jasmineDone = function () { };
/*global jasmine, matchers, joice*/
(function() {
    "use strict";

    describe("Given instance of the Container", function() {
        var container;
        beforeEach(function() {
            jasmine.addMatchers(matchers);
        });
        
        describe("when registering services explicitely", function() {
            beforeEach(function() {
                container = new joice.Container();
                container.register(joice.Component.for(joice.Service).implementedBy(joice.Implementation).lifestyleSingleton());
                container.register(joice.Component.for(joice.Service).implementedBy(joice.AnotherImplementation));
                container.register(joice.Component.for(joice.Some).implementedBy(joice.Some));
                container.register(joice.Component.for(joice.SomeOther).implementedBy(joice.SomeOther));
                container.register(joice.Component.for(joice.YetAnother).implementedBy(joice.YetAnother));
                container.register(joice.Component.for(joice.FactoryRequiring).implementedBy(joice.FactoryRequiring));
            });
            describe("and resolving a factory", function() {
                var factory;
                beforeEach(function() {
                    factory = container.resolve(joice.FactoryRequiring);
                });
                
                it("it should resolve that factory correctly", function() {
                    expect(factory).not.toBe(null);
                    expect(factory.serviceFactory).not.toBe(null);
                });
                it("it should implement that factory to resolve single instance correctly", function() {
                    var result = factory.serviceFactory.resolve();
                    
                    expect(result).toBeOfType(joice.Implementation);
                });
                it("it should implement that factory to resolve all instances correctly", function() {
                    var result = factory.serviceFactory.resolveAll();
                    
                    expect(result).toBeOfType(Array);
                    expect(result.length).toBe(2);
                    expect(result[0]).toBeOfType(joice.Implementation);
                    expect(result[1]).toBeOfType(joice.AnotherImplementation);
                });
            });
            it("it should resolve an instance with dependencies", function() {
                var instance = container.resolve(joice.Some);
                
                expect(instance.implementation).not.toBe(null);
                expect(instance.implementation).toBeOfType(joice.Implementation);
            });
            it("it should resolve an instance with nested dependencies", function() {
                var instance = container.resolve(joice.SomeOther);
                
                expect(instance.some).not.toBe(null);
                expect(instance.some).toBeOfType(joice.Some);
                expect(instance.some.implementation).not.toBe(null);
                expect(instance.some.implementation).toBeOfType(joice.Implementation);
            });
            it("it should resolve an instance with array of dependencies", function() {
                var instance = container.resolve(joice.YetAnother);
                
                expect(instance.services).not.toBe(null);
                expect(instance.services).toBeOfType(Array);
                expect(instance.services.length).toBe(2);
                expect(instance.services[0]).toBeOfType(joice.Implementation);
                expect(instance.services[1]).toBeOfType(joice.AnotherImplementation);
            });
            it("it should resolve same instances for singletons", function() {
                var firstCallResult = container.resolve(joice.Service);
                var secondCallResult = container.resolve(joice.Service);
                
                expect(firstCallResult).toBe(secondCallResult);
            });
            it("it should resolve different instances for transient scope", function() {
                var firstCallResult = container.resolve(joice.Some);
                var secondCallResult = container.resolve(joice.Some);
                
                expect(firstCallResult).not.toBe(secondCallResult);
            });
            it("it should resolve service type", function() {
                var result = container.resolveType(joice.Some);
                
                expect(result).not.toBe(joice.Implementation);
            });
        });
        
        describe("when registering services by convention", function() {
            beforeEach(function() {
                container = new joice.Container();
                container.register(joice.Classes.implementing(joice.Service));
            });
            
            it("it should have correct types registered", function() {
                expect(container._registrations.length).toBe(2);
            });
        });
        
        describe("when registering service by factory method", function() {
            var calls = 0;
            var instance = null;
            beforeEach(function() {
                container = new joice.Container();
                container.register(joice.Component.for(joice.Service).usingFactoryMethod(function() {
                    calls++;
                    return (instance = {});
                }).named("implementationType"));
                container.register(joice.Component.for(joice.Some).implementedBy(joice.Some));
            });
            
            it("it should resolve instance correctly", function() {
                var resolved = container.resolve(joice.Some);
                
                expect(calls).toBe(1);
                expect(resolved.implementation).toBe(instance);
            });
        });
        
        describe("when registering interface service implementation", function() {
            beforeEach(function() {
                container = new joice.Container();
                container.register(joice.Component.for(joice.IService).implementedBy(joice.Implementation));
                container.register(joice.Component.for(joice.Whatever).implementedBy(joice.Whatever));
            });
            
            it("it should resolve instance correctly", function() {
                var resolved = container.resolve(joice.Whatever);
                
                expect(resolved.service).toBeOfType(joice.Implementation);
            });
        });
    });
}());
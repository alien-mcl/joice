﻿/// <reference path="../scripts/_references.js" />
//ReSharperReporter.prototype.jasmineDone = function() { };
/*global jasmine, matchers, joice*/
(function() {
    "use strict";

    describe("Component registration", function() {
        var registration;
        beforeEach(function() {
            jasmine.addMatchers(matchers);
            registration = joice.Component.for(joice.tests.Service).implementedBy(joice.tests.Implementation);
        });
        
        describe("when creating a registration", function() {
            it("should be created correctly", function() {
                expect(registration.serviceType).toBe(joice.tests.Service);
                expect(registration._implementationType).toBe(joice.tests.Implementation);
                expect(registration._name).toBe(joice.tests.Implementation.toString());
                expect(registration.scope).toBe(joice.Scope.Transient);
            });
            it("should use a given name", function() {
                var expectedName = "test";
                registration.named(expectedName);
                
                expect(registration._name).toBe(expectedName);
            });
            it("should use a given lifestyle", function() {
                registration.lifestyleSingleton();
                
                expect(registration.scope).toBe(joice.Scope.Singleton);
            });
        });
    });
}());
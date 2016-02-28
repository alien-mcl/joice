/// <reference path="../scripts/_references.js" />
//ReSharperReporter.prototype.jasmineDone = function () { };
/*global jasmine, matchers, joice*/
(function() {
    "use strict";

    describe("Given instance of the RegistrationsCollection", function() {
        var collection;
        beforeEach(function() {
            jasmine.addMatchers(matchers);
            collection = new joice.RegistrationsCollection(null);
            collection.push(new joice.Registration(joice.Service, joice.Implementation));
        });
        it("it should contain a named registration", function() {
            expect(collection.indexOf(joice.Implementation.toString())).not.toBe(-1);
        });
    });
}());
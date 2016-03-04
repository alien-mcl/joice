/// <reference path="../scripts/_references.js" />
//ReSharperReporter.prototype.jasmineDone = function() { };
/*global jasmine, matchers, joice*/
(function() {
    "use strict";

    describe("Given instance of the CodeProcessor", function() {
        var codeProcessor;
        beforeEach(function() {
            jasmine.addMatchers(matchers);
            codeProcessor = new joice.CodeProcessor();
        });
        it("it process source code file property", function() {
            var result = codeProcessor.process(joice.tests.testCode);

            expect(result).toBe(joice.tests.expectedCode);
        });
    });
}());
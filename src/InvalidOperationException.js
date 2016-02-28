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
    var InvalidOperationException = (namespace.InvalidOperationException = function () {
        joice.Exception.prototype.constructor.apply(this, arguments);
    })[":"](joice.Exception);
    InvalidOperationException.toString = function () { return "joice.InvalidOperationException"; };
}(namespace("joice")));
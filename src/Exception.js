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
    Exception.toString = function() { return "joice.Exception"; };
}(namespace("joice")));
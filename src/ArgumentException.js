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
    ArgumentException.toString = function() { return "joice.ArgumentException"; };
}(namespace("joice")));
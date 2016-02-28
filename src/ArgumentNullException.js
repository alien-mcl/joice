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
    ArgumentNullException.toString = function() { return "joice.ArgumentNullException"; };
}(namespace("joice")));
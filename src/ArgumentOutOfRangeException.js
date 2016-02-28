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
    ArgumentOutOfRangeException.toString = function() { return "joice.ArgumentOutOfRangeException"; };
}(namespace("joice")));
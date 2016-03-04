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
/*global namespace, joice*/
(function(namespace) {
    "use strict";

    /**
     * Entry point for fluent API for explicit service registrations.
     * @memberof joice
     * @name Component
     * @public
     * @static
     * @class
     */
    var Component = namespace.Component = {};
    /**
     * Returns a registration for given type.
     * @memberof joice.Component
     * @public
     * @static
     * @member {joice.ComponentDescriptor} for
     * @param {Function} type Type of the service for which the registration is being defined.
     */
    Component.for = function (type) {
        Function.requiresArgument("type", type, Function);
        return new joice.ComponentDescriptor(type);
    };
    Component.toString = function() { return "joice.Component"; };
}(namespace("joice")));
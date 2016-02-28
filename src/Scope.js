/*global namespace*/
(function(namespace) {
    "use strict";

    /**
     * Enumerates possible instance scopes.
     * @memberof joice
     * @name Scope
     * @public
     * @class
     * @param {string} name Name of the scope.
     */
    var Scope = namespace.Scope = function(name) {
        Function.requiresArgument("name", name, "string");
        this.toString = function() { return name; };
    };
    Scope.toString = function() { return "joice.Scope"; };

    /**
     * Defines a singleton scope.
     * @memberof joice.Scope
     * @public
     * @static
     * @member {joice.Scope} Singleton
     */
    Scope.Singleton = new Scope("singleton");
    /**
     * Defines a transient scope. Instances are created on each resolution attempt.
     * @memberof joice.Scope
     * @public
     * @static
     * @member {joice.Scope} Transient
     */
    Scope.Transient = new Scope("transient");
}(namespace("joice")));
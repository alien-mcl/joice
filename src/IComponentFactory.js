/*global namespace, joice*/
(function(namespace) {
    "use strict";
    
    /**
     * Interface defining basic comoponent factory behaviour.
     * @memberof joice
     * @name IComponentFactory
     * @public
     * @static
     * @abstract
     * @class
     */
    var IComponentFactory = namespace.IComponentFactory = function() {
        throw new joice.InvalidOperationException("Cannot instantiate interface joice.IComponentFactory.");
    };
    IComponentFactory.resolve = function () { };
    IComponentFactory.resolveAll = function () { };
    IComponentFactory.toString = function () { return "joice.IComponentFactory"; };
}(namespace("joice")));
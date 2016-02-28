/*global namespace, joice*/
(function(namespace) {
    "use strict";

    var IService = namespace.IService = function() {
        throw new ursa.InvalidOperationException("Cannot instantiate interface joice.IService.");
    };
    IService.action = function() { };
    IService.toString = function() { return "joice.IService"; };
    
    var Service = namespace.Service = function() { };
    Service.prototype.action = function() { };
    Service.toString = function() { return "joice.Service"; };
    var Implementation = namespace.Implementation = function() { };
    Implementation[":"](Service);
    Implementation.prototype.action = function() { };
    Implementation.toString = function() { return "joice.Implementation"; };
    var AnotherImplementation = namespace.AnotherImplementation = function() { };
    AnotherImplementation[":"](Service);
    AnotherImplementation.prototype.action = function() { };
    AnotherImplementation.toString = function() { return "joice.AnotherImplementation"; };
    var Some = namespace.Some = function(implementation) { this.implementation = implementation; };
    Some.prototype.implementation = null;
    Some.toString = function() { return "joice.Some"; };
    var SomeOther = namespace.SomeOther = function(some) { this.some = some; };
    SomeOther.prototype.some = null;
    SomeOther.toString = function() { return "joice.SomeOther"; };
    var YetAnother = namespace.YetAnother = function(arrayOfService) { this.services = arrayOfService; };
    YetAnother.prototype.services = null;
    YetAnother.toString = function() { return "joice.YetAnother"; };
    var Whatever = namespace.Whatever = function(service) { this.service = service; };
    Whatever.prototype.service = null;
    Whatever.toString = function() { return "joice.Whatever"; };
    var FactoryRequiring = namespace.FactoryRequiring = function(serviceFactory) { this.serviceFactory = serviceFactory; };
    FactoryRequiring.prototype.serviceFactory = null;
    FactoryRequiring.toString = function() { return "joice.FactoryRequiring"; };
}(namespace("joice")));
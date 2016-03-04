module.exports = function(config) {
    config.set({
        basePath: "",
        frameworks: ["jasmine"],
        files: [
            "../src/namespace.js",
            "../src/StringExtensions.js",
            "../src/FunctionExtensions.js",
            "../src/Exception.js",
            "../src/ArgumentException.js",
            "../src/ArgumentOutOfRangeException.js",
            "../src/InvalidOperationException.js",
            "../src/Scope.js",
            "../src/Registration.js",
            "../src/RegistrationsCollection.js",
            "../src/ServiceDescriptor.js",
            "../src/ComponentDescriptor.js",
            "../src/ConventionDescriptor.js",
            "../src/Resolver.js",
            "../src/ArrayResolver.js",
            "../src/TypeResolver.js",
            "../src/FactoryResolver.js",
            "../src/InstanceResolver.js",
            "../src/IComponentFactory.js",
            "../src/Component.js",
            "../src/Classes.js",
            "../src/Container.js",
            "../build/joice-annotate.js",
            "../testing/toBeOfType.js",
            "../fixtures/ioc.js",
            "../fixtures/task.js",
            "*.js"
        ],
        exclude: [
            "karma.conf.js"
        ],
        preprocessors: {
        },
        reporters: ["progress"],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ["PhantomJS"],
        singleRun: false,
        concurrency: Infinity
    });
};
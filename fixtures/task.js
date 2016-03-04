(function(namespace) {
    namespace.testCode = "/*comment*/\r\n" + 
        "(function(namespace) {\r\n" +
        "\t/**\r\n" +
        "\t * js-doc\r\n" +
        "\t*/\r\n" +
        "\tvar SomeType = namespace.SomeType = function(argumentA) {\r\n" +
        "\t\targumentA = argumentA.replace(/(\\{|\\})/g, \"\");\r\n" +
        "\t};\r\n" + 
        "\tSomeType.prototype.argumentA = null;\r\n" + 
        "/*comment*/\r\n" + 
        "\tvar SomeOtherType = (namespace.SomeOtherType = function(argumentA, argumentB) {\r\n" + 
        "\t\tSomeType.prototype.constructor.call(this, argumentA);\r\n" +
        "\t})[\":\"](SomeType);\r\n" + 
        "\tObject.defineProperty(SomeOtherType.prototype, \"argumentB\", { enumerable: false, configurable: false, writable: true });\r\n" +
        "}());";
    namespace.expectedCode = "/*comment*/\r\n" + 
        "(function(namespace) {\r\n" +
        "\t/**\r\n" +
        "\t * js-doc\r\n" +
        "\t*/\r\n" +
        "\tvar SomeType = namespace.SomeType = function(argumentA) {\r\n" +
        "\t\targumentA = argumentA.replace(/(\\{|\\})/g, \"\");\r\n" +
        "\t};\r\n" +
        "\tnamespace.SomeType.dependencies = [\"argumentA\"];\r\n" +
        "\tSomeType.prototype.argumentA = null;\r\n" +
        "/*comment*/\r\n" +
        "\tvar SomeOtherType = (namespace.SomeOtherType = function(argumentA, argumentB) {\r\n" +
        "\t\tSomeType.prototype.constructor.call(this, argumentA);\r\n" +
        "\t})[\":\"](SomeType);\r\n" +
        "\tnamespace.SomeOtherType.dependencies = [\"argumentA\", \"argumentB\"];\r\n" +
        "\tObject.defineProperty(SomeOtherType.prototype, \"argumentB\", { enumerable: false, configurable: false, writable: true });\r\n" +
        "}());";
}(namespace("joice.tests")));
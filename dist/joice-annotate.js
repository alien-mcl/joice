/*global module, joice*/
(function(namespace) {
    "use strict";
    var whiteSpaces = [" ", "\t", "\r", "\n"];
    var FunctionDescriptor = function(name, startsAt, endsAt) {
        this.name = name;
        this.startsAt = startsAt;
        this.endsAt = endsAt;
        this.code = null;
        var dependencies = null;
        var that = this;
        Object.defineProperty(this, "dependencies", {
            get: function() {
                if (dependencies === null) {
                    var match = that.code.match(/\(([^)]*)\)/);
                    if ((match !== null) && (match.length > 1)) {
                        dependencies = match[1].split(",");
                        for (var index = 0; index < dependencies.length; index++) {
                            if ((dependencies[index] = dependencies[index].trim()).length === 0) {
                                dependencies.splice(index, 1);
                            }
                        }
                    }
                    else {
                        dependencies = [];
                    }
                }

                return dependencies;
            }
        });
    };
    FunctionDescriptor.prototype.name = null;
    FunctionDescriptor.prototype.code = null;
    FunctionDescriptor.prototype.startsAt = -1;
    FunctionDescriptor.prototype.endsAt = -1;
    FunctionDescriptor.prototype.dependencies = null;

    var ParsingContext = function(string, index, isInString, isEscape, isInComment) {
        this.string = string;
        this.line = 0;
        this.index = (typeof(index) === "number" ? index : 0);
        this.isInString = (typeof(isInString) === "boolean" ? isInString : false);
        this.isEscape = (typeof(isEscape) === "boolean" ? isEscape : false);
        this.isInComment = (typeof(isInComment) === "boolean" ? isInComment : false);
        this.currentFunction = [];
        this.scopeStack = -1;
        this.lastLineIndentation = null;
        this.lastLineStartIndex = -1;
    };
    ParsingContext.prototype.string = null;
    ParsingContext.prototype.index = -1;
    ParsingContext.prototype.isInString = false;
    ParsingContext.prototype.isEscape = false;
    ParsingContext.prototype.isInComment = false;
    ParsingContext.prototype.scopeStack = -1;
    ParsingContext.prototype.line = 0;
    ParsingContext.prototype.currentFunction = null;
    ParsingContext.prototype.lastLineIndentation = null;
    ParsingContext.prototype.lastLineStartIndex = -1;
    ParsingContext.prototype.forNewIndex = function(newIndex, isInString, isEscape) {
        return new ParsingContext(
            this.string,
            newIndex,
            (typeof(isInString) === "boolean" ? isInString : this.isInString),
            (typeof(isEscape) === "boolean" ? isEscape : this.isEscape));
    };
    ParsingContext.prototype.skipWhite = function(direction) {
        return this.skipAll(whiteSpaces, direction);
    };
    ParsingContext.prototype.skipAll = function(chars, direction) {
        if (typeof(direction) !== "number") {
            direction = 1;
        }

        chars = (chars instanceof Array ? chars : [chars]);
        while ((chars.indexOf(this.string.charAt(this.index)) !== -1) && (((direction < 0) && (this.index > 0)) || ((direction > 0) && (this.index < this.string.length - 1)))) {
            this.index += direction;
        }

        return this;
    };
    ParsingContext.prototype.skipUntil = function(chars, direction) {
        if (typeof(direction) !== "number") {
            direction = 1;
        }

        chars = (chars instanceof Array ? chars : [chars]);
        while ((chars.indexOf(this.string.charAt(this.index)) === -1) && (((direction < 0) && (this.index > 0)) || ((direction > 0) && (this.index < this.string.length - 1)))) {
            this.index += direction;
        }

        return this;
    };
    ParsingContext.prototype.updateState = function() {
        switch (this.currentChar) {
            case "/":
                if ((!this.isInString) && (!this.isEscape) && (!this.isInComment) && (this.index + 1 < this.string.length) && (this.string.charAt(this.index + 1) === "*")) {
                    this.isInComment = true;
                    this.index++;
                    this.isEscape = false;
                    return true;
                }
                
                return false;
            case "*":
                if ((this.isInComment) && (this.index + 1 < this.string.length) && (this.string.charAt(this.index + 1) === "/")) {
                    this.isInComment = false;
                    this.index++;
                    this.isEscape = false;
                    return true;
                }

                return false;
            case "\n":
                this.line++;
                if ((!this.isInString) && (!this.isEscape) && (!this.isInComment)) {
                    this.lastLineStartIndex = this.index;
                    this.lastLineIndentation = null;
                }

                this.isEscape = false;
                return true;
            case "\\":
                if ((this.isInString) && (!this.isInComment)) {
                    this.isEscape = !this.isEscape;
                }

                return true;
            case "'":
            case "\"":
                if ((!this.isEscape) && (!this.isInComment)) {
                    this.isInString = !this.isInString;
                }

                this.isEscape = false;
                return true;
            default:
                if ((!this.isInString)&& (!this.isEscape) && (!this.isInComment) && (this.lastLineIndentation === null) && (this.lastLineStartIndex !== -1) &&
                    (whiteSpaces.indexOf(this.currentChar) === -1)) {
                    this.lastLineIndentation = this.string.substring(this.lastLineStartIndex + 1, this.index);
                }

                return false;
        }
    };
    ParsingContext.prototype.toString = function() { return this.string.substring(0, this.index + 1); };
    ParsingContext.prototype.toTraceString = function() { return this.string.substring(Math.max(0, this.index - 20), Math.min(this.string.length, this.index + 20)); };
    Object.defineProperty(ParsingContext.prototype, "currentChar", { configurable: false, get: function() {
            return ((this.string) && (this.string.length > 0) && (this.index >= 0) ? this.string.charAt(this.index) : null);
    } });
    Object.defineProperty(ParsingContext.prototype, "currentCharCode", { configurable: false, get: function() {
            return ((this.string) && (this.string.length > 0) && (this.index >= 0) ? this.string.charCodeAt(this.index) : null);
    } });

    var _CodeProcessor = {};
    var CodeProcessor = namespace.CodeProcessor = function() {
    };
    CodeProcessor.prototype.process = function(file) {
        var parsingContext = new ParsingContext(file, 0, false, false);
        for (parsingContext.index = 0; parsingContext.index < parsingContext.string.length; parsingContext.index++) {
            if (!parsingContext.updateState()) {
                switch (parsingContext.currentChar) {
                    case "(":
                        if ((parsingContext.isInString) || (parsingContext.isEscape)) {
                            continue;
                        }

                        var functionName = _CodeProcessor.findFunctionName.call(this, parsingContext);
                        if (functionName !== null) {
                            _CodeProcessor.skipFunction.call(this, parsingContext);
                            var peek = parsingContext.string.substr(parsingContext.index, Math.min(parsingContext.string.length, 100));
                            var parts = functionName.split('.');
                            parts = parts[parts.length - 1];
                            if (new RegExp(parts + "[ \t\r\n]*\.[ \t\r\n]*(prototype|toString)").test(peek)) {
                                _CodeProcessor.annotateFunction.call(this, parsingContext);
                            }
                        }
                }
            }
        }

        return parsingContext.string;
    };
    var separators = [" ", "\t", "\r", "\n", ".", ",", "[", "]", "{", "}", "(", ")", ";", "+", "-", "/", "*", "%", ">", "<"];
    _CodeProcessor.findFunctionName = function(parsingContext) {
        var auxContext = parsingContext.forNewIndex(parsingContext.index - 1).skipWhite(-1);
        if ((auxContext.index <= 8) || (auxContext.string.substring(auxContext.index - 7, auxContext.index + 1) !== "function")) {
            return null;
        }

        var startsAt = auxContext.index;
        auxContext.index -= "function".length;
        auxContext.skipWhite(-1);
        auxContext.index--;
        auxContext.skipWhite(-1);
        var startIndex = auxContext.index;
        for (auxContext.index = startIndex; auxContext.index >= 0; auxContext.index--) {
            if ((separators.indexOf(auxContext.currentChar) !== -1) && (auxContext.currentChar !== ".")) {
                var result = auxContext.string.substring(auxContext.index + 1, startIndex + 1);
                if (result.length === 0) {
                    return null;
                }

                parsingContext.currentFunction.push(new FunctionDescriptor(result, startsAt + 1, -1));
                return result;
            }
        }

        return null;
    };
    _CodeProcessor.skipFunction = function(parsingContext) {
        parsingContext.skipUntil("{");
        if (parsingContext.index >= parsingContext.string.length) {
            throw new Error("Syntax error near " + parsingContext.toTraceString() + " at line " + parsingContext.line + ".");
        }

        parsingContext.scopeStack = 0;
        for (; parsingContext.index < parsingContext.string.length; parsingContext.index++) {
            if (!parsingContext.updateState()) {
                switch (parsingContext.currentChar) {
                    case "{":
                        if ((!parsingContext.isEscape) && (!parsingContext.isInString) && (!parsingContext.isInComment)) {
                            parsingContext.scopeStack++;
                        }

                        parsingContext.isEscape = false;
                        break;
                    case "}":
                        if ((!parsingContext.isEscape) && (!parsingContext.isInString) && (!parsingContext.isInComment)) {
                            parsingContext.scopeStack--;
                        }

                        parsingContext.isEscape = false;
                        break;
                }
            }

            if (parsingContext.scopeStack === 0) {
                break;
            }
        }

        if (parsingContext.scopeStack !== 0) {
            throw new Error("Syntax error near " + parsingContext.toTraceString() + " at line " + parsingContext.line + " while parsing class " + parsingContext.currentFunction[parsingContext.currentFunction.length - 1].name + ".");
        }
    };
    _CodeProcessor.annotateFunction = function(parsingContext) {
        var currentFunction = parsingContext.currentFunction[parsingContext.currentFunction.length - 1];
        currentFunction.endsAt = parsingContext.index + 1;
        currentFunction.code = parsingContext.string.substring(currentFunction.startsAt, currentFunction.endsAt);
        _CodeProcessor.skipToCodeBoundary.call(this, parsingContext);
        if (currentFunction.dependencies.length > 0) {
            var dependencies = "\r\n" + (parsingContext.lastLineIndentation || "") + currentFunction.name + ".dependencies = [\"" + currentFunction.dependencies.join("\", \"") + "\"];";
            parsingContext.string = parsingContext.string.substr(0, parsingContext.index) + dependencies + parsingContext.string.substring(parsingContext.index);
            parsingContext.index += dependencies.length;
        }

        parsingContext.currentFunction.pop();
        parsingContext.scopeStack = -1;
    };
    _CodeProcessor.skipToCodeBoundary = function(parsingContext) {
        for (; parsingContext.index < parsingContext.string.length; parsingContext.index++) {
            if (!parsingContext.updateState()) {
                switch (parsingContext.currentChar) {
                    case ";":
                        if ((!parsingContext.isEscape) && (!parsingContext.isInString) && (!parsingContext.isInComment)) {
                            parsingContext.index++;
                            return;
                        }

                        break;
                    case "}":
                        if ((!parsingContext.isEscape) && (!parsingContext.isInString) && (!parsingContext.isInComment) && (parsingContext.scopeStack === -1)) {
                            parsingContext.index++;
                            return;
                        }

                        break;
                }
            }
        }
    };
}(typeof(module) !== "undefined" ? module.exports = {} : (typeof(joice) === "object" ? joice : joice = {})));
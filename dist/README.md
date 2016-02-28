##Welcome to the JoICe - the Javascript Inverse of Control Extension

JoICe is a light JavaScript IoC container and by writing light I mean it - it has no external dependencies.
It contains few components still being extensible and it does it job.

It's somehow inspired by Castle Windsor - an IoC solution for C#, and allows component registration and instance resolution.

###Starting up

Setting up is very easy - use either npm or bower to install the component and your ready to go:

```
npm install joice
```
or
```
bower install joice
```

Once installed, all you have to do is to instantiate the container:
```javascript
var container = new joice.Container();
```

JoICe encourages to work with JavaScript equivalent of classes, thus there are few conventions that are used to make it all happen.

Let's assume, that we've got a base abstract class for which we would like to register an implementation:
```javascript
var Whateverlator = function() {};
Whateverlator.prototype.doSomething = function() {};
Whateverlator.toString = function() { return "Whateverlator"; };
```

This is a basic bolerplate of an abstract class. Notice last line where a _Whateverlator_ class gets a custom _toString_ method implementation.
It returns the class' name which will be used as a default when registering components.

Now, let's assume that we've got our implementation of the _Whateverlator_ class:
```javascript
var MyWhateverlator = function() {};
MyWhateverlator.prototype = new Whateverlator();
MyWhateverlator.prototype.constructor = MyWhateverlator;
MyWhateverlator.prototype.doSomething = function() {
    console.log("MyWhateverlator.doSomething() called!");
};
MyWhateverlator.toString = function() { return "MyWhateverlator"; };
```

Note here that the _MyWhateverlator_ class is prototypically _inheriting_ from the _Whateverlator_ class.
Also setting a _constructor_ is important. All of these steps will make the _instanceof_ operator to work properly.

All you need to do now in order to register our implementation into the IoC container is to call any of the registration APIs, i.e.:
```javascript
container.register(joice.Component.for(Whateverlator).implementedBy(MyWhateverlator);
```

Now you can resolve an instance of your _Whateverlator_ service to be used in your code:
```javascript
var whateverlator = container.resolve(Whateverlator);
```

####Basic concepts
True power in IoC is that it should be able to resolve a component no matter what are the dependencies.
Unless all required components are registered, it are free to expand your class' constructor with more dependencies without affecting rest of the code.

Let's assume, that we're introducing another implementation of the _Whateverlator_ class:
```javascript
var LoggingWhateverlator = function(logger) {
    this._logger = logger;
};
LoggingWhateverlator.prototype = new Whateverlator();
LoggingWhateverlator.prototype._logger = null;
LoggingWhateverlator.prototype.constructor = LoggingWhateverlator;
LoggingWhateverlator.toString = function() { return "LoggingWhateverlator"; };
```

As you've already noticed, _LoggingWhateverlator_ dependes on another component as it's constructor expects a _logger_ variable.

Let's setup this infrastructure:
```javascript
var Logger = function() {};
Logger.prototype.log = function(message) {};
Logger.toString = function() { return "Logger"; };

var ConsoleLogger = function() {};
ConsoleLogger.prototype = new Logger();
ConsoleLogger.prototype.constructor = ConsoleLogger;
ConsoleLogger.prototype.log = function(message) {
    console.log(message);
};
ConsoleLogger.toString = function() { return "ConsoleLogger"; }

container.register(joice.Component.for(Logger).implementedBy(ConsoleLogger));
```

As we've told the container that if someone wants to resolve _logger_ (names are case insensitive), provide instance of the _ConsoleLogger_ class.
Now it's ok to resolve our _Whateverlator_ instance:
```javascript
container.register(joice.Component.for(Whateverlator).implementedBy(LoggingWhateverlator));
...
var whateverlator = container.resolve(Whateverlator);
```

Your _whateverlator_ instance will be fed with _LoggingWhateverlator_ fed with _ConsoleLogger_!

Please note that this example assumes that you haven't registered the _MyWhateverlator_ implementation or you did it after registering _LoggingWhateverlator_.
In case of both components registered first takes precedence!

Still, if you need both components registered and resolved altogether, it's still doable!
All you need is to resolve an array of the service type:
```javascript
var whateverlators = container.resolve([Whateverlator]);
```

Resulting _whateverlators_ will be an _Array_ containing all implementations of _Whateverlator_.
It is also possible to have a component dependant on array of service implementations.

This is doable with a convention of variable names, which should start with any of these words: arrayOf..., enumerationOf..., collectionOf... .
An example of such a requirement:
```javascript
var MasterDoer = function(arrayOfWhateverlator) {
    this._whateverlators = arrayOfWhateverlator;
};
MasterDoer.prototype._whateverlators = null;
MasterDoer.toString = function() { return "MasterDoer"; };
```

#####Named registrations
Sometimes it's more convenient to provide the registered component name on the registration stage rather than on the implementation.
To do so, you shall call the _named("some name here")_ method on the registration like on the example below:
```javascript
container.register(joice.Component.for(Whateverlator).implementedBy(MyWhateverlator).named("whatever");
```

Now your component can have a constructor with variable name of _whatever_ to resolve the _MyWhateverlator_ directly.
Still, without it, your component is allowed to resolve instance of the _MyWhateverlator_ with having a constructor variable of name _myWhateverlator_.

####Advanced concepts
#####Factory method registration
Sometimes it is more convenient not to provide a class, but to create it manually. This is ususally a case when working with various frameworks.

JoICe provides a possibility of using a factory method approach for registering components.

Assuming that _HyperMagnetoWhateverlator_ class is defined somewhere in your code, your free to register it with factory method:
```javascript
container.register(joice.Component.for(Whateverlator).usingFactoryMethod(function() {
    return new HyperMagnetoWhateverlator();
});
```

Here JoICe puts whole responsibility on dependency injection on the factory method. It will be invoked on demand, thus it's a way of having a lazy-initialized dependency resolution.

#####Factory automatic implementation
Sometimes resolving i.e. array of instances is not an option. A lazy-initialized instances are required on demand.
It's not a good practice to inject the container itself so the component can resolve those instances on it's own.

JoICe provides a way of providing a on-the-fly created implementation of the factory interface which can be used to resolve those instances and which use the container internally.

This can be achieved with a variable name convention where it's name ends with a word _Factory_ as on the example below:
```javascript
var Lazy = function(whateverlatorFactory) {
    this._whateverlatorFactory = whateverlatorFactory;
};
Lazy.prototype._whateverlatorFactory = null;
Lazy.prototype.act = function() {
    var instances = this._whateverlatorFactory.resolveAll();
    ... do something with the resolved instances ...
};
```

Provided _whateverlatorFactory_ instance exposes two methods:
* resolve - resolves a single instance as you would call _container.resolve(Whateverlator)_
* resolveAll - resolves a single instance as you would call _container.resolve([Whateverlator])_

#####Instance scopes
Sometimes your component is stateless, thus there is no need to instantiate it evertime it's required.

This raises a requirement of defining on how the instances are maintained. Currently JoICe provides two lifestyles (called scopes) for instances:
* transient - created everytime when required, which is default setting
* singleton - created only once and then provided for further uses

You can define this lifestyle when registering your components by calling one of these methods on the registration:
* lifestyleTransient()
* lifestyleSingleton()

i.e.:
```javascript
container.register(joice.Component.for(Logger).implementedBy(ConsoleLogger).lifestyleSingleton());
```

#####Registration by convention
There are cases of pluggable components and you don't want to register them one by one.

It's more convenient to register them just by the service they implement. JoICe allows you to do so with a registration by convention.
Example of such a behaviour is presented below:
```javascript
container.register(joice.Classes.implementing(Whateverlator));
```

Container will traverse the _window_ object in search for all functions prototypically inheriting from the _Whateverlator_.
All other resolution activity is the same as in case of standard component registration.

There is a statis field on _joice.Classes.maxResolutionDepth_ with value of _4_ set which tells how deep to traverse the object graph.
You can change this value if you've got deeper namespace structure.

#####Interface injectiont
While JavaScript does not support interfaces (ES6 specification actually does support it!), it is still possible to have a similar behaviour available.
JoICe acknowledges interfaces as functions with list of members attached directly to them, i.e.:
```javascript
var IWhateverlator = function() {
    throw new Error("Interface IWhateverlator cannot be instantiated.");
};
IWhateverlator.doSomething = function() {};
IWhateverlator.toString = function() { return "IWhateverlator"; };
```

JoICe uses this notion to detect interfaces. When a _new_ operator called with a function fails, the exception is caught considering it as an interface.
It then iterates through all members available and checks if the implementation has corresponding members of same type.
That's why _doSomething_ method is actually a function, not a _null_ to tell the framework that a function is expected.
Not it is possible to register and resolve implementations of this interface:
```javascript
container.register(joice.Component.for(IWhateverlator).implementedBy(MyWhateverlator));
...
container.resolve(IWhateverlator);
```
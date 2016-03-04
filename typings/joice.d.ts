declare module joice {
    class Exception implements Error {
        constructor(message: string);
        message: string;
        name: string;
    }

    class ArgumentException extends Exception {
        constructor(argumentName: string);
    }

    class ArgumentNullException extends ArgumentException {
        constructor(argumentName: string);
    }

    class ArgumentOutOfRangeException extends ArgumentException {
        constructor(argumentName: string);
    }

    class InvalidOperationException extends ArgumentException {
        constructor(message: string);
    }

    class Scope {
        static Transient: Scope;
        static Singleton: Scope;
        constructor(name: string);
    }

    class Registration {
        constructor(serviceType: Function, implementationType: Function, name?: string, scope?: Scope);
        constructor(serviceType: Function, implementation: Function, implementationIsFactoryMethod: boolean, name?: string, scope?: Scope);
        constructor(serviceType: Function, instance: Object, name?: string, scope?: Scope);
    }

    class RegistrationsCollection implements Array<Registration> {
        constructor(owner: Container);
        concat<U extends Registration[]>(...items: U[]): Registration[];
        concat(...items: Registration[]): Registration[];
        join(separator?: string): string;
        pop(): Registration;
        push(...items: Registration[]): number;
        reverse(): Registration[];
        shift(): Registration;
        slice(start?: number, end?: number): Registration[];
        sort(compareFn?: (a: Registration, b: Registration) => number): Registration[];
        splice(start: number): Registration[];
        splice(start: number, deleteCount: number, ...items: Registration[]): Registration[];
        unshift(...items: Registration[]): number;
        indexOf(reigstrationName: string): number;
        indexOf(searchElement: Registration, fromIndex?: number): number;
        lastIndexOf(searchElement: Registration, fromIndex?: number): number;
        every(callbackfn: (value: Registration, index: number, array: Registration[]) => boolean, thisArg?: any): boolean;
        some(callbackfn: (value: Registration, index: number, array: Registration[]) => boolean, thisArg?: any): boolean;
        forEach(callbackfn: (value: Registration, index: number, array: Registration[]) => void, thisArg?: any): void;
        map<U>(callbackfn: (value: Registration, index: number, array: Registration[]) => U, thisArg?: any): U[];
        filter(callbackfn: (value: Registration, index: number, array: Registration[]) => boolean, thisArg?: any): Registration[];
        reduce(callbackfn: (previousValue: Registration, currentValue: Registration, currentIndex: number, array: Registration[]) => Registration, initialValue?: Registration): Registration;
        reduce<U>(callbackfn: (previousValue: U, currentValue: Registration, currentIndex: number, array: Registration[]) => U, initialValue: U): U;
        reduceRight(callbackfn: (previousValue: Registration, currentValue: Registration, currentIndex: number, array: Registration[]) => Registration, initialValue?: Registration): Registration;
        reduceRight<U>(callbackfn: (previousValue: U, currentValue: Registration, currentIndex: number, array: Registration[]) => U, initialValue: U): U;
        length: number;
        [n: number]: Registration;
    }

    class ServiceDescriptor {
        constructor(serviceType: Function);
        register(container: Container);
        lifestyleSingleton(): ServiceDescriptor;
        lifestyleTransient(): ServiceDescriptor;
    }

    class ComponentDescriptor extends ServiceDescriptor {
        constructor(serviceType: Function);
        implementedBy(implementationType: Function): ComponentDescriptor;
        instance(instance: Object): ComponentDescriptor;
        usingFactoryMethod(factoryMethod: Function): ComponentDescriptor;
        named(name: string): ComponentDescriptor;
        lifestyleSingleton(): ComponentDescriptor;
        lifestyleTransient(): ComponentDescriptor;
    }

    class ConventionDescriptor extends ServiceDescriptor {
        constructor(serviceType: Function);
        constructor(serviceType: Function, implementationTypes: Array<Function>);
        lifestyleSingleton(): ConventionDescriptor;
        lifestyleTransient(): ConventionDescriptor;
    }

    class Component {
        static for(serviceType: Function): ComponentDescriptor;
    }

    class Classes {
        static implementing(serviceType: Function): ConventionDescriptor;
    }

    interface IComponentFactory<T>  {
        resolve(): Object;
        resolveAll(): Array<Object>;
    }

    class Resolver {
        constructor();
        isApplicableTo(dependency: string): boolean;
        resolve(dependency: string, dependencyStack: Array<Registration>): Object;
    }

    class InstanceResolver extends Resolver {
    }

    class TypeResolver extends Resolver {
        resolve(dependency: string, dependencyStack: Array<Registration>): Function;
        resolve<T>(dependency: string, dependencyStack: Array<Registration>): Array<Function>;
    }

    class ArrayResolver extends Resolver {
        resolve(dependency: string, dependencyStack: Array<Registration>): Array<Object>;
    }

    class FactoryResolver extends Resolver {
        resolve<T>(dependency: string, dependencyStack: Array<Registration>): IComponentFactory<T>;
    }

    class Container {
        withResolver(resolver: Resolver): Container;
        register(registration: Registration): Container;
        register(serviceDescriptor: ServiceDescriptor): Container;
        resolve(serviceType: Function): Object;
        resolve<T>(serviceType: Function): T;
        resolve<T>(serviceType: Array<Function>): Array<T>;
        resolveType(serviceType: Function): Function;
        resolveType<T>(serviceType: Array<Function>): Array<Function>;
    }
}

interface FunctionConstructor {
    requiresArgument(argumentName: string, argumentValue: any, argumentType?: string);
    requiresArgument(argumentName: string, argumentValue: any, argumentType?: Function);
    requiresOptionalArgument(argumentName: string, argumentValue: any, argumentType?: Function);
    is(instance: any, argumentType: string);
    is(instance: any, argumentType: Function);
    implements(instance: Object, interface: Object);
    isInterface(type: Function): boolean;
    dependencies?: Array<string>;
}

interface StringConstructor {
    format(formatString: string, ...parameters: Array<any>);
}

declare function namespace(namespace: string): Object;
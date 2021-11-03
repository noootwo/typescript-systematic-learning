# 第三天 持续

## 更多的功能

1. ### 函数类型表达式

描述函数最简单的方法是使用函数类型表达式。这些类型在语法上类似于箭头函数:

```
function greeter(fn: (a: string) => void) {
  fn("Hello, World");
}
 
function printToConsole(s: string) {
  console.log(s);
}
 
greeter(printToConsole);
```

2. ### 呼叫签名

在 JavaScript 中，函数除了可调用之外，还可以具有属性。但是，函数类型表达式语法不允许声明属性。如果我们想用属性来描述可调用的东西，我们可以用对象类型来写一个调用签名:

```
type DescribableFunction = {
  description: string;
  (someArg: number): boolean;
};
function doSomething(fn: DescribableFunction) {
  console.log(fn.description + " returned " + fn(6));
}
```

3. ### 构造签名

函数也可以用新的操作符来调用。引用这些作为构造函数，因为它们通常会创建一个新对象。你可以通过在调用签名前面添加 new 关键字来写一个构造签名:

```
type SomeConstructor = {
  new (s: string): SomeObject;
};
function fn(ctor: SomeConstructor) {
  return new ctor("hello");
}
```

4. ### 泛型

在 TypeScript 中，泛型用于描述两个值之间的对应关系。我们通过在函数签名中声明一个类型参数来实现:

```
function firstElement<Type>(arr: Type[]): Type | undefined {
  return arr[0];
}
```

注意，我们不必在这个示例中指定 Type。类型是由打字稿自动推断选择的。
我们也可以使用多个类型参数，例如，一个独立版本的 map 看起来像这样:

```
function map<Input, Output>(arr: Input[], func: (arg: Input) => Output): Output[] {
  return arr.map(func);
}
 
// Parameter 'n' is of type 'string'
// 'parsed' is of type 'number[]'
const parsed = map(["1", "2", "3"], (n) => parseInt(n));
```

编写一个函数，返回两个值中较长的一个。要做到这一点，我们需要一个长度属性，它是一个数字。我们通过写一个 extends 子句将类型参数约束为该类型:

```
function longest<Type extends { length: number }>(a: Type, b: Type) {
  if (a.length >= b.length) {
    return a;
  } else {
    return b;
  }
}
 
// longerArray is of type 'number[]'
const longerArray = longest([1, 2], [1, 2, 3]);
// longerString is of type 'alice' | 'bob'
const longerString = longest("alice", "bob");
// Error! Numbers don't have a 'length' property
const notOK = longest(10, 100);
// Argument of type 'number' is not assignable to parameter of type '{ length: number; }'.
```

5. ### 可选参数

通过将参数标记为可选的? :

```
function f(x?: number) {
  // ...
}
f(); // OK
f(10); // OK
```

6. ### 函数的重载

在打字稿中，我们可以通过写重载签名来指定一个可以以不同方式调用的函数。要做到这一点，写一些函数签名(通常是两个或更多) ，后面跟着函数体:

```
function makeDate(timestamp: number): Date;
function makeDate(m: number, d: number, y: number): Date;
function makeDate(mOrTimestamp: number, d?: number, y?: number): Date {
  if (d !== undefined && y !== undefined) {
    return new Date(y, mOrTimestamp, d);
  } else {
    return new Date(mOrTimestamp);
  }
}
const d1 = makeDate(12345678);
const d2 = makeDate(5, 5, 5);
const d3 = makeDate(1, 3);
// No overload expects 2 arguments, but overloads do exist that expect either 1 or 3 arguments.
```

重载时，最后一个实现函数要兼顾到上面所有的重载。

7. ### 其他类型

- Void 表示不返回值的函数的返回值。当函数没有返回语句，或者返回语句没有返回任何明确的值时，它就是推断类型:

```
// The inferred return type is void
function noop() {
  return;
}
```

- unknow 未知类型表示任何值。这类似于任何类型，但是更安全，因为任何未知值都是不合法的:

```
function f1(a: any) {
  a.b(); // OK
}
function f2(a: unknown) {
  a.b();
  // Object is of type 'unknown'.
}
```

- never 有些函数从不返回值:

```
function fail(msg: string): never {
  throw new Error(msg);
}
```

- 全局类型 Function 描述了类似 bind、 call、 apply 等属性在 JavaScript 的所有函数值上的表现。它还有一个特殊属性，即 Function 类型的值总是可以被调用; 这些调用返回任何:

```
function doSomething(f: Function) {
  f(1, 2, 3);
}
```

8. ### 参数

在所有其他参数之后会出现一个 rest 参数，它使用... 语法:

```
function multiply(n: number, ...m: number[]) {
  return m.map((x) => n * x);
}
// 'a' gets value [10, 20, 30, 40]
const a = multiply(10, 1, 2, 3, 4);
```

如果不声明...m: number[]，将默认为any[]。

- 参数析构

对象的类型注释在析构化语法之后:

```
function sum({ a, b, c }: { a: number; b: number; c: number }) {
  console.log(a + b + c);
}
```

这看起来有点冗长，但是你也可以在这里使用命名类型:

```
// Same as prior example
type ABC = { a: number; b: number; c: number };
function sum({ a, b, c }: ABC) {
  console.log(a + b + c);
}
```






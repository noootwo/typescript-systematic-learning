# 第二篇 - 持续

## 类型断言

- ### 有时候我们有一个知道一个更具体的类型，但是typescript并不能具体判断的时候：

例如，如果你正在使用 document.getElementById，TypeScript 只知道这会返回某种类型的 HTMLElement，但是你可能知道你的页面总是有一个带有给定 ID 的 HTMLCanvasElement。

```
const myCanvas = document.getElementById("main_canvas") as HTMLCanvasElement;

// or

const myCanvas = <HTMLCanvasElement>document.getElementById("main_canvas");
```

有时这个规则可能过于保守，不允许更复杂的有效强制。如果出现这种情况，您可以使用两个断言，首先是针对 any (或者我们将在后面介绍的 unknown) ，然后是所需的类型:

```
const a = (expr as any) as T;
```

## 文字类型

文字类型本身并不是很有价值:

```
let x: "hello" = "hello";
// OK
x = "hello";
// ...
x = "howdy";
// Type '"howdy"' is not assignable to type '"hello"'.
// 拥有一个只能有一个值的变量没有多大用处！
```

通过将文字组合成联合，可以表达一个更有用的概念——例如，只接受一组已知值的函数:

```
function printText(s: string, alignment: "left" | "right" | "center") {
  // ...
}
printText("Hello, world", "left");
printText("G'day, mate", "centre");
// Argument of type '"centre"' is not assignable to parameter of type '"left" | "right" | "center"'.
```

数值文字类型的工作原理是相同的:

```
function compare(a: string, b: string): -1 | 0 | 1 {
  return a === b ? 0 : a > b ? 1 : -1;
}
```

当然，你可以把它们和非文字类型结合起来:

```
interface Options {
  width: number;
}
function configure(x: Options | "auto") {
  // ...
}
configure({ width: 100 });
configure("auto");
configure("automatic");
Argument of type '"automatic"' is not assignable to parameter of type 'Options | "auto"'.
```

可以通过在任一位置添加类型断言来更改推断:

```
// Change 1:
const req = { url: "https://example.com", method: "GET" as "GET" };
// Change 2
handleRequest(req.url, req.method as "GET");
```

可以使用 const 将整个对象转换为文本类型:

```
const req = { url: "https://example.com", method: "GET" } as const;
handleRequest(req.url, req.method);
```

有一种特殊的语法，用于在不进行任何显式检查的情况下从类型中删除 null 和未定义的内容。写作！在任何表达式之后都是一个类型断言，该值不是 null 或未定义的:

```
function liveDangerously(x?: number | null) {
  // No error
  console.log(x!.toFixed());
}
```

## 缩小范围

假设我们有一个名为 padLeft 的函数。

```
function padLeft(padding: number | string, input: string): string {

 throw new Error("Not implemented yet!");

}
```

如果 padding 是一个数字，那么它将把这个数字视为我们想要预置到输入的空格数。如果填充是一个字符串，它应该只是预先填充到输入。让我们尝试实现当 padLeft 传递一个数字作为填充时的逻辑。

```
function padLeft(padding: number | string, input: string) {

 return new Array(padding + 1).join(" ") + input;

// Operator '+' cannot be applied to types 'string | number' and 'number'.2365Operator '+' cannot be applied to types 'string | number' and 'number'.

}
```

我们在 padding + 1上得到一个错误。正在警告我们，向一个数字 | 字符串添加一个数字可能不会给我们想要的，这是正确的。换句话说，我们没有明确地检查填充是否是一个数字，也没有处理它是一个字符串的情况，所以让我们确切地这样做。

```
function padLeft(padding: number | string, input: string) {
  if (typeof padding === "number") {
    return new Array(padding + 1).join(" ") + input;
  }
  return padding + input;
}
```

## 类型保护

在 TypeScript 中，对 typeof 返回的值进行检查是一种类型保护。因为 TypeScript 编码 typeof 如何对不同的值进行操作，所以它知道 JavaScript 的一些怪异之处。例如，请注意，在上面的列表中，typeof 没有返回字符串 null。看看下面的例子:

```
function printAll(strs: string | string[] | null) {
  if (typeof strs === "object") {
    for (const s of strs) {
      // Object is possibly 'null'.
      // 因为Array和null都是Object类型的子类
      console.log(s);
    }
  } else if (typeof strs === "string") {
    console.log(strs);
  } else {
    // do nothing
  }
}
```

## 真实性缩小

通过判断strs不为null，则必然为string[]

```
function printAll(strs: string | string[] | null) {
  if (strs && typeof strs === "object") {
    for (const s of strs) {
      console.log(s);
    }
  } else if (typeof strs === "string") {
    console.log(strs);
  }
}
```
## 平等缩小

使用 switch 语句和相等性检查，比如 = = = 、 ! = = 、 = = 和! = 来缩小类型:

```
function example(x: string | number, y: string | boolean) {
  if (x === y) {
    // We can now call any 'string' method on 'x' or 'y'.
    x.toUpperCase();
          
    // (method) String.toUpperCase(): string
    y.toLowerCase();
          
    // (method) String.toLowerCase(): string
  } else {
    console.log(x);
               
    // (parameter) x: string | number
    console.log(y);
               
    // (parameter) y: string | boolean
  }
}
```

## 通过in语法缩小

例如，使用 x 中的代码: “ value”，其中“ value”是一个字符串文字，而 x 是一个联合类型。“ true”分支缩小了具有可选或必需属性值的 x 类型，而“ false”分支缩小到具有可选或缺少属性值的类型。

```
type Fish = { swim: () => void };
type Bird = { fly: () => void };
 
function move(animal: Fish | Bird) {
  if ("swim" in animal) {
    return animal.swim();
  }
 
  return animal.fly();
}
```

## 通过instanceof缩小

JavaScript 有一个运算符用于检查一个值是否是另一个值的“实例”。更具体地说，在 JavaScript x instanceof Foo 中检查 x 的原型链是否包含 Foo.prototype。虽然我们在这里不会深入讨论，当我们进入类的时候你会看到更多，但是对于大多数可以用 new 构造的值来说，它们仍然是有用的。正如您可能已经猜到的，instanceof 也是一个类型保护器，并且打字稿在 instanceofs 保护的分支中变窄。

```
function logValue(x: Date | string) {
  if (x instanceof Date) {
    console.log(x.toUTCString());
               
    // (parameter) x: Date
  } else {
    console.log(x.toUpperCase());
               
    // (parameter) x: string
  }
}
```

## 类型谓词

要定义一个用户定义的类型保护，我们只需要定义一个返回类型为类型谓词的函数:

```
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}
```

任何时候 isFish 都是通过某个变量调用的，如果原始类型兼容，那么 TypeScript 会将该变量缩小到特定的类型。

```
// Both calls to 'swim' and 'fly' are now okay.
let pet = getSmallPet();
 
if (isFish(pet)) {
  pet.swim();
} else {
  pet.fly();
}
```

## 复杂的结构中

想象一下我们正在尝试编码像圆圈和方块这样的形状。圆圈记录它们的半径，方块记录它们的边长。我们将使用一个叫 kind 的字段来判断我们处理的是哪种形状。这是第一次尝试定义形状。

```
interface Shape {
  kind: "circle" | "square";
  radius?: number;
  sideLength?: number;
}
```

我们使用字符串类型的联合: “圆”和“正方形”来告诉我们应该分别将形状视为圆还是正方形。通过使用“ circle”| “ square”代替字符串，我们可以避免拼写错误。

```
function handleShape(shape: Shape) {
  // oops!
  if (shape.kind === "rect") {
    // This condition will always return 'false' since the types '"circle" | "square"' and '"rect"' have no overlap.
    // ...
  }
}
```

使用非空断言(a！在 shape.radius 之后)来说桡骨确实存在。

```
function getArea(shape: Shape) {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius! ** 2;
  }
}
```

这种 Shape 编码的问题在于，类型检查器无法根据种类属性知道是否存在半径或旁长。我们需要把我们所知道的告诉类型检查员。不够优雅，考虑到这一点，让我们再次定义 Shape。

```
interface Circle {
  kind: "circle";
  radius: number;
}
 
interface Square {
  kind: "square";
  sideLength: number;
}
 
type Shape = Circle | Square;
```

我们再次检查类属性:

```
function getArea(shape: Shape) {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius ** 2;
                      
    // (parameter) shape: Circle
  }
}
```

同样的检查也适用于 switch 语句。现在我们可以试着写一个完整的旅游目的地，而不需要任何烦人的东西！非空断言。

```
function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
                        
      // (parameter) shape: Circle
    case "square":
      return shape.sideLength ** 2;
              
      // (parameter) shape: Square
  }
}
```

## never类型

例如，在 getArea 函数中添加一个缺省值，该函数尝试将形状分配给 never，当所有可能的情况都没有处理时，将会引发。

```
type Shape = Circle | Square;
 
function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    default:
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
  }
}
```

向 Shape 联合类型添加一个新成员，将导致打字稿错误:

```
interface Triangle {
  kind: "triangle";
  sideLength: number;
}
 
type Shape = Circle | Square | Triangle;
 
function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    default:
      const _exhaustiveCheck: never = shape;
      // Type 'Triangle' is not assignable to type 'never'.
      return _exhaustiveCheck;
  }
}
```


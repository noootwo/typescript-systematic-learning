# 开始
预装环境

tsc编译器

`npm install -g typescript`

也可通过 `ts-node` 直接运行

如运行 `index.ts` 文件：

`console.log('hello typescript!')`

运行：

`ts-node index.ts`

输出：

`hello typescript!`

生成tsconfig.json文件，用于控制typescript的检测的状态。

```
// 命令
tsc --init

// 生成有中文注释的文件
tsc --init --locale zh-cn
```

# 数据类型
### 类型注释

```
//基础数据类型
let myName: string = "ypy";
let myAge: number = 21;
let isMan: boolean = true;

// 数组
let languages: string[] = ["javascript", "html", "css", "python"];
// or let languages: Array<string> = ['javascript', 'html', 'css', 'python']

// 对象类型
// The parameter's type annotation is an object type
function printCoord(pt: { x: number; y: number }) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}
printCoord({ x: 3, y: 7 });
```

## typescript的类型自动判断

```
// 自动判断类型
const names = ["Alice", "Bob", "Eve"];

names.forEach(function (s) {
  console.log(s.toUppercase());
  // Property 'toUppercase' does not exist on type 'string'. Did you mean 'toUpperCase'?
});

names.forEach((s) => {
  console.log(s.toUppercase());
  // Property 'toUppercase' does not exist on type 'string'. Did you mean 'toUpperCase'?
});
```

## 函数的可选属性

```
function printName(obj: { first: string; last?: string }) {
  // ...
}
// Both OK
printName({ first: "Bob" });
printName({ first: "Alice", last: "Alisson" });
```

## 联合类型

```
// Return type is inferred as number[] | string
function getFirstThree(x: number[] | string) {
  return x.slice(0, 3);
}
```

## 类型别名

```
type ID = number | string;

type Point = {
  x: number;
  y: number;
};
 
// Exactly the same as the earlier example
function printCoord(pt: Point) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}
 
printCoord({ x: 100, y: 100 });
```

## 接口

```
interface Point {
  x: number;
  y: number;
}
 
function printCoord(pt: Point) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}
 
printCoord({ x: 100, y: 100 });
```

和类型别名type的对象类型很相似，在许多情况下，您可以在它们之间自由选择。

接口的几乎所有特性都是类型可用的，关键区别在于不能重新打开类型以添加新的属性，而接口总是可扩展的。

- ### 拓展（extends）与 交叉类型（Intersection Types）

interface 可以 extends， 但 type 是不允许 extends 和 implement 的，但是 type 缺可以通过交叉类型 实现 interface 的 extend 行为，并且两者并不是相互独立的，也就是说 interface 可以 extends type, type 也可以 与 interface 类型 交叉 。
虽然效果差不多，但是两者语法不同。

1. interface extends interface

```
interface Name {
  name: string;
}
interface User extends Name {
  age: number;
}
```

2. type 与 type 交叉

```
type Name = {
  name: string;
}
type User = Name & { age: number  };
```

3. interface extends type

```
type Name = {
  name: string;
}
interface User extends Name {
  age: number;
}
```

4. type 与 interface 交叉

```
interface Name {
  name: string;
}
type User = Name & {
  age: number;
}
```

## 有什么不同呢？

- ### type 可以而 interface 不行

1. type 可以声明基本类型别名，联合类型，元组等类型

```
// 基本类型别名
type Name = string

// 联合类型
interface Dog {
    wong();
}
interface Cat {
    miao();
}

type Pet = Dog | Cat

// 具体定义数组每个位置的类型
type PetList = [Dog, Pet]
```

2. type 语句中还可以使用 typeof 获取实例的 类型进行赋值

```
// 当你想获取一个变量的类型时，使用 typeof
let div = document.createElement('div');
type B = typeof div
```

3. 其他骚操作

```
type StringOrNumber = string | number;  
type Text = string | { text: string };  
type NameLookup = Dictionary<string, Person>;  
type Callback<T> = (data: T) => void;  
type Pair<T> = [T, T];  
type Coordinates = Pair<number>;  
type Tree<T> = T | { left: Tree<T>, right: Tree<T> };
```

- ### interface 可以而 type 不行

interface 能够声明合并，向现有接口添加新字段

```
interface Window {
  title: string
}

interface Window {
  ts: TypeScriptAPI
}

const src = 'const a = "Hello World"';
window.ts.transpileModule(src, {});
```

类型创建后不能更改

```
type Window = {
  title: string
}

type Window = {
  ts: TypeScriptAPI
}

 // Error: Duplicate identifier 'Window'.
```
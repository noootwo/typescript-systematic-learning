// 不使用 Omit 实现 TypeScript 的 Omit<T, K> 范型。

// Omit 会创建一个省略 K 中字段的 T 对象。

interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview1 = MyOmit<Todo, "description" | "title">;

const todo1: TodoPreview1 = {
  completed: false,
};

type MyOmit<T, K extends keyof T> = Pick<
  T,
  {
    [O in keyof T]: O extends K ? never : O;
  }[keyof T]
>;

type MyOmit2<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// 实现绝对类型。接受字符串、数字或大数的类型。输出应该是一个正数字符串

type Test = -100;
type Result = Absolute<Test>; // expected to be "100"

type Absolute<T extends string | number | bigint> = `${T}` extends `-${infer N}`
  ? N
  : T;

// 实现 Python 喜欢类型系统中的任何函数。类型接受 Array，如果 Array 中的任何元素为 true，则返回 true。如果 Array 为空，则返回 false。
type FalseArray = "" | 0 | false | [] | { [P in any]: never };

type AnyOf<T extends any[]> = T extends [infer H, ...infer T]
  ? H extends FalseArray
    ? AnyOf<T>
    : true
  : false;

type AnyOf1<T extends any[]> = T[number] extends
  | 0
  | ""
  | false
  | []
  | { [key: string]: never }
  ? false
  : true;

type Sample1 = AnyOf<[1, "", false, [], {}]>; // expected to be true.
type Sample2 = AnyOf<[0, "", false, [], {}]>; // expected to be false.

// 不使用 ReturnType 实现 TypeScript 的 ReturnType<T> 范型。

const fn = (v: boolean) => {
  if (v) return 1;
  else return 2;
};

type a4 = MyReturnType<typeof fn>; // 应推导出 "1 | 2"

type MyReturnType<T extends (...args: any[]) => any> = T extends (
  ...args: any[]
) => infer R
  ? R
  : never;

// 实现一个通用的DeepReadonly<T>，它将对象的每个参数及其子对象递归地设为只读。

// 您可以假设在此挑战中我们仅处理对象。数组，函数，类等都无需考虑。但是，您仍然可以通过覆盖尽可能多的不同案例来挑战自己。

type X = {
  x: {
    a: 1;
    b: "hi";
  };
  y: "hey";
};

type Expected = {
  readonly x: {
    readonly a: 1;
    readonly b: "hi";
  };
  readonly y: "hey";
};

type DeepReadonly<T extends { [key: string]: any }> = {
  readonly [K in keyof T]: T[K] extends { [key: string]: any }
    ? DeepReadonly<T[K]>
    : T[K];
};

let todo: DeepReadonly<X>; // should be same as `Expected`

// 实现泛型TupleToUnion<T>，它覆盖元组的值与其值联合。

type Arr = ["1", "2", "3"];

type a = TupleToUnion<Arr>; // expected to be '1' | '2' | '3'

type TupleToUnion<T extends any[]> = T[number];

// 在 JavaScript 中我们很常会使用可串联（Chainable/Pipeline）的函数构造一个对象，但在 TypeScript 中，你能合理的给他附上类型吗？

// 在这个挑战中，你可以使用任意你喜欢的方式实现这个类型 - Interface, Type 或 Class 都行。你需要提供两个函数 option(key, value) 和 get()。在 option 中你需要使用提供的 key 和 value 扩展当前的对象类型，通过 get 获取最终结果。

// 你只需要在类型层面实现这个功能 - 不需要实现任何 TS/JS 的实际逻辑。

// 你可以假设 key 只接受字符串而 value 接受任何类型，你只需要暴露它传递的类型而不需要进行任何处理。同样的 key 只会被使用一次。

type Chainable<T = {}> = {
  option<K extends string, V extends any>(
    key: K,
    value: V
  ): Chainable<T & { [key in K]: V }>;
  get(): T;
};

declare const config: Chainable;

const result = config
  .option("foo", 123)
  .option("name", "type-challenges")
  .option("bar", { value: "Hello World" })
  .get();

// 期望 result 的类型是：
interface Result2 {
  foo: number;
  name: string;
  bar: {
    value: string;
  };
}

// 实现一个通用Last<T>，它接受一个数组T并返回其最后一个元素的类型。

type arr1 = ["a", "b", "c"];
type arr2 = [3, 2, 1];

type tail1 = Last<arr1>; // expected to be 'c'
type tail2 = Last<arr2>; // expected to be 1

type Last<T extends any[]> = T extends [...infer T, infer K] ? K : never;

// 实现一个通用Pop<T>，它接受一个数组T并返回一个没有最后一个元素的数组。

type arr3 = ["a", "b", "c", "d"];
type arr4 = [3, 2, 1];

type re1 = Pop<arr3>; // expected to be ['a', 'b', 'c']
type re2 = Pop<arr4>; // expected to be [3, 2]

type Pop<T extends any[]> = T extends [...infer T, infer K] ? T : never;

// 额外：同样，您也可以实现Shift，Push和Unshift吗？
// Push 和 Unshift 见 simple.ts

type re3 = Shift<arr3>; // expected to be ['b', 'c', 'd']
type re4 = Shift<arr4>; // expected to be [2, 1]

type Shift<T extends any[]> = T extends [infer K, ...infer T] ? T : never;

// 键入函数PromiseAll，它接受PromiseLike对象数组，返回值应为Promise<T>，其中T是解析的结果数组。

const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise<string>((resolve, reject) => {
  setTimeout(resolve, 100, "foo");
});

// expected to be `Promise<[number, number, string]>`
const p = Promise.all([promise1, promise2, promise3] as const);
const p1 = PromiseAll([promise1, promise2, promise3] as const);

declare function PromiseAll<T extends any[]>(
  value: readonly [...T]
): Promise<{ [K in keyof T]: T[K] extends Promise<infer R> ? R : T[K] }>;

// 有时，您可能希望根据其属性在并集中查找类型。

// 在此挑战中，我们想通过在联合Cat | Dog中搜索公共type字段来获取相应的类型。换句话说，在以下示例中，我们期望LookUp<Dog | Cat, 'dog'>获得Dog，LookUp<Dog | Cat, 'cat'>获得Cat。

interface Cat {
  type: "cat";
  breeds: "Abyssinian" | "Shorthair" | "Curl" | "Bengal";
}

interface Dog {
  type: "dog";
  breeds: "Hound" | "Brittany" | "Bulldog" | "Boxer";
  color: "brown" | "white" | "black";
}

type MyDog = LookUp<Cat | Dog, "dog">; // expected to be `Dog`
type MyCat = LookUp<Cat | Dog, "Curl">; // expected to be `Cat`

type LookUp<T, U> = {
  [K in keyof T]: U extends T[K] ? T : never;
}[keyof T];

// 实现 TrimLeft<T> ，它接收确定的字符串类型并返回一个新的字符串，其中新返回的字符串删除了原字符串开头的空白字符串。

type trimed = TrimLeft<"  Hello World  ">; // 应推导出 'Hello World  '

type TrimLeft<T extends string> = T extends `${" " | "\n" | "\t"}${infer T}`
  ? TrimLeft<T>
  : T;

// 实现 Trim<T>，它采用一个精确的字符串类型，并返回一个新的字符串，从两端删除空白。

type trimed1 = Trim<"  Hello World  ">; // expected to be 'Hello World'

type Trim<T extends string> = T extends
  | `${" " | "\n" | "\t"}${infer T}`
  | `${infer T}${" " | "\n" | "\t"}`
  ? Trim<T>
  : T;

// 实现Capitalize<t>，它将字符串的第一个字母转换为大写，其余字母保持原样。

type UpperChar<S extends string> = S extends "a"
  ? "A"
  : S extends "b"
  ? "B"
  : S extends "c"
  ? "C"
  : S extends "d"
  ? "D"
  : S extends "e"
  ? "E"
  : S extends "f"
  ? "F"
  : S extends "g"
  ? "G"
  : S extends "h"
  ? "H"
  : S extends "i"
  ? "I"
  : S extends "j"
  ? "J"
  : S extends "k"
  ? "K"
  : S extends "l"
  ? "L"
  : S extends "m"
  ? "M"
  : S extends "n"
  ? "N"
  : S extends "o"
  ? "O"
  : S extends "p"
  ? "P"
  : S extends "q"
  ? "Q"
  : S extends "r"
  ? "R"
  : S extends "s"
  ? "S"
  : S extends "t"
  ? "T"
  : S extends "u"
  ? "U"
  : S extends "v"
  ? "V"
  : S extends "w"
  ? "W"
  : S extends "x"
  ? "X"
  : S extends "y"
  ? "Y"
  : S extends "z"
  ? "Z"
  : S;

type capitalized = MyCapitalize<"hello world">; // expected to be 'Hello world'

type MyCapitalize<T extends string> = T extends `${infer H}${infer T}`
  ? `${UpperChar<H>}${T}`
  : UpperChar<T>;

// 实现 Replace < s，From，To > ，在给定的字符串 s 中用 To 替换字符串 From

type replaced1 = Replace<"types are fun!", "fun", "awesome">; // expected to be 'types are awesome!'
type replaced2 = Replace<"types are fun!", "types", "type">; // expected to be 'type are fun!'
type replaced3 = Replace<"", "types", "type">; // expected to be ''

type Replace<
  T extends string,
  O extends string,
  N extends string
> = T extends `${infer L}${O}${infer R}` ? `${L}${N}${R}` : T;

// 实现 ReplaceAll < s，From，To > ，它用 To 替换给定字符串 s 中的所有子字符串 From

type replaced = ReplaceAll<"t y p e s", " ", "">; // expected to be 'types'

type ReplaceAll<
  T extends string,
  O extends string,
  N extends string
> = T extends `${infer L}${O}${infer R}` ? ReplaceAll<`${L}${N}${R}`, O, N> : T;

// 实现一个范型 AppendArgument<Fn, A>，对于给定的函数类型 Fn，以及一个任意类型 A，返回一个新的函数 G。G 拥有 Fn 的所有参数并在末尾追加类型为 A 的参数。

type Fn = (a: number, b: string) => number;

type Result3 = AppendArgument<Fn, boolean>;
// 期望是 (a: number, b: string, x: boolean) => number

// with built-in type
type AppendArgument1<Fn extends (...args: any) => any, Type> = (
  ...args: [...Parameters<Fn>, Type]
) => ReturnType<Fn>;

type AppendArgument<F extends Function, A> = F extends (
  ...arg: infer U
) => infer R
  ? (...arg: [...U, A]) => R
  : F;

// 实现将联合类型转换为包含联合排列的数组的排列类型。

type perm = Permutation<"A" | "B" | "C">; // ['A', 'B', 'C'] | ['A', 'C', 'B'] | ['B', 'A', 'C'] | ['B', 'C', 'A'] | ['C', 'A', 'B'] | ['C', 'B', 'A']

type Permutation<T, U = T> = [U] extends [never]
  ? []
  : T extends never
  ? []
  : [T, ...Permutation<Exclude<U, T>>];

// 计算字符串文本的长度，它的行为类似于 String # length。
type Split<S extends string> = S extends `${infer A}${infer B}`
  ? [A, ...Split<B>]
  : [];

type LengthOfString<S extends string> = Split<S>["length"];

const len: LengthOfString<"123456"> = 6;

// 在这个挑战中，您需要编写一个接受数组并发出扁平数组类型的类型。

type flatten = Flatten<[1, 2, [3, 4], [[[5]]]]>; // [1, 2, 3, 4, 5]

type Flatten<T extends any[]> = T extends [infer L, ...infer R]
  ? L extends Array<any>
    ? [...Flatten<L>, ...Flatten<R>]
    : [L, ...Flatten<R>]
  : T;

type Flatten1<T extends any[]> = T extends [infer First, ...infer Rest]
  ? [...(First extends any[] ? Flatten<First> : [First]), ...Flatten<Rest>]
  : [];

// 实现向接口添加新字段的类型。类型接受三个参数。输出应该是带有新字段的对象

type Result1 = AppendToObject<{ id: "1" }, "value", 4>; // expected to be { id: '1', value: 4 }

type AppendToObject<T extends object, U extends string, V> = {
  [key in keyof T | U]: key extends keyof T ? T[key] : V;
};

// 实现 String to Union 类型。键入 take String 参数。输出应该是输入字母的联合

type Result4 = StringToUnion<"123">; // expected to be "1" | "2" | "3"
type Result5 = StringToUnion1<"123">; // expected to be "1" | "2" | "3"

type StringToUnion<T extends string> = Split<T>[number];
type StringToUnion1<T extends string> = T extends `${infer A}${infer B}`
  ? A | StringToUnion<B>
  : never;

// 将两种类型合并为一种新类型。第二种类型的键重写第一种类型的键。

type Merge<T extends object, U extends object> = {
  [K in keyof T | keyof U]: K extends keyof U
    ? U[K]
    : K extends keyof T
    ? T[K]
    : never;
};

type c = Merge<{ a: 1 }, { a: 2; b: 3 }>; //expected { a: 2, b: 3 }

// for-bar-baz -> forBarBaz 驼峰命名

type Result6 = CamelCase<"for-bar-baz">;

type CamelCase<T extends string> = T extends `${infer L}-${infer R}`
  ? `${L}${CamelCase<MyCapitalize<R>>}`
  : T;

// FooBarBaz -> for-bar-baz 肉串命名

type Result7 = KebabCase<Result6>;
type Result8 = KebabCase<"Result6">;
type Result9 = KebabCase1<"Vue3TypeScript">;

type KebabCase1<T extends string> = T extends `${infer L}${infer R}`
  ? Lowercase<L> extends L
    ? `${L}${KebabCase<R>}`
    : `${L extends T[0] ? "" : "-"}${Lowercase<L>}${KebabCase<R>}`
  : T;

type KebabCase<
  S extends string,
  P extends string = ""
> = S extends `${infer C}${infer R}`
  ? C extends Lowercase<C>
    ? `${C}${KebabCase<R, "-">}`
    : `${P}${Lowercase<C>}${KebabCase<R, "-">}`
  : S;

type o1 = { a: 1; b: 2 };
type o2 = { c: 2; b: 3 };

type Result10 = Diff<o1, o2>; // expected {a: 1, c: 2}

type Diff<T extends Object, U extends Object> = {
  [K in
    | Exclude<keyof T, keyof U>
    | Exclude<keyof U, keyof T>]: K extends keyof T
    ? T[K]
    : K extends keyof U
    ? U[K]
    : never;
};

// 实现一个类型 IsNever，它接受输入类型 t。如果解析类型为 never，则返回 true，否则返回 false。

type A1 = IsNever<never>; // expected to be true
type B = IsNever<undefined>; // expected to be false
type C = IsNever<null>; // expected to be false
type D = IsNever<[]>; // expected to be false
type E = IsNever<number>; // expected to be false

type IsNever<T> = [T] extends [never] ? true : false;

// 实现一个类型 IsUnion，该类型接受输入类型 t，并返回 t 是否解析为联合类型。

type case1 = IsUnion<string>; // false
type case2 = IsUnion<string | number>; // true
type case3 = IsUnion<[string | number]>; // false

type IsUnion<T, F = T> = T extends T
  ? Array<F> extends Array<T>
    ? false
    : true
  : never;

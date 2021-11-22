// 实现 TS 内置的 Pick<T, K>，但不可以使用它。

import { Equal } from "@type-challenges/utils";

// 从类型 T 中选择出属性 K，构造成一个新的类型。
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = MyPick<Todo, "title" | "completed">;

const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
};

type MyPick<T, K extends keyof T> = {
  [k in K]: T[k];
};

type Awaited<R extends Promise<any>> = R extends Promise<infer T> ? T : R;

const a: Awaited<Promise<string>>;

// 不要使用内置的Readonly<T>，自己实现一个。

// 该 Readonly 会接收一个 泛型参数，并返回一个完全一样的类型，只是所有属性都会被 readonly 所修饰。

// 也就是不可以再对该对象的属性赋值。

interface Todo2 {
  title: string;
  description: string;
}

const todo2: MyReadonly<Todo2> = {
  title: "Hey",
  description: "foobar",
};

type MyReadonly<T> = {
  readonly [K in keyof T]: T[K];
};

todo2.title = "Hello"; // Error: cannot reassign a readonly property
todo2.description = "barFoo"; // Error: cannot reassign a readonly property

// 实现泛型TupleToUnion<T>，它覆盖元组的值与其值联合。

type Arr = ["1", "2", "3"];

type TupleToUnion<T extends any[]> = T[number];

const a1: TupleToUnion<Arr> = "1"; // expected to be '1' | '2' | '3'

// 实现一个通用First<T>，它接受一个数组T并返回它的第一个元素的类型。

type arr1 = ["a", "b", "c"];
type arr2 = [3, 2, 1];

type head1 = First1<arr1>; // expected to be 'a'
type head2 = First1<arr2>; // expected to be 3

type First<T> = T extends [infer F, ...infer T] ? F : never;
type First1<T extends any[]> = T extends [] ? never : T[0];

// 创建一个通用的Length，接受一个readonly的数组，返回这个数组的长度。

type tesla = ["tesla", "model 3", "model X", "model Y"];
type spaceX = [
  "FALCON 9",
  "FALCON HEAVY",
  "DRAGON",
  "STARSHIP",
  "HUMAN SPACEFLIGHT"
];

type teslaLength = Length<tesla>; // expected 4
type spaceXLength = Length<spaceX>; // expected 5

type Length<T extends readonly any[]> = T["length"];

// 实现内置的Exclude <T，U>类型，但不能直接使用它本身。
// 从联合类型T中排除U的类型成员，来构造一个新的类型。

type MyExclude<T, U> = T extends U ? never : T;

type a2 = MyExclude<1 | 2 | 3, 2>;

// 实现一个 IF 类型，它接收一个条件类型 C ，一个判断为真时的返回类型 T ，以及一个判断为假时的返回类型 F。 C 只能是 true 或者 false， T 和 F 可以是任意类型。

type A1 = If<true, "a", "b">; // expected to be 'a'
type B1 = If<false, "a", "b">; // expected to be 'b'

type If<T extends Boolean, A, B> = T extends true ? A : B;

// 在类型系统里实现 JavaScript 内置的 Array.concat 方法，这个类型接受两个参数，返回的新数组类型应该按照输入参数从左到右的顺序合并为一个新的数组。

type Result1 = Concat<[1], [2]>; // expected to be [1, 2]

type Concat<T extends any[], U extends any[]> = [...T, ...U];

// 在类型系统里实现 JavaScript 的 Array.includes 方法，这个类型接受两个参数，返回的类型要么是 true 要么是 false。

type isPillarMen = Includes1<["Kars", "Esidisi", "Wamuu", "Santana"], "Dio">; // expected to be `false`

type Includes<T extends any[], U> = U extends T[number] ? true : false;

type Includes1<T extends any[], U> = T extends [infer H, ...infer T]
  ? Equal<H, U> extends true
    ? true
    : Includes1<T, U>
  : false;

// 在类型系统里实现通用的 Array.push 。

type Result2 = Push<[1, 2], "3">; // [1, 2, '3']

type Push<T extends any[], U> = [...T, U];

// 在类型系统里实现通用的 Array.unshift 。

type Result3 = Unshift<[1, 2], "3">; // ['3', 1, 2]

type Unshift<T extends any[], U> = [U, ...T];

// 实现内置的 Parameters 类型，而不是直接使用它，可参考TypeScript官方文档。

// 获取函数参数的类型

type MyParameters<T extends (...args: any[]) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never;

declare function f1(arg: { a: number; b: string }): void;

type T0 = MyParameters<() => string>; // []
type T1 = MyParameters<(s: string) => void>; // [s: string]
type T2 = MyParameters<<T>(arg: T) => T>; // [arg: unknown]
type T3 = MyParameters<typeof f1>; // [arg: { a: number; b: string; }]

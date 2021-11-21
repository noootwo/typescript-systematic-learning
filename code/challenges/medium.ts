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
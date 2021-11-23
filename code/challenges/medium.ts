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
  if (v)
    return 1
  else
    return 2
}

type a4 = MyReturnType<typeof fn> // 应推导出 "1 | 2"

type MyReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer R ? R : never

// 实现一个通用的DeepReadonly<T>，它将对象的每个参数及其子对象递归地设为只读。

// 您可以假设在此挑战中我们仅处理对象。数组，函数，类等都无需考虑。但是，您仍然可以通过覆盖尽可能多的不同案例来挑战自己。

type X = { 
  x: { 
    a: 1
    b: 'hi'
  }
  y: 'hey'
}

type Expected = { 
  readonly x: { 
    readonly a: 1
    readonly b: 'hi'
  }
  readonly y: 'hey' 
}

type DeepReadonly<T extends {[key: string]:any}> = {
  readonly [K in keyof T]: T[K] extends {[key: string]:any} ? DeepReadonly<T[K]> : T[K]
}

let todo: DeepReadonly<X> // should be same as `Expected`

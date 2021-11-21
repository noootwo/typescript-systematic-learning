// 实现泛型GetReadonlyKeys<T>，该GetReadonlyKeys<T>返回对象的只读键的并集。

interface Todo3 {
  readonly title: string;
  readonly description: string;
  completed: boolean;
}

type Keys = GetReadonlyKeys<Todo3>; // expected to be "title" | "description"

type IsEqual<X, Y, A, B> = (<T>() => T extends X ? 1 : 2) extends <
  T
>() => T extends Y ? 1 : 2
  ? A
  : B;

type GetReadonlyKeys<T> = {
  [K in keyof T]-?: IsEqual<
    { [O in K]: T[K] },
    { -readonly [O in K]: T[K] },
    never,
    K
  >;
}[keyof T];

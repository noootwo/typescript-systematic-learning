// 实现泛型GetReadonlyKeys<T>，该GetReadonlyKeys<T>返回对象的只读键的并集。

interface Todo3 {
  readonly title: string
  readonly description: string
  completed: boolean
}

type Keys = GetReadonlyKeys<Todo3> // expected to be "title" | "description"

type IsEqual<X, Y, A, B> = (<T>() => T extends X ? 1 : 2) extends <
  T
>() => T extends Y ? 1 : 2
  ? A
  : B

type GetReadonlyKeys<T> = {
  [K in keyof T]-?: IsEqual<
    { [O in K]: T[K] },
    { -readonly [O in K]: T[K] },
    never,
    K
  >
}[keyof T]

// -----------------------------------------------------------------------------------

// 您需要实现一个类型级别的解析器，将 URL 查询字符串解析为对象文本类型。

// 一些详细的要求:

// 可以忽略查询字符串中键的值，但仍可对其进行解析为 true。例如: key是无值的，因此解析器的结果是{ key: true }.
// 复制键必须合并成一个键。如果具有相同键的不同值，则必须将值合并为元组类型
// 当一个键只有一个值时，该值不能包装成元组类型
// 如果具有相同键值的值出现多次，则必须将其视为一次, key=value&key=value必须只视为key=value。

type NewKeyValue<
  T extends Object,
  NK extends string,
  V extends any
> = NK extends keyof T
  ? V extends T[NK]
    ? T
    : Copy<T & { [key in NK]: V extends '' ? true : V }>
  : Copy<T & { [key in NK]: V extends '' ? true : V }>

type QueryStringParser<
  S extends string,
  U extends { [key in string]: string | boolean | string[] } = {}
> = S extends `${infer K}=${infer L}`
  ? L extends `${infer V}&${infer R}`
    ? QueryStringParser<R, Copy<U & { [key in K]: V extends '' ? true : V }>>
    : Copy<U & { [key in K]: L extends '' ? true : L }>
  : U

type test = QueryStringParser<'a=1&b=2&c=3'>

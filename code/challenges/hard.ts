import { Equal } from "@type-challenges/utils";

// 实现类似Vue的类型支持的简化版本。

// 通过提供函数名称SimpleVue（类似于Vue.extend或defineComponent），它应该正确地推断出计算和方法内部的this类型。

// 在此挑战中，我们假设SimpleVue接受带有data，computed和methods字段的Object作为唯一参数，

// -data是一个简单的函数，它返回一个公开上下文this的对象，但是您无法访问data中的数据本身或其他计算机值或方法。

// -computed是将上下文作为this的函数的对象，进行一些计算并返回结果。计算结果应作为简单的返回值而不是函数显示给上下文。

// -methods是函数的对象，其上下文也与this相同。方法可以访问data，computed以及其他methods公开的字段。 computed与methods的不同之处在于按原样公开的功能。

// SimpleVue的返回值类型可以是任意的。

const instance = SimpleVue({
  data() {
    return {
      firstname: "Type",
      lastname: "Challenges",
      amount: 10,
    };
  },
  computed: {
    fullname() {
      return this.firstname + " " + this.lastname;
    },
    name() {
      this.fullname();
    },
  },
  methods: {
    hi() {
      alert(this.fullname.toLowerCase());
    },
  },
});

type A = Record<string, any>;

interface Options<D, C extends A, M> {
  data: (this: void) => D;
  computed: C & ThisType<D & C>;
  methods: M & ThisType<M & { [P in keyof C]: ReturnType<C[P]> }>;
}

declare function SimpleVue<D, C extends A, M>(options: Options<D, C, M>): any;

// -----------------------------------------------------------------------------------

// 实现一个类型 uniontuple，它将联合转换为元组。

// 正如我们所知，联合是一个无序的结构，但是元组是一个有序的结构，这意味着我们不应该预先假设任何秩序将被保留在一个联合条款之间，当联合被创建或转换。

// 因此，在这个挑战中，输出元组中元素的任何排列都是可以接受的。

// 您的类型应该解析为以下两种类型之一，但不是它们的联合！

type tup = UnionToTuple<1>; // [1], and correct
type tup1 = UnionToTuple<"any" | "a">; // ['any','a'], and correct

type UnionToTuple<T, R extends any[] = [], U = T> = [T] extends [never]
  ? R
  : T extends T
  ? UnionToTuple<Exclude<U, T>, [...R, T]>
  : [];

// -----------------------------------------------------------------------------------

// 在这个问题中，类型应该将给定的字符串元组转换为行为类似枚举的对象。此外，一个枚举的性质最好是帕斯卡情形。

type e = Enum<["macOS", "Windows", "Linux"]>;
// -> { readonly MacOS: "macOS", readonly Windows: "Windows", readonly Linux: "Linux" }

// 如果在第二个参数中给出了 true，那么该值应该是一个数字字面值。

type e1 = Enum<["macOS", "Windows", "Linux"], true>;
// -> { readonly MacOS: 0, readonly Windows: 1, readonly Linux: 2 }

type Enum<T extends string[], U extends boolean = false> = {
  readonly [K in T[number] as Capitalize<K>]: U extends true
    ? IndexOf<T, K>
    : K;
};

// -----------------------------------------------------------------------------------

// Currying 是一种技术，它将一个接受多个参数的函数转换为一系列接受单个参数的函数。

const add = (a: number, b: number) => a + b;
const three = add(1, 2);

const curriedAdd = Currying(add);
const five = curriedAdd(2)(3);

// 传递给 Currying 的函数可能有多个参数，您需要正确地键入它。

// 在这个挑战中，curry 函数一次只接受一个参数。一旦指定了所有的参数，它应该返回它的结果。

type FirstArgument<T extends any[]> = T extends [...infer L, infer R]
  ? L extends []
    ? T
    : FirstArgument<L>
  : [];

type Curry<T extends (...arg: any) => any> = T extends (
  ...arg: infer A
) => infer B
  ? A extends [infer L, ...infer R]
    ? R extends []
      ? T
      : (...args: FirstArgument<A>) => Curry<(...args: R) => B>
    : T
  : T;

declare function Currying<T extends (...arg: any) => any>(fn: T): Curry<T>;

// -----------------------------------------------------------------------------------

// 实现高级应用型联合交叉

type I = Union2Intersection<"foo" | 42 | true>; // expected to be 'foo' & 42 & true
type I1 = Union2Intersection<(() => "foo") | ((i: 42) => true)>;

type Union2Intersection<T> = (T extends any ? (a: T) => any : never) extends (
  a: infer U
) => any
  ? U
  : never;

// -----------------------------------------------------------------------------------

// 实现高级应用类型 GetRequired < t > ，它保留了所有需要的字段

type I2 = GetRequired<{ foo: number; bar?: string }>; // expected to be { foo: number }
type I3 = GetRequired<{ foo: undefined; bar?: undefined }>;

type GetRequired<T, P extends Required<T> = Required<T>> = {
  [K in keyof T as T[K] extends P[K] ? K : never]: P[K];
};

// -----------------------------------------------------------------------------------

// 实现高级的 util 类型 getopt < t > ，它保留了所有可选字段

type I4 = GetOptional<{ foo: number; bar?: string }>; // expected to be { bar?: string }

type GetOptional<T, P extends Required<T> = Required<T>> = {
  [K in keyof T as T[K] extends P[K] ? never : K]: P[K];
};

// -----------------------------------------------------------------------------------

// 实现高级的 util 类型 RequiredKeys < t > ，它将所有需要的密钥集成为一个联合。

type Result16 = RequiredKeys<{ foo: number; bar?: string }>;
// expected to be “foo”

type RequiredKeys<T> = keyof {
  [K in keyof T as {} extends Pick<T, K> ? never : K]: K;
};

// -----------------------------------------------------------------------------------

// 实现高级的 util 类型 OptionalKeys < t > ，它将所有可选的密钥组成一个联合。

type Result17 = OptionalKeys<{ foo: number; bar?: string }>;

type t = {} extends Omit<{ foo: number; bar?: string }, "foo"> ? 1 : 2;

type OptionalKeys<T> = keyof {
  [K in keyof T as {} extends Omit<T, K> ? never : K]: K;
};

// -----------------------------------------------------------------------------------

// 实现大写单词 < t > ，它将字符串中每个单词的首字母转换为大写，其余单词保持原样。

type Capitalized = CapitalizeWords<"hello world, my friends">; // expected to be 'Hello World, My Friends'
type Capitalized1 = CapitalizeWords<"">; // expected to be ''
type Capitalized2 = CapitalizeWords<"FOOBAR">;
type Capitalized3 = CapitalizeWords<"foo bar">;
type Capitalized4 = CapitalizeWords<"foo bar hello world">;
type Capitalized5 = CapitalizeWords<"foo bar.hello,world">;

type CapitalizeWords<S extends string> = S extends `${infer L} ${infer R}`
  ? `${Capitalize<L>} ${CapitalizeWords<R>}`
  : S extends `${infer L}.${infer R}`
  ? `${Capitalize<L>}.${CapitalizeWords<R>}`
  : S extends `${infer L},${infer R}`
  ? `${Capitalize<L>},${CapitalizeWords<R>}`
  : Capitalize<S>;

// -----------------------------------------------------------------------------------

// 实现 CamelCase < t > 将 snake _ case 字符串转换为 CamelCase。

type camelCase1 = CamelCaseHard<"hello_world_with_types">; // expected to be 'helloWorldWithTypes'
type camelCase2 = CamelCaseHard<"HELLO_WORLD_WITH_TYPES">; // expected to be same as previous one

type CamelCaseHard<S extends string, F = 0> = S extends `${infer L}_${infer R}`
  ? `${F extends 0 ? Lowercase<L> : Capitalize<Lowercase<L>>}${CamelCaseHard<
      R,
      1
    >}`
  : F extends 0
  ? Lowercase<S>
  : Capitalize<Lowercase<S>>;

// -----------------------------------------------------------------------------------

// 在 c 语言中有一个函数: printf。这个函数允许我们打印带格式的东西。像这样:

// printf("The result is %d.", 42);

// 这个挑战要求您解析输入字符串并提取格式占位符，如% d 和% f。例如，如果输入字符串是“ The result is% d”，解析的结果是一个 tuple [‘ dec’]。

// 下面是地图:

type ControlsMap = {
  c: "char";
  s: "string";
  d: "dec";
  o: "oct";
  h: "hex";
  f: "float";
  p: "pointer";
};

type PrintF<S extends string> = S extends `${infer _}%${infer R}`
  ? [
      ControlsMap[(R extends `${infer F}${infer _}` ? F : R) &
        keyof ControlsMap],
      ...PrintF<R>
    ]
  : [];

type Result18 = PrintF<"The result is %d%c%o.">;

// -----------------------------------------------------------------------------------

// 这个挑战是从6-Simple Vue 开始的，你应该先完成这个挑战，然后基于它修改你的代码来开始这个挑战。

// 除了简单的 Vue，我们现在有一个新的道具领域的选择。这是 Vue 的道具选项的简化版本。以下是一些规则。

// 道具是一个物体，包含了每一个领域作为关键的真正的道具注入到这里。注入的道具在所有情况下都可以访问，包括数据、计算和方法。

// Prop 将由构造函数或具有包含构造函数的类型字段的对象定义。

props: {
  foo: Boolean;
}
// or
props: {
  foo: {
    type: Boolean;
  }
}
// 应该被推断为类型 Props = { foo: boolean }。

// 当传递多个构造函数时，类型应该被推断为联合。

props: {
  foo: {
    type: [Boolean, Number, String];
  }
}

type Props = { foo: boolean | number | string };

// 当传递一个空对象时，应该将该键推导到任何。

// 有关更多指定的用例，请参阅测试用例部分。

// 在这个挑战中，Vue 中的 required、 default 和 array 道具不被考虑。

// TODO:

// -----------------------------------------------------------------------------------

// 有时检测是否有任何类型的值是很有用的。这在处理第三方打字稿模块时特别有用，该模块可以导出模块 API 中的任何值。当你压制隐私支票的时候，知道这些也是很好的。

// 因此，让我们编写一个实用程序类型 IsAny < t > ，它接受输入类型 t。如果 t 是任何值，返回 true，否则返回 false。

type A4 = IsAny<any>;
type A5 = IsAny<number>;
type A6 = IsAny<string>;

type IsAny<T> = 1 extends T & 0 ? true : false;

// -----------------------------------------------------------------------------------

// Lodash 中的 get 函数是访问 JavaScript 中嵌套值的一个非常方便的帮助器。然而，当我们谈到打字稿时，使用这样的函数会使你丢失类型信息。随着 TS 4.1即将推出的 Template Literal Types 特性，正确地输入 get 成为可能。你能实现它吗？

type Data = {
  foo: {
    bar: {
      value: "foobar";
      count: 6;
    };
    included: true;
  };
  hello: "world";
};

type A7 = Get<Data, "hello">; // 'world'
type B1 = Get<Data, "foo.bar.count">; // 6
type C1 = Get<Data, "foo.bar">; // { value: 'foobar', count: 6 }

// 在此挑战中不需要访问数组。

type Get<
  T extends { [key in string]: any },
  U extends string
> = U extends `${infer L}.${infer R}` ? Get<T[L], R> : T[U];

// -----------------------------------------------------------------------------------

// 将字符串文字转换为数字，其行为类似 Number.parseInt。

type ToNumber<
  T extends string,
  U extends any[] = []
> = `${U["length"]}` extends T ? U["length"] : ToNumber<T, [...U, 1]>;

type N = ToNumber<"0">; // expected to be 0
type N1 = ToNumber<"5">; // expected to be 5

// -----------------------------------------------------------------------------------

// 实现一个类型 FilterOut < t，f > ，它从元组 t 中过滤出给定类型 f 的项。

type Filtered = FilterOut<[1, 2, null, 3], null>; // [1, 2, 3]

type FilterOut<T extends any[], U> = T extends [infer L, ...infer R]
  ? [...(L extends U ? [] : [L]), ...FilterOut<R, U>]
  : T;

// -----------------------------------------------------------------------------------

// 实现 Format < t extends string > generic。

type FormatCase1 = Format<"%sabc">; // FormatCase1 : string => string
type FormatCase2 = Format<"%s%dabc">; // FormatCase2 : string => number => string
type FormatCase3 = Format<"sdabc">; // FormatCase3 :  string
type FormatCase4 = Format<"sd%abc">; // FormatCase4 :  string

type FormatMap = {
  s: string;
  d: number;
};

type Format<T extends string> = T extends `${string}%${infer L}${infer R}`
  ? L extends keyof FormatMap
    ? (x: FormatMap[L]) => Format<R>
    : Format<R>
  : string;

// -----------------------------------------------------------------------------------

// TypeScript 具有结构类型系统，但有时您希望函数只接受一些以前定义良好的唯一对象(如在名义类型系统中) ，而不接受任何具有必需字段的对象。

// 创建一个类型，该类型接受一个对象，并使其及其中所有深度嵌套的对象都是惟一的，同时保留所有对象的字符串和数字键，以及这些键上所有属性的值。

// 原始类型和生成的唯一类型必须是相互可分配的，但不能完全相同。

type Foo = { foo: 2; bar: { 0: 1 }; baz: { 0: 1 } };

type UniqFoo = DeepObjectToUniq<Foo>;

declare let foo: Foo;
declare let uniqFoo: UniqFoo;

uniqFoo = foo; // ok
foo = uniqFoo; // ok

type T0 = Equal<UniqFoo, Foo>; // false
type T1 = UniqFoo["foo"]; // 2
type T2 = Equal<UniqFoo["bar"], UniqFoo["baz"]>; // false
type T3 = UniqFoo["bar"][0]; // 1
type T4 = Equal<keyof Foo & string, keyof UniqFoo & string>; // true

type DeepObjectToUniq<T extends { [k in string | number]: any }> = {
  [K in keyof T]: T[K] extends { [k in string | number]: any }
    ? DeepObjectToUniq<T[K]> & { _uniq?: [T, K] }
    : T[K];
};

// -----------------------------------------------------------------------------------

// 实现一个类型 LengthOfString < s > ，它计算模板字符串的长度(如298-Length of String) :

type T5 = LengthOfString<"foo">; // 3
type T6 =
  LengthOfString<"类型必须支持长达几百个字符的字符串(通常对字符串长度的递归计算受到 TS 递归函数调用深度的限制，也就是说，它支持长达45个字符的字符串)。">; // 70

// -----------------------------------------------------------------------------------

// 类型必须支持长达几百个字符的字符串(通常对字符串长度的递归计算受到 TS 递归函数调用深度的限制，也就是说，它支持长达45个字符的字符串)。

type LengthOfString<
  S extends string,
  R extends number[] = []
> = S extends `${infer R1}${infer R2}${infer R3}${infer R4}${infer R5}${infer R6}${infer R7}${infer R8}${infer R9}${infer R10}${infer Rest}`
  ? LengthOfString<Rest, [...R, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]>
  : S extends `${infer _}${infer Rest}`
  ? LengthOfString<Rest, [...R, 1]>
  : [...R]["length"];

// 创建一个类型安全的字符串连接工具，可以这样使用:

const hyphenJoiner = join("-");
const result = hyphenJoiner("a", "b", "c"); // = 'a-b-c'

// 或者:

// 当我们传递一个空的分隔符(即“”)来连接时，我们应该让字符串保持原样，即:

const result2 = join("")("a", "b", "c"); // = 'abc'

// 当只传递一个项时，我们应该返回原始项(不添加任何分隔符) :

const result3 = join("-")("a"); // = 'a'

declare function join<S extends string>(
  delimiter: S
): <T extends string[]>(...parts: T) => Join<T, S>;

// -----------------------------------------------------------------------------------

// 实现一个类型 DeepPick，它扩展了实用程序类型 Pick。

type obj = {
  name: "hoge";
  age: 20;
  friend: {
    name: "fuga";
    age: 30;
    family: {
      name: "baz";
      age: 1;
    };
  };
};

type T7 = DeepPick<obj, "name">; // { name : 'hoge' }
type T8 = DeepPick<obj, "name" | "friend.name">; // { name : 'hoge' } & { friend: { name: 'fuga' }}
type T9 = DeepPick<obj, "name" | "friend.name" | "friend.family.name">; // { name : 'hoge' } &  { friend: { name: 'fuga' }} & { friend: { family: { name: 'baz' }}}

type UnionToFunc<T> = T extends any ? (x: T) => 0 : never;

type d = UnionToIntersect<T8>;

type UnionToIntersect<T> = UnionToFunc<T> extends (x: infer I) => 0 ? I : never;

type DeepPick<
  T extends Record<string, any>,
  U extends string
> = UnionToIntersect<
  U extends keyof T
    ? { [K in U]: T[K] }
    : U extends `${infer L}.${infer R}`
    ? L extends keyof T
      ? { [K in L]: DeepPick<T[K], R> }
      : never
    : never
>;

// -----------------------------------------------------------------------------------

// 实现 Camelize，它将对象从 snake _ case 转换为 camelCase

type R = Camelize<{
  some_prop: string;
  prop: { another_prop: string };
  array: [{ snake_case: string }];
}>;

// expected to be
// {
//   someProp: string,
//   prop: { anotherProp: string },
//   array: [{ snakeCase: string }]
// }

type Camelize<T extends object> = {
  [K in keyof T as CamelCaseHard<K & string>]: T[K] extends object
    ? Camelize<T[K]>
    : T[K];
};

// -----------------------------------------------------------------------------------

// 从字符串中删除指定的字符。

type Butterfly = DropString<"foobar!", "fb">; // 'ooar!'

type String2Union<S extends string> = S extends `${infer L}${infer R}`
  ? L | String2Union<R>
  : S;

type DropString<
  S extends string,
  U extends string
> = S extends `${infer L}${infer R}`
  ? L extends String2Union<U>
    ? DropString<`${R}`, U>
    : `${L}${DropString<`${R}`, U>}`
  : S;

// -----------------------------------------------------------------------------------

// 众所周知的 split ()方法通过查找分隔符将字符串分解为一个子字符串数组，并返回新的数组。这个挑战的目标是在类型系统中使用分隔符来分割字符串！

type result = Split<"Hi! How are you?", " ">; // should be ['Hi!', 'How', 'are', 'you?']

// 实现通用的 ClassPublicKeys < t > ，它返回一个类的所有公钥。
class A1 {
  public str!: string;
  protected num!: number;
  private bool!: boolean;
  getNum() {
    return Math.random();
  }
}

type publicKeys = ClassPublicKeys<A1>; // 'str' | 'getNum'

type ClassPublicKeys<T extends object> = {
  [K in keyof T]: K;
}[keyof T];

// -----------------------------------------------------------------------------------

// 实现一个通用的 IsRequiredKey < t，k > ，返回 k 是否是 t 的必需键。

type A2 = IsRequiredKey<{ a: number; b?: string }, "a">; // true
type B = IsRequiredKey<{ a: number; b?: string }, "b">; // false
type C = IsRequiredKey<{ a: number; b?: string }, "b" | "a">; // false

type IsRequiredKey<
  T extends object,
  U extends string
> = UnionToTuple<U> extends [infer L, ...infer R]
  ? undefined extends T[L & keyof T]
    ? false
    : IsRequiredKey<T, R[number] & string>
  : true;

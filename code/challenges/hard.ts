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

type CamelCaseHard<S extends string> = S extends `${infer L}_${infer R}`
  ? `${Capitalize<Lowercase<L>>}${CamelCaseHard<R>}`
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

# 第四天 深入

## 泛型的世界

1. ### 使用泛型类型变量
  - 当您开始使用泛型时，您将注意到，当您创建诸如 identity 之类的泛型函数时，编译器将强制您在函数体中正确使用任何泛型类型的参数。也就是说，您实际上将这些参数视为它们可以是任意和所有类型。
    ```
    function identity<Type>(arg: Type): Type {
      return arg;
    }
    ```

  - 如果我们还想在每次调用时将参数 arg 的长度记录到控制台，该怎么办？我们可能会写下这样的话:

    ```
    function loggingIdentity<Type>(arg: Type): Type {
      console.log(arg.length);
    Property 'length' does not exist on type 'Type'.
      return arg;
    }
    ```
  - 假设我们实际上希望这个函数处理 Type 数组，而不是直接处理 Type。因为我们使用数组，所以。长度成员应该可用。我们可以像创建其他类型的数组一样来描述它:

    ```
    function loggingIdentity<Type>(arg: Type[]): Type[] {
      console.log(arg.length);
      return arg;
    }
    ```
2. ### 通用类型
  - 泛型函数的类型与非泛型函数类似，类型参数列在前面，类似于函数声明:

    ```
    function identity<Type>(arg: Type): Type {
      return arg;
    }
    
    let myIdentity: <Type>(arg: Type) => Type = identity;

    function identity<Type>(arg: Type): Type {
      return arg;
    }
    
    let myIdentity: <Input>(arg: Input) => Input = identity;

    function identity<Type>(arg: Type): Type {
      return arg;
    }
    
    let myIdentity: { <Type>(arg: Type): Type } = identity;
    ```
  - 请注意，我们的示例已经变得稍有不同。与描述泛型函数不同，我们现在有了一个非泛型函数签名，它是泛型类型的一部分。当我们使用 GenericIdentityFn 时，我们现在还需要指定相应的类型参数(这里: number) ，有效地锁定底层调用签名将使用的内容。理解何时将类型参数直接放在调用签名上，何时将其放在接口本身上，将有助于描述类型的哪些方面是泛型的
2. ### 通用类
  - 泛型类具有与泛型接口类似的形状。泛型类的名称后面的尖括号(< >)中有一个泛型类型参数列表。

    ```
    class GenericNumber<NumType> {
      zeroValue: NumType;
      add: (x: NumType, y: NumType) => NumType;
    }
    
    let myGenericNumber = new GenericNumber<number>();
    myGenericNumber.zeroValue = 0;
    myGenericNumber.add = function (x, y) {
      return x + y;
    };
    ```
  - 这是对 GenericNumber 类的字面使用，但是您可能已经注意到没有任何东西限制它只使用数字类型。我们可以用字符串或者更复杂的对象来代替。

    ```
    let stringNumeric = new GenericNumber<string>();
    stringNumeric.zeroValue = "";
    stringNumeric.add = function (x, y) {
      return x + y;
    };
    
    console.log(stringNumeric.add(stringNumeric.zeroValue, "test"));
    ```

3. ### 通用约束
  - 我们将创建一个描述约束的接口。在这里，我们将创建一个接口，它有一个单一的。属性，然后我们使用这个接口和 extends 关键字来表示我们的约束:

    ```
    interface Lengthwise {
      length: number;
    }
    
    function loggingIdentity<Type extends Lengthwise>(arg: Type): Type {
      console.log(arg.length); 
      // Now we know it has a .length property, so no more error
      return arg;
    }
    ```
  - 因为泛型函数现在受到约束，它将不再适用于任何和所有类型:

    ```
    loggingIdentity(3);
    // Argument of type 'number' is not assignable to parameter of type 'Lengthwise'.
    ```
  - 相反，我们需要传入具有所有必需属性的类型:

    ```
    loggingIdentity({ length: 10, value: 3 });
    ```
4. ### 在泛型约束中使用类型参数
  - 可以声明受其他类型参数约束的类型参数。例如，这里我们希望从给定名称的对象获取一个属性。我们希望确保我们不会意外地抓取 obj 上不存在的属性，因此我们将在两种类型之间设置一个约束:

    ```
    function getProperty<Type, Key extends keyof Type>(obj: Type, key: Key) {
      return obj[key];
    }
    
    let x = { a: 1, b: 2, c: 3, d: 4 };
    
    getProperty(x, "a");
    getProperty(x, "m");
    // Argument of type '"m"' is not assignable to parameter of type '"a" | "b" | "c" | "d"'.
    ```
5. ### 在泛型中使用类类型
  - 当使用泛型在 TypeScript 中创建工厂时，必须通过类的构造函数引用类类型。比如说,

    ```
    function create<Type>(c: { new (): Type }): Type {
      return new c();
    }
    ```
  - 一个更高级的示例使用 prototype 属性来推断和约束构造函数和类类型的实例端之间的关系。

    ```
    class BeeKeeper {
      hasMask: boolean = true;
    }
    
    class ZooKeeper {
      nametag: string = "Mikle";
    }
    
    class Animal {
      numLegs: number = 4;
    }
    
    class Bee extends Animal {
      keeper: BeeKeeper = new BeeKeeper();
    }
    
    class Lion extends Animal {
      keeper: ZooKeeper = new ZooKeeper();
    }
    
    function createInstance<A extends Animal>(c: new () => A): A {
      return new c();
    }
    
    createInstance(Lion).keeper.nametag;
    createInstance(Bee).keeper.hasMask;
    ```
## 类型操作符 `keyof`

  - Keyof 操作符接受对象类型，并生成其键的字符串或数值文字联合。下列类型 p 与“ x”| “ y”类型相同:

    ```
    type Point = { x: number; y: number };
    type P = keyof Point;
    ```
  - 如果类型有字符串或数字索引签名，keyof 将返回这些类型:

    ```
    type Arrayish = { [n: number]: unknown };
    type A = keyof Arrayish;
    
    type Mapish = { [k: string]: boolean };
    type M = keyof Mapish;
    ```

## 类型操作符 `typeof`

  - 可以使用 typeof 方便地表示许多模式。例如，让我们首先查看预定义的类型 ReturnType < t > 。它接受一个函数类型并生成它的返回类型:

    ```
    type Predicate = (x: unknown) => boolean;
    type K = ReturnType<Predicate>;
    ```

  - 记住，值和类型不是一回事。为了引用值 f 的类型，我们使用 typeof:

    ```
    function f() {
      return { x: 10, y: 3 };
    }
    type P = ReturnType<typeof f>;
    ```

## 索引访问类型

  - 使用任意类型进行索引的另一个示例是使用 number 来获取数组元素的类型。我们可以把它和 typeof 结合起来，方便地捕获数组文字的元素类型:

    ```
    const MyArray = [
      { name: "Alice", age: 15 },
      { name: "Bob", age: 23 },
      { name: "Eve", age: 38 },
    ];
    
    type Person = typeof MyArray[number];
          
    type Person = {
        name: string;
        age: number;
    }
    type Age = typeof MyArray[number]["age"];
        
    type Age = number
    // Or
    type Age2 = Person["age"];
    ```

## 条件类型

  - 我们也可以写一个叫 Flatten 的类型，它把数组类型平坦化为元素类型，但是不使用其他类型:
    ```
    type Flatten<T> = T extends any[] ? T[number] : T;
    
    // Extracts out the element type.
    type Str = Flatten<string[]>;
        
    type Str = string
    
    // Leaves the type alone.
    type Num = Flatten<number>;
    ```
  - 可以用方括号将 extends 关键字的每一边包围起来。

    ```
    type ToArrayNonDist<Type> = [Type] extends [any] ? Type[] : never;
    
    // 'StrArrOrNumArr' is no longer a union.
    type StrArrOrNumArr = ToArrayNonDist<string | number>;
    ```
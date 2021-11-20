# 映射类型

- 映射类型建立在索引签名的语法之上，索引签名用于声明未提前声明的属性类型:

  ```
  type OnlyBoolsAndHorses = {
    [key: string]: boolean | Horse;
  };
  
  const conforms: OnlyBoolsAndHorses = {
    del: true,
    rodney: false,
  };
  ```

- 映射类型是一种泛型类型，它使用 PropertyKeys (通常通过 keyof 创建)的联合来迭代键以创建类型:

  ```
  type OptionsFlags<Type> = {
    [Property in keyof Type]: boolean;
  };
  ```

- OptionsFlags 将获取 Type 类型中的所有属性，并将其值更改为布尔值。

  ```
  type FeatureFlags = {
    darkMode: () => void;
    newUserProfile: () => void;
  };
  
  type FeatureOptions = OptionsFlags<FeatureFlags>;
  ```

## 映射修饰符

- 您可以通过使用-或 + 作为前缀来删除或添加这些修饰符。如果您没有添加前缀，则假定为 + 。

  ```
  // Removes 'readonly' attributes from a type's properties
  type CreateMutable<Type> = {
    -readonly [Property in keyof Type]: Type[Property];
  };
  
  type LockedAccount = {
    readonly id: string;
    readonly name: string;
  };
  
  type UnlockedAccount = CreateMutable<LockedAccount>;

  // Removes 'optional' attributes from a type's properties
  type Concrete<Type> = {
    [Property in keyof Type]-?: Type[Property];
  };
  
  type MaybeUser = {
    id: string;
    name?: string;
    age?: number;
  };
  
  type User = Concrete<MaybeUser>;
  ```

## 通过 `as` 密钥重新映射

- 你可以利用一些特性，比如模板文字类型，从以前的属性中创建新的属性名:

  ```
  type Getters<Type> = {
      [Property in keyof Type as `get${Capitalize<string & Property>}`]: () => Type[Property]
  };
  
  interface Person {
      name: string;
      age: number;
      location: string;
  }
  
  type LazyPerson = Getters<Person>;
  ```

- 你可以通过一个条件类型生成 never 来过滤掉键:

  ```
  // Remove the 'kind' property
  type RemoveKindField<Type> = {
      [Property in keyof Type as Exclude<Property, "kind">]: Type[Property]
  };
  
  interface Circle {
      kind: "circle";
      radius: number;
  }
  
  type KindlessCircle = RemoveKindField<Circle>;
  ```

- 你可以映射任意的联合，不仅仅是字符串 | 数字 | 符号的联合，而是任意类型的联合:

  ```
  type EventConfig<Events extends { kind: string }> = {
      [E in Events as E["kind"]]: (event: E) => void;
  }
  
  type SquareEvent = { kind: "square", x: number, y: number };
  type CircleEvent = { kind: "circle", radius: number };
  
  type Config = EventConfig<SquareEvent | CircleEvent>
  ```

- 在这个类型操作部分，映射类型可以很好地与其他特性一起工作，例如，这里是一个使用条件类型的映射类型，根据对象的属性 pii 是否设置为文字 true，返回 true 或 false:

  ```
  type ExtractPII<Type> = {
    [Property in keyof Type]: Type[Property] extends { pii: true } ? true : false;
  };
  
  type DBFields = {
    id: { format: "incrementing" };
    name: { type: string; pii: true };
  };
  
  type ObjectsNeedingGDPRDeletion = ExtractPII<DBFields>;
  ```

# 模板文字类型

- 当在插值位置使用联合时，类型是每个联合成员可以表示的每个可能的字符串文字的集合:

  ```
  type EmailLocaleIDs = "welcome_email" | "email_heading";
  type FooterLocaleIDs = "footer_title" | "footer_sendoff";
  
  type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
  ```

- 对于模板文字中的每个插值位置，联合是十字乘:

  ```
  type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
  type Lang = "en" | "ja" | "pt";
  
  type LocaleMessageIDs = `${Lang}_${AllLocaleIDs}`;
  ```

## 类型字符串联合

- 在监听事件“ firstNameChanged”时，不仅仅是“ firstName”，模板文本提供了一种在类型系统中处理这种类型的字符串操作的方法:

  ```
  type PropEventSource<Type> = {
      on(eventName: `${string & keyof Type}Changed`, callback: (newValue: any) => void): void;
  };
  
  /// Create a "watched object" with an 'on' method
  /// so that you can watch for changes to properties.
  declare function makeWatchedObject<Type>(obj: Type): Type & PropEventSource<Type>;
  ```

- 有了这个，我们就可以构建一些在给出错误属性时会出错的东西:

  ```
  const person = makeWatchedObject({
    firstName: "Saoirse",
    lastName: "Ronan",
    age: 26
  });
  
  person.on("firstNameChanged", () => {});
  
  // Prevent easy human error (using the key instead of the event name)
  person.on("firstName", () => {});
  // Argument of type '"firstName"' is not assignable to parameter of type '"firstNameChanged" | "lastNameChanged" | "ageChanged"'.
  
  // It's typo-resistant
  person.on("frstNameChanged", () => {});
  // Argument of type '"frstNameChanged"' is not assignable to parameter of type '"firstNameChanged" | "lastNameChanged" | "ageChanged"'.
  ```

## 使用模板文字进行推理

- 我们可以使我们的最后一个示例成为泛型，从 eventName 字符串的各个部分推断出关联的属性。

  ```
  type PropEventSource<Type> = {
      on<Key extends string & keyof Type>
          (eventName: `${Key}Changed`, callback: (newValue: Type[Key]) => void ): void;
  };
  
  declare function makeWatchedObject<Type>(obj: Type): Type & PropEventSource<Type>;
  
  const person = makeWatchedObject({
    firstName: "Saoirse",
    lastName: "Ronan",
    age: 26
  });
  
  person.on("firstNameChanged", newName => {
      console.log(`new name is ${newName.toUpperCase()}`);
  });
  
  person.on("ageChanged", newAge => {
      if (newAge < 0) {
          console.warn("warning! negative age");
      }
  })
  ```

## 内部字符串操作类型

- 将字符串中的每个字符转换为大写版本。

  ```
  type Greeting = "Hello, world"
  type ShoutyGreeting = Uppercase<Greeting>
            
  type ShoutyGreeting = "HELLO, WORLD"
  
  type ASCIICacheKey<Str extends string> = `ID-${Uppercase<Str>}`
  type MainID = ASCIICacheKey<"my_app">

  // Lowercase<StringType>
  // Capitalize<StringType>
  // Uncapitalize<StringType>
  ```




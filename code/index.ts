// function greet(person: string, date: Date) {
//   console.log(`Hello ${person}, today is ${date.toDateString()}!`);
// }

// greet("haha", new Date());

// // 类型注释
// let myName: string = "ypy";
// let myAge: number = 21;
// let isMan: boolean = true;

// // 数组
// let languages: string[] = ["javascript", "html", "css", "python"];
// // or let languages: Array<string> = ['javascript', 'html', 'css', 'python']

// // 对象类型
// // The parameter's type annotation is an object type
// function printCoord(pt: { x: number; y: number }) {
//   console.log("The coordinate's x value is " + pt.x);
//   console.log("The coordinate's y value is " + pt.y);
// }
// printCoord({ x: 3, y: 7 });

// // 自动判断类型
// const names = ["Alice", "Bob", "Eve"];

// names.forEach(function (s) {
//   console.log(s.toUppercase());
//   // Property 'toUppercase' does not exist on type 'string'. Did you mean 'toUpperCase'?
// });

// names.forEach((s) => {
//   console.log(s.toUppercase());
//   // Property 'toUppercase' does not exist on type 'string'. Did you mean 'toUpperCase'?
// });

// // interface和type

// interface window1 {
//   title: string;
// }

// interface window1 {
//   ts: TypeScriptAPI;
// }

// const src = 'const a = "Hello World"';
// window.ts.transpileModule(src, {});

// type window2 = {
//   title: string;
// };

// type window2 = {
//   ts: TypeScriptAPI;
// };

// type SomeConstructor = {
//   new (s: string): SomeObject;
// };

// class SomeObject {
//   constructor(s: string) {}
// }

// function fn(ctor: SomeConstructor) {
//   return new ctor("hello");
// }

// fn(SomeObject);

// function firstElement<Type>(arr: Type[]): Type | undefined {
//   return arr[0];
// }

// firstElement([1, 2, '3']);

// type voidFunc = () => void;

// const f1: voidFunc = () => {
//   return true;
// };

// const f2: voidFunc = () => true;

// const f3: voidFunc = function () {
//   return true;
// };

// const v1 = f1();

// const v2 = f2();

// const v3 = f3();

// function f2(): void {
//   // @ts-expect-error
//   return true;
// }

// const f3 = function (): void {
//   // @ts-expect-error
//   return true;
// };

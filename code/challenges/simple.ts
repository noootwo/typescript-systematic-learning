// 实现 TS 内置的 Pick<T, K>，但不可以使用它。

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

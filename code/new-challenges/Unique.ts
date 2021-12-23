// Implement the type version of Lodash.uniq, Unique<T> takes an Array T, returns the Array T without repeated values.

type Unique<T, U extends any[] = []> = T extends [infer L, ...infer R]
  ? Unique<R, [...U, ...(L extends U[number] ? [] : [L])]>
  : U;

type Res = Unique<[1, 1, 2, 2, 3, 3]>; // expected to be [1, 2, 3]
type Res1 = Unique<[1, 2, 3, 4, 4, 5, 6, 7]>; // expected to be [1, 2, 3, 4, 5, 6, 7]
type Res2 = Unique<[1, "a", 2, "b", 2, "a"]>; // expected to be [1, "a", 2, "b"]

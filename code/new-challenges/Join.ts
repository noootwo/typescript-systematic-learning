// Implement the type version of Array.join, Join<T, U> takes an Array T, string U and returns the Array T with U stitching up.

type toString<T extends string | number> = `${T}`;

type Join<T extends string[], U extends string | number> = T extends [
  infer F,
  ...infer R
]
  ? R extends string[]
    ? `${F extends string ? F : ""}${U}${R["length"] extends 1
        ? R[0]
        : Join<R, U>}`
    : never
  : "";

type Res = Join<["a", "p", "p", "l", "e"], "-">; // expected to be 'a-p-p-l-e'
type Res1 = Join<["Hello", "World"], " ">; // expected to be 'Hello World'
type Res2 = Join<["2", "2", "2"], 1>; // expected to be '21212'

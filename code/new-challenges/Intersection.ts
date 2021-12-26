// Implement the type version of Lodash.intersection, but there is a little different,
// Intersection<T> takes an Array T containing several arrays or any type element that includes the union type,
// returns a new array containing all incoming array intersection elements.

type Intersection<T extends Array<any | any[]>> = T extends [
  infer L,
  ...infer R
]
  ? (L extends any[] ? L[number] : L) &
      (R extends Array<any | any[]> ? Intersection<R> : R)
  : unknown;

type Res = Intersection<[[1, 2], [2, 3], [2, 2]]>; // expected to be 2
type Res1 = Intersection<[[1, 2, 3], [2, 3, 4], [2, 2, 3]]>; // expected to be 2 | 3
type Res2 = Intersection<[[1, 2], [3, 4], [5, 6]]>; // expected to be never
type Res3 = Intersection<[[1, 2, 3], [2, 3, 4], 3]>; // expected to be 3
type Res4 = Intersection<[[1, 2, 3], 2 | 3 | 4, 2 | 3]>; // expected to be 2 | 3
type Res5 = Intersection<[[1, 2, 3], 2, 3]>; // expected to be never

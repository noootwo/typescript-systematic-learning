// Implement the type version of Lodash.uniqBy, UniqueBy<T> takes an Array T, returns the Array T without repeated values.

type UniqueBy<T, U extends any = null, A extends any[] = []> = T extends [infer F, ...infer R] ? (U extends null ? F : U<F>) extends A[number];

type Res = UniqueBy<[1,1,2,2,3,3]> // expected to be [1, 2, 3]

// TODO:
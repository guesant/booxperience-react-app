export type OptionalRecursive<T> = {
  [P in keyof T]?: T[P] | OptionalRecursive<T[P]>;
};

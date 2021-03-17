export const hasOwnProperty = <T extends {}, K extends PropertyKey>(
  obj: T,
  prop: K
): obj is T & Record<K, unknown> => obj.hasOwnProperty(prop);

export const isOwnPropertyOf = <T extends {}>(
  prop: PropertyKey,
  obj: T
): prop is keyof T => obj.hasOwnProperty(prop);

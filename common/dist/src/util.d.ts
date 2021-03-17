export declare const hasOwnProperty: <T extends {}, K extends string | number | symbol>(obj: T, prop: K) => obj is T & Record<K, unknown>;
export declare const isOwnPropertyOf: <T extends {}>(prop: PropertyKey, obj: T) => prop is keyof T;

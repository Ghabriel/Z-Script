export type Output<T> = T | Promise<T>;

export type Async<T> = {
    [K in keyof T]:
        T[K] extends (...args: infer Args) => Output<infer U>
            ? (...args: Args) => Promise<U>
            : never;
};

export type Sync<T> = {
    [K in keyof T]:
        T[K] extends (...args: infer Args) => Output<infer U>
            ? (...args: Args) => U
            : never;
};

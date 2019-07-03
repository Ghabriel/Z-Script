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

export function discardValue<T>(value: Output<T>): Output<void> {
    if (value instanceof Promise) {
        return value.then(() => {});
    }
}

// export function sequence<R1, R2>(
//     f1: () => Output<R1>,
//     f2: (value: R1) => Output<R2>
// ): Output<R2> {

// }

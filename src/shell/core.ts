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

export function consolidate<R, V1>(
    values: [Output<V1>],
    fn: (v1: V1) => R
): Output<R>;

export function consolidate<R, V1, V2>(
    values: [Output<V1>, Output<V2>],
    fn: (v1: V1, v2: V2) => R
): Output<R>;

export function consolidate<R>(
    values: any[],
    fn: (...args: any[]) => R
): Output<R> {
    if (values[0] instanceof Promise) {
        return new Promise(async (resolve, reject) => {
            const awaitedValues = await Promise.all(values);
            resolve(fn(...awaitedValues));
        });
    }

    return fn(...values);
}

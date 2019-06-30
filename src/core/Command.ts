export interface Command {
    name: string;
    execute: ExecutionFunction;
}

export interface ExecutionFunction {
    (args: string[]): void;
}

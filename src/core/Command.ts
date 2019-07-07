import { ExecutionContext } from './ExecutionContext';

export interface Command {
    name: string;
    execute: ExecutionFunction;
}

export interface ExecutionFunction {
    (args: string[], context: ExecutionContext): void;
}

import { run as externalRun } from './run';

export interface Command {
    name: string;
    execute: ExecutionFunction;
}

export interface ExecutionFunction {
    (args: string[]): void;
}

const commandList: Command[] = [];

export function addCommand(name: string, execute: ExecutionFunction): void {
    commandList.push({ name, execute });
}

export function runCommand(name: string, args: string[] = []): void {
    const command = commandList.find(c => c.name === name);

    if (command === undefined) {
        throw Error(`Unknown command "${name}"`);
    }

    command.execute(args);
}

export function run(): void {
    externalRun(commandList);
}

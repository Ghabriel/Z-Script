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

export function run(): void {
    const args = process.argv;

    commandList.forEach(c => c.execute(args));
}

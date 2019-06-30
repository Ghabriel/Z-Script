import { Command, ExecutionFunction } from './Command';
import { run as externalRun, runCommand as externalRunCommand } from './run';

const commandList: Command[] = [];

export function addCommand(name: string, execute: ExecutionFunction): void {
    commandList.push({ name, execute });
}

export function runCommand(name: string, args: string[] = []): void {
    externalRunCommand(commandList, name, args);
}

export function run(): void {
    externalRun(commandList);
}

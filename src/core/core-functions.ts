import { Command, ExecutionFunction } from './Command';
import { run as externalRun, runCommand as externalRunCommand } from './run';

const commandList: Command[] = [];

/**
 * Adds a command to the script. The given function will receive all arguments
 * passed after it.
 */
export function addCommand(name: string, execute: ExecutionFunction): void {
    commandList.push({ name, execute });
}

/**
 * Runs a registered command with a given list of arguments.
 */
export function runCommand(name: string, args: string[] = []): void {
    externalRunCommand(commandList, name, args);
}

/**
 * Runs the registered command that matches the input arguments ("all" if no
 * command was provided). This function should be called at the end of every
 * Z-Script.
 */
export function run(): void {
    externalRun(commandList);
}

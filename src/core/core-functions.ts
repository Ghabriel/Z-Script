import { ExecutionFunction } from './Command';
import { ExecutionContext } from "./ExecutionContext";
import { parseCommandLineArgs } from './parseCommandLineArgs';

const topLevelContext = new ExecutionContext();

/**
 * Adds a command to the script. The given function will receive all arguments
 * passed after it.
 */
export function addCommand(name: string, execute: ExecutionFunction): void {
    topLevelContext.addCommand(name, execute);
}

/**
 * Runs a registered command with a given list of arguments.
 */
export function runCommand(name: string, args: string[] = []): void {
    topLevelContext.runCommand(name, args);
}

/**
 * Runs the registered command that matches the input arguments ("all" if no
 * command was provided). This function should be called at the end of every
 * Z-Script.
 */
export function run(): void {
    const { commandName, args } = parseCommandLineArgs();
    topLevelContext.runCommand(commandName, args);
}

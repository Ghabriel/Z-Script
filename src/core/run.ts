import { ParseError } from '../flags';
import { Command } from './Command';
import { NoSuchRuleError } from './NoSuchRuleError';

interface CommandLineArgs {
    nodePath: string;
    selfPath: string;
    commandName: string;
    args: string[];
}

export function run(commandList: Command[]): void {
    const { commandName, args } = parseCommandLineArgs();
    runCommand(commandList, commandName, args);
}

function parseCommandLineArgs(): CommandLineArgs {
    const [ nodePath, selfPath, commandName, ...args ] = process.argv;

    return {
        nodePath,
        selfPath,
        commandName: commandName || 'all',
        args,
    };
}

export function runCommand(commandList: Command[], name: string, args: string[]): void {
    try {
        internalRunCommand(commandList, name, args);
    } catch (e) {
        if (e instanceof NoSuchRuleError || e instanceof ParseError) {
            console.log(e.message);
            process.exit(1);
        } else {
            throw e;
        }
    }
}

function internalRunCommand(commandList: Command[], name: string, args: string[]): void {
    const command = commandList.find(c => c.name === name);

    if (command === undefined) {
        throw new NoSuchRuleError(`Unknown command "${name}"`);
    }

    command.execute(args);
}

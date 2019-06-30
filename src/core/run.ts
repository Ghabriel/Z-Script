import { ParseError } from '../flags';
import { Command } from './core-functions';

interface CommandLineArgs {
    nodePath: string;
    selfPath: string;
    commandName: string;
    args: string[];
}

export function run(commandList: Command[]): void {
    const { commandName, args } = parseCommandLineArgs();

    for (const command of commandList) {
        if (command.name === commandName) {
            runCommand(command, args);
        }
    }
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

export function runCommand(command: Command, args: string[]): void {
    try {
        command.execute(args);
    } catch (e) {
        if (e instanceof ParseError) {
            console.log(e.message);
        } else {
            throw e;
        }
    }
}

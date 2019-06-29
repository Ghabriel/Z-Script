import { Command } from "./core-functions";

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
            command.execute(args);
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

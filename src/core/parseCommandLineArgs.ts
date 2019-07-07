export interface CommandLineArgs {
    nodePath: string;
    selfPath: string;
    commandName: string;
    args: string[];
}

export function parseCommandLineArgs(): CommandLineArgs {
    const [nodePath, selfPath, commandName, ...args] = process.argv;

    return {
        nodePath,
        selfPath,
        commandName: commandName || 'all',
        args,
    };
}

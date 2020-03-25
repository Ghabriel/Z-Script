import { Command, ExecutionFunction } from './Command';
import { DEFAULT_RULE_NAME } from './constants';
import { NoSuchRuleError } from './NoSuchRuleError';
import { ZScriptError } from './ZScriptError';

/**
 * Represents an isolated context in which commands can be registered and ran.
 */
export class ExecutionContext {
    private commandList: Command[] = [];

    constructor(private args: string[] = []) { }

    /**
     * Adds a command to this context. The given function, when called, will
     * receive all arguments passed after it.
     */
    addCommand(name: string, execute: ExecutionFunction) {
        this.commandList.push({ name, execute });
    }

    /**
     * Runs a registered command with a given list of arguments.
     */
    runCommand(name: string, args: string[] = []) {
        try {
            this.internalRunCommand(name, args);
        } catch (e) {
            this.handleCommandError(e);
        }
    }

    /**
     * Runs the registered command that matches the input arguments ("main" if
     * no command was provided).
     */
    run() {
        const [commandName, ...args] = this.args;
        this.runCommand(commandName || DEFAULT_RULE_NAME, args);
    }

    private internalRunCommand(name: string, args: string[]) {
        const command = this.commandList.find(c => c.name === name);

        if (command === undefined) {
            throw new NoSuchRuleError(name, this.commandList);
        }

        command.execute(args, new ExecutionContext(args));
    }

    private handleCommandError(e: Error) {
        if (e instanceof ZScriptError) {
            e.print();
            process.exit(1);
        } else {
            throw e;
        }
    }
}

import { Command, ExecutionFunction } from './Command';
import { DEFAULT_RULE_NAME } from './constants';
import { NoSuchRuleError } from './NoSuchRuleError';
import { ZScriptError } from './ZScriptError';

/**
 * Represents an isolated context in which commands can be registered and ran.
 */
export class ExecutionContext {
    private commandList: Command[] = [];

    constructor(
        private args: string[] = [],
        private parentContext: ExecutionContext | null = null,
        private parentRule: string | null = null,
    ) { }

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
            if (e instanceof ZScriptError) {
                e.print();
                process.exit(1);
            } else {
                throw e;
            }
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
            let parent = this.parentContext;
            const parentCommands: string[] = [];

            if (this.parentRule !== null) {
                parentCommands.push(this.parentRule);
            }

            while (parent !== null && parent.parentRule !== null) {
                parentCommands.push(parent.parentRule);
                parent = parent.parentContext;
            }

            throw new NoSuchRuleError(name, this.commandList, parentCommands.reverse());
        }

        command.execute(args, new ExecutionContext(args, this, name));
    }
}

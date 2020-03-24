import { ParseError } from '../flags';
import { Color, Format } from '../formatting';
import { CommandExecutionError } from '../shell';
import { Command, ExecutionFunction } from './Command';
import { DEFAULT_RULE_NAME } from './constants';
import { NoSuchRuleError } from './NoSuchRuleError';

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
            throw new NoSuchRuleError(`Unknown command "${name}"`);
        }

        command.execute(args, new ExecutionContext(args));
    }

    private handleCommandError(e: Error) {
        if (e instanceof NoSuchRuleError || e instanceof ParseError) {
            console.log(e.message);
            process.exit(1);
        } else if (e instanceof CommandExecutionError) {
            const STYLE_ERROR = Format.foreground(Color.Red) + Format.bold();
            const STYLE_COMMAND = Format.foreground(Color.Green);
            const command = e.getCommand();

            Format.print('Error: ', STYLE_ERROR);
            process.stdout.write('the following command returned a non-zero status code:\n');
            Format.print(`\t${command}\n`, STYLE_COMMAND);

            if (process.env.ZSCRIPT_STACKTRACE == '1') {
                if (e.stack === undefined) {
                    console.log('Complete error description:\n', e);
                } else {
                    const message = e.stack;
                    const commandPosition = message.indexOf(command);
                    const stackTrace = message.substr(commandPosition + command.length);
                    console.log('Stacktrace:', stackTrace);
                }
            } else {
                console.log(
                    'Run with `ZSCRIPT_STACKTRACE=1` environment variable to display ' +
                    'the full stacktrace.'
                );
            }

            process.exit(2);
        } else {
            throw e;
        }
    }
}

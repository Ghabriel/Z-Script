import { ParseError } from '../flags';
import { Command, ExecutionFunction } from './Command';
import { NoSuchRuleError } from './NoSuchRuleError';

export class ExecutionContext {
    private commandList: Command[] = [];

    constructor(private args: string[] = []) { }

    addCommand(name: string, execute: ExecutionFunction) {
        this.commandList.push({ name, execute });
    }

    runCommand(name: string, args: string[] = []) {
        try {
            this.internalRunCommand(name, args);
        } catch (e) {
            if (e instanceof NoSuchRuleError || e instanceof ParseError) {
                console.log(e.message);
                process.exit(1);
            } else {
                throw e;
            }
        }
    }

    run() {
        const [commandName, ...args] = this.args;
        this.runCommand(commandName || 'all', args);
    }

    private internalRunCommand(name: string, args: string[]) {
        const command = this.commandList.find(c => c.name === name);

        if (command === undefined) {
            throw new NoSuchRuleError(`Unknown command "${name}"`);
        }

        command.execute(args, new ExecutionContext(args));
    }
}

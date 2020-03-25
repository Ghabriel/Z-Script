import { Color, Format } from '../formatting';
import { Command } from './Command';
import { ZScriptError } from './ZScriptError';

export class NoSuchRuleError extends ZScriptError {
    constructor(private command: string, private availableCommands: Command[]) {
        super();
        Error.captureStackTrace(this, this.constructor);
        this.name = 'NoSuchRuleError';
        this.message = `unknown command "${command}"`;
    }

    print() {
        this.printErrorPrefix();
        console.log(
            `unknown command "${this.command}". The following commands are ` +
            'available in this context:'
        );

        const STYLE_COMMAND = Format.foreground(Color.Green);

        for (const command of this.availableCommands) {
            Format.print(`\t${command.name}\n`, STYLE_COMMAND);
        }
    }
}

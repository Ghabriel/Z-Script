import { Color, Format } from '../formatting';
import { Command } from './Command';
import { DEFAULT_RULE_NAME } from './constants';
import { ZScriptError } from './ZScriptError';

export class NoSuchRuleError extends ZScriptError {
    constructor(
        private command: string,
        private availableCommands: Command[],
        private commandChain: string[],
    ) {
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

        const STYLE_COMMAND = Format.foreground(Color.Green) + Format.underline();

        this.availableCommands.sort((a, b) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        });

        for (const command of this.availableCommands) {
            process.stdout.write('\tzsc ');
            this.commandChain.forEach(command => process.stdout.write(command + ' '));
            Format.print(`${command.name}`, STYLE_COMMAND);

            if (command.name === DEFAULT_RULE_NAME) {
                let simplifiedCommand = 'zsc';
                this.commandChain.forEach(command => simplifiedCommand += ' ' + command);
                process.stdout.write(` (or simply ${simplifiedCommand})`);
            }

            process.stdout.write('\n');
        }
    }
}

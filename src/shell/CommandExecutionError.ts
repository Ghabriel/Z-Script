import { ZScriptError } from "../core/ZScriptError";
import { Color, Format } from "../formatting";

export class CommandExecutionError extends ZScriptError {
    constructor(message: string, private command: string) {
        super();
        Error.captureStackTrace(this, this.constructor);
        this.name = 'CommandExecutionError';
        this.message = message;
    }

    print(): void {
        const STYLE_COMMAND = Format.foreground(Color.Green);

        this.printErrorPrefix();
        process.stdout.write('the following command returned a non-zero status code:\n');
        Format.print(`\t${this.command}\n`, STYLE_COMMAND);

        if (process.env.ZSCRIPT_STACKTRACE == '1') {
            if (this.stack === undefined) {
                console.log('Complete error description:\n', this);
            } else {
                const message = this.stack;
                const commandPosition = message.indexOf(this.command);
                const stackTrace = message.substr(commandPosition + this.command.length);
                console.log('Stacktrace:', stackTrace);
            }
        } else {
            console.log(
                'Run with `ZSCRIPT_STACKTRACE=1` environment variable to display ' +
                'the full stacktrace.'
            );
        }
    }
}

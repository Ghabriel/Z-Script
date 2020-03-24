export class CommandExecutionError extends Error {
    constructor(message: string, private command: string) {
        super();
        Error.captureStackTrace(this, this.constructor);
        this.name = 'CommandExecutionError';
        this.message = message;
    }

    getCommand(): string {
        return this.command;
    }
}

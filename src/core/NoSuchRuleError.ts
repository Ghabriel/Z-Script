export class NoSuchRuleError extends Error {
    constructor(message: string) {
        super();
        Error.captureStackTrace(this, this.constructor);
        this.name = 'NoSuchRuleError';
        this.message = message;
    }
}

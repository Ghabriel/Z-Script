export class ParseError extends Error {
    constructor(message: string) {
        super();
        Error.captureStackTrace(this, this.constructor);
        this.name = 'ParseError';
        this.message = message;
    }
}

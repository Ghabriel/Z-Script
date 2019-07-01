import * as fs from 'fs';

/**
 * Checks if a file exists. Note that a file that _exists_ is not necessarily
 * _readable_.
 */
export function fileExists(filename: string): Promise<boolean> {
    return checkFileAccess(filename, fs.constants.F_OK);
}

/**
 * Checks if a file exists and is readable.
 */
export function isFileReadable(filename: string): Promise<boolean> {
    return checkFileAccess(filename, fs.constants.R_OK);
}

/**
 * Checks if a file exists and is writeable.
 */
export function isFileWriteable(filename: string): Promise<boolean> {
    return checkFileAccess(filename, fs.constants.W_OK);
}

/**
 * Checks if a file exists and is executable.
 */
export function isFileExecutable(filename: string): Promise<boolean> {
    return checkFileAccess(filename, fs.constants.X_OK);
}

function checkFileAccess(filename: string, mode: number): Promise<boolean> {
    return new Promise(resolve => {
        fs.access(filename, mode, err => resolve(err === null));
    });
}

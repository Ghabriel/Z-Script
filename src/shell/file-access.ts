import * as fs from 'fs';
import { Async, Output, Sync } from './core';

abstract class BaseFileAccess {
    /**
     * Checks if a file exists. Note that a file that _exists_ is not necessarily
     * _readable_.
     */
    fileExists(filename: string): Output<boolean> {
        return this.checkFileAccess(filename, fs.constants.F_OK);
    }

    /**
     * Checks if a file exists and is readable.
     */
    isFileReadable(filename: string): Output<boolean> {
        return this.checkFileAccess(filename, fs.constants.R_OK);
    }

    /**
     * Checks if a file exists and is writeable.
     */
    isFileWriteable(filename: string): Output<boolean> {
        return this.checkFileAccess(filename, fs.constants.W_OK);
    }

    /**
     * Checks if a file exists and is executable.
     */
    isFileExecutable(filename: string): Output<boolean> {
        return this.checkFileAccess(filename, fs.constants.X_OK);
    }

    protected abstract checkFileAccess(filename: string, mode: number): Output<boolean>;
}

class AsyncFileAccessImpl extends BaseFileAccess {
    checkFileAccess(filename: string, mode: number): Promise<boolean> {
        return new Promise(resolve => {
            fs.access(filename, mode, err => resolve(err === null));
        });
    }
}

class SyncFileAccessImpl extends BaseFileAccess {
    checkFileAccess(filename: string, mode: number): boolean {
        try {
            fs.accessSync(filename, mode);
            return true;
        } catch {
            return false;
        }
    }
};

export const AsyncFileAccess = new AsyncFileAccessImpl() as Async<BaseFileAccess>;
export const SyncFileAccess = new SyncFileAccessImpl() as Sync<BaseFileAccess>;

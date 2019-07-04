import * as fs from 'fs';
import { Async, Output, Sync } from './core';
import { executeAsync, executeSync } from './execute';

abstract class BaseFileOperations {
    /**
     * Creates a folder at the given path with the given permissions (777 if not
     * specified). Note that this is recursive, i.e parent folders are created if
     * needed. If the target path already exists, rejection only happens if it's
     * not a folder.
     */
    abstract createFolder(path: string, mode?: string): Output<void>;

    /**
     * Copies a file, overwriting `newPath` if it already exists.
     */
    abstract copyFile(oldPath: string, newPath: string): Output<void>;

    /**
     * Copies a folder, overwriting `newPath` if it already exists.
     */
    abstract copyFolder(oldPath: string, newPath: string): Output<void>;

    /**
     * Renames a file or folder. Rejects if the operation fails. Note that if
     * `newPath` already exists and is a non-empty folder, the operation fails.
     */
    abstract rename(oldPath: string, newPath: string): Output<void>;

    /**
     * Deletes a file. Rejects if the operation fails.
     */
    abstract deleteFile(filename: string): Output<void>;

    /**
     * Deletes an empty folder. Rejects if the operation fails.
     */
    abstract deleteFolder(path: string): Output<void>;

    protected buildMkdirOptions(mode: string = '777'): fs.MakeDirectoryOptions {
        return {
            mode: parseInt(mode, 8),
            recursive: true,
        };
    }
}

class AsyncFileOperationsImpl extends BaseFileOperations {
    createFolder(path: string, mode?: string): Promise<void> {
        const options = this.buildMkdirOptions(mode);

        return new Promise((resolve, reject) => {
            fs.mkdir(path, options, err => this.resolveIfNoErrors(err, resolve, reject));
        });
    }

    copyFile(oldPath: string, newPath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.copyFile(oldPath, newPath, err => this.resolveIfNoErrors(err, resolve, reject));
        });
    }

    async copyFolder(oldPath: string, newPath: string): Promise<void> {
        await executeAsync(`mv ${oldPath} ${newPath}`);
    }

    rename(oldPath: string, newPath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.rename(oldPath, newPath, err => this.resolveIfNoErrors(err, resolve, reject));
        });
    }

    deleteFile(filename: string): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.unlink(filename, err => this.resolveIfNoErrors(err, resolve, reject));
        });
    }

    deleteFolder(path: string): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.rmdir(path, err => this.resolveIfNoErrors(err, resolve, reject));
        });
    }

    private resolveIfNoErrors(
        err: NodeJS.ErrnoException | null,
        resolve: () => void,
        reject: (err: NodeJS.ErrnoException) => void
    ): void {
        if (err) {
            return reject(err);
        }

        resolve();
    }
}

class SyncFileOperationsImpl extends BaseFileOperations {
    createFolder(path: string, mode?: string): void {
        const options = this.buildMkdirOptions(mode);
        fs.mkdirSync(path, options);
    }

    copyFile(oldPath: string, newPath: string): void {
        fs.copyFileSync(oldPath, newPath);
    }

    copyFolder(oldPath: string, newPath: string): void {
        executeSync(`mv ${oldPath} ${newPath}`);
    }

    rename(oldPath: string, newPath: string): void {
        fs.renameSync(oldPath, newPath);
    }

    deleteFile(filename: string): void {
        fs.unlinkSync(filename);
    }

    deleteFolder(path: string): void {
        fs.rmdirSync(path);
    }
}

export const AsyncFileOperations = new AsyncFileOperationsImpl() as Async<BaseFileOperations>;
export const SyncFileOperations = new SyncFileOperationsImpl() as Sync<BaseFileOperations>;

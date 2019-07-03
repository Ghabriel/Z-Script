import * as fs from 'fs';
import { Async, discardValue, Output, Sync } from './core';
import { execute } from './execute';

type FS = typeof fs;

type IgnoreLastArg<F> =
    F extends (...args: [infer T, any]) => any ? [T]
    : F extends (...args: [infer T, infer U, any]) => any ? [T, U]
    : never[];

abstract class BaseFileOperations {
    /**
     * Creates a folder at the given path with the given permissions (777 if not
     * specified). Note that this is recursive, i.e parent folders are created if
     * needed. If the target path already exists, rejection only happens if it's
     * not a folder.
     */
    createFolder(path: string, mode: string = '777'): Output<void> {
        return new Promise((resolve, reject) => {
            const options: fs.MakeDirectoryOptions = {
                mode: parseInt(mode, 8),
                recursive: true,
            };

            fs.mkdir(path, options, err => {
                if (err) {
                    return reject(err);
                }

                resolve();
            });
        });
    }

    /**
     * Copies a file, overwriting `newPath` if it already exists.
     */
    copyFile(oldPath: string, newPath: string): Output<void> {
        return this.wrapFs('copyFile', oldPath, newPath);
    }

    /**
     * Copies a folder, overwriting `newPath` if it already exists.
     */
    copyFolder(oldPath: string, newPath: string): Output<void> {
        return discardValue(execute(`mv ${oldPath} ${newPath}`));
    }

    /**
     * Renames a file or folder. Rejects if the operation fails. Note that if
     * `newPath` already exists and is a non-empty folder, the operation fails.
     */
    rename(oldPath: string, newPath: string): Output<void> {
        return this.wrapFs('rename', oldPath, newPath);
    }

    /**
     * Deletes a file. Rejects if the operation fails.
     */
    deleteFile(filename: string): Output<void> {
        return this.wrapFs('unlink', filename);
    }

    /**
     * Deletes an empty folder. Rejects if the operation fails.
     */
    deleteFolder(path: string): Output<void> {
        return this.wrapFs('rmdir', path);
    }

    protected abstract wrapFs<K extends keyof FS>(method: K, ...args: IgnoreLastArg<FS[K]>): Output<void>;
}

class AsyncFileOperationsImpl extends BaseFileOperations {
    wrapFs<K extends keyof FS>(method: K, ...args: IgnoreLastArg<FS[K]>): Promise<void> {
        return new Promise((resolve, reject) => {
            const fn = fs[method] as Function;

            fn(...args, (err: NodeJS.ErrnoException | null) => {
                if (err) {
                    return reject(err);
                }

                resolve();
            });
        });
    }
}

class SyncFileOperationsImpl extends BaseFileOperations {
    wrapFs<K extends keyof FS>(method: K, ...args: IgnoreLastArg<FS[K]>): void {
        method = (method + 'Sync') as K;
        const fn = fs[method] as Function;
        fn(...args);
    }
}

export const AsyncFileOperations = new AsyncFileOperationsImpl() as Async<BaseFileOperations>;
export const SyncFileOperations = new SyncFileOperationsImpl() as Sync<BaseFileOperations>;

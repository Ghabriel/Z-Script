import * as fs from 'fs';
import { execute } from './execute';

/**
 * Checks if the given path corresponds to a folder.
 */
export function isFolder(path: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        fs.stat(path, (err, stats) => {
            if (err) {
                return reject(err);
            }

            resolve(stats.isDirectory());
        });
    });
}

/**
 * Creates a folder at the given path with the given permissions (777 if not
 * specified). Note that this is recursive, i.e parent folders are created if
 * needed. If the target path already exists, rejection only happens if it's
 * not a folder.
 */
export function createFolder(path: string, mode: string = '777'): Promise<void> {
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
export function copyFile(oldPath: string, newPath: string): Promise<void> {
    return promisifyFs('copyFile', oldPath, newPath);
}

/**
 * Copies a folder, overwriting `newPath` if it already exists.
 */
export async function copyFolder(oldPath: string, newPath: string): Promise<void> {
    await execute(`mv ${oldPath} ${newPath}`);
}

/**
 * Renames a file or folder. Rejects if the operation fails. Note that if
 * `newPath` already exists and is a non-empty folder, the operation fails.
 */
export function rename(oldPath: string, newPath: string): Promise<void> {
    return promisifyFs('rename', oldPath, newPath);
}

/**
 * Deletes a file. Rejects if the operation fails.
 */
export function deleteFile(filename: string): Promise<void> {
    return promisifyFs('unlink', filename);
}

/**
 * Deletes an empty folder. Rejects if the operation fails.
 */
export function deleteFolder(path: string): Promise<void> {
    return promisifyFs('rmdir', path);
}

type FS = typeof fs;

type IgnoreLastArg<F> =
    F extends (...args: [infer T, any]) => any ? [T]
    : F extends (...args: [infer T, infer U, any]) => any ? [T, U]
    : never[];

function promisifyFs<K extends keyof FS>(method: K, ...args: IgnoreLastArg<FS[K]>): Promise<void> {
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

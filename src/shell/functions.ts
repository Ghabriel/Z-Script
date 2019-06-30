import * as fs from 'fs';
import { bash } from './exec';

/**
 * Deletes a file. Rejects if the operation fails.
 */
export function deleteFile(filename: string): Promise<void> {
    return new Promise((resolve, reject) => {
        fs.unlink(filename, err => {
            if (err) {
                return reject(err);
            }

            resolve();
        });
    });
}

/**
 * Returns a Unix Timestamp with the modification time of a file or folder.
 * If the filename refers to a folder, the returned value takes into account
 * the modification time of its contents. If that's not desired, use
 * `getModificationTime()` instead.
 */
export async function getRecursiveModificationTime(filename: string): Promise<number> {
    const output = await bash(
        `find ${filename} -type f -exec stat {} --printf="%Y\\n" \\; | sort -n -r | head -n 1`
    );

    return parseInt(output.stdout);
}

/**
 * Returns a Unix Timestamp with the modification time of a file or folder.
 * Note that the modification time of a folder may be newer than a file it
 * contains. To get the modification time of a folder _including its contents_,
 * use `getRecursiveModificationTime()` instead.
 */
export function getModificationTime(filename: string): Promise<number> {
    return new Promise((resolve, reject) => {
        fs.stat(filename, (err, stats) => {
            if (err) {
                return reject(err);
            }

            resolve(Math.floor(stats.mtimeMs / 1000));
        });
    });
}

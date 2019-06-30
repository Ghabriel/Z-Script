import * as fs from 'fs';
import { execute } from './exec';

/**
 * Checks if `filenameA` was modified more recently than `filenameB`. Note that
 * this uses the recursive modification time, making it suitable for use in
 * lazy compilation (e.g checking if 'src' is newer than 'bin').
 */
export async function isNewerThan(filenameA: string, filenameB: string): Promise<boolean> {
    const timestampA = await getRecursiveModificationTime(filenameA);
    const timestampB = await getRecursiveModificationTime(filenameB);
    return timestampA > timestampB;
}

/**
 * Returns a Unix Timestamp with the modification time of a file or folder.
 * If the filename refers to a folder, the returned value takes into account
 * the modification time of its contents. If that's not desired, use
 * `getModificationTime()` instead.
 */
export async function getRecursiveModificationTime(filename: string): Promise<number> {
    const output = await execute(
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

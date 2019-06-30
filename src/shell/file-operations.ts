import * as fs from 'fs';

/**
 * Renames a file. Rejects if the operation fails.
 */
export function renameFile(oldPath: string, newPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        fs.rename(oldPath, newPath, err => {
            if (err) {
                return reject(err);
            }

            resolve();
        });
    });
}

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

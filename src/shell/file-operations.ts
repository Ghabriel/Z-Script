import * as fs from 'fs';

/**
 * Renames a file or folder. Rejects if the operation fails. Note that if
 * `newPath` already exists and is a non-empty folder, the operation fails.
 */
export function rename(oldPath: string, newPath: string): Promise<void> {
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

/**
 * Deletes an empty folder. Rejects if the operation fails.
 */
export function deleteFolder(path: string): Promise<void> {
    return new Promise((resolve, reject) => {
        fs.rmdir(path, err => {
            if (err) {
                return reject(err);
            }

            resolve();
        });
    });
}

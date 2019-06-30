import * as fs from 'fs';

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

import * as fs from 'fs';
import { Async, consolidate, Output, Sync } from './core';

abstract class BaseFileStats {
    /**
     * Checks if `filenameA` was modified more recently than `filenameB`. Note that
     * this uses the recursive modification time, making it suitable for use in
     * lazy compilation (e.g checking if 'src' is newer than 'bin').
     */
    isNewerThan = (filenameA: string, filenameB: string): Output<boolean> => {
        const timestampA = this.getRecursiveModificationTime(filenameA);
        const timestampB = this.getRecursiveModificationTime(filenameB);

        return consolidate([timestampA, timestampB], (a, b) => a > b);
    }

    /**
     * Returns a Unix Timestamp with the modification time of a file or folder.
     * If the filename refers to a folder, the returned value takes into account
     * the modification time of its contents. If that's not desired, use
     * `getModificationTime()` instead.
     */
    getRecursiveModificationTime = (filename: string): Output<number> => {
        // TODO
        return 42;
        // const output = await execute(
        //     `find ${filename} -type f -exec stat {} --printf="%Y\\n" \\; | sort -n -r | head -n 1`
        // );

        // return parseInt(output.stdout);
    }

    /**
     * Returns a Unix Timestamp with the modification time of a file or folder.
     * Note that the modification time of a folder may be newer than a file it
     * contains. To get the modification time of a folder _including its contents_,
     * use `getRecursiveModificationTime()` instead.
     */
    getModificationTime = (filename: string): Output<number> => {
        const stats = this.getFileStats(filename);
        return consolidate([stats], s => Math.floor(s.mtimeMs / 1000));
    }

    /**
     * Checks if the given path corresponds to a folder.
     */
    isFolder = (path: string): Output<boolean> => {
        const stats = this.getFileStats(path);
        return consolidate([stats], s => s.isDirectory());
    }

    protected abstract getFileStats(filename: string): Output<fs.Stats>;
}

class AsyncFileStatsImpl extends BaseFileStats {
    protected getFileStats(filename: string): Promise<fs.Stats> {
        return new Promise((resolve, reject) => {
            fs.stat(filename, (err, stats) => {
                if (err) {
                    return reject(err);
                }

                resolve(stats);
            });
        });
    }
}

class SyncFileStatsImpl extends BaseFileStats {
    protected getFileStats(filename: string): fs.Stats {
        return fs.statSync(filename);
    }
}

export const AsyncFileStats = new AsyncFileStatsImpl() as Async<BaseFileStats>;
export const SyncFileStats = new SyncFileStatsImpl() as Sync<BaseFileStats>;

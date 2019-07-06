import * as readline from 'readline';
import { executeAsync, executeSync, getStdout } from './execute';
import { AsyncFileAccess, SyncFileAccess } from './file-access';
import { AsyncFileOperations, SyncFileOperations } from './file-operations';
import { AsyncFileStats, SyncFileStats } from './file-stats';

export { ShellCommandOutput } from './execute';

export const AsyncShell = {
    ...AsyncFileAccess,
    ...AsyncFileOperations,
    ...AsyncFileStats,
    readInput,
    execute: executeAsync,
};

export const SyncShell = {
    ...SyncFileAccess,
    ...SyncFileOperations,
    ...SyncFileStats,
    execute: executeSync,
    getStdout,
};

export const Shell = {
    ...SyncShell,
    readInput,
};
export const exec = executeSync;

/**
 * Prints a message and waits for user input.
 */
function readInput(question: string): Promise<string> {
    return new Promise(resolve => {
        const reader = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        reader.question(question, answer => {
            reader.close();
            resolve(answer);
        });
    });
}

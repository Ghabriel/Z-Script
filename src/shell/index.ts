import { executeAsync, executeSync, getStdout } from './execute';
import { AsyncFileAccess, SyncFileAccess } from './file-access';
import { AsyncFileOperations, SyncFileOperations } from './file-operations';
import { AsyncFileStats, SyncFileStats } from './file-stats';

export { ShellCommandOutput } from './execute';

export const AsyncShell = {
    ...AsyncFileAccess,
    ...AsyncFileOperations,
    ...AsyncFileStats,
    execute: executeAsync,
};

export const SyncShell = {
    ...SyncFileAccess,
    ...SyncFileOperations,
    ...SyncFileStats,
    execute: executeSync,
    getStdout,
};

export const Shell = SyncShell;
export const exec = executeSync;

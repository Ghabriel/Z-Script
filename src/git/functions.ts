import { exec } from '../shell';
import { getStdout } from '../shell/execute';

/**
 * Pushes the local changes to the remote repository.
 */
export function push(): void {
    exec('git push');
}

/**
 * Creates a tag, optionally (default: `true`) pushing it to the remote
 * repository.
 */
export function createTag(name: string, push: boolean = true): void {
    exec(`git tag ${name}`);

    if (push) {
        exec('git push --tags');
    }
}

/**
 * Updates all remote-tracking branches.
 */
export function fetchRemoteBranches(): void {
    exec('git fetch --prune');
}

/**
 * Returns a list of every local branch that used to have a remote counterpart
 * but no longer do (i.e they "expired").
 */
export function getExpiredBranches(): string[] {
    const output = getStdout('git branch -vv | grep \': gone]\' | awk \'{print $1}\'');
    return output.trim().split('\n');
}

/**
 * Returns a list of all remote branches, prefixed with `origin/`.
 */
export function getRemoteBranches(): string[] {
    const output = getStdout('git branch -r');
    return output.trim().split('\n').map(b => b.trim());
}

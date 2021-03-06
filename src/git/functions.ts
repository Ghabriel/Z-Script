import { exec } from '../shell';
import { getStdout } from '../shell/execute';

/**
 * Pulls all remote changes, updating the current local branch.
 */
export function pull(): void {
    exec('git pull');
}

/**
 * Pushes the local changes to the remote repository.
 */
export function push(): void {
    exec('git push');
}

/**
 * Changes the current branch to `branchName`. Non-committed local changes
 * are maintained. Fails if the local changes conflict with the target branch.
 */
export function checkout(branchName: string): void {
    exec(`git checkout ${branchName}`);
}

export namespace stash {
    /**
     * Stashes all changes of a given list of files, or all tracked local
     * changes if no file is provided.
     */
    export function push(files?: string[]): void {
        exec(`git stash${files ? files.join(' ') : ''}`);
    }

    /**
     * Pops and applies the most recent stash entry.
     */
    export function pop(): void {
        exec('git stash pop');
    }

    /**
     * Applies the most recent stash entry, without removing it from the stash
     * list.
     */
    export function apply(): void {
        exec('git stash apply');
    }

    /**
     * Returns a list with all stash entries.
     */
    export function list(): string[] {
        return parseStdoutList(getStdout('git stash list'));
    }

    /**
     * Removes all the stash entries.
     */
    export function clear(): void {
        exec('git stash clear');
    }
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
 * Creates a branch, optionally (default: `true`) pushing it to the remote
 * repository.
 */
export function createBranch(name: string, push: boolean = true): void {
	exec(`git checkout -b ${name}`);

    if (push) {
        exec(`git push --set-upstream origin ${name}`);
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
    return parseStdoutList(output);
}

/**
 * Returns a list of all remote branches, prefixed with `origin/`.
 */
export function getRemoteBranches(): string[] {
    const output = getStdout('git branch -r');
    return parseStdoutList(output);
}

/**
 * Returns a list of all local branches that are already merged into the
 * current branch.
 */
export function getMergedBranches(): string[] {
    const branches = getStdout('git branch --merged')
    return parseStdoutList(branches.replace('*', ''));
}

/**
 * Creates a local branch that tracks a given remote branch. Note that the
 * remote branch must be prefixed by `origin/`. The local name can be omitted;
 * in this case, it's inferred from the remote name without the `origin/`
 * prefix.
 */
export function createTrackingBranchFor(remoteName: string, localName?: string): void {
    if (localName === undefined) {
        localName = remoteName.replace('origin/', '');
    }

    exec(`git branch --track ${localName} ${remoteName}`);
}

/**
 * Deletes a local branch, optionally (default: `false`) forcing its deletion.
 */
export function deleteLocalBranch(name: string, force: boolean = false): void {
    exec(`git branch ${force ? '-D' : '-d'} ${name}`);
}

/**
 * Deletes a remote branch.
 */
export function deleteRemoteBranch(name: string): void {
    exec(`git push --delete origin ${name}`);
}

function parseStdoutList(output: string): string[] {
    return output
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
}

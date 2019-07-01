import { exec as baseExec } from 'child_process';

export interface ShellCommandOutput {
    stdout: string;
    stderr: string;
}

/**
 * Runs a shell command in a child process. Returns a structure containing the
 * stdout and stderr emitted by it. Rejects if an error happens during
 * execution.
 */
export function execute(command: string): Promise<ShellCommandOutput> {
    return new Promise((resolve, reject) => {
        baseExec(command, (err, stdout, stderr) => {
            if (err) {
                return reject(err);
            }

            resolve({ stdout, stderr });
        });
    });
}

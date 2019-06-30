import { exec as baseExec } from 'child_process';

export interface BashCommandOutput {
    stdout: string;
    stderr: string;
}

/**
 * Runs a shell command in a child process. Returns a structure containing the
 * stdout and stderr emitted by it. Rejects if an error happens during
 * execution.
 */
export function execute(command: string): Promise<BashCommandOutput> {
    return new Promise((resolve, reject) => {
        baseExec(command, (err, stdout, stderr) => {
            if (err) {
                return reject(err);
            }

            resolve({ stdout, stderr });
        });
    });
}

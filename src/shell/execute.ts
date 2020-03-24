import { exec as baseExec, execSync } from 'child_process';
import { CommandExecutionError } from './CommandExecutionError';

export interface ShellCommandOutput {
    stdout: string;
    stderr: string;
}

/**
 * Runs a shell command in a child process. Returns a structure containing the
 * stdout and stderr emitted by it. Rejects if an error happens during
 * execution.
 */
export function executeAsync(command: string): Promise<ShellCommandOutput> {
    return new Promise((resolve, reject) => {
        baseExec(command, (err, stdout, stderr) => {
            if (err) {
                return reject(err);
            }

            resolve({ stdout, stderr });
        });
    });
}

/**
 * Runs a shell command in a child process. All stdout and stderr emitted by it
 * will be forwarded to the parent process.
 */
export function executeSync(command: string): void {
    try {
        execSync(command, { stdio: 'inherit' });
    } catch (e) {
        throw new CommandExecutionError(e.toString(), command);
    }
}

/**
 * Runs a shell command in a child process and returns its stdout. All stderr
 * emitted by it will be forwarded to the parent process.
 */
export function getStdout(command: string): string {
    return execSync(command).toString();
}

import { exec } from 'child_process';

export interface BashCommandOutput {
    stdout: string;
    stderr: string;
}

export function bash(command: string): Promise<BashCommandOutput> {
    return new Promise((resolve, reject) => {
        exec(command, (err, stdout, stderr) => {
            if (err) {
                return reject(err);
            }

            resolve({ stdout, stderr });
        });
    });
}

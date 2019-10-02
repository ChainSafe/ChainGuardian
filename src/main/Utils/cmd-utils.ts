import * as child from 'child_process';
import { Readable } from 'stream';

export interface CmdRun {
    pid: number;
    stdout: string | Readable;
    stderr: string | Readable;
}

export async function runCmd(command: string, getStreams?: boolean): Promise<CmdRun> {
    return new Promise((resolve, reject) => {
        const process = child.exec(command);
        const result: CmdRun = { pid: process.pid, stdout: '', stderr: '' };
        if (process.stdout && process.stderr) {
            if (getStreams) {
                result.stdout = process.stdout;
                result.stderr = process.stderr;
                resolve(result);
            } else {
                process.stdout.on('data', data => {
                    result.stdout += data;
                });
                process.stderr.on('data', data => {
                    result.stderr += data;
                });
                process.on('close', code => {
                    code !== 0 ? reject(result) : resolve(result);
                });
            }
        }
    });
}

export function isPlatform(platform: 'win' | 'lin'): boolean {
    return platform === 'win' ? /^win/i.test(process.platform) : !/^win/i.test(process.platform);
}

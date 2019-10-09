import * as child from 'child_process';
import { Readable } from 'stream';

export interface CmdRunAsync {
    stdout: string;
    stderr: string;
}

export async function runCmdAsync(command: string): Promise<CmdRunAsync> {
    return new Promise((resolve, reject) => {
        const process = child.exec(command);
        const result: CmdRunAsync = { stdout: '', stderr: '' };
        if (process.stdout && process.stderr) {
            process.stdout.on('data', data => {
                result.stdout += data;
            });
            process.stderr.on('data', data => {
                result.stderr += data;
            });
            process.on('close', code => {
                code !== 0 ? reject(result) : resolve(result);
            });
        } else {
            reject();
        }
    });
}

export interface CmdRun {
    stdout: Readable;
    stderr: Readable;
}

export function runCmd(command: string): CmdRun {
    const process = child.exec(command);
    if (process.stdout && process.stderr) {
        return {
            stdout: process.stdout,
            stderr: process.stderr
        } as CmdRun;
    }
    throw new Error(`Executing command ${command} failed.`);
}

export function streamToString(stream: Readable): Promise<string> {
    const chunks: string[] = [];
    return new Promise((resolve, reject) => {
        stream.on('data', chunk => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(chunks.join('')));
    });
}

export function isPlatform(platform: 'win' | 'lin'): boolean {
    return platform === 'win' ? /^win/i.test(process.platform) : !/^win/i.test(process.platform);
}

import * as child from "child_process";
import {Readable} from "stream";

export interface ICmdRunAsync {
    stdout: string;
    stderr: string;
}

export async function runCmdAsync(command: string): Promise<ICmdRunAsync> {
    return new Promise((resolve, reject) => {
        const process = child.exec(command);
        const result: ICmdRunAsync = {stdout: "", stderr: ""};
        if (process.stdout && process.stderr) {
            process.stdout.on("data", data => {
                result.stdout += data;
            });
            process.stderr.on("data", data => {
                result.stderr += data;
            });
            process.on("close", code => {
                code !== 0 ? reject(result) : resolve(result);
            });
        } else {
            reject();
        }
    });
}

export interface ICmdRun {
    stdout: Readable;
    stderr: Readable;
}

export function runCmd(command: string): ICmdRun {
    const process = child.exec(command);
    if (process.stdout && process.stderr) {
        return {
            stdout: process.stdout,
            stderr: process.stderr
        } as ICmdRun;
    }
    throw new Error(`Executing command ${command} failed.`);
}

export function runDetached(command: string): ICmdRun {
    const args = command.split(" ");
    const process = child.spawn(args[0], args.slice(1), {
        detached: true,
    });

    if (process.stdout && process.stderr) {
        // don't wait for the detached child to exit
        process.unref();

        return {
            stdout: process.stdout,
            stderr: process.stderr
        } as ICmdRun;
    }
    throw new Error(`Executing command ${command} failed.`);
}

export function streamToString(stream: Readable): Promise<string> {
    const chunks: string[] = [];
    return new Promise((resolve, reject) => {
        stream.on("data", chunk => chunks.push(chunk));
        stream.on("error", reject);
        stream.on("end", () => resolve(chunks.join("")));
    });
}

export function isPlatform(platform: "win" | "lin"): boolean {
    return platform === "win" ? /^win/i.test(process.platform) : !/^win/i.test(process.platform);
}

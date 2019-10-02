export function extractDockerVersion(dockerLog: string): string | null {
    let regexec: RegExpExecArray | null;
    regexec = /Docker version (\d+\.\d+\.\d+)/.exec(dockerLog);
    return regexec ? regexec[1] : null;
}

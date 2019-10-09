export function extractDockerVersion(dockerLog: string): string | null {
    let regexec: RegExpExecArray | null;
    regexec = /docker version (\d+\.\d+\.\d+)/.exec(dockerLog.toLowerCase());
    return regexec ? regexec[1] : null;
}

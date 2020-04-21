import fs from "fs";

export interface ICopyFileStatus {
    success: boolean;
    message: string
}

export function copyFile(fromPath: string, toPath: string): ICopyFileStatus {
    try {
        fs.copyFileSync(fromPath, toPath);
        return {success: true, message: `File successfully copied from ${fromPath} to ${toPath}`};
    } catch (e) {
        return {success: false, message: e.message};
    }
}

export async function removeDirRecursive(path: string): Promise<void> {
    if (fs.existsSync(path)) {
        for (const entry of await fs.promises.readdir(path)) {
            const curPath = path + "/" + entry;
            if ((await fs.promises.lstat(curPath)).isDirectory())
                await removeDirRecursive(curPath);
            else await fs.promises.unlink(curPath);
        }
        await fs.promises.rmdir(path);
    }
}


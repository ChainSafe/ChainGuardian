import fs from "fs";

export async function removeDirRecursive(path: string): Promise<void> {
    if (fs.existsSync(path)) {
        for (const entry of await fs.promises.readdir(path)) {
            const curPath = path + "/" + entry;
            if ((await fs.promises.lstat(curPath)).isDirectory()) await removeDirRecursive(curPath);
            else await fs.promises.unlink(curPath);
        }
        await fs.promises.rmdir(path);
    }
}

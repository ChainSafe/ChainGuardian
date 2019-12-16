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
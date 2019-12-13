import fs from "fs";

export interface ICopyFileStatus {
    success: boolean;
    message: string
}

export function copyFile(fromPath: string, toPath: string, readOptions = "utf-8"): ICopyFileStatus {
    try {
        const fileContent = fs.readFileSync(fromPath, readOptions);
        fs.writeFileSync(toPath, fileContent);
        return {success: true, message: `File successfully copied from ${fromPath} to ${toPath}`};
    } catch (e) {
        return {success: false, message: e.message};
    }
}
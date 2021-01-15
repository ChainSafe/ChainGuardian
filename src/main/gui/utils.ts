import {mainLogger} from "../logger";

export async function installExtensions(): Promise<void | string[]> {
    // eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
    const installer = require("electron-devtools-installer");
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    const extensions = ["REACT_DEVELOPER_TOOLS", "REDUX_DEVTOOLS"];

    return Promise.all(extensions.map((name) => installer.default(installer[name], forceDownload))).catch(
        mainLogger.log,
    );
}

export const iconExtensions = {
    darwin: ".ics",
    win32: ".ico",
    linux: ".png",
    aix: ".png",
    android: ".png",
    freebsd: ".png",
    openbsd: ".png",
    sunos: ".png",
    cygwin: ".png",
};

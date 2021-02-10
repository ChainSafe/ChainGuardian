import {MenuItemConstructorOptions, MenuItem, Menu, shell, app, BrowserWindow, dialog} from "electron";
import path from "path";
import {existsSync, createWriteStream} from "fs";
import {mainLogger} from "../logger";
import archiver from "archiver";

const reloadDialog = (window: BrowserWindow): number =>
    dialog.showMessageBoxSync(window, {
        type: "question",
        buttons: ["Yes", "No"],
        title: "Confirm",
        message: "Reloading the Application will require to start all the validators again. Are you sure?",
    });

const isMac = process.platform === "darwin";

const template = [
    {
        label: isMac ? app.getName() : "Application",
        submenu: [
            {
                label: "Homepage",
                click: async (): Promise<void> => {
                    await shell.openExternal("https://chainguardian.nodefactory.io/");
                },
            },
            {
                label: "Discord",
                click: async (): Promise<void> => {
                    await shell.openExternal("https://discord.gg/4GBwH52cFb");
                },
            },
            ...(isMac ? [{role: "about"}] : []),
            {type: "separator"},
            {
                label: "Reload",
                accelerator: "CmdOrCtrl+R",
                nonNativeMacOSRole: true,
                click: (event: KeyboardEvent, window: BrowserWindow): void => {
                    if (reloadDialog(window) === 0) {
                        window.reload();
                    }
                },
            },
            {
                label: "Force Reload",
                accelerator: "Shift+CmdOrCtrl+R",
                nonNativeMacOSRole: true,
                click: (event: KeyboardEvent, window: BrowserWindow): void => {
                    if (reloadDialog(window) === 0) {
                        window.webContents.reloadIgnoringCache();
                    }
                },
            },
            ...(process.env.NODE_ENV !== "production" || app.commandLine.hasSwitch("enable-devtools")
                ? [{role: "toggleDevTools"}]
                : []),
            {type: "separator"},
            ...(isMac ? [{role: "hide"}, {role: "hideothers"}, {role: "unhide"}, {type: "separator"}] : []),
            {role: "quit"},
        ],
    },
    {
        role: "help",
        submenu: [
            {
                label: "Discord Support",
                click: async (): Promise<void> => {
                    await shell.openExternal("https://discord.gg/uM9rZFDefm");
                },
            },
            {
                label: "Github Repository",
                click: async (): Promise<void> => {
                    await shell.openExternal("https://github.com/NodeFactoryIo/ChainGuardian");
                },
            },
            {
                label: "Search Issues",
                click: async (): Promise<void> => {
                    await shell.openExternal("https://github.com/NodeFactoryIo/ChainGuardian/issues");
                },
            },
            {type: "separator"},
            {
                label: "Open logs directory",
                click: async (): Promise<void> => {
                    const error = await shell.openPath(path.join(app.getPath("userData"), "logs"));
                    if (error) await shell.openPath(app.getPath("userData"));
                },
            },
            {
                label: "Export logs",
                click: async (event: KeyboardEvent, window: BrowserWindow): Promise<void> => {
                    const savePath = dialog.showOpenDialogSync(window, {
                        title: `Saving logs to destination"`,
                        defaultPath: app.getPath("home"),
                        buttonLabel: "Export",
                        properties: ["openDirectory"],
                    });
                    if (savePath && savePath.length) {
                        const logsPath = path.join(app.getPath("userData"), "logs");
                        if (existsSync(logsPath)) {
                            const filename = `logs-${Date.now()}.zip`;
                            const output = createWriteStream(path.join(savePath[0], filename));
                            const archive = archiver("zip", {zlib: {level: 9}});
                            archive.pipe(output);
                            archive.directory(logsPath, false);
                            await archive.finalize();
                        }
                        // this should never naturally happens on production but if is case create new log to fix it.
                        else mainLogger.error("Missing logs!");
                    }
                },
            },
        ],
    },
];

export function setApplicationMenu(): void {
    const menu = Menu.buildFromTemplate(template as Array<MenuItemConstructorOptions | MenuItem>);
    Menu.setApplicationMenu(menu);
}

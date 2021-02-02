import {MenuItemConstructorOptions, MenuItem, Menu, shell, app, BrowserWindow, dialog} from "electron";

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
                label: "Github repo",
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
        ],
    },
];

export function setApplicationMenu(): void {
    const menu = Menu.buildFromTemplate(template as Array<MenuItemConstructorOptions | MenuItem>);
    Menu.setApplicationMenu(menu);
}

import {MenuItemConstructorOptions, MenuItem, Menu, shell, app} from "electron";

const template = [
    {
        label: process.platform === "darwin" ? app.getName() : "Application",
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
            ...(process.platform === "darwin" ? [{role: "about"}] : []),
            {type: "separator"},
            {role: "reload"},
            {role: "forcereload"},
            {type: "separator"},
            ...(process.platform === "darwin"
                ? [{role: "hide"}, {role: "hideothers"}, {role: "unhide"}, {type: "separator"}]
                : []),
            {role: "quit"},
        ],
    },
    {
        role: "help",
        submenu: [
            {
                label: "Discord Support",
                click: async (): Promise<void> => {
                    await shell.openExternal("https://discord.gg/4GBwH52cFb");
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

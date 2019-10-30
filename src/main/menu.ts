import * as electron from "electron";
import {Menu, shell} from "electron";

const template = [
    // { role: 'appMenu' }
    ...(process.platform === "darwin" ? [{
        label: electron.app.getName(),
        submenu: [
            {role: "about"},
            {type: "separator"},
            {role: "services"},
            {type: "separator"},
            {role: "hide"},
            {role: "hideothers"},
            {role: "unhide"},
            {type: "separator"},
            {role: "quit"}
        ]
    }] : []),
    // { role: 'fileMenu' }
    {
        label: "File",
        submenu: [
            process.platform === "darwin" ? {role: "close"} : {role: "quit"}
        ]
    },
    // { role: 'editMenu' }
    {
        label: "Edit",
        submenu: [
            {role: "undo"},
            {role: "redo"},
            {type: "separator"},
            {role: "cut"},
            {role: "copy"},
            {role: "paste"},
            ...(process.platform === "darwin" ? [
                {role: "pasteAndMatchStyle"},
                {role: "delete"},
                {role: "selectAll"},
                {type: "separator"},
                {
                    label: "Speech",
                    submenu: [
                        {role: "startspeaking"},
                        {role: "stopspeaking"}
                    ]
                }
            ] : [
                {role: "delete"},
                {type: "separator"},
                {role: "selectAll"}
            ])
        ]
    },
    // { role: 'viewMenu' }
    {
        label: "View",
        submenu: [
            {role: "reload"},
            {role: "forcereload"},
            {role: "toggledevtools"},
            {type: "separator"},
            {role: "resetzoom"},
            {role: "zoomin"},
            {role: "zoomout"},
            {type: "separator"},
            {role: "togglefullscreen"}
        ]
    },
    // { role: 'windowMenu' }
    {
        label: "Window",
        submenu: [
            {role: "minimize"},
            {role: "zoom"},
            ...(process.platform === "darwin" ? [
                {type: "separator"},
                {role: "front"},
                {type: "separator"},
                {role: "window"}
            ] : [
                {role: "close"}
            ])
        ]
    },
    {
        role: "help",
        submenu: [
            {
                label: "Github repo",
                click: async (): Promise<void> => {
                    await shell.openExternal("https://github.com/NodeFactoryIo/ChainGuardian");
                }
            },
            {
                label: "Search Issues",
                click: async (): Promise<void> => {
                    await shell.openExternal("https://github.com/NodeFactoryIo/ChainGuardian/issues");
                }
            }
        ]
    }
];

export function setApplicationMenu(): void {
    // @ts-ignore
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

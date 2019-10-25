/* eslint-disable */
import {app, BrowserWindow} from "electron";
import path from "path";
import url from "url";

let win: BrowserWindow | null;

const installExtensions = async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
    const installer = require("electron-devtools-installer");
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    const extensions = ["REACT_DEVELOPER_TOOLS", "REDUX_DEVTOOLS"];

    return Promise.all(extensions.map(name => installer.default(installer[name], forceDownload))).catch(console.log);
};

const createWindow = async () => {
    if (process.env.NODE_ENV !== "production") {
        await installExtensions();
    }
    win = new BrowserWindow({
        webPreferences: {nodeIntegration: true},
        backgroundColor: "#052437",
        show: false,
        icon: path.join(__dirname, '../src/renderer/assets/ico/app_icon.png'), // wont work on macOS
    });
    win.maximize();
    win.once("ready-to-show", () => {
        if (win !== null) { win.show(); }
    });
    win.webContents.on("did-finish-load", () => {
        if (win !== null) { win.setTitle("ChainGuardian"); }
    });

    if (process.env.NODE_ENV !== "production") {
        process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "1";
        win.loadURL("http://localhost:2003");
    } else {
        win.loadURL(
            url.format({
                pathname: path.join(__dirname, "index.html"),
                protocol: "file:",
                slashes: true
            })
        );
    }

    if (process.env.NODE_ENV !== "production") {
        // Open DevTools, see https://github.com/electron/electron/issues/12438 for why we wait for dom-ready
        win.webContents.once("dom-ready", () => {
            win!.webContents.openDevTools();
        });
    }

    win.on("closed", () => {
        win = null;
    });
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (win === null) {
        createWindow();
    }
});

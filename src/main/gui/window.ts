import path from "path";
import {BrowserWindow, dialog} from "electron";
import {iconExtensions, installExtensions} from "./utils";
import store from "../../renderer/store";
// import {app} from "electron";
// app.showExitPrompt = true;

let win: BrowserWindow | null;

export async function createWindow(): Promise<void> {
    if(win) {
        return;
    }
    if (process.env.NODE_ENV !== "production") {
        await installExtensions();
    }

    const iconPath = path.join(
        __dirname,
        `../src/renderer/assets/ico/app_icon${iconExtensions[process.platform]}`
    );
    // eslint-disable-next-line require-atomic-updates
    win = new BrowserWindow({
        webPreferences: {nodeIntegration: true},
        backgroundColor: "#052437",
        show: false,
        icon: iconPath,
    });
    win.maximize();
    win.once("ready-to-show", () => {
        if (win !== null) { win.show(); }
    });
    win.webContents.on("did-finish-load", async () => {
        if (win !== null) {
            win.setTitle("ChainGuardian");
        }
    });

    if (process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test") {
        // eslint-disable-next-line require-atomic-updates
        process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "1";
        win.loadURL("http://localhost:2003");
    } else {
        let append = "";
        if(process.env.CG_INITIAL_ROUTE) {
            append += "#" + process.env.CG_INITIAL_ROUTE;
        }
        win.loadURL("file://" + path.join(__dirname, "index.html") + append);
    }

    if (process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test") {
        // Open DevTools, see https://github.com/electron/electron/issues/12438 for why we wait for dom-ready
        win.webContents.once("dom-ready", () => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            win!.webContents.openDevTools();
        });
    }

    win.on('close', (e) => {
        e.preventDefault();
        // store.dispatch(storeClosePressed(true));
        // showClosePrompt();
    })

    win.on("closed", function() {
        win = null;
    });
}
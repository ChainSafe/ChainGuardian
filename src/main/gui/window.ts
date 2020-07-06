import path from "path";
import {BrowserWindow} from "electron";
import {iconExtensions, installExtensions} from "./utils";
import {dialog} from "electron";

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
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            nodeIntegrationInSubFrames: true,
            webSecurity: false,
            devTools: process.env.NODE_ENV !== "production"
        },
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

    win.on("close", (e: Electron.Event) => {
        // TODO / Validator status - check if there is validator with status ACTIVE/VALIDATING
        if (!process.env.IS_TESTING && win !== null){
            const choice = dialog.showMessageBoxSync(win,
                {
                    type: "question",
                    buttons: ["Yes", "No"],
                    title: "Confirm",
                    message: "Are you sure you want to quit?"
                });
            if (choice === 1) {
                e.preventDefault();
            } else {
                if (process.env.NODE_ENV !== "production") {
                    win.webContents.send("stop-docker");
                }
            }
        }
    });

    win.on("closed", function() {
        win = null;
    });
}

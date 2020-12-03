import {app} from "electron";
import {init as initBLS} from "@chainsafe/bls";

import {createWindow} from "./gui/window";
import {DatabaseIpcHandler} from "./db/ipc";
import {initSentry} from "./sentry";

console.error("starting")
// initSentry();

let db: DatabaseIpcHandler;
try {
    db = new DatabaseIpcHandler()
} catch(e) {
    console.error(e);
    process.exit(1);
}

app.on("before-quit", db.stop.bind(db));

app.whenReady().then(async function () {
    try {
        await initBLS("herumi");
        await Promise.all([db.start(), createWindow()]);
    } catch (e) {
        console.error(e);
    }
});

app.on("activate", createWindow);
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

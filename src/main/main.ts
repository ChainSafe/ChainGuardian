import {app} from "electron";
import {initBLS} from "@chainsafe/bls";

import {createWindow} from "./gui/window";
import {DatabaseIpcHandler} from "./db/ipc";
import {initSentry} from "./sentry";

initSentry();

const db = new DatabaseIpcHandler();

app.on("before-quit", db.stop.bind(db));

app.whenReady().then(async function () {
    await initBLS();
    await Promise.all([db.start(), createWindow()]);
});

app.on("activate", createWindow);
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

import {app} from "electron";
import {initBLS} from "@chainsafe/bls";

import {createWindow} from "./gui/window";
import {DatabaseIpcHandler} from "./db/ipc";

const db = new DatabaseIpcHandler();

app.on("before-quit", db.stop.bind(db));

app.on("activate", db.start.bind(db));

app.on("ready", async function() {
    await Promise.all([
        db.start(),
        createWindow(),
        initBLS(),
    ]);
});
app.on("activate", createWindow);
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

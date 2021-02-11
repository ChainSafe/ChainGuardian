import {app} from "electron";
import {init as initBLS} from "@chainsafe/bls";

import {createWindow} from "./gui/window";
import {DatabaseIpcHandler} from "./db/ipc";
import {initSentry} from "./sentry";
import {mainLogger} from "./logger";

initSentry();

let db: DatabaseIpcHandler;
try {
    db = new DatabaseIpcHandler();
} catch (e) {
    mainLogger.error(e);
    process.exit(1);
}

app.on("before-quit", db.stop.bind(db));

app.whenReady().then(async function () {
    mainLogger.info(`Starting ChainGuardian`);
    mainLogger.info(`Version ${process.env.npm_package_version}`);
    try {
        await initBLS("herumi");
        await Promise.all([db.start(), createWindow()]);
    } catch (e) {
        mainLogger.error(e);
    }
});

app.on("activate", createWindow);
app.on("window-all-closed", () => {
    mainLogger.info(`Stopping ChainGuardian`);
    if (process.platform !== "darwin") {
        app.quit();
    }
});

import {app} from "electron";
import {createWindow} from "./gui/window";
import {DatabaseHandler} from "./db/database";

const db = new DatabaseHandler();

app.on("before-quit", db.stop.bind(db));
app.on("activate", db.start.bind(db));

app.on("ready", async function() {
    await Promise.all([
        db.start(),
        createWindow(),
    ]);
});
app.on("activate", createWindow);
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
